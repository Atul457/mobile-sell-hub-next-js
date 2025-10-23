import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameCategoryMapping extends Document {
  gameId: Schema.Types.ObjectId;
  gameCategoryId: Schema.Types.ObjectId;
}

const GameCategorySchema: Schema<IGameCategoryMapping> = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    gameCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "GameCategory",
      required: true,
    },
  },
  { timestamps: true }
);

const GameCategoryMappingModel =
  (models.GameCategoryMapping as Model<IGameCategoryMapping>) ||
  model<IGameCategoryMapping>(
    "GameCategoryMapping",
    GameCategorySchema,
    "gameCategoryMapping"
  );

export default GameCategoryMappingModel;
