import { Model } from 'mongoose'

import PackageModel, { IPackage } from '@/models/package.model'
import { utils } from '@/utils/utils'

interface IPackageService {
  createPackage(data: Partial<IPackage>): Promise<IPackage>
  updatePackage(id: string, data: Partial<IPackage>): Promise<IPackage | null>
  deletePackage(id: string): Promise<IPackage | null>
  getPackageById(id: string, shouldPopulate?: boolean): Promise<IPackage | null>
}

class PackageService implements IPackageService {
  private packageModel: Model<IPackage>

  constructor(packageModel: Model<IPackage>) {
    this.packageModel = packageModel
  }

  async getPackageByIdentifier(identifier: string): Promise<IPackage | null> {
    return this.packageModel.findOne({ identifier })
  }

  async createPackage(data: Partial<IPackage>): Promise<IPackage> {
    const pkg = new this.packageModel(data)
    return pkg.save()
  }

  async updatePackage(id: string, data: Partial<IPackage>): Promise<IPackage | null> {
    return this.packageModel.findByIdAndUpdate(id, data, { new: true, returnDocument: 'after' })
  }

  async deletePackage(id: string): Promise<IPackage | null> {
    return this.packageModel.findByIdAndUpdate(
      id,
      {
        status: utils.CONST.PACKAGE.STATUS.DELETED
      },
      {
        returnDocument: 'after'
      }
    )
  }

  async getPackageById(id: string): Promise<IPackage | null> {
    const query = this.packageModel.findById(id)
    return query.exec()
  }

  async makeDefault(id: string): Promise<IPackage | null> {
    this.packageModel.updateMany({}, { isDefault: false })
    return this.packageModel.findByIdAndUpdate(
      id,
      {
        isDefault: true
      },
      { new: true, returnDocument: 'after' }
    )
  }
}

export default new PackageService(PackageModel)
