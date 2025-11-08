import { Model } from 'mongoose';

import ProductCategoryModel, { IProductCategory } from '@/models/product-category.model';

interface IProductCategoryService {
    createProductCategory(data: Partial<IProductCategory>): Promise<IProductCategory>;
    getProductCategoryById(id: string): Promise<IProductCategory | null>;
    updateProductCategory(id: string, data: Partial<IProductCategory>): Promise<IProductCategory | null>;
    deleteProductCategory(id: string): Promise<IProductCategory | null>;
    getBaseCategories(): Promise<IProductCategory[]>;
}

class ProductCategoryService implements IProductCategoryService {
    private productCategoryModel: Model<IProductCategory>;

    constructor(productCategoryModel: Model<IProductCategory>) {
        this.productCategoryModel = productCategoryModel;
    }

    async getProductCategoryById(id: string): Promise<IProductCategory | null> {
        return this.productCategoryModel.findById(id);
    }

    async getBaseCategories() {
        return this.productCategoryModel.find({
            shopId: { $exists: false }
        });
    }

    async createProductCategory(data: Partial<IProductCategory>): Promise<IProductCategory> {
        const productCategory = new this.productCategoryModel(data);
        return productCategory.save();
    }

    async updateProductCategory(id: string, data: Partial<IProductCategory>): Promise<IProductCategory | null> {
        return this.productCategoryModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteProductCategory(id: string): Promise<IProductCategory | null> {
        return this.productCategoryModel.findByIdAndUpdate(id, { status: 2 }, { new: true }); // Soft delete
    }
}

export default new ProductCategoryService(ProductCategoryModel);
