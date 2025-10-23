import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGamePostReports extends Document {
  gameId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

const GamePostReports: Schema<IGamePostReports> = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    postId: {
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

const GamePostReportsModel =
  (models.GamePostReports as Model<IGamePostReports>) ||
  model<IGamePostReports>("GamePostReports", GamePostReports, "gamePostReports");

export default GamePostReportsModel;
