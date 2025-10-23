import { ITransaction } from '@/models/transaction.model'

const CANCEL = {
  LABEL: 'Cancelled',
  VALUE: 'canceled' as ITransaction['status']
}

const PROCESSING = {
  LABEL: 'Processing',
  VALUE: 'processing' as ITransaction['status']
}

const REQUIRES_ACTION = {
  LABEL: 'Requires Action',
  VALUE: 'requires_action' as ITransaction['status']
}

const REQUIRES_CAPTURE = {
  LABEL: 'Requires Capture',
  VALUE: 'requires_capture' as ITransaction['status']
}

const REQUIRES_CONFIRMATION = {
  LABEL: 'Requires Confirmation',
  VALUE: 'requires_confirmation' as ITransaction['status']
}

const REQUIRES_PAYMENT_METHOD = {
  LABEL: 'Requires Payment Method',
  VALUE: 'requires_payment_method' as ITransaction['status']
}

const SUCCEEDED = {
  LABEL: 'Succeeded',
  VALUE: 'succeeded' as ITransaction['status']
}

const TRANSACTION = {
  STATUS: {
    CANCEL: CANCEL.VALUE,
    PROCESSING: PROCESSING.VALUE,
    REQUIRES_ACTION: REQUIRES_ACTION.VALUE,
    REQUIRES_CAPTURE: REQUIRES_CAPTURE.VALUE,
    REQUIRES_CONFIRMATION: REQUIRES_CONFIRMATION.VALUE,
    REQUIRES_PAYMENT_METHOD: REQUIRES_PAYMENT_METHOD.VALUE,
    SUCCEEDED: SUCCEEDED.VALUE
  },
  NUMERIC_STATUS: {
    canceled: CANCEL.LABEL,
    processing: PROCESSING.LABEL,
    requires_action: REQUIRES_ACTION.LABEL,
    requires_capture: REQUIRES_CAPTURE.LABEL,
    requires_confirmation: REQUIRES_CONFIRMATION.LABEL,
    requires_payment_method: REQUIRES_PAYMENT_METHOD.LABEL,
    succeeded: SUCCEEDED.LABEL
  },
  OBJECT_STATUSES: {
    CANCEL,
    PROCESSING,
    REQUIRES_ACTION,
    REQUIRES_CAPTURE,
    REQUIRES_CONFIRMATION,
    REQUIRES_PAYMENT_METHOD,
    SUCCEEDED
  }
}

export { TRANSACTION }
