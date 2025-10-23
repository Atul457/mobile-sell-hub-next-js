import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameCommentsReports extends Document {
  gameId: Schema.Types.ObjectId;
  commentId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

const GameCommentsReports: Schema<IGameCommentsReports> = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "gameComments",
        required: true,
      },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  },
  { timestamps: true }
);

const GameCommentsReportsModel =
  (models.GameCommentsReports as Model<IGameCommentsReports>) ||
  model<IGameCommentsReports>("GameCommentsReports", GameCommentsReports, "gameCommentsReports");

export default GameCommentsReportsModel;
