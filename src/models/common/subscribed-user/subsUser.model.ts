import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose"

export interface ISubsUsers extends Document {
  email: string
}

const SubscribedUserSchema: Schema<ISubsUsers> = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const SubscribedUserModel =
  (models?.SubscribedUser as Model<ISubsUsers>) ||
  model<ISubsUsers>("SubscribedUser", SubscribedUserSchema, "subscribedUsers")

export default SubscribedUserModel
