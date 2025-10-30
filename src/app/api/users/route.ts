import mongoose, { Schema } from 'mongoose';
import { NextRequest } from 'next/server';

import { dbConfig } from '@/configs/dbConfig';
import RoleModel from '@/models/role.model';
import UserModel, { IUser } from '@/models/user.model';
import { commonSchemas } from '@/schemas/common.schemas';
import { serverSchemas } from '@/schemas/server.schemas';
import { ErrorHandlingService } from '@/services/ErrorHandling.service';
import { services } from '@/services/index.service';
import { ActionValidator } from '@/services/server/ActionValidator.service';
import { middlewares } from '@/utils/middlewares';
import { mongo } from '@/utils/mongo';
import { utils } from '@/utils/utils';

export async function GET(request: NextRequest) {
    return utils.errorHandler(async function () {
        await dbConfig();

        const authData = await middlewares.withUser(request);
        const av = new ActionValidator({
            roleId: authData.roleId ?? null,
            module: utils.CONST.ROLE_PERMISSION.MODULES.USER,
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
            type = null,
            userId = null,
            roleId = null
        } = await serverSchemas.usersPaginationSchema.validate({
            ...(body ?? {})
        });

        // For single user view

        let userIds: Schema.Types.ObjectId[] = [];
        let mainCreatorId_: mongoose.Types.ObjectId | null = null;
        let userId_ = userId ? mongo.stringToObjectId(userId) : null;

        const { SHOP, ADMIN } = utils.CONST.USER.TYPES;
        const isAdminsListing = type && type === ADMIN;

        const stages = [
            {
                $match: {
                    ...(userId_ && {
                        $and: [
                            {
                                _id: { $in: userIds }
                            },
                            {
                                _id: {
                                    $nin: [...(mainCreatorId_ ? [mainCreatorId_] : []), userId_]
                                }
                            }
                        ]
                    }),
                    _id: { $ne: authData.userId },
                    ...(roleId && { roleId: mongo.stringToObjectId(roleId) }),
                    type: isAdminsListing ? ADMIN : SHOP,
                    status: {
                        $ne: utils.CONST.USER.STATUS.DELETED
                    },
                    ...(query && {
                        $and: query.split(' ').map((word) => ({
                            $or: [
                                { firstName: { $regex: new RegExp(word, 'gi') } },
                                { lastName: { $regex: new RegExp(word, 'gi') } },
                                { email: { $regex: new RegExp(word, 'gi') } },
                                { phoneNumber: { $regex: new RegExp(word, 'gi') } }
                            ]
                        }))
                    })
                }
            }
        ];

        const totalCount_ = await UserModel.aggregate([...stages, { $group: { _id: null, n: { $sum: 1 } } }]);

        const totalCount = totalCount_.length > 0 ? totalCount_[0].n : 0;

        const users = await UserModel.aggregate([
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
                password: 0
            });

        return Response.json(
            utils.generateRes({
                status: true,
                data: {
                    page,
                    limit,
                    query,
                    totalCount,
                    users
                }
            })
        );
    });
}

export async function POST(request: Request) {
    return utils.errorHandler(async function () {
        await dbConfig();

        const authData = await middlewares.withUser(request, {
            select: ['type', 'roleId']
        });
        const av = new ActionValidator({
            roleId: authData.roleId ?? null,
            module: utils.CONST.ROLE_PERMISSION.MODULES.USER,
            action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.CREATE
        });

        await av.validate();

        const body = await utils.getReqBody(request);

        const validatedData = await commonSchemas.createAdminUsers.validate(body ?? {});

        const { firstName, email, phoneNumber, lastName, address, roleId } = validatedData;

        let inviterDesignation = 'Admin';

        if (authData.roleId) {
            const role = await RoleModel.findById(authData.roleId);
            if (role) {
                inviterDesignation = role.name;
            }
        }

        // const ms = services.MailService
        const us = services.server.UserService;

        const existingUser = await UserModel.findOne({
            $or: [
                {
                    email: new RegExp(email, 'gi'),
                    status: { $ne: utils.CONST.USER.STATUS.DELETED }
                },
                {
                    firstName: new RegExp(validatedData.firstName, 'gi'),
                    lastName: new RegExp(validatedData.lastName, 'gi'),
                    status: { $ne: utils.CONST.USER.STATUS.DELETED }
                }
            ]
        });

        if (existingUser) {
            throw ErrorHandlingService.userAlreadyExists({
                message: utils.CONST.RESPONSE_MESSAGES.USER_ALREADY_EXIST
            });
        }

        const user = await us.createUser({
            firstName,
            lastName,
            phoneNumber,
            email: email.toLowerCase(),
            type: utils.CONST.USER.TYPES.ADMIN,
            address,
            roleId: roleId as unknown as IUser['roleId'],
            status: utils.CONST.USER.STATUS.PENDING,
            creatorId: authData.userId
        });

        const commonRKeysValues = utils.helpers.user.getUserDetails(user);

        const uss = services.server.UserSessionService;

        const commonKeysValues = {
            type: user.type,
            email: user.email,
            tokenType: 'invitation'
        };

        const token = utils.jwt.generateToken({ ...commonKeysValues, id: user._id }, null);

        const session = await uss.createSession({
            userId: user._id as any,
            lastLogin: new Date(),
            token,
            type: 'invitation',
            userType: user.type
        });

        const resetPasswordLink = `/portal/login?invitation-token=${session.token}`;
        const inviter = utils.helpers.user.getFullName(authData);
        const userName = utils.helpers.user.getFullName(user);
        const completeAccountUrl = `${process.env.NEXT_PUBLIC_APP_HOSTNAME ?? ''}${resetPasswordLink}`;

        // await ms.invitationMail({
        //   email: user.email,
        //   userName,
        //   inviter,
        //   completeAccountUrl,
        //   inviterDesignation,
        //   inviterOrganization: utils.string.capitalizeFirstLetter(process.env.MONGO_DB_NAME ?? '')
        // })

        return Response.json(
            utils.generateRes({
                status: true,
                message: utils.CONST.RESPONSE_MESSAGES._ADDED_SUCCESSFULLY.replace('[ITEM]', 'User'),
                data: {
                    completeAccountUrl,
                    inviter,
                    inviterDesignation,
                    user: {
                        user: {
                            ...commonRKeysValues,
                            role: user.role,
                            _id: user.id,
                            userName
                        }
                    }
                }
            })
        );
    });
}
