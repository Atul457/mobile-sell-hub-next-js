import { IQr } from "@/models/qr.model"

const DELETED = {
    LABEL: 'Deleted',
    VALUE: 2 as IQr['status']
}

const ACTIVE = {
    LABEL: 'Unused',
    VALUE: 1 as IQr['status']
}

const INACTIVE = {
    LABEL: 'Inactive',
    VALUE: 0 as IQr['status']
}

const USED = {
    LABEL: 'Used',
    VALUE: 3 as IQr['status']
}

const QR = {
    MAX_FILE_SIZE: 1,
    VALID_FILE_TYPES: ['text/csv'],
    STATUS: {
        DELETED: DELETED.VALUE,
        ACTIVE: ACTIVE.VALUE,
        INACTIVE: INACTIVE.VALUE,
        USED: USED.VALUE
    },
    NUMERIC_STATUS: {
        3: USED.LABEL,
        1: ACTIVE.LABEL,
        0: INACTIVE.LABEL,
        2: DELETED.LABEL
    },
    OBJECT_STATUSES: {
        DELETED,
        ACTIVE,
        INACTIVE,
        USED
    },
}

export { QR }
