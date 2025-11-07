import mongoose, { PipelineStage } from 'mongoose';
import { NextRequest } from 'next/server';

import { dbConfig } from '@/configs/dbConfig';
import TagModel from '@/models/tag.model';
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
            module: utils.CONST.ROLE_PERMISSION.MODULES.TAGS,
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
            status = -1,
            categoryId
        } = await serverSchemas.tagsPaginationSchema.validate({
            ...(body ?? {})
        });

        const stages: PipelineStage[] = [
            {
                $match: {
                    status: { $ne: utils.CONST.TAG.STATUS.DELETED },
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
                          }),
                    ...(categoryId && {
                        categoryId: new mongoose.Types.ObjectId(categoryId)
                    })
                }
            },
            {
                $lookup: {
                    localField: 'categoryId',
                    foreignField: '_id',
                    from: 'categories',
                    as: 'category',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: '$category'
            }
        ];

        const totalCount_ = await TagModel.aggregate([...stages, { $group: { _id: null, n: { $sum: 1 } } }]);

        const totalCount = totalCount_.length > 0 ? totalCount_[0].n : 0;

        const tags = await TagModel.aggregate([
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
                    tags
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
            module: utils.CONST.ROLE_PERMISSION.MODULES.TAGS,
            action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.CREATE
        });

        await av.validate();

        const ts = services.server.TagService;

        // Get the request body
        const body = await utils.getReqBody(request);

        // Validate the request body
        const validatedData = await serverSchemas.addTag.validate(body ?? {});

        const { name, image, description, categoryId } = validatedData;

        // Create the tag
        const tag = await ts.createTag({
            name,
            image,
            description,
            categoryId,
            ...(authData.shopId && {
                shopId: authData.shopId
            })
        });

        return Response.json(
            utils.generateRes({
                status: true,
                message: utils.CONST.RESPONSE_MESSAGES._ADDED_SUCCESSFULLY.replace('[ITEM]', 'Tag'),
                data: {
                    tag
                }
            })
        );
    });
}
