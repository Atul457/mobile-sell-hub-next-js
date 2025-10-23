import * as yup from 'yup'

import { utils } from '@/utils/utils'

const agree = yup
  .boolean()
  .oneOf([true], 'Please agree to terms & conditions')
  .required('Please agree to terms & conditions')

const permissionActionsSchema = yup.string().oneOf(['create', 'read', 'update', 'delete']).required()

const permissionsSchema = yup.object().shape({
  transaction: yup.array().of(permissionActionsSchema).optional(),
  user: yup.array().of(permissionActionsSchema).optional(),
  qr: yup.array().of(permissionActionsSchema).optional(),
  report: yup.array().of(permissionActionsSchema).optional(),
  role: yup.array().of(permissionActionsSchema).optional(),
  package: yup.array().of(permissionActionsSchema).optional(),
  profile: yup.array().of(permissionActionsSchema).optional(),
  test: yup.array().of(permissionActionsSchema).optional()
})

const statusSchema = yup.number().oneOf([0, 1, 3]).nullable()

const qrSchema = yup.string().trim().length(6, 'Invalid Qr code').required('Qr code is a required field')

const addressMetaSchema = yup.object().shape({
  city: yup.string().trim().required('city is a required field'),
  appartment: yup.string().nullable(),
  zipCode: yup.string().trim().required('zipCode is a required field'),
  state: yup.string().trim().required('state is a required field'),
  country: yup.string().nullable(),
  lat: yup.number().nullable(),
  long: yup.number().nullable()
})

const firstNameSchema = yup
  .string()
  .trim()
  .min(1, 'First name is a required field')
  .required('First name is a required field')

const addressSchema = yup.string().optional().nullable()

const phoneNumberSchema_ = yup.string().nullable().optional()

const lastNameSchema = yup
  .string()
  .trim()
  .min(1, 'Last name is a required field')
  .required('Last name is a required field')

const nonMandatoryPhoneNumberSchema = yup
  .string()
  .trim()
  .transform(value => (value === '' ? null : value))
  .matches(/^\d+$/, 'Please enter a valid mobile number')
  .length(10, 'Mobile number must be 10 characters long')
  .nullable()

const phoneNumberSchema = nonMandatoryPhoneNumberSchema.required('Mobile number is a required field')

const userTypeSchema = yup
  .number()
  .oneOf([0, ...Object.values(utils.CONST.USER.TYPES)], 'Type is a required field')
  .required('Type is a required field')

const userTypeSchema_ = yup
  .number()
  .oneOf([...Object.values(utils.CONST.USER.TYPES)], 'Type is a required field')
  .required('Type is a required field')

const paginationSchema = yup.object().shape({
  page: yup.number().min(0).typeError('Page should be a number').optional(),
  sort: yup.string().typeError('Sort should be a string').optional(),
  order: yup.string().oneOf(['asc', 'desc']).typeError('Order should be a string').optional(),
  limit: yup.number().positive().typeError('Limit should be a number').optional(),
  query: yup.string().optional().typeError('Query should be a string').optional()
})

const designationTypeSchema = yup
  .number()
  .oneOf([1, 2, 3], 'Designation is a required field')
  .required('Designation is a required field')

const nonMandatoryEmailSchema = yup
  .string()
  .min(1, 'Email is a required field')
  .email('Enter a valid email address')
  .nullable()

const emailSchema = nonMandatoryEmailSchema.required('Email is a required field')

const passwordSchema = yup
  .string()
  .required('Password is a required field')
  .min(5, 'Password must be at least 5 characters long')

const resetPassword = yup.object().shape({
  password: passwordSchema
})

const addProfile = yup.object().shape({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: nonMandatoryEmailSchema,
  phoneNumber: nonMandatoryPhoneNumberSchema,
  phoneNumber_: phoneNumberSchema_,
  gender: yup.number().oneOf([0, 1, 2, 3]).nullable(),
  dob: yup.date().typeError('Dob must be a valid date').max(new Date(), 'Dob must be before today').nullable()
})

const generateQr = yup.object().shape({
  count: yup
    .number()
    .min(1, 'Count must be at least 1')
    .max(10000, 'Count should be less than or equal to 10000')
    .required('Count is a required field'),
  qrs: yup
    .array()
    .of(yup.string().trim().length(6, 'Invalid Qr code').required('Qr code is a required field'))
    .nullable()
    .optional()
})

const generateReportQr = yup.object().shape({
  count: yup
    .number()
    .min(1, 'Count must be at least 1')
    .max(10000, 'Count should be less than or equal to 10000')
    .required('Count is a required field'),
  qrs: yup
    .array()
    .of(
      yup.object().shape({
        qrCode: yup.string().required('Qr code is a required field'),
        status: yup.number().required('status is a required field'),
        reason: yup.string().nullable()
      })
    )
    .required()
})

