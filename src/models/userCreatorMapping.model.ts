import { Document, Model, model, models, Schema } from 'mongoose'

export interface IUserCreatorMapping extends Document {
  userId: Schema.Types.ObjectId
  creatorId: Schema.Types.ObjectId
  mainCreatorId: Schema.Types.ObjectId
}

const UserCreatorMappingSchema: Schema<IUserCreatorMapping> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mainCreatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

const UserCreatorMappingModel =
  (models?.UserCreatorMapping as Model<IUserCreatorMapping>) ||
  model<IUserCreatorMapping>('UserCreatorMapping', UserCreatorMappingSchema, 'userCreatorMappings')

export default UserCreatorMappingModel
