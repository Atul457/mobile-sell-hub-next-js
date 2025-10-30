import { IUser } from '@/models/user.model';

const DELETED = {
    LABEL: 'Deleted',
    VALUE: 2 as IUser['status']
};

const ACTIVE = {
    LABEL: 'Active',
    VALUE: 1 as IUser['status']
};

const INACTIVE = {
    LABEL: 'Inactive',
    VALUE: 0 as IUser['status']
};

const PENDING = {
    LABEL: 'Pending',
    VALUE: 3 as IUser['status']
};

const SHOP = {
    LABEL: 'Shop',
    VALUE: 2 as IUser['type']
};

const SHOP_ROLE = {
    LABEL: 'Shop',
    VALUE: 2 as IUser['role']
};

const ADMIN_ROLE = {
    LABEL: 'Admin',
    VALUE: 1 as IUser['role']
};

const ADMIN = {
    LABEL: 'Admin',
    VALUE: 1 as IUser['type']
};

const USER = {
    STATUS: {
        DELETED: DELETED.VALUE,
        ACTIVE: ACTIVE.VALUE,
        INACTIVE: INACTIVE.VALUE,
        PENDING: PENDING.VALUE
    },
    NUMERIC_STATUS: {
        2: DELETED.LABEL,
        1: ACTIVE.LABEL,
        0: INACTIVE.LABEL,
        3: PENDING.LABEL
    },
    OBJECT_STATUSES: {
        DELETED,
        ACTIVE,
        INACTIVE,
        PENDING
    },
    MAX_PROFILE_PICTURE_SIZE: 1,
    VALID_PROFILE_PICTURE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
    DEFAULT_PROFILE_PICTURE: '/images/icons/user-badge.svg',
    TYPES: {
        SHOP: SHOP.VALUE,
        ADMIN: ADMIN.VALUE
    },
    NUMERIC_TYPES: {
        1: ADMIN.LABEL,
        2: SHOP.LABEL
    },
    OBJECT_TYPES: {
        ADMIN,
        SHOP
    },
    ROLES: {
        ADMIN: ADMIN_ROLE.VALUE,
        SHOP: SHOP_ROLE.VALUE
    },
    NUMERIC_ROLE_TYPES: {
        1: ADMIN_ROLE.LABEL,
        2: SHOP_ROLE.LABEL
    },
    OBJECT_ROLE_TYPES: {
        ADMIN: ADMIN_ROLE,
        SHOP: SHOP_ROLE
    }
};

export { USER };
