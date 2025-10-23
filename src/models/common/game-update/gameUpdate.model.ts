import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameUpdate extends Document {
  userId: Schema.Types.ObjectId;
  gameId: Schema.Types.ObjectId;
  title: string;
  fundAmount?: number;
  description?: string;

  /** @info 0 => False, 1 => True */
  isTopInvestor?: 0 | 1;
  likeCount: number;
}

const GameUpdateSchema: Schema<IGameUpdate> = new Schema(
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
    title: { type: String, required: true },
    description: { type: String },
    fundAmount: { type: Number },
    likeCount: { type: Number, required: true, default: 0 },
    isTopInvestor: { type: Number },
  },
  { timestamps: true }
);

const GameUpdateModel =
  (models?.GameUpdate as Model<IGameUpdate>) ||
  model<IGameUpdate>("GameUpdate", GameUpdateSchema, "gameUpdates");

export default GameUpdateModel;
