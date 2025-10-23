import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose"

export interface IDeveloperUserBlock extends Document {
  userId: Schema.Types.ObjectId
  developerId: Schema.Types.ObjectId
}

const DeveloperUserBlock: Schema<IDeveloperUserBlock> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    developerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

const DeveloperUserBlockModel =
  (models?.DeveloperUserBlock as Model<IDeveloperUserBlock>) ||
  model<IDeveloperUserBlock>(
    "DeveloperUserBlock",
    DeveloperUserBlock,
    "developerUserBlock"
  )

export default DeveloperUserBlockModel
