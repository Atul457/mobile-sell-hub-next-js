
import { dbConfig } from '@/configs/dbConfig'
import ProfileModel from '@/models/profile.model'
import { serverSchemas } from '@/schemas/server.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { ActionValidator } from '@/services/server/ActionValidator.service'
import { middlewares } from '@/utils/middlewares'
import { mongo } from '@/utils/mongo'
import { utils } from '@/utils/utils'

import { IRequestArgs } from "../../types"
export async function GET(request: Request, args: IRequestArgs<{ id: string }>) {
    return utils.errorHandler(async function () {
        // Connect to the database
        await dbConfig()

        const authData = await middlewares.withUser(request)
        const av = new ActionValidator({
            roleId: authData.roleId ?? null,
            module: utils.CONST.ROLE_PERMISSION.MODULES.PROFILE,
            action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.READ
        })

        await av.validate()

        await serverSchemas.objectIdSchema.required().validate(args.params.id)

        const profileId = mongo.stringToObjectId(args.params.id)

        const profiles = await ProfileModel.aggregate([
            {
                $match: {
                    _id: profileId,

                }
            },
        ])

        if (!profiles.length) {
            throw ErrorHandlingService.notFound({
                message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Profile')
            })
        }

        const profile = profiles[0]

        return Response.json(
            utils.generateRes({
                status: true,
                data: {
                    profile
                }
            })
        )
    })
}
