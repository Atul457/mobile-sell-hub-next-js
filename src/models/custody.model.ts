import { Document, Model, model, models, Schema } from 'mongoose'

export interface IChainOfCustody extends Document {
  name: string
  description?: string
  status?: boolean
  date?: Date
  time?: Date
  reportId?: Schema.Types.ObjectId
  /** @info - Is add when user signups */
  userId?: Schema.Types.ObjectId
}

const ChainOfCustodySchema: Schema<IChainOfCustody> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    status: { type: Boolean },
    date: { type: Date },
    time: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    reportId: { type: Schema.Types.ObjectId, ref: 'Report' }
  },
  { timestamps: true }
)

const ChainOfCustodyModel =
  (models?.chainOfCustody as Model<IChainOfCustody>) ||
  model<IChainOfCustody>('chainOfCustody', ChainOfCustodySchema, 'chainOfCustody')

export default ChainOfCustodyModel
