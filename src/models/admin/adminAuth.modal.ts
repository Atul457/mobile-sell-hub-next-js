import type { Document, Model} from 'mongoose';
import { model, models, Schema } from 'mongoose'

export interface IAdminAuth extends Document {
  token: string
  adminId: Schema.Types.ObjectId
  expiry: Date
}

const AdminAuthSchema: Schema<IAdminAuth> = new Schema(
  {
    token: { type: String, required: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    expiry: { type: Date, required: true, default: () => Date.now() + 365 * 24 * 60 * 60 * 1000 }
  },
  { timestamps: true }
)

const AdminAuthModel =
  (models?.AdminAuth as Model<IAdminAuth>) || model<IAdminAuth>('AdminAuth', AdminAuthSchema, 'adminAuth')

export default AdminAuthModel
