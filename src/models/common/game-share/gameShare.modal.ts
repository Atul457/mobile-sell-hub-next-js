import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameShare extends Document {
  gameId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

const GameShareSchema: Schema<IGameShare> = new Schema(
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
  },
  { timestamps: true }
);

const GameShareModel =
  (models.GameShare as Model<IGameShare>) ||
  model<IGameShare>("GameShare", GameShareSchema, "gameShare");

export default GameShareModel;
