import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose"

export interface IGameCommunityMemberReport extends Document {
  reportedCommunityMemberId: Schema.Types.ObjectId
  gameId: Schema.Types.ObjectId
  communityId: Schema.Types.ObjectId
  reportedUserId: Schema.Types.ObjectId
  reportedBy: Schema.Types.ObjectId
  reportedByCommunityMemberId: Schema.Types.ObjectId
}

const GameCommunityMemberReport: Schema<IGameCommunityMemberReport> =
  new Schema(
    {
      reportedCommunityMemberId: {
        type: Schema.Types.ObjectId,
        ref: "GameCommunityMember",
        default: null,
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
      reportedUserId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      reportedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      reportedByCommunityMemberId: {
        type: Schema.Types.ObjectId,
        ref: "GameCommunityMember",
        default: null,
      },
    },
    { timestamps: true }
  )

const GameCommunityMemberReportModel =
  (models?.GameCommunityMemberReport as Model<IGameCommunityMemberReport>) ||
  model<IGameCommunityMemberReport>(
    "GameCommunityMemberReport",
    GameCommunityMemberReport,
    "gameCommunityMemberReport"
  )

export default GameCommunityMemberReportModel
