import { Document, Model, model, models, Schema } from 'mongoose'

export interface IMail extends Document {
  /** @info 0 => Pending, 1 => Sent, 2 => Error ,3 => Delete  */
  status: 0 | 1 | 2 | 3
  userId: Schema.Types.ObjectId
  type: 'report-rejection' | 'report-complete' | 'report-receive'
  data: string
}

export type IMailTypeContentMapping = {
  'report-rejection': {
    reportId: Schema.Types.ObjectId
  }
  'report-receive': {
    reportId: Schema.Types.ObjectId
  }
  'report-complete': {
    reportId: Schema.Types.ObjectId
  }
}

const MailSchema: Schema<IMail> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: { type: Number, enum: [0, 1, 2, 3], default: 0 },
    type: {
      type: String,
      enum: ['report-rejection', 'report-complete', 'report-receive'],
      required: true
    },
    data: { type: String, required: true }
  },
  { timestamps: true }
)

const MailModel = (models?.Mail as Model<IMail>) || model<IMail>('Mail', MailSchema, 'mails')

export default MailModel
