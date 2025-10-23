import { http } from '@/utils/http'
import { object } from '@/utils/object'

import { IPaginationArgs } from '../types'

class ChainOfCustodyService {
  async list(args: IPaginationArgs) {
    try {
      const response = await http({
        url: `chain-of-custody?${object.objectToUrlParams(args)}`,
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
        url: `chainOfCustody/${id}`,
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
        url: `chainOfCustody/${id}`,
        method: 'GET'
      })
      return response.data
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async update(id: string, data: Record<string, any>) {
    try {
      const response = await http({
        url: `chain-of-custody/${id}`,
        data,
        method: 'PATCH'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async create(data: Record<string, any>) {
    try {
      const response = await http({
        url: 'chain-of-custody',
        data,
        method: 'POST'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
}

export { ChainOfCustodyService }
