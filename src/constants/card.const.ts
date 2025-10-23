import { IUserCardTypes } from '@/models/card.model'
const DELETED = {
  LABEL: 'DELETED',
  VALUE: 0 as IUserCardTypes['status']
}
const CARD = {
  STATUS: {
    DELETED: DELETED.VALUE
  },

  NUMERIC_STATUS: {
    0: DELETED.LABEL
  },
  OBJECT_STATUSES: {
    DELETED
  },

  'American Express': '/images/icons/american-express.svg',
  MasterCard: '/images/icons/master-card.svg',
  UnionPay: '/images/icons/unionpay.svg',
  Visa: '/images/icons/visa.svg',
  Discover: '/images/icons/discover.svg',
  JCB: '/images/icons/jcb.svg',
  'Diners Club': '/images/icons/diners-club.svg',
  Unknown: '/images/icons/unknown-card.svg'
}

export { CARD }
