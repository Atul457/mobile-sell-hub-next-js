import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameComments extends Document {
    gameId: Schema.Types.ObjectId;
    comment: string;
    userId: Schema.Types.ObjectId;
    likes: number;
    reports: number
}

const GameComments: Schema<IGameComments> = new Schema(
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
        reports: { type: Number, default: 0 }
    },
    { timestamps: true }
);

const GameCommentsModel =
    (models.GameComments as Model<IGameComments>) ||
    model<IGameComments>("GameComments", GameComments, "gameComments");

export default GameCommentsModel;