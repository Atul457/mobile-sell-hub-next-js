import { Model } from 'mongoose'

import ProfileModel, { IProfile } from '@/models/profile.model'
import { helpers } from '@/utils/helpers'

interface IProfileService {
  createProfile(data: Partial<IProfile>): Promise<IProfile>
  getAllProfiles(): Promise<IProfile[]>
  getProfileById(id: string): Promise<IProfile | null>
  updateProfile(id: string, data: Partial<IProfile>): Promise<IProfile | null>
  deleteProfile(id: string): Promise<IProfile | null>
  findProfileByEmail(email: string): Promise<IProfile | null>
  findProfileByUserId(userId: string): Promise<IProfile | null>
  generatePid(): Promise<string>
}

class UserProfileService implements IProfileService {
  private profileModel: Model<IProfile>

  constructor(profileModel: Model<IProfile>) {
    this.profileModel = profileModel
  }

  async createProfile(data: Partial<IProfile>): Promise<IProfile> {
    const profile = new this.profileModel(data)
    return profile.save()
  }

  async getAllProfiles(): Promise<IProfile[]> {
    return this.profileModel.find()
  }

  async getProfileById(id: string): Promise<IProfile | null> {
    return this.profileModel.findById(id)
  }

  async updateProfile(id: string, data: Partial<IProfile>): Promise<IProfile | null> {
    return this.profileModel.findByIdAndUpdate(id, data, { new: true })
  }

  async deleteProfile(id: string): Promise<IProfile | null> {
    return this.profileModel.findByIdAndDelete(id)
  }

  async findProfileByEmail(email: string): Promise<IProfile | null> {
    return this.profileModel.findOne({ email: new RegExp(email, 'gi') })
  }

  async findProfileByUserId(userId: string): Promise<IProfile | null> {
    return this.profileModel.findOne({ userId })
  }

  async generatePid(): Promise<string> {
    let unique = false
    let pid = helpers.profiles.generatePid(12)
    while (!unique) {
      pid = helpers.profiles.generatePid(12)
      const existingUser = await this.profileModel.findOne({ pid })
      if (!existingUser) {
        unique = true
      }
    }
    return pid
  }
}

export default new UserProfileService(ProfileModel)
