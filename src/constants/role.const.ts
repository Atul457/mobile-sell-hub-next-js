import { IRole } from '@/models/role.model'

const ADMIN = {
  LABEL: 'Admin',
  VALUE: 1 as IRole['type']
}

const SHOP = {
  LABEL: 'Shop',
  VALUE: 2 as IRole['type']
}

const ROLE = {
  TYPES: {
    ADMIN: ADMIN.VALUE,
    SHOP: SHOP.VALUE
  },
  NUMERIC_TYPES: {
    1: ADMIN.LABEL,
    2: SHOP.LABEL
  },
  OBJECT_TYPESES: {
    ADMIN,
    SHOP
  }
}

export { ROLE }
