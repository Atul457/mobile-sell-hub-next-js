import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGamePostCommentLike extends Document {
  gameId: Schema.Types.ObjectId;
  commentId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  status: "like" | "dislike";
}

const GamePostCommentLike: Schema<IGamePostCommentLike> = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "GamePostComment",
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

const GamePostCommentLikeModel =
  (models?.GamePostCommentLike as Model<IGamePostCommentLike>) ||
  model<IGamePostCommentLike>(
    "GamePostCommentLike",
    GamePostCommentLike,
    "gamePostCommentLikes"
  );

export default GamePostCommentLikeModel;
