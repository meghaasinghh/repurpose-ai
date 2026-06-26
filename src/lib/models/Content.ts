import mongoose, { Schema, models, model } from "mongoose";

export type InputType = "youtube" | "audio" | "blog";
export type Tone = "professional" | "casual" | "storytelling" | "genz";

export interface IGeneratedOutput {
  platform: "twitter" | "linkedin" | "instagram" | "blog" | "email";
  content: string;
  hashtags?: string[];
}

export interface IContent {
  user: mongoose.Types.ObjectId;
  inputType: InputType;
  sourceUrl?: string;
  sourceFileName?: string;
  transcript: string;
  tone: Tone;
  outputs: IGeneratedOutput[];
  title: string;
  createdAt: Date;
}

const GeneratedOutputSchema = new Schema<IGeneratedOutput>({
  platform: {
    type: String,
    enum: ["twitter", "linkedin", "instagram", "blog", "email"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  hashtags: [String],
});

const ContentSchema = new Schema<IContent>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  inputType: {
    type: String,
    enum: ["youtube", "audio", "blog"],
    required: true,
  },
  sourceUrl: String,
  sourceFileName: String,
  transcript: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    enum: ["professional", "casual", "storytelling", "genz"],
    default: "professional",
  },
  outputs: [GeneratedOutputSchema],
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Content = models.Content || model<IContent>("Content", ContentSchema);