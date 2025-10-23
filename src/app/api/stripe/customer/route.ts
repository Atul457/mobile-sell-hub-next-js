import { dbConfig } from "@/configs/dbConfig"
import { ErrorHandlingService } from "@/services/ErrorHandling.service"
import { services } from "@/services/index.service"
import { middlewares } from "@/utils/middlewares"
import { utils } from "@/utils/utils"

export async function POST(request: Request) {
    return utils.errorHandler(async function () {
        await dbConfig()

        const authData = await middlewares.withUser(request, {
            select: ["stripeCustomerId"]
        })

        const ss = services.StripeService;
        const us = services.server.UserService;

        if (authData.stripeCustomerId) {
            throw ErrorHandlingService.conflict({
                message: utils.CONST.RESPONSE_MESSAGES._ALREADY_EXISTS.replace('[ITEM]', 'Customer')
            })
        }

        const customer = await ss.createCustomer(authData.email, utils.helpers.user.getFullName(authData));

        await us.updateUser(authData.userId, {
            stripeCustomerId: customer.id
        })

        return Response.json(
            utils.generateRes({
                status: true,
                message: utils.CONST.RESPONSE_MESSAGES._ADDED_SUCCESSFULLY.replace('[ITEM]', 'Customer'),
                data: {
                    stripeCustomerId: authData.stripeCustomerId
                }
            })
        )
    })
}
