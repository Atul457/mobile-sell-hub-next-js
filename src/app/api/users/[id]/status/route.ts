import { dbConfig } from '@/configs/dbConfig'
// import FileModel from '@/models/file.model'
import UserModel, { IUser } from '@/models/user.model'
import { schemas } from '@/schemas/index.schemas'
import { serverSchemas } from '@/schemas/server.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { ActionValidator } from '@/services/server/ActionValidator.service'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

import { IRequestArgs } from '../../../types'
export async function PATCH(request: Request, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.USER,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.UPDATE
    })

    await av.validate()

    const body = await utils.getReqBody(request)

    const validatedData = await schemas.server.updateUserStatus.validate(body ?? {})

    const { status } = validatedData

    const us = services.server.UserService

    await serverSchemas.objectIdSchema.required().validate(args.params.id)

    const existingUser = await UserModel.findById(args.params.id)

    if (!existingUser) {
      throw ErrorHandlingService.userNotFound()
    }

    const user = await us.updateUser(existingUser.id, {
      status: status as IUser['status']
    })

    const commonRKeysValues = utils.helpers.user.getUserDetails(user ?? new UserModel())

    return Response.json(
      utils.generateRes({
        status: true,
        message: utils.CONST.RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'User'),
        data: {
          user: commonRKeysValues
        }
      })
    )
  })
}
