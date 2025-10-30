import * as yup from 'yup';

import { utils } from '@/utils/utils';

const agree = yup
    .boolean()
    .oneOf([true], 'Please agree to terms & conditions')
    .required('Please agree to terms & conditions');

const permissionActionsSchema = yup.string().oneOf(['create', 'read', 'update', 'delete']).required();

const permissionsSchema = yup.object().shape({
    category: yup.array().of(permissionActionsSchema).optional(),
    user: yup.array().of(permissionActionsSchema).optional(),
    role: yup.array().of(permissionActionsSchema).optional()
});

const statusSchema = yup.number().oneOf([0, 1, 3]).nullable();

const addressMetaSchema = yup.object().shape({
    city: yup.string().trim().required('city is a required field'),
    appartment: yup.string().nullable(),
    zipCode: yup.string().trim().required('zipCode is a required field'),
    state: yup.string().trim().required('state is a required field'),
    country: yup.string().nullable(),
    lat: yup.number().nullable(),
    long: yup.number().nullable()
});

const firstNameSchema = yup
    .string()
    .trim()
    .min(1, 'First name is a required field')
    .required('First name is a required field');

const addressSchema = yup.string().optional().nullable();

const phoneNumberSchema_ = yup.string().nullable().optional();

const lastNameSchema = yup
    .string()
    .trim()
    .min(1, 'Last name is a required field')
    .required('Last name is a required field');

const nonMandatoryPhoneNumberSchema = yup
    .string()
    .trim()
    .transform((value) => (value === '' ? null : value))
    .matches(/^\d+$/, 'Please enter a valid mobile number')
    .length(10, 'Mobile number must be 10 characters long')
    .nullable();

const phoneNumberSchema = nonMandatoryPhoneNumberSchema.required('Mobile number is a required field');

const userTypeSchema = yup
    .number()
    .oneOf([0, ...Object.values(utils.CONST.USER.TYPES)], 'Type is a required field')
    .required('Type is a required field');

const userTypeSchema_ = yup
    .number()
    .oneOf([...Object.values(utils.CONST.USER.TYPES)], 'Type is a required field')
    .required('Type is a required field');

const paginationSchema = yup.object().shape({
    page: yup.number().min(0).typeError('Page should be a number').optional(),
    sort: yup.string().typeError('Sort should be a string').optional(),
    order: yup.string().oneOf(['asc', 'desc']).typeError('Order should be a string').optional(),
    limit: yup.number().positive().typeError('Limit should be a number').optional(),
    query: yup.string().optional().typeError('Query should be a string').optional()
});

const nonMandatoryEmailSchema = yup
    .string()
    .min(1, 'Email is a required field')
    .email('Enter a valid email address')
    .nullable();

const emailSchema = nonMandatoryEmailSchema.required('Email is a required field');

const passwordSchema = yup
    .string()
    .required('Password is a required field')
    .min(5, 'Password must be at least 5 characters long');

const resetPassword = yup.object().shape({
    password: passwordSchema
});

const updatePassword = yup.object().shape({
    oldPassword: yup.string().trim().required('Old password is a required field'),
    newPassword: yup
        .string()
        .required('New password is a required field')
        .min(5, 'New password must be at least 5 characters long')
});

const updatePasswordWithConfirm = updatePassword
    .clone()
    .shape({
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('newPassword')], 'The passwords do not match')
            .required('Confirm Password is a required field')
    })
    .required();

const resetPasswordWithConfirm = resetPassword
    .clone()
    .shape({
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'The passwords do not match')
            .required('Confirm Password is a required field')
    })
    .required();

const login = yup.object().shape({
    email: emailSchema,
    password: yup.string().trim().required('Password is a required field')
});

const registerStep1 = yup.object().shape({
    email: emailSchema,
    password: passwordSchema,
    type: userTypeSchema
});

