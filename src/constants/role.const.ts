import { IRole } from '@/models/role.model'

const ADMIN = {
  LABEL: 'Admin',
  VALUE: 1 as IRole['type']
}

const USER = {
  LABEL: 'User',
  VALUE: 0 as IRole['type']
}

const ROLE = {
  TYPES: {
    ADMIN: ADMIN.VALUE,
    USER: USER.VALUE
  },
  NUMERIC_TYPES: {
    1: ADMIN.LABEL,
    0: USER.LABEL
  },
  OBJECT_TYPESES: {
    ADMIN,
    USER
  }
}

export { ROLE }
