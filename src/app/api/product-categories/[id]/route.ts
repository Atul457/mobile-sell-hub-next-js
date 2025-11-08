import { IRequestArgs } from '@/app/api/types';
import { dbConfig } from '@/configs/dbConfig';
import ProductCategoryModel, { IProductCategory } from '@/models/product-category.model';
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
            module: utils.CONST.ROLE_PERMISSION.MODULES.PRODUCT_CATEGORY,
            action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.UPDATE
        });

        await av.validate();

        const pcs = services.server.ProductCategoryService;

        // Get the request body
        const body = await utils.getReqBody(request);

        // Validate the request body
        await serverSchemas.objectIdSchema.required().validate(args.params.id);

        const validatedData = await serverSchemas.addProductCategory.validate(body ?? {});

        const { name, image, description, status } = validatedData;

        const existingProductCategory = await ProductCategoryModel.findOne({
            _id: args.params.id,
            ...(authData.shopId && {
                shopId: authData.shopId
            }),
            status: {
                $ne: utils.CONST.CATEGORY.STATUS.DELETED
            }
        });

        if (!existingProductCategory) {
            throw ErrorHandlingService.notFound({
                message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Product Category')
            });
        }

        // Update the productCategory
        const productCategory = await pcs.updateProductCategory(args.params.id, {
            name,
            image,
            description,
            status: status as IProductCategory['status']
        });

        return Response.json(
            utils.generateRes({
                status: true,
                message: utils.CONST.RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'Product Category'),
                data: {
                    productCategory
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
            module: utils.CONST.ROLE_PERMISSION.MODULES.PRODUCT_CATEGORY,
            action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.DELETE
        });

        await av.validate();

        const pcs = services.server.ProductCategoryService;

        const productCategory = await ProductCategoryModel.findOne({
            _id: args.params.id,
            ...(authData.shopId && {
                shopId: authData.shopId
            }),
            status: {
                $ne: utils.CONST.CATEGORY.STATUS.DELETED
            }
        });

        if (!productCategory) {
            throw ErrorHandlingService.notFound({
                message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Product Category')
            });
        }

        // Delete the productCategory
        await pcs.deleteProductCategory(args.params.id);

        return Response.json(
            utils.generateRes({
                status: true,
                message: utils.CONST.RESPONSE_MESSAGES._DELETED_SUCCESSFULLY.replace('[ITEM]', 'Product Category'),
                data: {
                    productCategory
                }
            })
        );
    });
}
