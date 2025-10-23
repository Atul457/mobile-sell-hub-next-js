import { bcrypt } from './bcrypt'
import { clipboard } from './clipboard'
import { date } from './date'
import { debounce } from './debounce'
import { dom } from './dom'
import { error } from './error'
import { errorHandler } from './errorHandler'
import { file } from './file'
import { formData } from './formData'
import { formDataToJson } from './formDataToJson'
import { generateRes } from './generateRes'
import { getInitials } from './getInitials'
import { getParsedJson } from './getParsedJson'
import { getReqBody } from './getReqBody'
import { login, logout } from './handleAuth'
import { helpers } from './helpers'
import { isJson } from './isJson'
import { json } from './json'
import { jwt } from './jwt'
import { logger } from './logger'
import { loops } from './loops'
import { number } from './number'
import { object } from './object'
import { searchParamsToJson } from './searchParamsToJson'
import { string } from './string'
import { toast } from './toast'
import { CONST } from '../constants/index'

export const utils = {
  clipboard,
  toast,
  logger,
  getReqBody,
  loops,
  formData,
  object,
  dom,
  json,
  helpers,
  jwt,
  file,
  date,
  number,
  debounce,
  getParsedJson,
  error,
  CONST,
  bcrypt,
  isJson,
  errorHandler,
  formDataToJson,
  generateRes,
  getInitials,
  searchParamsToJson,
  string,
  login,
  logout
}
