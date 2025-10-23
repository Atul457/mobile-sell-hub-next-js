import mongoose, { Schema } from 'mongoose'

import { dbConfig } from '@/configs/dbConfig'
import CardModel from '@/models/card.model'
// import FileModel from '@/models/file.model'
import ProfileModel from '@/models/profile.model'
import ReportModel from '@/models/report.model'
import { IRolePermission } from '@/models/rolePermission.model'
import UserModel, { IUser } from '@/models/user.model'
// import UserModel, { IUser } from '@/models/user.model'
import UserSessionModel from '@/models/userSession.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { serverSchemas } from '@/schemas/server.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { ActionValidator } from '@/services/server/ActionValidator.service'
import { middlewares } from '@/utils/middlewares'
import { mongo } from '@/utils/mongo'
import { serverHelpers } from '@/utils/serverHelpers'
import { utils } from '@/utils/utils'

import { IRequestArgs } from '../../types'

export async function GET(request: Request, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    // Connect to the database
    await dbConfig()

    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.USER,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.READ
    })

    await av.validate()

    await serverSchemas.objectIdSchema.required().validate(args.params.id)

    const userId = new mongoose.Types.ObjectId(args.params.id)

    const users = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
          status: {
            $ne: utils.CONST.USER.STATUS.DELETED
          }
        }
      },
      {
        $lookup: {
          from: 'userCreatorMappings',
          localField: '_id',
          foreignField: 'userId',
          as: 'mapping',
          pipeline: [
            {
              $lookup: {
                from: 'users',
                localField: 'mainCreatorId',
                foreignField: '_id',
                as: 'user',
                pipeline: [
                  {
                    $project: {
                      organizationName: 1
                    }
                  },
                  {
                    $unwind: {
                      path: '$organizationName',
                      preserveNullAndEmptyArrays: true
                    }
                  }
                ]
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$mapping',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $addFields: {
          organizationName: {
            $cond: {
              if: { $not: ['$organizationName'] }, // if `organizationName` doesn't exist in user
              then: { $arrayElemAt: ['$mapping.user.organizationName', 0] }, // get from lookup
              else: '$organizationName' // keep the existing organizationName if present
            }
          }
        }
      }
    ])

    const rps = services.server.RolePermissionService

    if (!users.length) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'User')
      })
    }

    const user = users[0]

    let userModulePermissions: IRolePermission['actions'] = []

    if (user?.roleId) {
      userModulePermissions =
        (await rps.findPermissionsByRoleIdNModule(user?.roleId, utils.CONST.ROLE_PERMISSION.MODULES.USER))?.actions ??
        []
    }

    const commonRKeysValues = utils.helpers.user.getUserDetails(user)

    return Response.json(
      utils.generateRes({
        status: true,
        data: {
          user: {
            ...commonRKeysValues,
            userModulePermissions
          }
        }
      })
    )
  })
}

export async function PATCH(request: Request, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.USER,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.CREATE
    })

    await av.validate()

    const userId = args.params.id

    const body = await utils.getReqBody(request)

    const validatedData = await commonSchemas.updateProfileSchema.validate(body)
    const { firstName, phoneNumber, lastName, address, addressMeta, type, organizationName, roleId } = validatedData

    const us = services.server.UserService

    const isOrganization = utils.helpers.user.checkIsOrganiation(type as IUser["type"])
    const isSubAdmin = utils.helpers.user.checkSubAdmin(type as IUser["type"])
    const isAdmin = utils.helpers.user.checkAdmin(type as IUser["type"])

    if (isAdmin) {
      throw ErrorHandlingService.forbidden({
        message: utils.CONST.RESPONSE_MESSAGES.UN_AUTHORIZED
      })
    }

    let user = await us.updateUser(userId, {
      phoneNumber,
      firstName,
      lastName,
      address,
      ...(isSubAdmin && roleId && {
        roleId: roleId as unknown as Schema.Types.ObjectId
      }),
      addressMeta: utils.helpers.user.formatAddress(addressMeta),
      ...(isOrganization && {
        organizationName
      })
    })

    const updatedUser = utils.helpers.user.getUserDetails(user ?? new UserModel())

    return Response.json(
      utils.generateRes({
        status: true,
        data: updatedUser,
        message: utils.CONST.RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'Profile')
      })
    )
  })
}

export async function DELETE(request: Request, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    await dbConfig()

    // Validate user permissions
    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.USER,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.DELETE
    })

    await av.validate()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const uss = services.server.UserSessionService

    let isSubUser = false
    let userId = args.params.id
    let userIds: Schema.Types.ObjectId[] = []
    let userId_ = mongo.stringToObjectId(userId)

    const existingUser = await UserModel.findOne({
      _id: userId,
      status: { $ne: utils.CONST.USER.STATUS.DELETED }
    })

    if (!existingUser) {
      throw ErrorHandlingService.userNotFound()
    }

    isSubUser = existingUser.type === utils.CONST.USER.TYPES.ORGANIZATION_SUB_USER

    if (!isSubUser) {
      const getRelatedUserIdsResponse = await serverHelpers.user.getRelatedUserIds({
        loggedInUserId: userId_,
        user: existingUser
      })
      userIds = getRelatedUserIdsResponse.userIds
    } else {
      userIds.push(userId_ as unknown as Schema.Types.ObjectId)
    }

    await UserSessionModel.deleteMany({
      _id: {
        $in: userIds
      }
    })

    // Soft delete all subusers
    await UserModel.updateMany(
      {
        _id: { $in: userIds },
        status: { $ne: utils.CONST.USER.STATUS.DELETED }
      },
      {
        $set: { status: utils.CONST.USER.STATUS.DELETED }
      }
    )

    // Update status in related tables: CardModel, ProfileModel, PackageModel, Files, Reports
    await Promise.all([
      updateRelatedTableStatus(userIds, utils.CONST.CARD.STATUS.DELETED, 'CardModel'),
      updateRelatedTableStatus(userIds, utils.CONST.PROFILE.STATUS.DELETED, 'ProfileModel'),
      // updateRelatedTableStatus(userIds, utils.CONST.FILE_MANAGER.STATUS.DELETED, 'Files'),
      updateRelatedTableStatus(userIds, utils.CONST.REPORT.STATUS.DELETED, 'Reports')
      // updateRelatedTableStatus(userIds, utils.CONST.MAIL.STATUS.DELETED, 'Reports'),
    ])

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._DELETED_SUCCESSFULLY.replace('[ITEM]', 'User'),
        data: {
          userIds
        }
      })
    )
  })
}

// Function to update status in various related tables
async function updateRelatedTableStatus(userIds: Schema.Types.ObjectId[], status: number = 0, model: string) {
  const modelMap: { [key: string]: any } = {
    CardModel: CardModel,
    ProfileModel: ProfileModel,
    // 'Files': FileModel,
    Reports: ReportModel
  }

  const selectedModel = modelMap[model]

  if (selectedModel) {
    await selectedModel.updateMany({ userId: { $in: userIds } }, { $set: { status: status } })
  }
}
