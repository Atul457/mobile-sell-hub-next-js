import type { Document, Model} from "mongoose";
import { model, models, Schema } from "mongoose"

import type { IGameCategoryMapping } from "../game-category-mapping/gameCategoryMapping.model"

type IActiveSlug =
  | "intro"
  | "story"
  | "goal"
  | "rewards"
  | "length"
  | "launch"
  | "faq"
  | "community"
  | "terms"

export interface IGame extends Document {
  slug: string
  name: string
  userName: string
  currentSlug: IActiveSlug
  lastCompletedSlug: IActiveSlug
  description: string | null
  userId: Schema.Types.ObjectId

  /** @info 0 => Inactive, 1 => Published, 2 => Draft */
  status: 0 | 1 | 2
  likesCount: number
  collectFunds: 0 | 1 // 0 => Dont collect fund, 1 => Collect fund
  shareCount: number
  saveCount: number
  backersCount: number
  campaignLength: number
  campaignStartDate: Date
  campaignEndDate: Date
  launchDate: Date
  fundGoalAmount: number
  previewImage: string | null
  community: string | null
  collectedFundsAmount: number
  terms: string | null
  userSlug?: string | null

  /** @info To use on client side only */
  isSaved?: boolean

  // Not storable fields
  gameCategoryMappings?: IGameCategoryMapping[]
  fundGoalCompletedDate?: Date | null
  rewardsTierTotal: number
  isGameFunded?: boolean
  isShared?: boolean
  preLaunchBetaDate?: boolean
}

const GameSchema: Schema<IGame> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    userName: { type: String, required: true },
    slug: { type: String, required: true },
    currentSlug: {
      type: String,
      enum: [
        "intro",
        "story",
        "goal",
        "rewards",
        "length",
        "launch",
        "faq",
        "community",
        "terms",
      ],
      required: true,
    },
    lastCompletedSlug: {
      type: String,
      enum: [
        "intro",
        "story",
        "goal",
        "rewards",
        "length",
        "launch",
        "faq",
        "community",
        "terms",
      ],
      default: null,
    },
    status: { type: Number, enum: [0, 1, 2], required: true },
    likesCount: {
      type: Number,
      default: 0,
      required: true,
    },
    saveCount: {
      type: Number,
      default: 0,
    },
    collectFunds: {
      type: Number,
      enum: [0, 1],
    },
    shareCount: {
      type: Number,
      default: 0,
      required: true,
    },
    backersCount: {
      type: Number,
      default: 0,
      required: true,
    },
    campaignLength: {
      type: Number,
      required: true,
    },
    campaignStartDate: {
      type: Date,
      default: null,
    },
    campaignEndDate: {
      type: Date,
      default: null,
    },
    launchDate: {
      type: Date,
      default: null,
    },
    fundGoalAmount: {
      type: Number,
      default: 0,
      required: true,
    },
    fundGoalCompletedDate: {
      type: Date,
      default: null,
    },
    collectedFundsAmount: {
      type: Number,
      default: 0,
      required: true,
    },
    previewImage: {
      type: String,
      default: null,
    },
    community: { type: String, default: null },
    description: { type: String, default: null },
    terms: { type: String, default: null },
    userSlug: { type: String, default: null },
    rewardsTierTotal: { type: Number, default: 0 },
    preLaunchBetaDate: { type: Boolean },
  },
  { timestamps: true }
)

const GameModel =
  (models?.Game as Model<IGame>) || model<IGame>("Game", GameSchema, "games")

export default GameModel
