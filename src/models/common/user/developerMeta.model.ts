import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IDeveloperMeta extends Document {
  about: string | null;
  location: string | null;
  discord: string;
  linkedIn: string;
  twitter: string;
  instagram: string;
  facebook: string;
  userId: Schema.Types.ObjectId;
  onboarding: number;
}

const DeveloperMetaSchema: Schema<IDeveloperMeta> = new Schema(
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
    location: {
      type: String,
    },
    onboarding: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
    discord: {
      type: String,
      default: null,
    },
    linkedIn: {
      type: String,
      default: null,
    },
    twitter: {
      type: String,
      default: null,
    },
    instagram: {
      type: String,
      default: null,
    },
    facebook: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const DeveloperMetaModel =
  (models?.DeveloperMeta as Model<IDeveloperMeta>) ||
  model<IDeveloperMeta>("DeveloperMeta", DeveloperMetaSchema, "developerMeta");

export default DeveloperMetaModel;
