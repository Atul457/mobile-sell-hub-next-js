import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IGamerMeta extends Document {
  about: string | null;
  userId: Schema.Types.ObjectId;
  onboarding: number;
}

const GamerMetaSchema: Schema<IGamerMeta> = new Schema(
  {
    about: {
      type: String,
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    onboarding: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  { timestamps: true }
);

const GamerMetaModel =
  (models?.GamerMeta as Model<IGamerMeta>) ||
  model<IGamerMeta>("GamerMeta", GamerMetaSchema, "gamerMeta");

export default GamerMetaModel;
