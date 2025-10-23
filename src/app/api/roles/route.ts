import { PipelineStage } from 'mongoose'
import { NextRequest } from 'next/server'

import { dbConfig } from '@/configs/dbConfig'
import RoleModel, { IRole } from '@/models/role.model'
import { IRolePermission } from '@/models/rolePermission.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { serverSchemas } from '@/schemas/server.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { ActionValidator } from '@/services/server/ActionValidator.service'
import { middlewares } from '@/utils/middlewares'
import { mongo } from '@/utils/mongo'
import { utils } from '@/utils/utils'

export async function GET(request: NextRequest) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.ROLE,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.READ
    })

    await av.validate()

    const body = utils.searchParamsToJson({
      params: request.nextUrl.searchParams
    })

    const {
      page = 1,
      limit = 10,
      query = null,
      sort = 'createdAt',
      order = 'desc',
      type
    } = await serverSchemas.rolesPaginationSchema.validate({
      ...(body ?? {})
    })

    const stages: PipelineStage[] = [
      {
        $match: {
          defaultAdminRole: { $ne: true },
          type: type ?? { $ne: null },
          ...(query && {
            $and: query.split(' ').map(word => ({
              name: { $regex: new RegExp(word, 'gi') }
            }))
          })
        }
      }
    ]

    const totalCount_ = await RoleModel.aggregate([...stages, { $group: { _id: null, n: { $sum: 1 } } }])

    const totalCount = totalCount_.length > 0 ? totalCount_[0].n : 0

    const roles = await RoleModel.aggregate([
      ...stages,
      {
        $addFields: {
          id: '$_id'
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
      .sort({
        [sort]: order
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .project({
        __v: 0,
        addOnsCount: 0,
        totalTestsCount: 0,
        testsIncluded: 0,
        addOnsIncluded: 0
      })

    return Response.json(
      utils.generateRes({
        status: true,
        data: {
          page,
          limit,
          query,
          totalCount,
          roles
        }
      })
    )
  })
}

export async function POST(request: Request) {
  return utils.errorHandler(async function () {
    // Connect to the database
    await dbConfig()

    // Authenticate the user with admin privileges
    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.ROLE,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.CREATE
    })

    await av.validate()

    const rs = services.server.RoleService
    const rps = services.server.RolePermissionService

    // Get the request body
    const body = await utils.getReqBody(request)

    // Validate the request body
    const validatedData = await commonSchemas.addRole.validate(body ?? {})

    const { name, permissions, type, markDefault, roleId: roleId_ } = validatedData

    const existingRole = await RoleModel.findOne({ name });

    if (existingRole) {
      throw ErrorHandlingService.userAlreadyExists({
        message: utils.CONST.RESPONSE_MESSAGES.ROLE_ALREADY_EXISTS
      });
    }

    const role = await rs.createRole({
      name,
      type: type as IRole['type'],
      ...(roleId_ && {
        roleId: roleId_ as IRole['roleId']
      })
    })

    await utils.loops.asyncWhileLoop({
      loopCount: Object.keys(permissions).length,
      functionToFire: async index => {
        const rolePermissionModule = Object.keys(permissions)[index] as IRolePermission['module']
        const rolePermissionActions = Object.values(permissions)[index]
        await rps.createOrUpdateRolePermission(role.id, rolePermissionModule, {
          actions: rolePermissionActions
        })
      }
    })

    if (markDefault) {
      let key: Parameters<typeof rs.setDefaultRole>[1] =
        role.type === utils.CONST.ROLE.TYPES.USER ? 'defaultUserRole' : 'defaultAdminRole'

      await rs.setDefaultRole(role.id, key)
    }

    const roles = await RoleModel.aggregate([
      {
        $match: {
          _id: mongo.stringToObjectId(role.id)
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
                actions: 1,
                type: 1
              }
            }
          ]
        }
      }
    ])

    if (!roles.length) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Role')
      })
    }

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._ADDED_SUCCESSFULLY.replace('[ITEM]', 'Role'),
        data: {
          role: roles[0]
        }
      })
    )
  })
}