const updatePassword = yup.object().shape({
  oldPassword: yup.string().trim().required('Old password is a required field'),
  newPassword: yup
    .string()
    .required('New password is a required field')
    .min(5, 'New password must be at least 5 characters long')
})

const updatePasswordWithConfirm = updatePassword
  .clone()
  .shape({
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'The passwords do not match')
      .required('Confirm Password is a required field')
  })
  .required()

const resetPasswordWithConfirm = resetPassword
  .clone()
  .shape({
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'The passwords do not match')
      .required('Confirm Password is a required field')
  })
  .required()

const login = yup.object().shape({
  email: emailSchema,
  password: yup.string().trim().required('Password is a required field')
})

const registerStep1 = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
  type: userTypeSchema
})

const updateProfileSchema = yup.object().shape({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  address: addressSchema.transform(c => (c ? c : null)),
  phoneNumber: phoneNumberSchema,
  phoneNumber_: phoneNumberSchema_,
  addressMeta: addressMetaSchema.when('type', (type, schema) => {
    const object = utils.CONST.USER.TYPES
    const isSubAdminUser = object.SUB_ADMIN === type?.[0]
    return !isSubAdminUser ? schema.nullable().optional() : yup.string().optional().nullable()
  }),
  type: userTypeSchema_,
  organizationName: yup.string().when('type', (type, schema) => {
    const object = utils.CONST.USER.TYPES
    return [object.GOVT_ORGANISATION, object.CORPORATE_EMPLOYER].includes(type?.[0])
      ? schema.trim().required('Organization name is a required field')
      : schema
  }),
  roleId: yup.string().when('address', (type, schema) => {
    const object = utils.CONST.USER.TYPES
    const isSubAdminUser = object.SUB_ADMIN === type?.[0]
    return isSubAdminUser ? schema.required() : schema.optional().nullable()
  })
})

const updateAdminProfileSchema = yup.object().shape({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema
})

const updateProfileSchemaWithType = updateProfileSchema.clone().shape({
  type: userTypeSchema,
  organizationName: yup.string().when('type', (type, schema) => {
    const object = utils.CONST.USER.TYPES
    return [object.GOVT_ORGANISATION, object.CORPORATE_EMPLOYER].includes(type?.[0])
      ? schema.trim().required('Organization name is a required field')
      : schema
  })
})

const addUser = updateProfileSchema.clone().shape({
  email: emailSchema,
  role: yup.string().optional(),
  addressMeta: addressMetaSchema.when('address', (address, schema) => {
    return address[0] ? schema : schema.optional().nullable()
  }),
  status: statusSchema
})

const createAdminUsers = addUser.clone().shape({
  type: userTypeSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phoneNumber_: phoneNumberSchema_,
  addressMeta: yup.string().nullable().optional(),
  roleId: yup.string().required()
})

const addUpdateRolePermission = yup.object().shape({
  role: yup.number().oneOf(Object.values(utils.CONST.USER.ROLES)).required('Role is a required field'),
  module: yup.string().oneOf(Object.values(utils.CONST.ROLE_PERMISSION.MODULES)).required('Module is a required field'),
  actions: yup
    .array()
    .of(yup.string().oneOf(['create', 'read', 'update', 'delete']).required())
    .required('Actions is a required field')
})

const addTest = yup.object().shape({
  _id: yup.string().optional().nullable(),
  name: yup.string().trim().required('Name is a required field'),
  price: yup.number().required('Price is a required field'),
  identifier: yup.string().required('Identifier is a required field'),
  status: yup.number().oneOf([0, 1, 2]).nullable().optional(),
  slug: yup.string().oneOf(['coc']).optional()
})

const addPackage = yup.object().shape({
  isDefault: yup.number().oneOf(Object.values(utils.CONST.APP_CONST.BOOLEAN_STATUS)).nullable().optional(),
  withChainOfCustody: yup
    .number()
    .oneOf(Object.values(utils.CONST.APP_CONST.BOOLEAN_STATUS))
    .required('With chain of custody is a required field'),
  name: yup.string().trim().required('Name is a required field'),
  price: yup.number().required('Price is a required field'),
  status: yup.number().oneOf([0, 1, 2]).required('Status is a required field'),
  description: yup.string().optional().nullable(),
  identifier: yup.string().required('Identifier is a required field')
})

const addCategory = yup.object().shape({
  name: yup.string().required('Name is a required field'),
  description: yup.string().optional(),
  image: yup.string().nullable().optional(),
  status: yup.number().oneOf([0, 1, 2]).required('Status is a required field'),
})

