import { mailTemplates } from '@/mails/templates/index.template'
import { IMail } from '@/models/mail.model'

type IMapping = Record<IMail['type'], keyof typeof mailTemplates>

type IMail_ = {
  STATUS: {
    SENT: 0 | 1 | 2 | 3
    ERROR: 0 | 1 | 2 | 3
    PENDING: 0 | 1 | 2 | 3
    DELETED: 0 | 1 | 2 | 3
  }
  NUMERIC_STATUS: {
    1: string
    2: string
    3: string
    0: string
  }
  OBJECT_STATUSES: {
    SENT: {
      LABEL: string
      VALUE: IMail['status']
    }
    ERROR: {
      LABEL: string
      VALUE: IMail['status']
    }
    PENDING: {
      LABEL: string
      VALUE: IMail['status']
    }
    DELETED: {
      LABEL: string
      VALUE: IMail['status']
    }
  }
  SUBJECTS: {
    FORGOT_PASSWORD: 'Password Reset Request'
    INVITATION: 'Invitation'
    SAMPLE_RECIEVED: 'Your Sample Has Been Received | MyQuikSal'
    SAMPLE_REJECTED: 'Your Sample Has Been Rejected | MyQuikSal'
    REPORT_PROCESSED: 'Your Report is Ready for Download | MyQuikSal'
  }
  MAPPING: IMapping
}

const SENT = {
  LABEL: 'Sent',
  VALUE: 1 as IMail['status']
}

const PENDING = {
  LABEL: 'Pending',
  VALUE: 0 as IMail['status']
}

const ERROR = {
  LABEL: 'Error',
  VALUE: 2 as IMail['status']
}

const DELETED = {
  LABEL: 'Deleted',
  VALUE: 3 as IMail['status']
}

const MAIL: IMail_ = {
  STATUS: {
    SENT: SENT.VALUE,
    ERROR: ERROR.VALUE,
    PENDING: PENDING.VALUE,
    DELETED: DELETED.VALUE
  },
  NUMERIC_STATUS: {
    1: SENT.LABEL,
    2: ERROR.LABEL,
    3: DELETED.LABEL,
    0: PENDING.LABEL
  },
  OBJECT_STATUSES: {
    SENT,
    ERROR,
    PENDING,
    DELETED
  },
  SUBJECTS: {
    FORGOT_PASSWORD: 'Password Reset Request',
    INVITATION: 'Invitation',
    SAMPLE_RECIEVED: 'Your Sample Has Been Received | MyQuikSal',
    SAMPLE_REJECTED: 'Your Sample Has Been Rejected | MyQuikSal',
    REPORT_PROCESSED: 'Your Report is Ready for Download | MyQuikSal'
  },
  MAPPING: {
    'report-rejection': 'reportRejected',
    'report-complete': 'reportProcessed',
    'report-receive': 'reportReceived'
  }
} as const // <- Added `as const` for stricter typing

export { MAIL }
