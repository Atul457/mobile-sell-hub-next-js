import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose"

export interface IGamePostLike extends Document {
  postId: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
  commentId: Schema.Types.ObjectId
  status: "like" | "dislike"
}

const DeveloperImageCommentLike: Schema<IGamePostLike> = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "DeveloperImagesPost",
      required: true,
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "DeveloperImagesComments",
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
)

const DeveloperImageCommentLikeModel =
  (models?.DeveloperImageCommentLike as Model<IGamePostLike>) ||
  model<IGamePostLike>(
    "DeveloperImageCommentLike",
    DeveloperImageCommentLike,
    "DeveloperImageCommentLike"
  )

export default DeveloperImageCommentLikeModel
