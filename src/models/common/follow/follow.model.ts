import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IFollow extends Document {
  followerId: Schema.Types.ObjectId;
  followeeId: Schema.Types.ObjectId;
}

const GameSchema: Schema<IFollow> = new Schema(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const FollowModel =
  (models?.Follow as Model<IFollow>) ||
  model<IFollow>("Follow", GameSchema, "follows");

export default FollowModel;
