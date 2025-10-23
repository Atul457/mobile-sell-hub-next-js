import { Document, Model, model, models, Schema } from 'mongoose'

export interface IPackage extends Document {
  name: string
  price: number
  isDefault: boolean
  /** @info 0 => IN_ACTIVE, 1 => ACTIVE, 2 => DELETED */
  status: 0 | 1 | 2
  identifier: string
  description: string | null
  withChainOfCustody: boolean
}

export type IPackagePopulated = IPackage & {}

const PackageSchema: Schema<IPackage> = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: { type: Number, enum: [0, 1, 2], default: 1 },
    withChainOfCustody: { type: Boolean, required: true },
    description: { type: String, default: null },
    isDefault: { type: Boolean, default: false },
    identifier: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
)

const PackageModel = (models?.Package as Model<IPackage>) || model<IPackage>('Package', PackageSchema, 'packages')

export default PackageModel
