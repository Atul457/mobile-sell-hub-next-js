import { PaymentIntent } from '@stripe/stripe-js'
import { Document, Model, model, models, Schema } from 'mongoose'

export interface ITransaction extends Document {
  transactionId: string
  amountPaid: number
  platformFees: number
  amount: number
  currency: string
  userId: Schema.Types.ObjectId
  cardId: Schema.Types.ObjectId
  status: PaymentIntent.Status
  transactionDate: Date
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    transactionId: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    platformFees: { type: Number, default: 0 },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cardId: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
    status: { type: String, required: true },
    transactionDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
)

const TransactionModel =
  (models?.Transaction as Model<ITransaction>) || model<ITransaction>('Transaction', TransactionSchema, 'transactions')

export default TransactionModel
