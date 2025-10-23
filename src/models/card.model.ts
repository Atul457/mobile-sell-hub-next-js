import { Document, Model, model, models, Schema } from 'mongoose'

export interface IUserCardTypes extends Document {
  userId: Schema.Types.ObjectId
  cardId: string
  brand: string
  expMonth: number
  expYear: number
  cardNumber: string
  country: string | null
  cardFingerprint: string | null
  /** @info 0  => DELETED */
  status?: 0
}

const CardSchema: Schema<IUserCardTypes> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cardId: { type: String, required: true },
    brand: { type: String, required: true },
    expMonth: { type: Number, required: true },
    expYear: { type: Number, required: true },
    cardNumber: { type: String, required: true },
    country: { type: String, default: null },
    cardFingerprint: { type: String, default: null },
    status: { type: Number }
  },
  { timestamps: true }
)

const CardModel = (models.Card as Model<IUserCardTypes>) || model<IUserCardTypes>('Card', CardSchema, 'cards')

export default CardModel
