import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGamePostCommentReport extends Document {
  gameId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  commentId: Schema.Types.ObjectId;
}

const GamePostCommentReport: Schema<IGamePostCommentReport> = new Schema(
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
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "GamePostComment",
      required: true,
    },
  },
  { timestamps: true }
);

const GamePostCommentsReportsModel =
  (models.GamePostCommentReport as Model<IGamePostCommentReport>) ||
  model<IGamePostCommentReport>(
    "GamePostCommentReport",
    GamePostCommentReport,
    "gamePostCommentReports"
  );

export default GamePostCommentsReportsModel;
