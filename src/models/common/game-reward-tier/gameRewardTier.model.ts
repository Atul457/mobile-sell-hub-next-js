import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameRewardTier extends Document {
  gameId: Schema.Types.ObjectId;
  name: string;
  amount: number | string;
  description: string;
  rewards: string[];
  type: 1 | 2; // 1 => Normal, 2 => Add on
  supporters?: number;
}

const GameRewardTierSchema: Schema<IGameRewardTier> = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    rewards: { type: [String], required: true },
    supporters: { type: Number, default: 0 },
    type: { type: Number, enum: [1, 2], required: true },
  },
  { timestamps: true }
);

const GameRewardTierModel =
  (models.GameRewardTier as Model<IGameRewardTier>) ||
  model<IGameRewardTier>(
    "GameRewardTier",
    GameRewardTierSchema,
    "gameRewardTiers"
  );

export default GameRewardTierModel;
