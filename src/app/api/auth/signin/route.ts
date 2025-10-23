import { dbConfig } from '@/configs/dbConfig'
import UserModel from '@/models/user.model'
import { commonSchemas } from '@/schemas/common.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { utils } from '@/utils/utils'

export async function POST(request: Request) {
    return utils.errorHandler(async function () {
        await dbConfig()

        const body = await utils.getReqBody(request)
        const validatedData = await commonSchemas.login.validate(body ?? {})
        const { email, password } = validatedData

        const uss = services.server.UserSessionService

        const { ADMIN, SUB_ADMIN } = utils.CONST.USER.TYPES;

        const existingUser = await UserModel.findOne({
            email: new RegExp(email, 'gi'),
            type: { $in: [ADMIN, SUB_ADMIN] }
        })

        if (!existingUser) {
            throw ErrorHandlingService.badRequest({
                message: utils.CONST.RESPONSE_MESSAGES.INVALID_CREDENTIALS
            })
        }

        const passwordMatched = await utils.bcrypt.comparePassword(password, existingUser.password ?? '')

        if (!passwordMatched) {
            throw ErrorHandlingService.badRequest({
                message: utils.CONST.RESPONSE_MESSAGES.INVALID_CREDENTIALS
            })
        }

        const commonKeysValues = utils.helpers.user.getUserDetails(existingUser, true)
        const commonRKeysValues = utils.helpers.user.getUserDetails(existingUser)

        const token = utils.jwt.generateToken(commonKeysValues)

        await uss.createSession({
            userId: existingUser._id as any,
            lastLogin: new Date(),
            token,
            userType: existingUser.type
        })

        return Response.json(
            utils.generateRes({
                status: true,
                data: {
                    token,
                    user: commonRKeysValues
                },
                message: 'User logged in successfully'
            })
        )
    })
}
