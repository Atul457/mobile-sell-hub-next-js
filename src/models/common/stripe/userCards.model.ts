import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IUserCardTypes extends Document {
  userId: Schema.Types.ObjectId,
  cardId: string,
  brand: string,
  funding: string,
  exp_month: number,
  exp_year: number,
  card_number: number,
  country: string,
  cardFingerprint: string
}

const UserCardsSchema: Schema<IUserCardTypes> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardId: { type: String, required: true },
    brand: { type: String, required: true },
    funding: { type: String, required: true },
    exp_month: { type: Number, required: true },
    exp_year: { type: Number, required: true },
    card_number: { type: Number, required: true },
    country: { type: String, required: true },
    cardFingerprint: { type: String, required: false}
  },
  { timestamps: true }
);

const UserCardsModel =
  (models.UserCards as Model<IUserCardTypes>) ||
  model<IUserCardTypes>("UserCards", UserCardsSchema, "usercards");

export default UserCardsModel;
