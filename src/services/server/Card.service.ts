import { Model } from 'mongoose'

import UserCardsModel, { IUserCardTypes } from '@/models/card.model'

interface IUserCardService {
  createCard(data: Partial<IUserCardTypes>): Promise<IUserCardTypes>
  updateCard(id: string, data: Partial<IUserCardTypes>): Promise<IUserCardTypes | null>
  deleteCard(id: string): Promise<IUserCardTypes | null>
  getCardById(id: string): Promise<IUserCardTypes | null>
  getCardByFingerprint(id: string, userId: string): Promise<IUserCardTypes | null>
}

class UserCardService implements IUserCardService {
  private userCardModel: Model<IUserCardTypes>

  constructor(userCardModel: Model<IUserCardTypes>) {
    this.userCardModel = userCardModel
  }

  async createCard(data: Partial<IUserCardTypes>): Promise<IUserCardTypes> {
    const card = new this.userCardModel(data)
    return card.save()
  }

  async updateCard(id: string, data: Partial<IUserCardTypes>): Promise<IUserCardTypes | null> {
    return this.userCardModel.findByIdAndUpdate(id, data, { new: true, returnDocument: 'after' })
  }

  async deleteCard(id: string): Promise<IUserCardTypes | null> {
    return this.userCardModel.findByIdAndDelete(id)
  }

  async getCardById(id: string): Promise<IUserCardTypes | null> {
    return this.userCardModel.findById(id)
  }

  async getCardByFingerprint(fingerprint: string, userId: string): Promise<IUserCardTypes | null> {
    return this.userCardModel.findOne({ cardFingerprint: fingerprint, userId })
  }
}

export default new UserCardService(UserCardsModel)
