import { Schema } from 'mongoose'

import { dbConfig } from '@/configs/dbConfig'
import RoleModel from '@/models/role.model'
import UserModel, { IUser } from '@/models/user.model'
import { services } from '@/services/index.service'
import { ActionValidator } from '@/services/server/ActionValidator.service'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

export async function PATCH(request: Request) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.ROLE,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.UPDATE
    })

    await av.validate()

    let user: IUser | null = null
    let userIdsNotUpdated: IUser['_id'][] = []

    const us = services.server.UserService

    const roles = await RoleModel.find({
      type: utils.CONST.ROLE.TYPES.USER,
      roleId: {
        $exists: true
      }
    })

    const roleIdRoleMap = new Map<number, string>()

    roles.forEach(role => {
      if (role.roleId) {
        roleIdRoleMap.set(role.roleId, role._id as string)
      }
    })

    const users = await UserModel.aggregate([
      {
        $match: {
          role: {
            $exists: true
          }
        }
      }
    ]).project({
      role: 1,
      _id: 1
    })

    await utils.loops.asyncWhileLoop({
      loopCount: users.length,
      functionToFire: async index => {
        user = users[index]
        if (user && user.role && roleIdRoleMap.has(user.role)) {
          await us.updateUser(user._id as string, {
            roleId: roleIdRoleMap.get(user.role) as unknown as Schema.Types.ObjectId
          })
        } else if (user) {
          userIdsNotUpdated.push(user._id as string)
        }
      }
    })

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'Users'),
        data: {
          userIdsNotUpdated
        }
      })
    )
  })
}
