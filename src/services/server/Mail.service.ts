// MailService.ts

import { Model } from 'mongoose'

import MailModel, { IMail } from '@/models/mail.model'

interface IMailService {
  createMail(data: Partial<IMail>): Promise<IMail>
  findMailByType(type: IMail['type']): Promise<IMail | null>
  updateMail(id: string, data: Partial<IMail>): Promise<IMail | null>
  deleteMail(id: string): Promise<IMail | null>
  getMailById(id: string): Promise<IMail | null>
}

class MailService implements IMailService {
  private mailModel: Model<IMail>

  constructor(mailModel: Model<IMail>) {
    this.mailModel = mailModel
  }

  async createMail(data: Partial<IMail>): Promise<IMail> {
    const mail = new this.mailModel(data)
    return mail.save()
  }

  async findMailByType(type: IMail['type']): Promise<IMail | null> {
    return this.mailModel.findOne({ type })
  }

  async updateMail(id: string, data: Partial<IMail>): Promise<IMail | null> {
    return this.mailModel.findByIdAndUpdate(id, data, { new: true, returnDocument: 'after' })
  }

  async deleteMail(id: string): Promise<IMail | null> {
    return this.mailModel.findByIdAndDelete(id)
  }

  async getMailById(id: string): Promise<IMail | null> {
    return this.mailModel.findById(id)
  }
}

export default new MailService(MailModel)
