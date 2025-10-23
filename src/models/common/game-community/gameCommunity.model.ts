import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameCommunity extends Document {
  gameId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  name: string;
  slug: string;
  membersCount: number;
  updatesCount: number;
  postsPerDayCount: number;
  allowPhoto: boolean;
  allowComment: boolean;
}

const GameCommunity: Schema<IGameCommunity> = new Schema(
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
    name: { type: String, required: true },
    slug: { type: String, required: true },
    postsPerDayCount: {
      type: Number,
      default: 10,
    },
    membersCount: {
      type: Number,
      default: 0,
    },
    updatesCount: {
      type: Number,
      default: 0,
    },
    allowPhoto: {
      type: Boolean,
      default: true,
    },
    allowComment: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const GameCommunityModel =
  (models?.GameCommunity as Model<IGameCommunity>) ||
  model<IGameCommunity>("GameCommunity", GameCommunity, "gameCommunity");

export default GameCommunityModel;
