import { Model } from 'mongoose'

import QrModel, { IQr } from '@/models/qr.model'
import { helpers } from '@/utils/helpers'

interface IQrService {
  createQr(data: Partial<IQr>): Promise<IQr>
  getAllQrs(): Promise<IQr[]>
  getQrById(id: string): Promise<IQr | null>
  updateQr(id: string, data: Partial<IQr>): Promise<IQr | null>
  deleteQr(id: string): Promise<IQr | null>
  findQrByCode(qrCode: string): Promise<IQr | null>
  updateQrStatus(id: string, status: number): Promise<IQr | null>
}

class QrService implements IQrService {
  private qrModel: Model<IQr>

  constructor(qrModel: Model<IQr>) {
    this.qrModel = qrModel
  }

  async createQr(data: Partial<IQr>): Promise<IQr> {
    const qr = new this.qrModel(data)
    return qr.save()
  }

  async getAllQrs(): Promise<IQr[]> {
    return this.qrModel.find().populate('usedBy packageId')
  }

  async getQrById(id: string): Promise<IQr | null> {
    return this.qrModel.findById(id).populate('usedBy packageId')
  }

  async updateQr(id: string, data: Partial<IQr>): Promise<IQr | null> {
    return this.qrModel.findByIdAndUpdate(id, data, { new: true }).populate('usedBy packageId')
  }

  async deleteQr(id: string): Promise<IQr | null> {
    return this.qrModel.findByIdAndDelete(id)
  }

  async findQrByCode(qrCode: string): Promise<IQr | null> {
    return this.qrModel.findOne({ qrCode })
  }

  async updateQrStatus(id: string, status: number): Promise<IQr | null> {
    return this.qrModel.findByIdAndUpdate(id, { status }, { new: true }).populate('usedBy packageId')
  }

  async generateQr(qrCode_?: string): Promise<[string, boolean | undefined]> {
    let unique = false
    let isUnique = Boolean(qrCode_)
    let qrCode = qrCode_ ?? helpers.profiles.generatePid(6, true)

    if (qrCode) {
      const existingQr = await this.qrModel.findOne({ qrCode })
      if (existingQr) {
        isUnique = false
      }
    } else {
      while (!unique) {
        const existingQr = await this.qrModel.findOne({ qrCode })
        if (!existingQr) {
          unique = true
        } else {
          qrCode = helpers.profiles.generatePid(6, true)
        }
      }
    }

    return [qrCode, qrCode_ ? isUnique : undefined]
  }
}

export default new QrService(QrModel)
