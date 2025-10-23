import { http } from '@/utils/http'
import { object } from '@/utils/object'

import { IPaginationArgs } from '../types'

class PackageService {
  async list(args: IPaginationArgs) {
    try {
      const response = await http({
        url: `packages?${object.objectToUrlParams(args)}`,
        method: 'GET'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async update(id: string, data: Record<any, any>) {
    try {
      const response = await http({
        url: `packages/${id}`,
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
        url: 'packages',
        data,
        method: 'POST'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
}

export { PackageService }
