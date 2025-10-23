import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IDeveloperImageCommentsPinned extends Document {
  userId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  commentId: Schema.Types.ObjectId;
}

const DeveloperImageCommentsPinnedSchema: Schema<IDeveloperImageCommentsPinned> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
  },
  { timestamps: true }
);

const DeveloperImageCommentsPinnedModel =
  (models?.DeveloperImageCommentsPinneds as Model<IDeveloperImageCommentsPinned>) ||
  model<IDeveloperImageCommentsPinned>("DeveloperImageCommentsPinneds", DeveloperImageCommentsPinnedSchema, "developerImageCommentsPinneds");

export default DeveloperImageCommentsPinnedModel;
