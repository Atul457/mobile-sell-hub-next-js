import { http } from '@/utils/http'
import { object } from '@/utils/object'

import { IPaginationArgs } from '../types'

class RoleService {
  async delete() {
    try {
      const response = await http({
        url: 'roles',
        method: 'DELETE'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async get() {
    try {
      const response = await http({
        url: 'roles',
        method: 'GET'
      })
      return response.data?.role
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async update(id: string, data: Record<any, any>) {
    try {
      const response = await http({
        url: `roles/${id}`,
        data,
        method: 'PATCH'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async list(args: IPaginationArgs) {
    try {
      const response = await http({
        url: `roles?${object.objectToUrlParams(args)}`,
        method: 'GET'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async create(data: Record<any, any>) {
    try {
      const response = await http({
        url: 'roles',
        data,
        method: 'POST'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
}

export { RoleService }
