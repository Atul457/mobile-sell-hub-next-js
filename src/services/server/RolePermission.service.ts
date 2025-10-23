import { Model } from 'mongoose'

import RolePermissionModel, { IRolePermission } from '@/models/rolePermission.model'

export interface IRolePermissionService {
  createRolePermission(data: Partial<IRolePermission>): Promise<IRolePermission>
  getRolePermissionById(id: string): Promise<IRolePermission | null>
  updateRolePermission(id: string, data: Partial<IRolePermission>): Promise<IRolePermission | null>
  createOrUpdateRolePermission(
    roleId: IRolePermission['roleId'],
    module: string,
    data: Partial<IRolePermission>
  ): Promise<[IRolePermission | null, boolean]>
  deleteRolePermission(id: string): Promise<IRolePermission | null>
  findPermissionsByRoleId(roleId: IRolePermission['roleId']): Promise<IRolePermission[]>
  findPermissionsByRoleIdNModule(
    roleId: IRolePermission['roleId'],
    module: IRolePermission['module']
  ): Promise<IRolePermission | null>
  deleteRolePermissionsByRoleId(roleId: IRolePermission['roleId']): Promise<{
    deletedCount?: number
  }>
}

class RolePermissionService implements IRolePermissionService {
  private rolePermissionModel: Model<IRolePermission>

  constructor(rolePermissionModel: Model<IRolePermission>) {
    this.rolePermissionModel = rolePermissionModel
  }

  async createRolePermission(data: Partial<IRolePermission>): Promise<IRolePermission> {
    const rolePermission = new this.rolePermissionModel(data)
    return rolePermission.save()
  }

  async getRolePermissionById(id: string): Promise<IRolePermission | null> {
    return this.rolePermissionModel.findById(id)
  }

  async createOrUpdateRolePermission(
    roleId: IRolePermission['roleId'],
    module: string,
    data: Partial<IRolePermission>
  ): Promise<[IRolePermission | null, boolean]> {
    const updateResult = await this.rolePermissionModel.findOneAndUpdate(
      { roleId: roleId, module },
      { $set: data },
      { new: true, upsert: true, includeResultMetadata: true, returnDocument: 'after' }
    )
    return [updateResult.value!, !updateResult.lastErrorObject?.updatedExisting]
  }

  async updateRolePermission(id: string, data: Partial<IRolePermission>): Promise<IRolePermission | null> {
    return this.rolePermissionModel.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteRolePermission(id: string): Promise<IRolePermission | null> {
    return this.rolePermissionModel.findByIdAndDelete(id)
  }

  async deleteRolePermissionsByRoleId(
    roleId: IRolePermission['roleId']
  ): ReturnType<IRolePermissionService['deleteRolePermissionsByRoleId']> {
    return this.rolePermissionModel.deleteMany({
      roleId
    })
  }

  async findPermissionsByRoleId(roleId: IRolePermission['roleId']): Promise<IRolePermission[]> {
    return this.rolePermissionModel.find({ roleId })
  }

  async findPermissionsByRoleIdNModule(
    roleId: IRolePermission['roleId'],
    module: IRolePermission['module']
  ): Promise<IRolePermission | null> {
    return this.rolePermissionModel.findOne({ roleId, module })
  }
}

export default new RolePermissionService(RolePermissionModel)
