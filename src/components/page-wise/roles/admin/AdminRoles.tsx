import { utils } from '@/utils/utils'

import RolesDataGrid from '../common/DataGrid'

const AdminRoles = () => {
  return <RolesDataGrid type={utils.CONST.ROLE_PERMISSION.TYPES.ADMIN} />
}

export default AdminRoles
