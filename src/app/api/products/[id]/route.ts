import { IRequestArgs } from '@/app/api/types';
import { dbConfig } from '@/configs/dbConfig';
import ProductModel, { IProduct } from '@/models/product.model';
import TagModel from '@/models/tag.model';
import { serverSchemas } from '@/schemas/server.schemas';
import { ErrorHandlingService } from '@/services/ErrorHandling.service';
import { services } from '@/services/index.service';
import { ActionValidator } from '@/services/server/ActionValidator.service';
import { middlewares } from '@/utils/middlewares';
import { utils } from '@/utils/utils';

export async function GET(request: Request, args: IRequestArgs<{ id: string }>) {
    return utils.errorHandler(async function () {
        await dbConfig();

        const authData = await middlewares.withUser(request);

        const av = new ActionValidator({
            roleId: authData.roleId ?? null,
            module: utils.CONST.ROLE_PERMISSION.MODULES.PRODUCT,
            action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.READ
        });

        await av.validate();

        const ps = services.server.ProductService;
        await serverSchemas.objectIdSchema.required().validate(args.params.id);

        // Ensure product exists for this shop
        const existingProduct = await ProductModel.findOne({
            _id: args.params.id,
            ...(authData.shopId && { shopId: authData.shopId }),
            status: { $ne: utils.CONST.TAG.STATUS.DELETED }
        });

        if (!existingProduct) {
            throw ErrorHandlingService.notFound({
                message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Product')
            });
        }

        // Fetch product as plain JS object
        const product = (await ps.getProductById(args.params.id))!.toJSON() as IProduct;

        // Gather all unique category IDs from lanes
        const categoryIds = product.lanes.map((l) => l.categoryId);
        const tags = await TagModel.find({ categoryId: { $in: categoryIds } })
            .select('_id name categoryId')
            .lean();

        // Enrich lanes
        product.lanes = product.lanes.map((lane) => {
            const laneTags = tags.filter((t) => t.categoryId.toString() === lane.categoryId.toString());

            const presentTagOptions = laneTags.map((t) => ({
                tagId: t._id.toString(),
                name: t.name
            }));

            const selectedTagIds = lane.options.map((opt) => opt.tagId.toString());

            const options = lane.options.map((opt) => ({
                ...opt,
                name: laneTags.find((t) => t._id.toString() === opt.tagId.toString())?.name || ''
            }));

            return {
                ...lane,
                presentTagOptions,
                selectedTagIds,
                options
            };
        });

        return Response.json(
            utils.generateRes({
                status: true,
                data: { product }
            })
        );
    });
}

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
