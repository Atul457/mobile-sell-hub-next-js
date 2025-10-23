
import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IDeveloperImagesCommentReplies extends Document {
    commentId: Schema.Types.ObjectId;
    reply: string;
    userId: Schema.Types.ObjectId;
    likes: number;
    dislikes: number;
    reports: number;
    parentId: Schema.Types.ObjectId;
    postId: Schema.Types.ObjectId;
    repliesCount?: number
}

const DeveloperImagesCommentReplies: Schema<IDeveloperImagesCommentReplies> = new Schema(
    {
        commentId: {
            type: Schema.Types.ObjectId,
            ref: "DeveloperImagesComments",
            required: true,
        },
        reply: { type: String, required: true },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likes: { type: Number, default: 0 },
        dislikes: { type: Number, default: 0 },
        reports: { type: Number, default: 0 },
        repliesCount: { type: Number, default: 0 },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "DeveloperImagesCommentReplies",
            required: false,
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "DeveloperImagesPost",
            required: true,
        },
    },
    { timestamps: true }
);

const DeveloperImagesCommentRepliesModel =
    (models?.DeveloperImagesCommentReplies as Model<IDeveloperImagesCommentReplies>) ||
    model<IDeveloperImagesCommentReplies>("DeveloperImagesCommentReplies", DeveloperImagesCommentReplies, "developerImagesCommentReplies");

export default DeveloperImagesCommentRepliesModel;

