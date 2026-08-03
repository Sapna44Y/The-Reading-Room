import mongoose from "mongoose";

const { Schema, model, models } = mongoose;
import {
  READING_STATUS,
  READING_STATUS_VALUES,
} from "../constants/readingStatus.js";

const bookSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: READING_STATUS_VALUES,
      default: READING_STATUS.WANT_TO_READ,
    },
  },
  { timestamps: true },
);

bookSchema.index({ userId: 1, status: 1 });
bookSchema.index({ userId: 1, tags: 1 });

export default models.Book || model("Book", bookSchema);
