import mongoose from 'mongoose';
import * as yup from 'yup';

import { utils } from '@/utils/utils';

import { commonSchemas } from './common.schemas';

const objectIdSchema = yup.string().test('is-object-id', '${path} is invalid ObjectId', (value) => {
    return !value || mongoose.Types.ObjectId.isValid(value);
});

const addCategory = commonSchemas.addCategory.clone().shape({});
const addProductCategory = commonSchemas.addProductCategory.clone().shape({});

const addTag = commonSchemas.addTag.clone().shape({});

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

const tagsPaginationSchema = commonSchemas.paginationSchema.clone().shape({
    status: yup
        .number()
        .oneOf([...Object.values(utils.CONST.TAG.STATUS), -1])
        .optional()
        .nullable(),
    categoryId: objectIdSchema
        .transform((currentValue, originalValue) => {
            if (originalValue === '-1') {
                currentValue = null;
                return currentValue;
            }
            return originalValue;
        })
        .optional()
        .nullable()
});

const productsPaginationSchema = commonSchemas.paginationSchema.clone().shape({
    status: yup
        .number()
        .oneOf([...Object.values(utils.CONST.PRODUCT.STATUS), -1])
        .optional()
        .nullable(),
    categoryId: objectIdSchema
        .transform((currentValue, originalValue) => {
            if (originalValue === '-1') {
                currentValue = null;
                return currentValue;
            }
            return originalValue;
        })
        .optional()
        .nullable()
});

const productCategoriesPaginationSchema = commonSchemas.paginationSchema.clone().shape({
    status: yup
        .number()
        .oneOf([...Object.values(utils.CONST.PRODUCT_CATEGORY.STATUS), -1])
        .optional()
        .nullable()
});

const rolesPaginationSchema = commonSchemas.paginationSchema.clone().shape({
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

const updateTag = commonSchemas.addTag.clone().shape({
    _id: objectIdSchema.required('Tag id is a required field'),
    categoryId: objectIdSchema.optional()
});

const serverSchemas = {
    branding: commonSchemas.branding,
    updateRoleStatus,
    categoriesPaginationSchema,
    productsPaginationSchema,
    tagsPaginationSchema,
    updateUserStatus,
    profilesPaginationSchema,
    objectIdSchema,
    usersPaginationSchema,
    addCategory,
    addTag,
    updateTag,
    updateUser,
    rolesPaginationSchema,
    createShopSchema: commonSchemas.createShopSchema,
    addProduct: commonSchemas.addProduct,
    productCategoriesPaginationSchema,
    addProductCategory
};

export { serverSchemas };
