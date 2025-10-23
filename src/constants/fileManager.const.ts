import { ObjectCannedACL } from '@aws-sdk/client-s3'

import { IFile } from '@/models/file.model'

const DELETED = {
  LABEL: 'DELETED',
  VALUE: 0 as IFile['status']
}

export const FILE_MANAGER = {
  STATUS: {
    DELETED: DELETED.VALUE
  },

  NUMERIC_STATUS: {
    0: DELETED.LABEL
  },
  OBJECT_STATUSES: {
    DELETED
  },
  FOLDERS: {
    users: 'users',
    'profile-pictures': 'profile-pictures',
    'report-videos': 'report-videos',
    reports: 'reports',
    'processed-reports': 'reports/processed',
    'unprocessed-reports': 'reports/unprocessed'
  },
  FOLDER_ACCESS: {
    'profile-pictures': ObjectCannedACL.public_read,
    users: ObjectCannedACL.public_read,
    'report-videos': ObjectCannedACL.private,
    reports: ObjectCannedACL.private,
    'processed-reports': ObjectCannedACL.private,
    'unprocessed-reports': ObjectCannedACL.private
  }
}
