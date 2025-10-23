import { IRequestArgs } from "@/app/api/types";
import { dbConfig } from "@/configs/dbConfig";
import { serverSchemas } from "@/schemas/server.schemas";
import { ErrorHandlingService } from "@/services/ErrorHandling.service";
import { services } from "@/services/index.service";
import { middlewares } from "@/utils/middlewares";
import { utils } from "@/utils/utils";

export async function DELETE(request: Request, args: IRequestArgs<{ id: string }>) {
    return utils.errorHandler(async function () {
        await dbConfig()

        const authData = await middlewares.withUser(request, {
            select: ["stripeCustomerId"]
        })

        await serverSchemas.objectIdSchema.required().validate(args.params.id);

        const cs = services.server.CardService
        const ss = services.StripeService

        if (!authData.stripeCustomerId) {
            throw ErrorHandlingService.notFound({
                message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Customer')
            })
        }

        const card = await cs.getCardById(args.params.id)

        if (!card) {
            throw ErrorHandlingService.notFound({
                message: utils.CONST.RESPONSE_MESSAGES.NOT_FOUND.replace('[ITEM]', 'Card')
            })
        }

        await ss.deleteCard(authData.stripeCustomerId, card.cardId);
        await cs.deleteCard(args.params.id);

        return Response.json(
            utils.generateRes({
                status: true,
                message: utils.CONST.RESPONSE_MESSAGES._DELETED_SUCCESSFULLY.replace('[ITEM]', 'Card')
            })
        )
    })
}
