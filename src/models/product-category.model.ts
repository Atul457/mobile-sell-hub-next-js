import { Document, Model, model, models, Schema } from 'mongoose';

import { IShopRegister } from './shop-register.model';

export interface IProductCategory extends Document {
    name: string;
    description?: string;
    shopId: IShopRegister['_id'];
    image?: string | null;
    /** @info 0 => Inactive, 1 => Active, 2 => Deleted  */
    status: 0 | 1 | 2;
}

/** @TODO - */
// Store productCount, and tagsCount
/** @TODO - */

const ProductCategorySchema: Schema<IProductCategory> = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String, default: null },
        status: { type: Number, enum: [0, 1, 2], default: 1 },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'ShopRegister'
        }
    },
    { timestamps: true }
);

const ProductCategoryModel =
    (models?.ProductCategory as Model<IProductCategory>) ||
    model<IProductCategory>('ProductCategory', ProductCategorySchema, 'productCategories');

export default ProductCategoryModel;
