import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameStory extends Document {
  gameId: Schema.Types.ObjectId;
  title: string;
  description: string;
}

const GameStorySchema: Schema<IGameStory> = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const GameStoryModel =
  (models.GameStory as Model<IGameStory>) ||
  model<IGameStory>("GameStory", GameStorySchema, "gameStories");

export default GameStoryModel;
