import { Document, Model, model, models, Schema } from 'mongoose'

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  image?: string | null
  /** @info 0 => Inactive, 1 => Active, 2 => Deleted  */
  status: 0 | 1 | 2
}

const CategorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    image: { type: String, default: null },
    status: { type: Number, enum: [0, 1, 2], default: 1 }
  },
  { timestamps: true }
)

const CategoryModel =
  (models?.Category as Model<ICategory>) || model<ICategory>('Category', CategorySchema, 'categories')

export default CategoryModel
