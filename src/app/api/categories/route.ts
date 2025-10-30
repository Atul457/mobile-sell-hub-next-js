import { PipelineStage } from 'mongoose';
import { NextRequest } from 'next/server';

import { dbConfig } from '@/configs/dbConfig';
import CategoryModel from '@/models/category.model';
import { serverSchemas } from '@/schemas/server.schemas';
import { services } from '@/services/index.service';
import { ActionValidator } from '@/services/server/ActionValidator.service';
import { middlewares } from '@/utils/middlewares';
import { utils } from '@/utils/utils';

export async function GET(request: NextRequest) {
    return utils.errorHandler(async function () {
        await dbConfig();

        const authData = await middlewares.withUser(request);

        const av = new ActionValidator({
            roleId: authData.roleId ?? null,
            module: utils.CONST.ROLE_PERMISSION.MODULES.CATEGORY,
            action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.READ
        });

        await av.validate();

        const body = utils.searchParamsToJson({
            params: request.nextUrl.searchParams
        });

        const {
            page = 1,
            limit = 10,
            query = null,
            sort = 'createdAt',
            order = 'desc',
            status = -1
        } = await serverSchemas.categoriesPaginationSchema.validate({
            ...(body ?? {})
        });

        const stages: PipelineStage[] = [
            {
                $match: {
                    status: { $ne: utils.CONST.CATEGORY.STATUS.DELETED },
                    ...(query && {
                        name: { $regex: new RegExp(query, 'gi') },
                        description: { $regex: new RegExp(query, 'gi') }
                    }),
                    ...(status !== -1 && { status }),
                    ...(authData.shopId
                        ? {
                              shopId: authData.shopId!
                          }
                        : {
                              shopId: { $exists: false }
                          })
                }
            }
        ];

        const totalCount_ = await CategoryModel.aggregate([...stages, { $group: { _id: null, n: { $sum: 1 } } }]);

        const totalCount = totalCount_.length > 0 ? totalCount_[0].n : 0;

        const categories = await CategoryModel.aggregate([
            ...stages,
            {
                $addFields: {
                    id: '$_id'
                }
            }
        ])
            .sort({
                [sort]: order
            })
            .skip((page - 1) * limit)
            .limit(limit)
            .project({
                __v: 0
            });

        return Response.json(
            utils.generateRes({
                status: true,
                data: {
                    page,
                    limit,
                    query,
                    totalCount,
                    categories
                }
            })
        );
    });
}

export async function POST(request: Request) {
    return utils.errorHandler(async function () {
        // Connect to the database
        await dbConfig();

        // Authenticate the user with admin privileges
        const authData = await middlewares.withUser(request);

        const av = new ActionValidator({
            roleId: authData.roleId ?? null,
            module: utils.CONST.ROLE_PERMISSION.MODULES.CATEGORY,
            action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.CREATE
        });

        await av.validate();

        const cs = services.server.CategoryService;

        // Get the request body
        const body = await utils.getReqBody(request);

        // Validate the request body
        const validatedData = await serverSchemas.addCategory.validate(body ?? {});

        const { name, image, description } = validatedData;

        // Create the category
        const category = await cs.createCategory({
            name,
            image,
            description,
            ...(authData.shopId && {
                shopId: authData.shopId
            })
        });

        return Response.json(
            utils.generateRes({
                status: true,
                message: utils.CONST.RESPONSE_MESSAGES._ADDED_SUCCESSFULLY.replace('[ITEM]', 'Category'),
                data: {
                    category
                }
            })
        );
    });
}
