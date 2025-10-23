import { Schema } from 'mongoose'
import { NextRequest } from 'next/server'

import { dbConfig } from '@/configs/dbConfig'
import RoleModel, { IRole } from '@/models/role.model'
import { IRolePermission } from '@/models/rolePermission.model'
import { serverSchemas } from '@/schemas/server.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { ActionValidator } from '@/services/server/ActionValidator.service'
import { middlewares } from '@/utils/middlewares'
import { mongo } from '@/utils/mongo'
import { utils } from '@/utils/utils'

import { IRequestArgs } from '../../types'

export async function GET(request: NextRequest, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.ROLE,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.READ
    })

    await av.validate()

    await serverSchemas.objectIdSchema.required().validate(args.params.id)
    const roleId = mongo.stringToObjectId(args.params.id)

    const role = await RoleModel.aggregate([
      {
        $match: {
          _id: roleId
        }
      },
      {
        $lookup: {
          from: 'rolePermissions',
          localField: '_id',
          foreignField: 'roleId',
          as: 'permissions',
          pipeline: [
            {
              $project: {
                module: 1,
                actions: 1
              }
            }
          ]
        }
      }
    ])

    if (!role) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Role')
      })
    }

    return Response.json(
      utils.generateRes({
        status: true,
        data: {
          role: role
        }
      })
    )
  })
}

export async function PATCH(request: Request, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    // Connect to the database
    await dbConfig()

    // Authenticate the user with admin privileges
    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.ROLE,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.UPDATE
    })

    await av.validate()

    const rs = services.server.RoleService
    const rps = services.server.RolePermissionService

    // Get the request body
    const body = await utils.getReqBody(request)

    // Validate the request body
    const validatedData = await serverSchemas.updateRoleStatus.validate({
      ...(body ?? {}),
      _id: args.params.id
    })

    const { name, permissions, type, _id, markDefault, roleId: roleId_ } = validatedData

    const role = await rs.getRoleById(_id)
    const roleId = mongo.stringToObjectId(_id) as unknown as Schema.Types.ObjectId

    if (!role) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Role')
      })
    }

    await rs.updateRole(_id, {
      name,
      type: type as IRole['type'],
      ...(roleId_ && {
        roleId: roleId_ as IRole['roleId']
      })
    })

    if (markDefault) {
      let key: Parameters<typeof rs.setDefaultRole>[1] =
        role.type === utils.CONST.ROLE.TYPES.USER ? 'defaultUserRole' : 'defaultAdminRole'

      await rs.setDefaultRole(_id, key)
    }

    await rps.deleteRolePermissionsByRoleId(roleId)

    await utils.loops.asyncWhileLoop({
      loopCount: Object.keys(permissions).length,
      functionToFire: async index => {
        const rolePermissionModule = Object.keys(permissions)[index] as IRolePermission['module']
        const rolePermissionActions = Object.values(permissions)[index]
        await rps.createOrUpdateRolePermission(roleId as unknown as Schema.Types.ObjectId, rolePermissionModule, {
          actions: rolePermissionActions
        })
      }
    })

    const role_ = await RoleModel.aggregate([
      {
        $match: {
          _id: roleId
        }
      },
      {
        $lookup: {
          from: 'rolePermissions',
          localField: '_id',
          foreignField: 'roleId',
          as: 'permissions',
          pipeline: [
            {
              $project: {
                module: 1,
                actions: 1
              }
            }
          ]
        }
      }
    ])

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'Role'),
        data: {
          role: role_[0]
        }
      })
    )
  })
}
