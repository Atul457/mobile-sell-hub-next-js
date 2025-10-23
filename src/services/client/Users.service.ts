import { http } from '@/utils/http'
import { object } from '@/utils/object'

import { IPaginationArgs } from '../types'

class UsersService {
  async list(args: IPaginationArgs) {
    try {
      const response = await http({
        url: `users?${object.objectToUrlParams(args)}`,
        method: 'GET'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async delete(id: string) {
    try {
      const response = await http({
        url: `users/${id}`,
        method: 'DELETE'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async get(id: string) {
    try {
      const response = await http({
        url: `users/${id}`,
        method: 'GET'
      })
      return response.data?.user
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async updateStatus(id: string, data: Record<any, any>) {
    try {
      const response = await http({
        url: `users/${id}/status`,
        data,
        method: 'PATCH'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async updateProfile(id: string, data: Record<any, any>) {
    try {
      const response = await http({
        url: `users/${id}`,
        data,
        method: 'PATCH'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async addProfile(data: Record<any, any>) {
    try {
      const response = await http({
        url: 'users',
        data,
        method: 'POST'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
}

export { UsersService }
