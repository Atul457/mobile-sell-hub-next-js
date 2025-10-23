import { http } from '@/utils/http'
import { object } from '@/utils/object'

import { IPaginationArgs } from '../types'

class CardService {
  async list(args: IPaginationArgs) {
    try {
      const response = await http({
        url: `stripe/cards?${object.objectToUrlParams(args)}`,
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
        url: 'stripe/cards',
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
        url: 'stripe/cards',
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
        url: 'stripe/cards',
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
        url: 'stripe/cards',
        data,
        method: 'POST'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
}

export { CardService }
