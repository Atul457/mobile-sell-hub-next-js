import { IProductCategory } from '@/models/product-category.model';

const DELETED = {
    LABEL: 'Deleted',
    VALUE: 2 as IProductCategory['status']
};

const ACTIVE = {
    LABEL: 'Active',
    VALUE: 1 as IProductCategory['status']
};

const INACTIVE = {
    LABEL: 'Inactive',
    VALUE: 0 as IProductCategory['status']
};

const PRODUCT_CATEGORY = {
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
};

export { PRODUCT_CATEGORY };
