import { http } from '@/utils/http'

class ReportService {
  async register(data: Record<any, any>) {
    try {
      const response = await http({
        url: '/report/',
        data,
        method: 'POST',
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

}

export { ReportService }
