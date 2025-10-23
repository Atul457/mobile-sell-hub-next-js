import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose"

export interface IGameCommunityMember extends Document {
  gameId: Schema.Types.ObjectId
  donation: number
  userId: Schema.Types.ObjectId
  lastLogsId?: Schema.Types.ObjectId
  viewOnly?: number
}

const GameCommunityMember: Schema<IGameCommunityMember> = new Schema(
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
    lastLogsId: {
      type: Schema.Types.ObjectId,
      ref: "GameCommunityLogs",
    },
    donation: {
      type: Number,
      default: 0,
    },
    viewOnly: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const GameCommunityMemberModel =
  (models?.GameCommunityMember as Model<IGameCommunityMember>) ||
  model<IGameCommunityMember>(
    "GameCommunityMember",
    GameCommunityMember,
    "gameCommunityMember"
  )

export default GameCommunityMemberModel
