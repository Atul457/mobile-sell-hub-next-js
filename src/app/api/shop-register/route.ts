import { Types } from 'mongoose'

import { dbConfig } from '@/configs/dbConfig'
import UserModel from '@/models/user.model'
import { serverSchemas } from '@/schemas/server.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { utils } from '@/utils/utils'

export async function POST(request: Request) {
  return utils.errorHandler(async function () {
    // Connect to the database
    await dbConfig()

    const sr = services.server.ShopRegisterService
    const us = services.server.UserService

    // Get the request body
    const body = await utils.getReqBody(request)

    // // Validate the request body
    const validatedData = await serverSchemas.storeSchema.validate(body ?? {})

    const validatedUserData = await serverSchemas.register.validate(body ?? {})
    const { firstName, lastName, email, password, phoneNumber } = validatedUserData

    const password_ = await utils.bcrypt.hashPassword(password)
    const existingUser = await UserModel.findOne({
      $or: [
        {
          email: new RegExp(email, 'gi'),
          status: { $ne: utils.CONST.USER.STATUS.DELETED }
        },
        {
          firstName: new RegExp(validatedUserData.firstName, 'gi'),
          lastName: new RegExp(validatedUserData.lastName, 'gi'),
          status: { $ne: utils.CONST.USER.STATUS.DELETED }
        }
      ]
    })

    if (existingUser) {
      throw ErrorHandlingService.userAlreadyExists({
        message: utils.CONST.RESPONSE_MESSAGES.USER_ALREADY_EXIST
      })
    }

    const user = await us.createUser({
      firstName,
      lastName,
      phoneNumber,
      email: email.toLowerCase(),
      type: utils.CONST.USER.TYPES.SHOP,
      // roleId: roleId as unknown as IUser['roleId'],
      status: utils.CONST.USER.STATUS.PENDING,
      password: password_
    })

    const { storeName } = validatedData
    // // Create the category
    if (user) {
      await sr.registerShop({
        storeName,
        userId: user?._id as Types.ObjectId
      })
    }


    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES.ACCOUNT_CREATED,
      })
    )
  })
}
