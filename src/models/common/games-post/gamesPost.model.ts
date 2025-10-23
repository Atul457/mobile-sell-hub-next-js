import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose"

export interface IGamePost extends Document {
  gameId: Schema.Types.ObjectId
  communityId: Schema.Types.ObjectId
  description: string
  userId: Schema.Types.ObjectId
  likes: number
  disLikes: number
  reports: number
  communityMemberId: Schema.Types.ObjectId
  comments: number
  isMe: boolean
}

const GamePosts: Schema<IGamePost> = new Schema(
  {
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
    description: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: { type: Number, default: 0 },
    disLikes: { type: Number, default: 0 },
    reports: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    communityMemberId: {
      type: Schema.Types.ObjectId,
      ref: "gameCommunityMember",
    },
  },
  { timestamps: true }
)

const GamePostsModel =
  (models?.GamePosts as Model<IGamePost>) ||
  model<IGamePost>("GamePosts", GamePosts, "gamePosts")

export default GamePostsModel
