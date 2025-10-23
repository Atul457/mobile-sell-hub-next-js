import { http } from '@/utils/http'
import { object } from '@/utils/object'

import { IPaginationArgs } from '../types'

class ReportService {
  async list(args: IPaginationArgs) {
    try {
      const response = await http({
        url: `reports?${object.objectToUrlParams(args)}`,
        method: 'GET'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async listChainOfCustody(args: IPaginationArgs, reportId: string) {
    try {
      const response = await http({
        url: `reports/${reportId}/chain-of-custody?${object.objectToUrlParams(args)}`,
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
        url: `reports/${id}`,
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
        url: `reports/${id}`,
        method: 'GET'
      })
      return response.data?.report
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async uploadVideo(id: string, file: File) {
    try {
      let formData = new FormData()
      formData.append('file', file)
      const response = await http({
        url: `reports/${id}/video`,
        data: formData,
        formData: true,
        method: 'PUT'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async update(id: string, data: Record<any, any>) {
    try {
      const response = await http({
        url: `reports/${id}`,
        data,
        method: 'PATCH'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async submit(id: string) {
    try {
      const response = await http({
        url: `reports/${id}/submit`,
        method: 'POST'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async create(data: Record<any, any>) {
    try {
      const response = await http({
        url: 'reports',
        data,
        method: 'POST'
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
  async generateReportsQr(data: any) {
    try {
      const response = await http({
        url: 'reports/bulk',
        method: 'PATCH',
        data
      })
      return response
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }

  async getVideoUrl(id: string) {
    try {
      const response = await http({
        url: `reports/${id}/video`,
        method: 'GET'
      })
      return response?.data?.url
    } catch (error: any) {
      throw new Error(error?.message)
    }
  }
}

export { ReportService }
