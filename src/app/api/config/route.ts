import { dbConfig } from '@/configs/dbConfig'
import { IRolePopulated } from '@/models/role.model'
import { services } from '@/services/index.service'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

export async function GET(request: Request) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request, {
      select: ['roleId']
    })

    let permissions: Partial<IRolePopulated['cpermissions']> = {}

    let roles = await services.server.RoleService.listRoles()

    if (authData && authData.roleId) {
      const rolePermissions = await services.server.RolePermissionService.findPermissionsByRoleId(authData.roleId)
      permissions = utils.helpers.role.rolePermissionsArrayToObject(rolePermissions)
    }

    return Response.json(
      utils.generateRes({
        status: true,
        data: {
          permissions,
          roles
        }
      })
    )
  })
}
