import { http } from '@/utils/http'
import { object } from '@/utils/object'

import { IPaginationArgs } from '../types'

class ProfileService {
  async list(args: IPaginationArgs) {
    try {
      const response = await http({
        url: `profiles?${object.objectToUrlParams(args)}`,
        method: 'GET'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async delete() {
    try {
      const response = await http({
        url: 'profiles',
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
        url: 'profiles',
        method: 'GET'
      })
      return response.data?.user
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async update(data: Record<any, any>) {
    try {
      const response = await http({
        url: 'profiles',
        data,
        method: 'PATCH'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async create(data: Record<any, any>) {
    try {
      const response = await http({
        url: 'profiles',
        data,
        method: 'POST'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async getProfile(id: string) {
    try {
      const response = await http({
        url: `profiles/${id}`,
        method: 'GET'
      })
      return response.data?.profile
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
}

export { ProfileService }
