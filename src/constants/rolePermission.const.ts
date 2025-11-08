import { IRolePermission } from '@/models/role-permission.model';

import { ROLE } from './role.const';

const ROLE_PERMISSION = {
    MODULES: {
        USER: 'user' as IRolePermission['module'],
        CATEGORY: 'category' as IRolePermission['module'],
        PRODUCT: 'product' as IRolePermission['module'],
        ROLE: 'role' as IRolePermission['module'],
        TAGS: 'tags' as IRolePermission['module'],
        PRODUCT_CATEGORY: 'product-category' as IRolePermission['module']
    },
    TYPES: ROLE.TYPES,
    NUMERIC_TYPES: ROLE.NUMERIC_TYPES,
    OBJECT_TYPESES: ROLE.OBJECT_TYPESES,
    PERMISSIONS: {
        CREATE: 'create' as IRolePermission['actions'][0],
        READ: 'read' as IRolePermission['actions'][0],
        UPDATE: 'update' as IRolePermission['actions'][0],
        DELETE: 'delete' as IRolePermission['actions'][0]
    }
};

export { ROLE_PERMISSION };
