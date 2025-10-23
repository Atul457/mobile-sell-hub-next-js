import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose";

export interface INotificationSettings extends Document {
  userId: Schema.Types.ObjectId;

  /** @info 0 => Don't send, 1 => Send */
  general: 0 | 1;

  /** @info 0 => Don't send, 1 => Send */
  newMessages: 0 | 1;

  /** @info 0 => Don't send, 1 => Send */
  projectUpdates: 0 | 1;

  /** @info 0 => Don't send, 1 => Send */
  backedDevsNewProjects: 0 | 1;
}

const NotificationSettingsSchema: Schema<INotificationSettings> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    general: {
      type: Number, 
      enum: [0, 1],
      default: 1,
    },
    newMessages: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    projectUpdates: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
    backedDevsNewProjects: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
  },
  { timestamps: true }
);

const NotificationSettingsModel =
  (models.NotificationSettings as Model<INotificationSettings>) ||
  model<INotificationSettings>(
    "NotificationSettings",
    NotificationSettingsSchema,
    "notificationSettings"
  );

export default NotificationSettingsModel;
