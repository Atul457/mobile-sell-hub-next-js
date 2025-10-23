import { Document, Model, model, models, Schema } from 'mongoose'

export interface IProfile extends Document {
  pid: string
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  /** @info - Is add when user creates profile */
  creatorId?: Schema.Types.ObjectId
  /** @info - Is add when user signups */
  userId?: Schema.Types.ObjectId
  dob?: Date
  /** @info 1 => MALE, 2 => FEMALE, 3 => TRANS */
  gender?: 1 | 2 | 3
  /** @info 0  => DELETED */
  status?: 0
}

const ProfileSchema: Schema<IProfile> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String },
    phoneNumber: { type: String },
    pid: { type: String },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    dob: { type: Date },
    gender: { type: Number, enum: [1, 2, 3] },
    status: { type: Number }
  },
  { timestamps: true }
)

const ProfileModel = (models?.Profile as Model<IProfile>) || model<IProfile>('Profile', ProfileSchema, 'profiles')

export default ProfileModel
