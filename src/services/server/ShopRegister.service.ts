import { Model } from 'mongoose'

import ShopRegisterModel, { IShopRegister } from '@/models/shopRegister.model'
import { string } from '@/utils/string'

import { ErrorHandlingService } from '../ErrorHandling.service'

interface IShopRegisterService {
  registerShop(data: Partial<IShopRegister>): Promise<IShopRegister>
}

class ShopRegisterService implements IShopRegisterService {
  private shopRegisterModel: Model<IShopRegister>

  constructor(shopRegisterModel: Model<IShopRegister>) {
    this.shopRegisterModel = shopRegisterModel
  }

  async isNameUnique(name: string, excludeId?: string): Promise<boolean> {
    const query: any = { name }
    if (excludeId) query._id = { $ne: excludeId }
    const existing = await this.shopRegisterModel.findOne(query)
    return !existing
  }

  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    const query: any = { slug }
    if (excludeId) query._id = { $ne: excludeId }
    const existing = await this.shopRegisterModel.findOne(query)
    return !existing
  }

  async registerShop(data: Partial<IShopRegister>): Promise<IShopRegister> {
    if (!data.storeName) {
      throw ErrorHandlingService.badRequest({ message: 'Shop name is required' })
    }

    if (!(await this.isNameUnique(data.storeName))) {
      throw ErrorHandlingService.conflict({ message: 'Shop name must be unique' })
    }

    const slug = string.createSlug(data.storeName)

    if (!(await this.isSlugUnique(slug))) {
      throw ErrorHandlingService.conflict({ message: 'Shop slug must be unique' })
    }

    const shop = new this.shopRegisterModel({ ...data, slug })
    return shop.save()
  }
}

export default new ShopRegisterService(ShopRegisterModel)
