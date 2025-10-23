import { http } from '@/utils/http'

class ConfigService {
  async get() {
    try {
      const response = await http({
        url: 'config',
        method: 'GET'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
}

export { ConfigService }
