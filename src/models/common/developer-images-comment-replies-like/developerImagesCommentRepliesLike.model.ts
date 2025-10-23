import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IDeveloperImagesCommentRepliesLike extends Document {
  replyId: Schema.Types.ObjectId;
  commentId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  status: "like" | "dislike";
}

const DeveloperImagesCommentRepliesLike: Schema<IDeveloperImagesCommentRepliesLike> = new Schema(
  {
    replyId: {
      type: Schema.Types.ObjectId,
      ref: "DeveloperImagesCommentReplies",
      required: true,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "DeveloperImagesComments",
      required: true,
    },
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
);

const DeveloperImagesCommentRepliesLikeModel =
  (models?.DeveloperImagesCommentRepliesLike as Model<IDeveloperImagesCommentRepliesLike>) ||
  model<IDeveloperImagesCommentRepliesLike>(
    "DeveloperImagesCommentRepliesLike",
    DeveloperImagesCommentRepliesLike,
    "developerImagesCommentRepliesLikes"
  );

export default DeveloperImagesCommentRepliesLikeModel;
