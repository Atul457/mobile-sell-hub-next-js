import { dbConfig } from '@/configs/dbConfig'
import { commonSchemas } from '@/schemas/common.schemas'
import { services } from '@/services/index.service'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

export async function POST(request: Request) {
    return utils.errorHandler(async function () {
        await dbConfig()

        const us = services.server.UserService
        const uss = services.server.UserSessionService

        const authData = await middlewares.withUser(request)
        const isInvitationRequest = authData.session?.type === 'invitation'

        const body = await utils.getReqBody(request)

        const { password: password_ } = await commonSchemas.resetPassword.validate(body)
        const password = await utils.bcrypt.hashPassword(password_)

        await us.updateUser(authData.userId, {
            password,
            ...(isInvitationRequest && {
                status: utils.CONST.USER.STATUS.ACTIVE
            })
        })

        await uss.deleteSessionByToken(authData.session.token)

        return Response.json(
            utils.generateRes({
                status: true,
                message: utils.CONST.RESPONSE_MESSAGES._SUCCESSFULLY.replace(
                    '[ITEM]',
                    `Password ${isInvitationRequest ? 'set' : 'reset'}`
                )
            })
        )
    })
}
