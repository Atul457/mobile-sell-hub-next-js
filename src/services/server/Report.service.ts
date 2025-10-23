// ReportService.ts

import { Model } from 'mongoose'

import ReportModel, { IReport } from '@/models/report.model'

interface IReportService {
  createReport(data: Partial<IReport>): Promise<IReport>
  findReportById(reportId: string): Promise<IReport | null>
  updateReport(id: string, data: Partial<IReport>): Promise<IReport | null>
  deleteReport(id: string): Promise<IReport | null>
  getReportsByUserId(userId: string): Promise<IReport[]>
  getReportsByProfileId(profileId: string): Promise<IReport[]>
  updateReportStatus(
    reportId: string,
    status: IReport['status'],
    updates?: Partial<Omit<IReport, 'status'>>
  ): Promise<IReport | null>
}

class ReportService implements IReportService {
  private reportModel: Model<IReport>

  constructor(reportModel: Model<IReport>) {
    this.reportModel = reportModel
  }

  async createReport(data: Partial<IReport>): Promise<IReport> {
    const report = new this.reportModel(data)
    return report.save()
  }

  async findReportById(reportId: string): Promise<IReport | null> {
    return this.reportModel.findById(reportId)
  }

  async updateReport(id: string, data: Partial<IReport>): Promise<IReport | null> {
    return this.reportModel.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteReport(id: string): Promise<IReport | null> {
    return this.reportModel.findByIdAndDelete(id)
  }

  async getReportsByUserId(userId: string): Promise<IReport[]> {
    return this.reportModel.find({ userId })
  }

  async getReportsByProfileId(profileId: string): Promise<IReport[]> {
    return this.reportModel.find({ profileId })
  }

  async updateReportStatus(
    reportId: string,
    status: IReport['status'],
    updates?: Partial<Omit<IReport, 'status'>>
  ): Promise<IReport | null> {
    const report = await this.findReportById(reportId)
    if (!report) return null

    const { updationDates } = report
    let updationDates_ = [...updationDates]

    updationDates_.splice(status)

    // If the status is greater than the length of the updationDates array,
    // fill the missing indices with new dates.
    for (let i = updationDates_.length; i <= status; i++) {
      updationDates_[i] = new Date()
    }

    return this.reportModel.findByIdAndUpdate(
      report?.id,
      {
        status,
        updationDates: updationDates_,
        ...updates
      },
      { new: true, returnDocument: 'after' }
    )
  }
}

export default new ReportService(ReportModel)
