import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameCategory extends Document {
  name: string;
  slug: string;
}

const GameCategorySchema: Schema<IGameCategory> = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
  },
  { timestamps: true }
);

const GameCategoryModel =
  (models?.GameCategory as Model<IGameCategory>) ||
  model<IGameCategory>("GameCategory", GameCategorySchema, "gameCategories");

export default GameCategoryModel;
