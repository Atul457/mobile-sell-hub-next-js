import { IRequestArgs } from '@/app/api/types';
import { dbConfig } from '@/configs/dbConfig';
import ProductModel, { IProduct } from '@/models/product.model';
import { serverSchemas } from '@/schemas/server.schemas';
import { ErrorHandlingService } from '@/services/ErrorHandling.service';
import { services } from '@/services/index.service';
import { ActionValidator } from '@/services/server/ActionValidator.service';
import { middlewares } from '@/utils/middlewares';
import { utils } from '@/utils/utils';

export async function PATCH(request: Request, args: IRequestArgs<{ id: string }>) {
    return utils.errorHandler(async function () {
        // Connect to the database
        await dbConfig();

        // Authenticate the user with admin privileges
        const authData = await middlewares.withUser(request);

        const av = new ActionValidator({
            roleId: authData.roleId ?? null,
            module: utils.CONST.ROLE_PERMISSION.MODULES.PRODUCT,
            action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.UPDATE
        });

        await av.validate();

        const ps = services.server.ProductService;

        // Get the request body
        const body = await utils.getReqBody(request);

        // Validate the request body
        await serverSchemas.objectIdSchema.required().validate(args.params.id);

        const validatedData = await serverSchemas.addProduct.validate(body ?? {});

        const existingProduct = await ProductModel.findOne({
            _id: args.params.id,
            ...(authData.shopId && {
                shopId: authData.shopId
            }),
            status: {
                $ne: utils.CONST.TAG.STATUS.DELETED
            }
        });

        if (!existingProduct) {
            throw ErrorHandlingService.notFound({
                message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Product')
            });
        }

        // Update the product
        const product = await ps.updateProduct(args.params.id, {
            ...validatedData,
            status: validatedData.status as IProduct['status']
        });

        return Response.json(
            utils.generateRes({
                status: true,
                message: utils.CONST.RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'Product'),
                data: {
                    product
                }
            })
        );
    });
}

export async function DELETE(request: Request, args: IRequestArgs<{ id: string }>) {
    return utils.errorHandler(async function () {
        // Connect to the database
        await dbConfig();

        // Authenticate the user with admin privileges
        const authData = await middlewares.withUser(request);

        const av = new ActionValidator({
            roleId: authData.roleId ?? null,
            module: utils.CONST.ROLE_PERMISSION.MODULES.PRODUCT,
            action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.DELETE
        });

        await av.validate();

        const cs = services.server.ProductService;

        const product = await ProductModel.findOne({
            _id: args.params.id,
            ...(authData.shopId && {
                shopId: authData.shopId
            }),
            status: {
                $ne: utils.CONST.TAG.STATUS.DELETED
            }
        });

        if (!product) {
            throw ErrorHandlingService.notFound({
                message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Product')
            });
        }

        // Delete the product
        await cs.deleteProduct(args.params.id);

        return Response.json(
            utils.generateRes({
                status: true,
                message: utils.CONST.RESPONSE_MESSAGES._DELETED_SUCCESSFULLY.replace('[ITEM]', 'Product'),
                data: {
                    product
                }
            })
        );
    });
}
