import { IProfile } from '@/models/profile.model'

const DELETED = {
  LABEL: 'DELETED',
  VALUE: 0 as IProfile['status']
}

const PROFILE = {
  STATUS: {
    DELETED: DELETED.VALUE
  },
  NUMERIC_STATUS: {
    0: DELETED.LABEL
  },
  OBJECT_STATUSES: {
    DELETED
  }
}

export { PROFILE }
