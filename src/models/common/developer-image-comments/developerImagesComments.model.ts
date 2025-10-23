import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose"

export interface IDeveloperImagesComments extends Document {
  comment: string
  userId: Schema.Types.ObjectId
  postId: Schema.Types.ObjectId
  likes: number
  disLikes: number
  reports: number
  comments: number
  isMe?: boolean
  isDeveloper?: boolean
}

const DeveloperImagesComments: Schema<IDeveloperImagesComments> = new Schema(
  {
    comment: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "DeveloperImagesComments",
      required: true,
    },
    likes: { type: Number, default: 0 },
    disLikes: { type: Number, default: 0 },
    reports: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const DeveloperImagesCommentsModel =
  (models?.DeveloperImagesComments as Model<IDeveloperImagesComments>) ||
  model<IDeveloperImagesComments>(
    "DeveloperImagesComments",
    DeveloperImagesComments,
    "developerImagesComments"
  )

export default DeveloperImagesCommentsModel
