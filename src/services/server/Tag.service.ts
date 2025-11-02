import { Model } from 'mongoose';

import TagModel, { ITag } from '@/models/tag.model';

interface ITagService {
    createTag(data: Partial<ITag>): Promise<ITag>;
    getTagById(id: string): Promise<ITag | null>;
    updateTag(id: string, data: Partial<ITag>): Promise<ITag | null>;
    deleteTag(id: string): Promise<ITag | null>;
    findTagBySlug(slug: string): Promise<ITag | null>;
    getBaseCategories(): Promise<ITag[]>;
}

class TagService implements ITagService {
    private tagModel: Model<ITag>;

    constructor(tagModel: Model<ITag>) {
        this.tagModel = tagModel;
    }

    async getTagById(id: string): Promise<ITag | null> {
        return this.tagModel.findById(id);
    }

    async getBaseCategories() {
        return this.tagModel.find({
            shopId: { $exists: false }
        });
    }

    async createTag(data: Partial<ITag>): Promise<ITag> {
        const tag = new this.tagModel(data);
        return tag.save();
    }

    async updateTag(id: string, data: Partial<ITag>): Promise<ITag | null> {
        return this.tagModel.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteTag(id: string): Promise<ITag | null> {
        return this.tagModel.findByIdAndUpdate(id, { status: 2 }, { new: true }); // Soft delete
    }

    async findTagBySlug(slug: string): Promise<ITag | null> {
        return this.tagModel.findOne({ slug, status: 1 });
    }
}

export default new TagService(TagModel);
