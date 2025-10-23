import { http } from '@/utils/http'
import { object } from '@/utils/object'

import { IPaginationArgs } from '../types'

class UserCreatorMappingService {
  async get(args: IPaginationArgs) {
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

  async create(data: any) {
    try {
      const response = await http({
        url: 'users',
        method: 'POST',
        data
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async update(id: string, data: any) {
    try {
      const response = await http({
        url: `users/${id}`,
        method: 'PATCH',
        data
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
}

export { UserCreatorMappingService }
