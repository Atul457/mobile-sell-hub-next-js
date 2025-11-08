import { Document, Model, model, models, Schema } from 'mongoose';

import { ICategory } from './category.model';
import { IProductCategory } from './product-category.model';
import { IShopRegister } from './shop-register.model';
import { ITag } from './tag.model';

export interface IProductLaneOption {
    tagId: ITag['id']; // Reference to Tag
    price: number; // Price for this specific option
    name?: string;
}

export interface IProductLane {
    categoryId: ICategory['id'];
    laneTitle?: string;
    type: 'radio' | 'checkbox';
    options: IProductLaneOption[]; // Array of { tagId, price }
    presentTagOptions?: Omit<IProductLaneOption, 'price'>[];
    selectedTagIds?: string[];
}

export interface IProduct extends Document {
    name: string;
    description?: string;
    price: number;
    categoryId: IProductCategory['id'];
    image?: string | null;
    lanes: IProductLane[];
    status: 0 | 1 | 2;
    shopId: IShopRegister['id'];
}

const ProductLaneOptionSchema = new Schema({
    tagId: { type: Schema.Types.ObjectId, ref: 'Tag', required: true },
    price: { type: Number, required: true }
});

const ProductLaneSchema: Schema = new Schema({
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    laneTitle: { type: String },
    type: { type: String, enum: ['radio', 'checkbox'], required: true },
    options: { type: [ProductLaneOptionSchema], required: true, id: false }
});

const ProductSchema: Schema<IProduct> = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        image: { type: String, default: null },
        lanes: { type: [ProductLaneSchema], required: true, id: false },
        status: { type: Number, enum: [0, 1, 2], default: 1 },
        shopId: { type: Schema.Types.ObjectId, ref: 'ShopRegister' },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'ProductCategory',
            required: true
        }
    },
    { timestamps: true }
);

const ProductModel = (models?.Product as Model<IProduct>) || model<IProduct>('Product', ProductSchema, 'products');

export default ProductModel;
