import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameCommunityLogs extends Document {
  gameId: Schema.Types.ObjectId;

  /** @info 1= create a post, 2=like a post, 3= dislike a post, 4= comment on post, 5 = like a post comment, 6= dislike a post comment**/
  type: number;
  postId?: Schema.Types.ObjectId;
  gameCommentId?: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  communityMemberId: Schema.Types.ObjectId;
  postcommentId?: Schema.Types.ObjectId;
}

const GameCommunityLogs: Schema<IGameCommunityLogs> = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    communityMemberId: {
      type: Schema.Types.ObjectId,
      ref: "GameCommunityMember",
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    postcommentId: {
      type: Schema.Types.ObjectId,
      ref: "GamePostComment",
    },
    gameCommentId: {
      type: Schema.Types.ObjectId,
      ref: "GameComments",
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "GamePosts",
    },
  },
  { timestamps: true }
);

const GameCommunityLogsModel =
  (models?.GameCommunityLogs as Model<IGameCommunityLogs>) ||
  model<IGameCommunityLogs>(
    "GameCommunityLogs",
    GameCommunityLogs,
    "gameCommunityLogs"
  );

export default GameCommunityLogsModel;
