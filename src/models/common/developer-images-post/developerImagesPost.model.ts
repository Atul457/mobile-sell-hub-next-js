import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose"

export interface IDeveloperImagesPost extends Document {
  description: string
  userId: Schema.Types.ObjectId
  isMe?: boolean
  commentsCount?: number
  likes: number
}

const DeveloperImagesPost: Schema<IDeveloperImagesPost> = new Schema(
  {
    description: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commentsCount: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  { timestamps: true }
)

const DeveloperImagesPostModel =
  (models?.DeveloperImagesPost as Model<IDeveloperImagesPost>) ||
  model<IDeveloperImagesPost>(
    "DeveloperImagesPost",
    DeveloperImagesPost,
    "developerImagesPost"
  )

export default DeveloperImagesPostModel
