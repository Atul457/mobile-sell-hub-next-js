import { Document, Model, model, models, Schema } from 'mongoose'

import { IPackage } from './package.model'
import { IReport } from './report.model'
import { IUser } from './user.model'

export interface IQr extends Document {
  qrCode: string
  // 0 => Inactive, 1 => Active, 2 => Deleted, 3 => Used
  status: 0 | 1 | 2 | 3
  reportId?: Schema.Types.ObjectId
  usedBy?: Schema.Types.ObjectId
  usedAt?: Date
  packageId: Schema.Types.ObjectId
}

export type IQrPopulated = Omit<IQr, 'usedBy' | 'reportId' | 'packageId'> & {
  usedBy?: IUser
  reportId?: IReport
  package?: IPackage
  packageId?: IPackage
}

const QrSchema: Schema<IQr> = new Schema(
  {
    qrCode: { type: String, required: true, unique: true, maxlength: 6 },
    status: { type: Number, default: 1, enum: [0, 1, 2, 3] },
    usedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reportId: { type: Schema.Types.ObjectId, ref: 'Report' },
    usedAt: { type: Date },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true }
  },
  { timestamps: true }
)

const QrModel = (models?.Qr as Model<IQr>) || model<IQr>('Qr', QrSchema, 'qrs')

export default QrModel
