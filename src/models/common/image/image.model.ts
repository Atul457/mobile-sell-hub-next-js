import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IImage extends Document {
  key: string;
  url: string;

  /** @info Game => Game images, Image => Images, post => game post added when game not created, User => User images */
  type: "game" | "image" | "user" | "post" | "developerImages";
  mediaType: "image" | "video";
  fileName: string;
  gameId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  postId: Schema.Types.ObjectId;
  developerPostId: Schema.Types.ObjectId;
}

const ImageSchema: Schema<IImage> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gameId: {
      type: Schema.Types.ObjectId,
      ref: "Game",
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "GamePosts",
      required: false,
    },
    developerPostId: {
        type: Schema.Types.ObjectId,
        ref: "DeveloperImagesPost",
        required: false,
    },
    type: {
      type: String,
      enum: ["game", "image", "user", "post", "developerImages"],
      required: true,
    },
    fileName: { type: String, required: true },
    mediaType: { type: String, enum: ["video", "image"], required: false },
    key: { type: String, required: true },
    url: { type: String, required: true },
  },
  { timestamps: true }
);

const ImageModel =
  (models?.Image as Model<IImage>) ||
  model<IImage>("Image", ImageSchema, "images");

export default ImageModel;