const decodeQR = yup.object().shape({
  qr: qrSchema
})

const registerStep2 = yup.object().shape({
  type: userTypeSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  organizationName: yup.string().when('type', (type, schema) => {
    const object = utils.CONST.USER.TYPES
    return [object.GOVT_ORGANISATION, object.CORPORATE_EMPLOYER].includes(type?.[0])
      ? schema.trim().required('Organization name is a required field')
      : schema
  }),
  designation: yup.number().when('type', (type, schema) => {
    const object = utils.CONST.USER.TYPES
    return [object.GOVT_ORGANISATION, object.CORPORATE_EMPLOYER].includes(type?.[0]) ? designationTypeSchema : schema
  }),
  address: addressSchema,
  phoneNumber: phoneNumberSchema,
  phoneNumber_: phoneNumberSchema_
})

const registerStep2WithAgree = registerStep2.clone().shape({
  agree
})

const forgotPasswordSchema = yup.object().shape({
  email: emailSchema
})

const querySchema = yup.object().shape({
  query: yup.string().optional().typeError('Query should be a string').optional()
})

const addCard = yup.object().shape({
  token: yup.string().optional(),
  name: yup.string()?.trim()?.required('Name is a required field'),
  cardNumber: yup.string().when('token', (token, schema) => {
    return !token[0]
      ? schema.typeError('Card number is invalid').required('Card number is a required field')
      : schema.optional()
  }),
  expiryDate: yup.string().when('token', (token, schema) => {
    return !token[0]
      ? schema.typeError('Expiry date is invalid').required('Expiry date is a required field')
      : schema.optional()
  }),
  cardCvv: yup.string().when('token', (token, schema) => {
    return !token[0]
      ? schema.typeError('Card cvv is invalid').required('Card cvv is a required field')
      : schema.optional()
  })
})

const addCardWithTokenRequired = addCard.clone().shape({
  token: yup.string().required('Token is a required field')
})

const payment = yup.object().shape({
  cardId: yup.string().when('addOnsIncluded', (addOnsIncluded_, schema) => {
    const addOnsIncluded = addOnsIncluded_?.[0]
    return addOnsIncluded && Array.isArray(addOnsIncluded) && addOnsIncluded.length > 0
      ? schema.required('Card id is a required field')
      : schema.optional().nullable()
  }),
  profileId: yup.string().required('Profile id is a required field'),
  addOnsIncluded: yup.array().of(yup.string().required()).nullable().optional(),
  qr: qrSchema
})

const addCustody = yup.object().shape({
  name: yup.string().trim().required('Name is a required filed'),
  description: yup.string().optional(),
  date: yup.date().optional().nullable(),
  time: yup.date().optional().nullable(),
  reportId: yup.string().required('Report id is a required field')
})

const updateReportStatus = yup.object().shape({
  status: yup
    .number()
    .oneOf([...Object.values(utils.CONST.REPORT.STATUS), -1])
    .notOneOf([utils.CONST.REPORT.STATUS.DRAFT])
    .required('Status is a required field')
})

const addRole = yup.object().shape({
  name: yup.string().trim().required('Role name is a required field'),
  roleId: yup.number().oneOf(Object.values(utils.CONST.USER.ROLES)).optional().nullable(),
  type: yup
    .number()
    .oneOf([...Object.values(utils.CONST.ROLE_PERMISSION.TYPES)])
    .required(),
  permissions: permissionsSchema,
  markDefault: yup.number().oneOf(Object.values(utils.CONST.APP_CONST.BOOLEAN_STATUS)).nullable().optional()
})

const updateReportStatuswithReason = updateReportStatus.clone().shape({
  rejectionReason: yup.string().nullable()
})

const commonSchemas = {
  addCardWithTokenRequired,
  login,
  querySchema,
  addProfile,
  addRole,
  payment,
  agree,
  resetPassword,
  registerStep1,
  registerStep2,
  paginationSchema,
  addUser,
  addTest,
  statusSchema,
  updateReportStatus,
  updateReportStatuswithReason,
  addUpdateRolePermission,
  updateProfileSchemaWithType,
  updateProfileSchema,
  forgotPasswordSchema,
  registerStep2WithAgree,
  resetPasswordWithConfirm,
  updatePasswordWithConfirm,
  updatePassword,
  decodeQR,
  addCard,
  addCustody,
  userTypeSchema,
  userTypeSchema_,
  generateQr,
  addPackage,
  generateReportQr,
  updateAdminProfileSchema,
  createAdminUsers,
  addCategory
}

export { commonSchemas }
