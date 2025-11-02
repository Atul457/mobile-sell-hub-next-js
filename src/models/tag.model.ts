import { Document, Model, model, models, Schema } from 'mongoose';

import { ICategory } from './category.model';

export interface ITag extends Document {
    name: string;
    description?: string;
    shopId?: Schema.Types.ObjectId;
    categoryId: ICategory['id'];
    image?: string | null;
    /** @info 0 => Inactive, 1 => Active, 2 => Deleted  */
    status: 0 | 1 | 2;
}

/** @TODO - */
// Store productCount
/** @TODO - */

export interface ITagPopulated extends ITag {
    category: ICategory;
}

const TagSchema: Schema<ITag> = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String, default: null },
        status: { type: Number, enum: [0, 1, 2], default: 1 },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'ShopRegister'
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        }
    },
    { timestamps: true }
);

const TagModel = (models?.Tag as Model<ITag>) || model<ITag>('Tag', TagSchema, 'tags');

export default TagModel;
