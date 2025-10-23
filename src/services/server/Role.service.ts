import { Model } from 'mongoose'

import RoleModel, { IRole } from '@/models/role.model'

export interface IRoleService {
  createRole(data: Partial<IRole>): Promise<IRole>
  getRoleById(id: string): Promise<IRole | null>
  updateRole(id: string, data: Partial<IRole>): Promise<IRole | null>
  deleteRole(id: string): Promise<IRole | null>
  findRoleByName(name: string): Promise<IRole | null>
  incrementUsersCount(roleId: string, incrementBy?: number): Promise<IRole | null>
  setDefaultRole(roleId: string, key: 'defaultUserRole' | 'defaultAdminRole'): Promise<IRole | null>
  getDefaultRole(key: 'defaultUserRole' | 'defaultAdminRole'): Promise<IRole | null>
}

class RoleService implements IRoleService {
  private roleModel: Model<IRole>

  constructor(roleModel: Model<IRole>) {
    this.roleModel = roleModel
  }

  async createRole(data: Partial<IRole>): Promise<IRole> {
    const role = new this.roleModel(data)
    return role.save()
  }

  async getRoleById(id: string): Promise<IRole | null> {
    return this.roleModel.findById(id)
  }

  async updateRole(id: string, data: Partial<IRole>): Promise<IRole | null> {
    return this.roleModel.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteRole(id: string): Promise<IRole | null> {
    return this.roleModel.findByIdAndDelete(id)
  }

  async findRoleByName(name: string): Promise<IRole | null> {
    return this.roleModel.findOne({ name })
  }

  async incrementUsersCount(roleId: string, incrementBy = 1): Promise<IRole | null> {
    return this.roleModel.findByIdAndUpdate(roleId, { $inc: { usersCount: incrementBy } }, { new: true })
  }

  async getDefaultRole(key: 'defaultUserRole' | 'defaultAdminRole'): Promise<IRole | null> {
    return this.roleModel.findOne({
      [key]: true
    })
  }

  async listRoles(): Promise<IRole[]> {
    // @ts-expect-error: Complex union type too large for TS to handle
    return this.roleModel.find({}).select('name')
  }

  async setDefaultRole(roleId: string, key: 'defaultUserRole' | 'defaultAdminRole'): Promise<IRole | null> {
    // Remove the default flag from other roles
    await this.roleModel.updateMany({ [key]: true }, { $unset: { [key]: true } })

    // Set the default flag to true for the specified role
    return this.roleModel.findByIdAndUpdate(roleId, { $set: { [key]: true } }, { new: true, returnDocument: 'after' })
  }
}

export default new RoleService(RoleModel)
