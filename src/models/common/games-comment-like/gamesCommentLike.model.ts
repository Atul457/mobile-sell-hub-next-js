import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameCommentsLike extends Document {
  gameId: Schema.Types.ObjectId;
  commentId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

const GameCommentsLike: Schema<IGameCommentsLike> = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "gameComments",
        required: true,
      },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  },
  { timestamps: true }
);

const GameCommentsLikeModel =
  (models.GameCommentsLike as Model<IGameCommentsLike>) ||
  model<IGameCommentsLike>("GameCommentsLike", GameCommentsLike, "gameCommentsLike");

export default GameCommentsLikeModel;
