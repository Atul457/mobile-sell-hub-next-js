import { Model } from 'mongoose';

import ShopRegisterModel, { IShopRegister } from '@/models/shop-register.model';
import { string } from '@/utils/string';

import { ErrorHandlingService } from '../ErrorHandling.service';

interface IShopRegisterService {
    registerShop(data: Partial<IShopRegister>): Promise<IShopRegister | null>;
    update(id: string, data: Partial<IShopRegister>): Promise<IShopRegister | null>;
    get(id: string): Promise<IShopRegister | null>;
}

class ShopRegisterService implements IShopRegisterService {
    private shopRegisterModel: Model<IShopRegister>;

    constructor(shopRegisterModel: Model<IShopRegister>) {
        this.shopRegisterModel = shopRegisterModel;
    }

    async isNameUnique(name: string): Promise<boolean> {
        const query: any = { storeName: name };
        const existing = await this.shopRegisterModel.findOne(query);
        return !existing;
    }

    async isSlugUnique(slug: string): Promise<boolean> {
        const query: any = { slug };
        const existing = await this.shopRegisterModel.findOne(query);
        return !existing;
    }

    async registerShop(data: Partial<IShopRegister>): Promise<IShopRegister> {
        if (!data.storeName) {
            throw ErrorHandlingService.badRequest({ message: 'Shop name is required' });
        }

        if (!(await this.isNameUnique(data.storeName))) {
            throw ErrorHandlingService.conflict({ message: 'Shop name must be unique' });
        }

        const slug = string.createSlug(data.storeName);

        if (!(await this.isSlugUnique(slug))) {
            throw ErrorHandlingService.conflict({ message: 'Shop slug must be unique' });
        }

        const shop = new this.shopRegisterModel({ ...data, slug });
        return shop.save();
    }

    async update(id: string, data: Partial<IShopRegister>): Promise<IShopRegister | null> {
        return this.shopRegisterModel.findByIdAndUpdate(id, data, { new: true });
    }

    async get(id: string): Promise<IShopRegister | null> {
        return this.shopRegisterModel.findById(id);
    }
}

export default new ShopRegisterService(ShopRegisterModel);
