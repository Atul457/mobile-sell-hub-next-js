import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGamePostLike extends Document {
  gameId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  status: "like" | "dislike";
}

const GamePostLike: Schema<IGamePostLike> = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "GamePosts",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
  },
  { timestamps: true }
);

const GamePostLikeModel =
  (models.GamePostLike as Model<IGamePostLike>) ||
  model<IGamePostLike>("GamePostLike", GamePostLike, "gamePostLike");

export default GamePostLikeModel;
