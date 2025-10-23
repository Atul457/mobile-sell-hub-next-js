import { Model } from 'mongoose'

import CategoryModel, { ICategory } from '@/models/category.model'
import { string } from '@/utils/string'

import { ErrorHandlingService } from '../ErrorHandling.service'

interface ICategoryService {
  createCategory(data: Partial<ICategory>): Promise<ICategory>
  getCategoryById(id: string): Promise<ICategory | null>
  updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null>
  deleteCategory(id: string): Promise<ICategory | null>
  findCategoryBySlug(slug: string): Promise<ICategory | null>
}

class CategoryService implements ICategoryService {
  private categoryModel: Model<ICategory>

  constructor(categoryModel: Model<ICategory>) {
    this.categoryModel = categoryModel
  }

  // Check if name exists excluding optional id for updates
  async isNameUnique(name: string, excludeId?: string): Promise<boolean> {
    const query: any = { name }
    if (excludeId) query._id = { $ne: excludeId }
    const existing = await this.categoryModel.findOne(query)
    return !existing
  }

  // Check if slug exists excluding optional id for updates
  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    const query: any = { slug }
    if (excludeId) query._id = { $ne: excludeId }
    const existing = await this.categoryModel.findOne(query)
    return !existing
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    return this.categoryModel.findById(id)
  }

  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    // Validate name and slug uniqueness
    if (!(await this.isNameUnique(data.name!))) {
      throw ErrorHandlingService.conflict({ message: 'Category name must be unique' })
    }
    const slug = string.createSlug(data.name!)
    if (!(await this.isSlugUnique(slug))) {
      throw ErrorHandlingService.conflict({ message: 'Category slug must be unique' })
    }
    const category = new this.categoryModel({ ...data, slug })
    return category.save()
  }

  async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    let slug: string | null = null

    // Validate name and slug uniqueness excluding this id
    if (data.name) {
      if (!(await this.isNameUnique(data.name, id))) {
        throw ErrorHandlingService.conflict({ message: 'Category name must be unique' })
      }
      slug = string.createSlug(data.name!)
      if (!(await this.isSlugUnique(slug, id))) {
        throw ErrorHandlingService.conflict({ message: 'Category slug must be unique' })
      }
    }

    return this.categoryModel.findByIdAndUpdate(id, { ...data, ...(slug && { slug }) }, { new: true })
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    return this.categoryModel.findByIdAndUpdate(id, { status: 2 }, { new: true }) // Soft delete
  }

  async findCategoryBySlug(slug: string): Promise<ICategory | null> {
    return this.categoryModel.findOne({ slug, status: 1 })
  }
}

export default new CategoryService(CategoryModel)
