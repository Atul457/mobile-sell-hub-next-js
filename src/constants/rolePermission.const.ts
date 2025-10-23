import { IRolePermission } from '@/models/rolePermission.model'

import { ROLE } from './role.const'

const ROLE_PERMISSION = {
  MODULES: {
    USER: 'user' as IRolePermission['module'],
    TRANSACTION: 'transaction' as IRolePermission['module'],
    PACKAGE: 'package' as IRolePermission['module'],
    PROFILE: 'profile' as IRolePermission['module'],
    ROLE: 'role' as IRolePermission['module'],
    // CARD: 'card' as IRolePermission['module'],
    REPORT: 'report' as IRolePermission['module'],
    QR: 'qr' as IRolePermission['module'],
    // MAIL: 'mail' as IRolePermission['module'],
    // FILE_MANAGER: 'fileManager' as IRolePermission['module'],

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
}

export { ROLE_PERMISSION }
