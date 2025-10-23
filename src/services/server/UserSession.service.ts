import { Schema } from 'mongoose'
import { Model } from 'mongoose'

import UserSessionModel, { IUserSession } from '@/models/userSession.model'

interface IUserSessionService {
  createSession(data: Partial<IUserSession>): Promise<IUserSession>
  findSessionByToken(token: string): Promise<IUserSession | null>
  findSessionByUserId(userId: string): Promise<IUserSession | null>
  findSessionByUserIdAndToken(userId: string, token: string): Promise<IUserSession | null>
  updateSessionByToken(token: string, data: Partial<IUserSession>): Promise<IUserSession | null>
  deleteSessionByToken(token: string): Promise<IUserSession | null>
  deleteSessionsByUserId(userId: string): Promise<void>
  getAllSessions(): Promise<IUserSession[]>
}

class UserSessionService implements IUserSessionService {
  private userSessionModel: Model<IUserSession>

  constructor(userSessionModel: Model<IUserSession>) {
    this.userSessionModel = userSessionModel
  }

  async createSession(data: Partial<IUserSession>): Promise<IUserSession> {
    const session = new this.userSessionModel(data)
    return session.save()
  }

  async findSessionByToken(token: string): Promise<IUserSession | null> {
    return this.userSessionModel.findOne({ token })
  }

  async findSessionByUserId(userId: string): Promise<IUserSession | null> {
    return this.userSessionModel.findOne({ userId })
  }

  async findSessionByUserIdAndToken(userId: string, token: string): Promise<IUserSession | null> {
    return this.userSessionModel.findOne({ userId, token })
  }

  async updateSessionByToken(token: string, data: Partial<IUserSession>): Promise<IUserSession | null> {
    return this.userSessionModel.findOneAndUpdate({ token }, data, { new: true })
  }

  async deleteSessionByToken(token: string): Promise<IUserSession | null> {
    return this.userSessionModel.findOneAndDelete({ token })
  }

  async deleteSessionsByUserId(userId: string | Schema.Types.ObjectId): Promise<void> {
    await this.userSessionModel.deleteMany({ userId })
  }

  async getAllSessions(): Promise<IUserSession[]> {
    return this.userSessionModel.find()
  }
}

export default new UserSessionService(UserSessionModel)
