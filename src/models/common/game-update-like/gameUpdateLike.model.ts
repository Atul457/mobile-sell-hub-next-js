import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameUpdateLike extends Document {
  userId: Schema.Types.ObjectId;
  gameId: Schema.Types.ObjectId;
  gameUpdateId: Schema.Types.ObjectId;
  gameRewardId?: Schema.Types.ObjectId;
}

const GameUpdateLikeSchema: Schema<IGameUpdateLike> = new Schema(
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
    gameUpdateId: {
      type: Schema.Types.ObjectId,
      ref: "GameUpdate",
      required: true,
    },
    gameRewardId: {
      type: Schema.Types.ObjectId,
      ref: "GameRewards",
    },
  },
  { timestamps: true }
);

const GameUpdateLikeModel =
  (models?.GameUpdateLike as Model<IGameUpdateLike>) ||
  model<IGameUpdateLike>("GameUpdateLike", GameUpdateLikeSchema, "gameUpdateLikes");

export default GameUpdateLikeModel;
