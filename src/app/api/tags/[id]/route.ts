import { IRequestArgs } from '@/app/api/types';
import { dbConfig } from '@/configs/dbConfig';
import TagModel, { ITag } from '@/models/tag.model';
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
            module: utils.CONST.ROLE_PERMISSION.MODULES.TAGS,
            action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.UPDATE
        });

        await av.validate();

        const ts = services.server.TagService;

        // Get the request body
        const body = await utils.getReqBody(request);

        // Validate the request body
        await serverSchemas.objectIdSchema.required().validate(args.params.id);

        const validatedData = await serverSchemas.addTag.validate(body ?? {});

        const { name, image, description, status, categoryId } = validatedData;

        const existingTag = await TagModel.findOne({
            _id: args.params.id,
            ...(authData.shopId && {
                shopId: authData.shopId
            }),
            status: {
                $ne: utils.CONST.TAG.STATUS.DELETED
            }
        });

        if (!existingTag) {
            throw ErrorHandlingService.notFound({
                message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Tag')
            });
        }

        // Update the tag
        const tag = await ts.updateTag(args.params.id, {
            name,
            image,
            description,
            status: status as ITag['status'],
            categoryId
        });

        return Response.json(
            utils.generateRes({
                status: true,
                message: utils.CONST.RESPONSE_MESSAGES._UPDATED_SUCCESSFULLY.replace('[ITEM]', 'Tag'),
                data: {
                    tag
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
            module: utils.CONST.ROLE_PERMISSION.MODULES.TAGS,
            action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.DELETE
        });

        await av.validate();

        const cs = services.server.TagService;

        const tag = await TagModel.findOne({
            _id: args.params.id,
            ...(authData.shopId && {
                shopId: authData.shopId
            }),
            status: {
                $ne: utils.CONST.TAG.STATUS.DELETED
            }
        });

        if (!tag) {
            throw ErrorHandlingService.notFound({
                message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Tag')
            });
        }

        // Delete the tag
        await cs.deleteTag(args.params.id);

        return Response.json(
            utils.generateRes({
                status: true,
                message: utils.CONST.RESPONSE_MESSAGES._DELETED_SUCCESSFULLY.replace('[ITEM]', 'Tag'),
                data: {
                    tag
                }
            })
        );
    });
}
