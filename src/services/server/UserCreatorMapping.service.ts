import { Model } from 'mongoose'

import UserCreatorMappingModel, { IUserCreatorMapping } from '@/models/userCreatorMapping.model'

interface IUserCreatorMappingService {
  createMapping(data: Partial<IUserCreatorMapping>): Promise<IUserCreatorMapping>
  findMappingByUserId(userId: string): Promise<IUserCreatorMapping | null>
  updateMappingById(id: string, data: Partial<IUserCreatorMapping>): Promise<IUserCreatorMapping | null>
  deleteMappingById(id: string): Promise<IUserCreatorMapping | null>
  getAllMappings(): Promise<IUserCreatorMapping[]>
  findMappingById(id: string): Promise<IUserCreatorMapping | null>
}

class UserCreatorMappingService implements IUserCreatorMappingService {
  private userCreatorMappingModel: Model<IUserCreatorMapping>

  constructor(userCreatorMappingModel: Model<IUserCreatorMapping>) {
    this.userCreatorMappingModel = userCreatorMappingModel
  }

  async createMapping(data: Partial<IUserCreatorMapping>): Promise<IUserCreatorMapping> {
    const mapping = new this.userCreatorMappingModel(data)
    return mapping.save()
  }

  async findMappingByUserId(userId: string): Promise<IUserCreatorMapping | null> {
    return this.userCreatorMappingModel.findOne({ userId })
  }

  async updateMappingById(id: string, data: Partial<IUserCreatorMapping>): Promise<IUserCreatorMapping | null> {
    return this.userCreatorMappingModel.findByIdAndUpdate(id, data, { new: true })
  }

  async findMappingById(id: string): Promise<IUserCreatorMapping | null> {
    return this.userCreatorMappingModel.findById(id)
  }

  async deleteMappingById(id: string): Promise<IUserCreatorMapping | null> {
    return this.userCreatorMappingModel.findByIdAndDelete(id)
  }

  async getAllMappings(): Promise<IUserCreatorMapping[]> {
    return this.userCreatorMappingModel.find()
  }
}

export default new UserCreatorMappingService(UserCreatorMappingModel)
