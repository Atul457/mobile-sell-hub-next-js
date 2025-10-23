import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose"

export interface ISavedGame extends Document {
  userId: Schema.Types.ObjectId
  gameId: Schema.Types.ObjectId
}

const SavedGameSchema: Schema<ISavedGame> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
  },
  { timestamps: true }
)

const SavedGameModel =
  (models?.SavedGame as Model<ISavedGame>) ||
  model<ISavedGame>("SavedGame", SavedGameSchema, "savedGames")

export default SavedGameModel
