import { Model } from 'mongoose'

import RolePermissionModel, { IRolePermission } from '@/models/rolePermission.model'
import { utils } from '@/utils/utils'

import { ErrorHandlingService } from '../ErrorHandling.service'
import { IActionValidator } from '../types'

class ActionValidator {
  roleId: IActionValidator['roleId']
  action: IActionValidator['action']
  module: IActionValidator['module']
  private rolePermissionModel: Model<IRolePermission>

  constructor(args: IActionValidator) {
    this.roleId = args.roleId
    this.action = args.action
    this.module = args.module
    this.module = args.module
    this.rolePermissionModel = RolePermissionModel
  }

  public async validate() {
    const permission = await this.rolePermissionModel.findOne({
      roleId: this.roleId,
      module: this.module,
      actions: this.action
    })

    if (!permission) {
      throw ErrorHandlingService.forbidden({
        message: utils.CONST.RESPONSE_MESSAGES.DONT_HAVE_PERMISSION
      })
    }
  }
}

export { ActionValidator }
