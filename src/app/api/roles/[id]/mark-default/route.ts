import { NextRequest } from 'next/server'

import { IRequestArgs } from '@/app/api/types'
import { dbConfig } from '@/configs/dbConfig'
import RoleModel, { IRole } from '@/models/role.model'
import { serverSchemas } from '@/schemas/server.schemas'
import { ErrorHandlingService } from '@/services/ErrorHandling.service'
import { services } from '@/services/index.service'
import { ActionValidator } from '@/services/server/ActionValidator.service'
import { middlewares } from '@/utils/middlewares'
import { utils } from '@/utils/utils'

export async function PATCH(request: NextRequest, args: IRequestArgs<{ id: string }>) {
  return utils.errorHandler(async function () {
    await dbConfig()

    const authData = await middlewares.withUser(request)
    const av = new ActionValidator({
      roleId: authData.roleId ?? null,
      module: utils.CONST.ROLE_PERMISSION.MODULES.ROLE,
      action: utils.CONST.ROLE_PERMISSION.PERMISSIONS.UPDATE
    })

    await av.validate()

    await serverSchemas.objectIdSchema.required().validate(args.params.id)

    const rs = services.server.RoleService
    const roleId = args.params.id

    let existingRole = await RoleModel.findById(roleId).select('_id type')

    if (!existingRole) {
      throw ErrorHandlingService.notFound({
        message: utils.CONST.RESPONSE_MESSAGES._NOT_FOUND.replace('[ITEM]', 'Role')
      })
    }

    let role: IRole | null = null

    let key: Parameters<typeof rs.setDefaultRole>[1] =
      existingRole.type === utils.CONST.ROLE.TYPES.USER ? 'defaultUserRole' : 'defaultAdminRole'

    role = await rs.setDefaultRole(roleId, key)

    return Response.json(
      utils.generateRes({
        status: true,
        data: {
          role
        }
      })
    )
  })
}
