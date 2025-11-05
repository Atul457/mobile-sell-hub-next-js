import * as yup from 'yup';

import { CONST } from '@/constants';
import { utils } from '@/utils/utils';

const {
    USER: { STATUS: USER_STATUS }
} = CONST;

const USER_STATUSES = Object.values(USER_STATUS).filter((status) => status !== USER_STATUS.DELETED);

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

const updateProfileSchema = yup.object().shape({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    address: addressSchema.transform((c) => (c ? c : null)),
    phoneNumber: phoneNumberSchema,
    phoneNumber_: phoneNumberSchema_,
    type: userTypeSchema_,
    status: yup.number().oneOf(USER_STATUSES),
    roleId: yup.string().required('Role is a required field')
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
    status: statusSchema
});

const createAdminUsers = addUser.clone().shape({
    type: userTypeSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    phoneNumber_: phoneNumberSchema_,
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

const addTag = yup.object().shape({
    name: yup.string().required('Name is a required field'),
    description: yup.string().optional(),
    image: yup.string().nullable().optional(),
    categoryId: yup
        .string()
        .transform((value) => (value === '-1' ? null : value))
        .required('Category Id is a required field'),
    status: yup.number().oneOf([0, 1, 2]).required('Status is a required field')
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

const addProduct = yup.object().shape({
    name: yup.string().required('Product name is a required field'),
    description: yup.string().optional(),
    image: yup.string().nullable().optional(),
    status: yup.number().oneOf([0, 1, 2]).required('Status is a required field'),
    lanes: yup
        .array()
        .of(
            yup.object().shape({
                categoryId: yup
                    .string()
                    .transform((value) => (value === '-1' ? null : value))
                    .required('Category is required'),
                laneTitle: yup.string().optional(),
                type: yup
                    .mixed<'radio' | 'checkbox'>()
                    .oneOf(['radio', 'checkbox'])
                    .required('Type is required (radio or checkbox)'),
                options: yup
                    .array()
                    .of(
                        yup.object().shape({
                            tagId: yup
                                .string()
                                .transform((value) => (value === '-1' ? null : value))
                                .required('Tag is required'),
                            price: yup
                                .number()
                                .typeError('Price must be a number')
                                .min(0, 'Price must be >= 0')
                                .required('Price is required')
                        })
                    )
                    .min(1, 'At least one option is required')
                    .required('Options are required')
            })
        )
        .min(1, 'At least one lane is required')
        .required('Lanes are required')
});

const phoneSchema = yup
    .string()
    .matches(/^\d{7,15}$/, 'Phone number must be between 7 and 15 digits')
    .optional();

const directorSchema = yup.object().shape({
    firstName: firstNameSchema,
    middleName: yup.string().optional(),
    lastName: lastNameSchema,
    email: emailSchema.optional(),
    mobile: phoneSchema.optional()
});

const createShopSchema = yup.object().shape({
    business: yup.object().shape({
        companyName: yup.string().required('Company / Trading name is required'),
        companyNumber: yup.string().optional(),
        addressStreet: yup.string().required('Street is required'),
        addressSuburb: yup.string().required('Suburb is required'),
        addressCity: yup.string().required('City is required'),
        addressPostcode: yup.string().required('Postcode is required'),
        businessEmail: yup.string().email('Enter a valid email').required('Business email is required'),
        businessPhone: phoneSchema.required('Business contact number is required')
    }),
    admin: yup.object().shape({
        firstName: yup.string().required('First name is required'),
        lastName: yup.string().optional(),
        role: yup.string().optional(),
        email: yup.string().email('Enter a valid email').required('Admin email is required'),
        mobile: phoneSchema.required('Mobile number is required'),
        password: yup.string().required('Password is required').min(5, 'Password must be at least 5 characters long'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('password')], 'The passwords do not match')
            .required('Confirm Password is required')
    }),
    directors: yup.array().of(directorSchema).max(3, 'You can add up to 3 directors'),
    subscription: yup.object().shape({
        plan: yup.string().oneOf(['monthly', 'annual']).required('Choose a subscription plan'),
        paymentMethod: yup.string().oneOf(['card', 'bank']).required('Choose a payment method'),
        billingName: yup.string().required('Billing contact name is required'),
        billingEmail: yup.string().email('Enter a valid email').required('Billing contact email is required'),
        billingAddress: yup.string().optional(),
        termsAccepted: agree
    })
});

const commonSchemas = {
    addProduct,
    login,
    querySchema,
    addRole,
    agree,
    resetPassword,
    paginationSchema,
    addUser,
    statusSchema,
    addUpdateRolePermission,
    updateProfileSchemaWithType,
    updateProfileSchema,
    forgotPasswordSchema,
    resetPasswordWithConfirm,
    updatePasswordWithConfirm,
    updatePassword,
    userTypeSchema,
    userTypeSchema_,
    updateAdminProfileSchema,
    createAdminUsers,
    addCategory,
    addTag,
    createShopSchema
};

export { commonSchemas };
