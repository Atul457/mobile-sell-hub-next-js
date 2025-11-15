import { dbConfig } from '@/configs/dbConfig';
import { serverSchemas } from '@/schemas/server.schemas';
import { services } from '@/services/index.service';
import { middlewares } from '@/utils/middlewares';
import { utils } from '@/utils/utils';

export async function GET(request: Request) {
    return utils.errorHandler(async function () {
        await dbConfig();

        const { SHOP } = utils.CONST.USER.TYPES;

        const authData = await middlewares.withUser(request, {
            allowedUserTypes: [SHOP]
        });

        const srs = services.server.ShopRegisterService;

        const { branding } = (await srs.get(authData.shopId as unknown as string))!;

        return Response.json(
            utils.generateRes({
                status: true,
                data: {
                    branding
                }
            })
        );
    });
}

export async function PATCH(request: Request) {
    return utils.errorHandler(async function () {
        await dbConfig();

        const { SHOP } = utils.CONST.USER.TYPES;

        const authData = await middlewares.withUser(request, {
            allowedUserTypes: [SHOP]
        });

        // Get the request body
        const body = await utils.getReqBody(request);

        // Validate the request body
        const validatedData = await serverSchemas.branding.validate(body ?? {});

        const branding = validatedData;

        const srs = services.server.ShopRegisterService;

        const { branding: updatedBranding } = (await srs.update(authData.shopId as unknown as string, {
            branding
        }))!;

        return Response.json(
            utils.generateRes({
                status: true,
                data: {
                    branding: updatedBranding
                }
            })
        );
    });
}
