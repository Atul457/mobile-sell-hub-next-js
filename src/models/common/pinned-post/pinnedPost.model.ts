import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IPinnedPost extends Document {
  userId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  gameId: Schema.Types.ObjectId;
  communityId: Schema.Types.ObjectId;
  communityMemberId: Schema.Types.ObjectId | null;
}

const PinnedPostSchema: Schema<IPinnedPost> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "GamePosts",
      required: true,
    },
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "GameCommunity",
      required: true,
    },
    communityMemberId: {
      type: Schema.Types.ObjectId,
      ref: "GameCommunityMember",
    },
  },
  { timestamps: true }
);

const PinnedPostModel =
  (models?.PinedPost as Model<IPinnedPost>) ||
  model<IPinnedPost>("PinedPost", PinnedPostSchema, "pinnedPosts");

export default PinnedPostModel;
