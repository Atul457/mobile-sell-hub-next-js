import { dbConfig } from '@/configs/dbConfig'
import UserModel from '@/models/user.model'
import UserCreatorMappingModel from '@/models/userCreatorMapping.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { services } from '@/services/index.service'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

export async function GET(request: Request) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const us = services.server.UserService
    const authData = await middlewares.withUser(request)
    const userId = authData.userId

    const user = (await us.getUserById(userId))!

    const updatedUser = utils.helpers.user.getUserDetails(user ?? new UserModel())

    return Response.json(
      utils.generateRes({
        status: true,
        data: {
          user: updatedUser
        }
      })
    )
  })
}

export async function PATCH(request: Request) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request)
    const body = await utils.getReqBody(request)

    const validatedData = await commonSchemas.updateAdminProfileSchema.validate({
      ...(body ?? {}),
      type: authData.type
    })
    const { firstName, lastName, email } = validatedData

    const us = services.server.UserService

    let user = await us.updateUser(authData.userId, {
      firstName,
      lastName,
      email
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

export async function DELETE(request: Request) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const us = services.server.UserService
    const uss = services.server.UserSessionService

    const authData = await middlewares.withUser(request)
    const userId = authData.userId

    await us.updateUser(userId, {
      status: utils.CONST.USER.STATUS.DELETED
    })

    const profilesCreated = await UserCreatorMappingModel.aggregate([
      {
        $match: {
          $or: [
            {
              mainCreatorId: userId
            },
            {
              creatorId: userId
            }
          ]
        }
      },
      {
        $project: {
          _id: 0,
          userId: 1
        }
      }
    ])

    const userIdsToDelete = profilesCreated.map(profile => profile.userId)

    await uss.deleteSessionsByUserId(userId)

    await UserModel.updateMany(
      {
        _id: { $in: userIdsToDelete },
        status: { $ne: utils.CONST.USER.STATUS.DELETED }
      },
      {
        status: utils.CONST.USER.STATUS.DELETED
      }
    )

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._DELETED_SUCCESSFULLY.replace('[ITEM]', 'Account')
      })
    )
  })
}
