import { Model } from 'mongoose';

import ProductModel, { IProduct } from '@/models/product.model';

interface IProductService {
    createProduct(data: Partial<IProduct>): Promise<IProduct>;
    getProductById(id: string): Promise<IProduct | null>;
    updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct | null>;
    deleteProduct(id: string): Promise<IProduct | null>;
}

class ProductService implements IProductService {
    private productModel: Model<IProduct>;

    constructor(productModel: Model<IProduct>) {
        this.productModel = productModel;
    }

    async createProduct(data: Partial<IProduct>): Promise<IProduct> {
        const product = new this.productModel(data);
        return product.save();
    }

    async getProductById(id: string): Promise<IProduct | null> {
        return this.productModel.findById(id);
    }

    async updateProduct(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
        return this.productModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteProduct(id: string): Promise<IProduct | null> {
        return this.productModel.findByIdAndUpdate(id, { status: 2 }, { new: true });
    }
}

export default new ProductService(ProductModel);
