import mongoose from 'mongoose'
import * as yup from 'yup'

import { utils } from '@/utils/utils'

import { commonSchemas } from './common.schemas'

const register = commonSchemas.registerStep1.concat(commonSchemas.registerStep2).clone().shape({})

const objectIdSchema = yup
  .string()
  .test(
    'is-object-id',
    '${path} is invalid ObjectId',
    value => value === undefined || mongoose.Types.ObjectId.isValid(value)
  )

const addPackage = commonSchemas.addPackage.clone().shape({})

const addCategory = commonSchemas.addCategory.clone().shape({})

const updateUser = commonSchemas.addUser.clone().shape({
  _id: objectIdSchema.required('User id is a required field')
})

const updateUserStatus = yup.object().shape({
  status: commonSchemas.statusSchema.required('Status is a required field')
})

const payment = commonSchemas.payment.clone().shape({
  profileId: objectIdSchema.required('Profile id is a required field'),
  cardId: objectIdSchema.when('addOnsIncluded', (addOnsIncluded_, schema) => {
    const addOnsIncluded = addOnsIncluded_?.[0]
    return addOnsIncluded && Array.isArray(addOnsIncluded) && addOnsIncluded.length > 0
      ? schema.required('Card id is a required field')
      : schema.optional().nullable()
  }),
  addOnsIncluded: yup.array().of(objectIdSchema.required()).nullable().optional()
})

const usersPaginationSchema = commonSchemas.paginationSchema.clone().shape({
  type: commonSchemas.userTypeSchema.nullable().optional(),
  userId: objectIdSchema.optional().nullable(),
  roleId: objectIdSchema.optional().nullable()
})

const qrsPaginationSchema = commonSchemas.paginationSchema.clone().shape({
  status: yup.number().optional().nullable(),
  all: yup.boolean().optional().nullable()
})

const reportsPaginationSchema = commonSchemas.paginationSchema.clone().shape({
  status: yup
    .number()
    .oneOf([...Object.values(utils.CONST.REPORT.STATUS), -1])
    .optional()
    .nullable(),
  userId: objectIdSchema.nullable().optional(),
  profileId: objectIdSchema.nullable().optional(),
})

const packagesPaginationSchema = commonSchemas.paginationSchema.clone().shape({
  status: yup
    .number()
    .oneOf([...Object.values(utils.CONST.PACKAGE.STATUS), -1])
    .optional()
    .nullable(),
})

const categoriesPaginationSchema = commonSchemas.paginationSchema.clone().shape({
  status: yup
    .number()
    .oneOf([...Object.values(utils.CONST.CATEGORY.STATUS), -1])
    .optional()
    .nullable(),
})

const rolesPaginationSchema = commonSchemas.paginationSchema.clone().shape({
  status: yup
    .number()
    .oneOf([...Object.values(utils.CONST.REPORT.STATUS), -1])
    .optional()
    .nullable(),
  type: yup
    .number()
    .oneOf([...Object.values(utils.CONST.ROLE_PERMISSION.TYPES)])
    .required()
})

const profilesPaginationSchema = commonSchemas.paginationSchema.clone().shape({
  userId: objectIdSchema.nullable().optional()
})

const transactionsPaginationSchema = commonSchemas.paginationSchema.clone().shape({
  userId: objectIdSchema.nullable().optional(),
  status: yup
    .string()
    .oneOf([...Object.values(utils.CONST.TRANSACTION.STATUS), '-1'])
    .optional()
    .nullable()
})

const updateReportStatus = commonSchemas.updateReportStatuswithReason.clone().shape({
  _id: objectIdSchema.required('Report id is a required field')
})

const updateRoleStatus = commonSchemas.addRole.clone().shape({
  _id: objectIdSchema.required('Role id is a required field')
})

const serverSchemas = {
  payment,
  updateRoleStatus,
  updateReportStatus,
  reportsPaginationSchema,
  packagesPaginationSchema,
  categoriesPaginationSchema,
  register,
  updateUserStatus,
  profilesPaginationSchema,
  transactionsPaginationSchema,
  objectIdSchema,
  usersPaginationSchema,
  qrsPaginationSchema,
  addPackage,
  addCategory,
  updateUser,
  rolesPaginationSchema
}

export { serverSchemas }
