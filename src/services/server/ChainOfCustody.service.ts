import { Model } from 'mongoose'

import ChainOfCustodyModel, { IChainOfCustody } from '@/models/custody.model'

interface IChainOfCustodyService {
  createChainOfCustody(data: Partial<IChainOfCustody>): Promise<IChainOfCustody>
  getAllChainOfCustodies(): Promise<IChainOfCustody[]>
  getChainOfCustodyById(id: string): Promise<IChainOfCustody | null>
  updateChainOfCustody(id: string, data: Partial<IChainOfCustody>): Promise<IChainOfCustody | null>
  deleteChainOfCustody(id: string): Promise<IChainOfCustody | null>
  findChainOfCustodyByUserId(userId: string): Promise<IChainOfCustody[] | null>
}

class ChainOfCustodyService implements IChainOfCustodyService {
  private chainOfCustodyModel: Model<IChainOfCustody>

  constructor(chainOfCustodyModel: Model<IChainOfCustody>) {
    this.chainOfCustodyModel = chainOfCustodyModel
  }

  async createChainOfCustody(data: Partial<IChainOfCustody>): Promise<IChainOfCustody> {
    const chainOfCustody = new this.chainOfCustodyModel(data)
    return chainOfCustody.save()
  }

  async getAllChainOfCustodies(): Promise<IChainOfCustody[]> {
    return this.chainOfCustodyModel.find()
  }

  async getChainOfCustodyById(id: string): Promise<IChainOfCustody | null> {
    return this.chainOfCustodyModel.findById(id)
  }

  async updateChainOfCustody(id: string, data: Partial<IChainOfCustody>): Promise<IChainOfCustody | null> {
    return this.chainOfCustodyModel.findByIdAndUpdate(id, data, { new: true, returnDocument: 'after' })
  }

  async deleteChainOfCustody(id: string): Promise<IChainOfCustody | null> {
    return this.chainOfCustodyModel.findByIdAndDelete(id)
  }

  async findChainOfCustodyByUserId(userId: string): Promise<IChainOfCustody[] | null> {
    return this.chainOfCustodyModel.find({ userId })
  }
}

export default new ChainOfCustodyService(ChainOfCustodyModel)
