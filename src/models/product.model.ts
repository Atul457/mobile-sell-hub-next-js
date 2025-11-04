import { Document, Model, model, models, Schema } from 'mongoose';

import { ICategory } from './category.model';
import { IShopRegister } from './shopRegister.model';
import { ITag } from './tag.model';

export interface IProductLaneOption {
    tagId: ITag["id"]; // Reference to Tag
    price: number; // Price for this specific option
}

export interface IProductLane {
    categoryId: ICategory["id"];
    laneTitle?: string;
    type: 'radio' | 'checkbox';
    options: IProductLaneOption[]; // Array of { tagId, price }
}

export interface IProduct extends Document {
    name: string;
    description?: string;
    image?: string | null;
    lanes: IProductLane[];
    status: 0 | 1 | 2;
    shopId: IShopRegister["id"];
}

const ProductLaneOptionSchema = new Schema({
    tagId: { type: Schema.Types.ObjectId, ref: 'Tag', required: true },
    price: { type: Number, required: true }
});

const ProductLaneSchema: Schema = new Schema({
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    laneTitle: { type: String },
    type: { type: String, enum: ['radio', 'checkbox'], required: true },
    options: { type: [ProductLaneOptionSchema], required: true }
});

const ProductSchema: Schema<IProduct> = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String, default: null },
        lanes: { type: [ProductLaneSchema], required: true },
        status: { type: Number, enum: [0, 1, 2], default: 1 },
        shopId: { type: Schema.Types.ObjectId, ref: 'ShopRegister' }
    },
    { timestamps: true }
);

const ProductModel = (models?.Product as Model<IProduct>) || model<IProduct>('Product', ProductSchema, 'products');

export default ProductModel;
