import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IgameRewards extends Document {
  gameId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  totalAmount?: number;
  platformFees?: number;
  status: String;
  transaction_id: String;
  card_id?: Schema.Types.ObjectId;
  step: number;
  transactionFees?: number;
  paymentIntentId?: string
  currentStep?: number;
  stripeCardId?: string;
  withoutReward?: boolean;
  gameAuthorId?: Schema.Types.ObjectId
};


const gameRewardsSchema: Schema<IgameRewards> = new Schema(
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
    gameAuthorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    totalAmount: { type: Number, required: false },
    platformFees: { type: Number, required: false },
    status: { type: String, default: null },
    paymentIntentId: { type: String, default: null },
    transaction_id: { type: String, default: null },
    transactionFees: {type: Number, required: false},
    card_id: { type: Schema.Types.ObjectId, ref: "UserCards", required: false },
    step: { type: Number, required: true },
    currentStep: { type: Number, default: 1 },
    stripeCardId: { type: String, default: null},
    withoutReward: {type: Boolean, default: false}
  },
  { timestamps: true }
);

const GameRewardsModel =
  (models.GameRewards as Model<IgameRewards>) ||
  model<IgameRewards>("GameRewards", gameRewardsSchema, "gameRewards");

export default GameRewardsModel;
