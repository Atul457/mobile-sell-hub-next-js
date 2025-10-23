import { IPackage } from '@/models/package.model'

const DELETED = {
  LABEL: 'Deleted',
  VALUE: 2 as IPackage['status']
}

const ACTIVE = {
  LABEL: 'Active',
  VALUE: 1 as IPackage['status']
}

const INACTIVE = {
  LABEL: 'Inactive',
  VALUE: 0 as IPackage['status']
}

const PACKAGE = {
  STATUS: {
    DELETED: DELETED.VALUE,
    ACTIVE: ACTIVE.VALUE,
    INACTIVE: INACTIVE.VALUE
  },
  NUMERIC_STATUS: {
    2: DELETED.LABEL,
    1: ACTIVE.LABEL,
    0: INACTIVE.LABEL
  },
  OBJECT_STATUSES: {
    DELETED,
    ACTIVE,
    INACTIVE
  }
}

export { PACKAGE }
