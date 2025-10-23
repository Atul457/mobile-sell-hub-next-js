import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameRewardsItems extends Document {
  gameId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  tierId?: Schema.Types.ObjectId;
  gameRewardId: Schema.Types.ObjectId;
  count: number;
  amount: number;
  type: number;
  bonusAmount: number;
  paymentStatus: string;
  withoutReward?: boolean;
}

const GameRewardsItemsSchema: Schema<IGameRewardsItems> = new Schema(
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
    tierId: {
      type: Schema.Types.ObjectId,
      ref: "GameRewardTier",
      required: false,
      default: null
    },
    gameRewardId: {
      type: Schema.Types.ObjectId,
      ref: "GameRewards",
      required: true,
    },
    paymentStatus: {
      type: String,
      default: null
    },
    bonusAmount: {
      type: Number,
      required: false
    },
    amount: {
      type: Number,
      required: true
    },
    count: {
      type: Number,
      required: false
    },
    type: {
      type: Number,
      required: false
    },
    withoutReward: { type: Boolean, default: false}
  },
  { timestamps: true }
);

const GameRewardsItemsModel =
  (models.GameRewardsItems as Model<IGameRewardsItems>) ||
  model<IGameRewardsItems>("GameRewardsItems", GameRewardsItemsSchema, "gameRewardsItems");

export default GameRewardsItemsModel;
