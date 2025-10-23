import type { Document, Model} from 'mongoose';
import { model, models, Schema } from 'mongoose'

export interface IAdmin extends Document {
  name: string
  email: string
  role: 'admin' | 'subAdmin'
  password: string
  profilePicture?: string
}

const AdminSchema: Schema<IAdmin> = new Schema(
  {
    name: { type: String, required: true, default: 'Admin' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    role: { type: String, required: true, enum: ['admin', 'subAdmin'], default: 'admin' }
  },
  { timestamps: true }
)

const AdminModel = (models?.Admin as Model<IAdmin>) || model<IAdmin>('Admin', AdminSchema, 'admin')

export default AdminModel
