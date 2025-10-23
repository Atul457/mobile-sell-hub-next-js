
import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGamePostComment extends Document {
    gameId: Schema.Types.ObjectId;
    comment: string;
    userId: Schema.Types.ObjectId;
    likes: number;
    dislikes: number;
    reports: number;
    parentId: Schema.Types.ObjectId;
    postId: Schema.Types.ObjectId;
    repliesCount?: number
}

const GamePostComment: Schema<IGamePostComment> = new Schema(
    {
        gameId: {
            type: Schema.Types.ObjectId,
            ref: "Game",
            required: true,
        },
        comment: { type: String, required: true },
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
            ref: "GamePostComment",
            required: false,
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "GamePosts",
            required: true,
        },
    },
    { timestamps: true }
);

const GamePostCommentModel =
    (models.GamePostComment as Model<IGamePostComment>) ||
    model<IGamePostComment>("GamePostComment", GamePostComment, "gamePostComment");

export default GamePostCommentModel;

