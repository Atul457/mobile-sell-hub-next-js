import { USER } from './user.const'

const RESPONSE_MESSAGES = {
  APP_LISTENING: `App is listening on port ${process.env.APP_PORT}`,

  USER_ALREADY_EXIST: 'Email is already registered. Try another',
  ROLE_ALREADY_EXISTS: 'This role name already exists. Please try another.',
  USER_NOT_EXISTS: 'User does not exist',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not found',
  CONFLICT: 'Conflict',
  SUCCESS: 'Success',
  BAD_REQUEST: 'Bad request',
  UN_AUTHORIZED: 'Unauthorized',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  INVALID_CREDENTIALS: 'Invalid login credentials. Please check and try again',
  MISSING_AUTH_HEADER: 'Authorization header is missing or invalid',
  TOKEN_INVALID_OR_EXPIRED: 'Your token is invalid or expired',

  NOT_ALLOWED_TO_LOGIN: 'You are not allowed to login',
  NOT_ALLOWED_TO_REGISTER: 'You are not allowed to register',

  _NOT_FOUND: '[ITEM] not found',
  _SUCCESSFULLY: '[ITEM] successfully',
  _ALREADY_USED: '[ITEM] already used',
  _ADDED_SUCCESSFULLY: '[ITEM] added successfully',
  _NOT_ADDED: '[ITEM] not added',
  _REMOVED_SUCCESSFULLY: '[ITEM] removed successfully',
  _UPDATED_SUCCESSFULLY: '[ITEM] updated successfully',
  _DELETED_SUCCESSFULLY: '[ITEM] deleted successfully',
  _ALREADY_EXISTS: '[ITEM] already exists',
  _NOT_BELONGS_TO_YOU: '[ITEM] not belongs to you',

  _SKIPPED_N: 'Skipped [N] [ITEM] since [REASON]',
  _SKIPPED_N_WITHOUT_REASON: 'Skipped [N] [ITEM]',
  _SKIPPED_N_WITH_REASON: '[N] Invalid QR [NOUN] detected and skipped during the import process.',

  INVALID_QR: 'Invalid Qr code. Please check the code and try again.',
  ALREADY_USED_QR: 'This test kit has already been used.',
  DONT_HAVE_PERMISSION: 'You do not have permission to perform this action',
  CANT_CREATE_EQUAL_ROLE: 'You cannot create a user with the same role as yours',
  CANT_UPATE_EQUAL_ROLE: 'You cannot update a user with the same role as yours',

  CSV_MUST_CONTAIN: 'CSV file must contain "qrCode" column.',
  NO_REPORTS_UPDATED: 'No reports updated.',
  CSV_MUST_CONTAIN_: 'CSV file must contain "qrCode", "status" and "reason" column.',
  DRAFT_REPORT_CANT_UPDATED: 'Report with draft status can not be updated.',
  INCORRECT_OLD_PASSWORD: 'The old password you entered is incorrect',
  EMAIL_SENT: 'An email has been sent to you with a link to update password',
  ACCOUNT_DELETED:
    'It appears that your account has been deleted. You can still create a new account using the same email address.',
  ACCOUNT_INACTIVE: 'Your account has been inactive. Please contact admin for further information.',

  NOT_ADMIN: `You are not a ${USER.NUMERIC_TYPES[USER.TYPES.ADMIN]}/${USER.NUMERIC_TYPES[USER.TYPES.SUB_ADMIN]}`,
  NOT_CORPORATE_EMPLOYER: `You are not a ${USER.NUMERIC_TYPES[USER.TYPES.CORPORATE_EMPLOYER]}`,
  NOT_GOVT_ORGANISATION: `You are not a ${USER.NUMERIC_TYPES[USER.TYPES.GOVT_ORGANISATION]}`,
  NOT_INDIVIDUAL: `You are not a ${USER.NUMERIC_TYPES[USER.TYPES.INDIVIDUAL]}`,
  NOT_GOVT_THIRD_PARTY_ADMINISTRATOR: `You are not a ${USER.NUMERIC_TYPES[USER.TYPES.THIRD_PARTY_ADMINISTRATOR]}`,
  NO_RESULTS_FOUND: 'Sorry, no results found. Please check the spellings or try searching for something else.'
}

export { RESPONSE_MESSAGES }
