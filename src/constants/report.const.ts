import { IReport } from '@/models/report.model'

const DRAFT = {
  LABEL: 'Draft',
  VALUE: 0 as IReport['status']
}

const SUBMITTED = {
  LABEL: 'Received',
  VALUE: 2 as IReport['status'],
  DESCRIPTION: 'Your test has been received by the lab and is currently being processed.'
}

const CHECKED = {
  LABEL: 'Completed',
  VALUE: 3 as IReport['status'],
  DESCRIPTION: 'Your test has been processed by the lab and your results have been uploaded for your review.  '
}

const REJECTED = {
  LABEL: 'Rejected',
  VALUE: 4 as IReport['status'],
  DESCRIPTION:
    'Your sample has been rejected by the lab due to spillage during transit.  Please resubmit a new test sample. '
}

const PENDING = {
  LABEL: 'Submitted',
  VALUE: 1 as IReport['status'],
  DESCRIPTION:
    ' Your test has been submitted correctly and you will be notified once the sample has been received by the lab.'
}
const DELETED = {
  LABEL: 'DELETED',
  VALUE: 5 as IReport['status']
}

const REPORT = {
  STATUS: {
    DRAFT: DRAFT.VALUE,
    SUBMITTED: SUBMITTED.VALUE,
    PENDING: PENDING.VALUE,
    CHECKED: CHECKED.VALUE,
    REJECTED: REJECTED.VALUE,
    DELETED: DELETED.VALUE
  },
  NUMERIC_STATUS: {
    0: DRAFT.LABEL,
    2: SUBMITTED.LABEL,
    1: PENDING.LABEL,
    3: CHECKED.LABEL,
    4: REJECTED.LABEL,
    5: DELETED.LABEL
  },
  OBJECT_STATUSES: {
    DRAFT,
    SUBMITTED,
    PENDING,
    CHECKED,
    REJECTED,
    DELETED
  },
  VALID_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mpeg'],
  VALID_HL7_TYPES: ['text/plain', 'application/octet-stream'],
  HL7: {
    GENDERS_OBJECT: {
      M: 'Male',
      F: 'Female',
      O: 'Other',
      U: 'Unknown',
      A: 'Ambiguous',
      N: 'Not Applicable'
    }
  }
}

export { REPORT }
