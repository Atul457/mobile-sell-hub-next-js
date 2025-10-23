import { http } from '@/utils/http'
import { object } from '@/utils/object'

import { IPaginationArgs } from '../types'

class QrService {
  async list(args: IPaginationArgs & { all?: boolean }) {
    try {
      const response = await http({
        url: `qrs?${object.objectToUrlParams(args)}`,
        method: 'GET'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async generate(data: any) {
    try {
      const response = await http({
        url: 'qrs',
        method: 'POST',
        data
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
}

export { QrService }
