import { Model } from 'mongoose';

import CategoryModel, { ICategory } from '@/models/category.model';

interface ICategoryService {
    createCategory(data: Partial<ICategory>): Promise<ICategory>;
    getCategoryById(id: string): Promise<ICategory | null>;
    updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null>;
    deleteCategory(id: string): Promise<ICategory | null>;
    getBaseCategories(): Promise<ICategory[]>;
}

class CategoryService implements ICategoryService {
    private categoryModel: Model<ICategory>;

    constructor(categoryModel: Model<ICategory>) {
        this.categoryModel = categoryModel;
    }

    async getCategoryById(id: string): Promise<ICategory | null> {
        return this.categoryModel.findById(id);
    }

    async getBaseCategories() {
        return this.categoryModel.find({
            shopId: { $exists: false }
        });
    }

    async createCategory(data: Partial<ICategory>): Promise<ICategory> {
        const category = new this.categoryModel(data);
        return category.save();
    }

    async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
        return this.categoryModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteCategory(id: string): Promise<ICategory | null> {
        return this.categoryModel.findByIdAndUpdate(id, { status: 2 }, { new: true }); // Soft delete
    }
}

export default new CategoryService(CategoryModel);