const updateProfileSchema = yup.object().shape({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    address: addressSchema.transform((c) => (c ? c : null)),
    phoneNumber: phoneNumberSchema,
    phoneNumber_: phoneNumberSchema_,
    addressMeta: addressMetaSchema.when('type', (type, schema) => {
        const object = utils.CONST.USER.TYPES;
        const isSubAdminUser = object.ADMIN === type?.[0];
        return !isSubAdminUser ? schema.nullable().optional() : yup.string().optional().nullable();
    }),
    type: userTypeSchema_,
    roleId: yup.string().when('address', (type, schema) => {
        const object = utils.CONST.USER.TYPES;
        const isSubAdminUser = object.ADMIN === type?.[0];
        return isSubAdminUser ? schema.required() : schema.optional().nullable();
    })
});

const updateAdminProfileSchema = yup.object().shape({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema
});

const updateProfileSchemaWithType = updateProfileSchema.clone().shape({
    type: userTypeSchema
});

const addUser = updateProfileSchema.clone().shape({
    email: emailSchema,
    role: yup.string().optional(),
    addressMeta: addressMetaSchema.when('address', (address, schema) => {
        return address[0] ? schema : schema.optional().nullable();
    }),
    status: statusSchema
});

const createAdminUsers = addUser.clone().shape({
    type: userTypeSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    phoneNumber_: phoneNumberSchema_,
    addressMeta: yup.string().nullable().optional(),
    roleId: yup.string().required()
});

const addUpdateRolePermission = yup.object().shape({
    role: yup.number().oneOf(Object.values(utils.CONST.USER.ROLES)).required('Role is a required field'),
    module: yup
        .string()
        .oneOf(Object.values(utils.CONST.ROLE_PERMISSION.MODULES))
        .required('Module is a required field'),
    actions: yup
        .array()
        .of(yup.string().oneOf(['create', 'read', 'update', 'delete']).required())
        .required('Actions is a required field')
});

const addCategory = yup.object().shape({
    name: yup.string().required('Name is a required field'),
    description: yup.string().optional(),
    image: yup.string().nullable().optional(),
    status: yup.number().oneOf([0, 1, 2]).required('Status is a required field')
});

const registerStep2 = yup.object().shape({
    type: userTypeSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    address: addressSchema,
    phoneNumber: phoneNumberSchema,
    phoneNumber_: phoneNumberSchema_
});

const registerStep2WithAgree = registerStep2.clone().shape({
    agree
});

const forgotPasswordSchema = yup.object().shape({
    email: emailSchema
});

const querySchema = yup.object().shape({
    query: yup.string().optional().typeError('Query should be a string').optional()
});

const addRole = yup.object().shape({
    name: yup.string().trim().required('Role name is a required field'),
    roleId: yup.number().oneOf(Object.values(utils.CONST.USER.ROLES)).optional().nullable(),
    type: yup
        .number()
        .oneOf([...Object.values(utils.CONST.ROLE_PERMISSION.TYPES)])
        .required(),
    permissions: permissionsSchema,
    markDefault: yup.number().oneOf(Object.values(utils.CONST.APP_CONST.BOOLEAN_STATUS)).nullable().optional()
});

const storeSchema = yup.object().shape({
    storeName: yup.string().required('Store name is a required field')
});
const shopRegister = yup.object().shape({
    firstName: yup.string().required('First name is a required field'),
    lastName: yup.string().nullable(),
    email: emailSchema,
    phoneNumber: phoneNumberSchema,
    phoneNumber_: phoneNumberSchema_,
    password: yup
        .string()
        .required('New password is a required field')
        .min(5, 'New password must be at least 5 characters long'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'The passwords do not match')
        .required('Confirm Password is a required field'),
    storeName: yup.string().required('Store name is a required field'),
    type: yup.number().required('Type is a required field')
});

const commonSchemas = {
    login,
    querySchema,
    addRole,
    agree,
    resetPassword,
    registerStep1,
    registerStep2,
    paginationSchema,
    addUser,
    statusSchema,
    addUpdateRolePermission,
    updateProfileSchemaWithType,
    updateProfileSchema,
    forgotPasswordSchema,
    registerStep2WithAgree,
    resetPasswordWithConfirm,
    updatePasswordWithConfirm,
    updatePassword,
    userTypeSchema,
    userTypeSchema_,
    updateAdminProfileSchema,
    createAdminUsers,
    addCategory,
    storeSchema,
    shopRegister
};

export { commonSchemas };
