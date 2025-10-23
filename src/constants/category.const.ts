import { ICategory } from '@/models/category.model'

const DELETED = {
  LABEL: 'Deleted',
  VALUE: 2 as ICategory['status']
}

const ACTIVE = {
  LABEL: 'Active',
  VALUE: 1 as ICategory['status']
}

const INACTIVE = {
  LABEL: 'Inactive',
  VALUE: 0 as ICategory['status']
}

const CATEGORY = {
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

export { CATEGORY }

