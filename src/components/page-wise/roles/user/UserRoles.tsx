import { utils } from '@/utils/utils'

import RolesDataGrid from '../common/DataGrid'

const UserRoles = () => {
  return <RolesDataGrid type={utils.CONST.ROLE_PERMISSION.TYPES.USER} />
}

export default UserRoles
