import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose"

export interface IDeveloperImageLike extends Document {
  postId: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
  status: "like" | "dislike"
}

const DeveloperImageLike: Schema<IDeveloperImageLike> = new Schema(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "DeveloperImagesPost",
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

const DeveloperImageLikeModel =
  (models?.DeveloperImageLike as Model<IDeveloperImageLike>) ||
  model<IDeveloperImageLike>(
    "DeveloperImageLike",
    DeveloperImageLike,
    "developerImageLike"
  )

export default DeveloperImageLikeModel
