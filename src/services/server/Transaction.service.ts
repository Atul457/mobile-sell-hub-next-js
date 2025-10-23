import { Model } from 'mongoose'

import TransactionModel, { ITransaction } from '@/models/transaction.model'

interface ITransactionService {
  createTransaction(data: Partial<ITransaction>): Promise<ITransaction>
  findTransactionById(transactionId: string): Promise<ITransaction | null>
  updateTransaction(id: string, data: Partial<ITransaction>): Promise<ITransaction | null>
  deleteTransaction(id: string): Promise<ITransaction | null>
  getTransactionsByUserId(userId: string): Promise<ITransaction[]>
}

class TransactionService implements ITransactionService {
  private transactionModel: Model<ITransaction>

  constructor(transactionModel: Model<ITransaction>) {
    this.transactionModel = transactionModel
  }

  async createTransaction(data: Partial<ITransaction>): Promise<ITransaction> {
    const transaction = new this.transactionModel(data)
    return transaction.save()
  }

  async findTransactionById(transactionId: string): Promise<ITransaction | null> {
    return this.transactionModel.findOne({ transactionId })
  }

  async updateTransaction(id: string, data: Partial<ITransaction>): Promise<ITransaction | null> {
    return this.transactionModel.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteTransaction(id: string): Promise<ITransaction | null> {
    return this.transactionModel.findByIdAndDelete(id)
  }

  async getTransactionsByUserId(userId: string): Promise<ITransaction[]> {
    return this.transactionModel.find({ userId })
  }
}

export default new TransactionService(TransactionModel)
