import { Document, Model, model, models, Schema } from 'mongoose'
import { HL7Message } from 'simple-hl7'

import { IFile } from './file.model'
import { IProfile } from './profile.model'
import { IQrPopulated } from './qr.model'
import { ITransaction } from './transaction.model'
import { IUser } from './user.model'

export interface IReport extends Document {
  pid: IProfile['pid']
  /** @info 0 => DRAFT, 1 => PENDING, 2 => RECEIVED, 3 => PROCESSED, 4 => REJECTED ,5 => DELETED */
  status: 0 | 1 | 2 | 3 | 4 | 5
  addOnsCount: number
  identifier: string
  userId: Schema.Types.ObjectId
  qrId: Schema.Types.ObjectId
  packageId: Schema.Types.ObjectId
  profileId: Schema.Types.ObjectId
  transactionId?: Schema.Types.ObjectId
  videoUrl: string | null
  reportUrl: string | null
  processedReportUrl: string | null
  rejectionReason: string | null
  updationDates: Date[]
}

export type IReportPopulated = IReport & {
  user?: IUser
  qr?: IQrPopulated
  profile?: IProfile
  video?: IFile
  processedReport?: IFile
  report?: IFile
  hl7Message?: HL7Message
  transaction?: ITransaction
}

const ReportSchema: Schema<IReport> = new Schema(
  {
    pid: {
      type: String,
      required: true
    },
    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5],
      default: 0
    },
    identifier: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: true
    },
    qrId: {
      type: Schema.Types.ObjectId,
      ref: 'Qr',
      required: true
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction'
    },
    updationDates: { type: [Date], ref: 'Test', default: [] },
    videoUrl: { type: String, default: null },
    reportUrl: { type: String, default: null },
    processedReportUrl: { type: String, default: null },
    rejectionReason: { type: String, default: null }
  },
  { timestamps: true }
)

const ReportModel = (models.Report as Model<IReport>) || model<IReport>('Report', ReportSchema, 'reports')

export default ReportModel
