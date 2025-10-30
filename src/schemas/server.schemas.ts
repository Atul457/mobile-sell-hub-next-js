import mongoose from 'mongoose';
import * as yup from 'yup';

import { utils } from '@/utils/utils';

import { commonSchemas } from './common.schemas';

const register = commonSchemas.registerStep1.concat(commonSchemas.registerStep2).clone().shape({});

const objectIdSchema = yup
    .string()
    .test(
        'is-object-id',
        '${path} is invalid ObjectId',
        (value) => value === undefined || mongoose.Types.ObjectId.isValid(value)
    );

const addCategory = commonSchemas.addCategory.clone().shape({});
const registerShop = commonSchemas.storeSchema.clone().shape({});

const updateUser = commonSchemas.addUser.clone().shape({
    _id: objectIdSchema.required('User id is a required field')
});

const updateUserStatus = yup.object().shape({
    status: commonSchemas.statusSchema.required('Status is a required field')
});

const usersPaginationSchema = commonSchemas.paginationSchema.clone().shape({
    type: commonSchemas.userTypeSchema.nullable().optional(),
    userId: objectIdSchema.optional().nullable(),
    roleId: objectIdSchema.optional().nullable()
});

const categoriesPaginationSchema = commonSchemas.paginationSchema.clone().shape({
    status: yup
        .number()
        .oneOf([...Object.values(utils.CONST.CATEGORY.STATUS), -1])
        .optional()
        .nullable()
});

const rolesPaginationSchema = commonSchemas.paginationSchema.clone().shape({
    status: yup
        .number()
        // .oneOf([...Object.values(utils.CONST.REPORT.STATUS), -1])
        .optional()
        .nullable(),
    type: yup
        .number()
        .oneOf([...Object.values(utils.CONST.ROLE_PERMISSION.TYPES)])
        .required()
});

const profilesPaginationSchema = commonSchemas.paginationSchema.clone().shape({
    userId: objectIdSchema.nullable().optional()
});

const updateRoleStatus = commonSchemas.addRole.clone().shape({
    _id: objectIdSchema.required('Role id is a required field')
});

const serverSchemas = {
    storeSchema: commonSchemas.storeSchema,
    updateRoleStatus,
    categoriesPaginationSchema,
    register,
    updateUserStatus,
    profilesPaginationSchema,
    objectIdSchema,
    usersPaginationSchema,
    addCategory,
    registerShop,
    updateUser,
    rolesPaginationSchema
};

export { serverSchemas };
