import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGameFaq extends Document {
  gameId: Schema.Types.ObjectId;
  question: string;
  answer: string;
}

const GameFaqSchema: Schema<IGameFaq> = new Schema(
  {
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

const GameFaqModel =
  (models.GameFaq as Model<IGameFaq>) ||
  model<IGameFaq>("GameFaq", GameFaqSchema, "gameFaqs");

export default GameFaqModel;
