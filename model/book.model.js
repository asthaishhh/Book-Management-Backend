import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    BookName: {
      type: String,
      required: true,
    },
    Author: {
      type: String,
      required: true,
    },
    Price: {
      type: Number,
      required: true,
    },
    Category: {
      type: String,
      required: true,
    },
    Image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Book = mongoose.model("Book", schema);

export default Book;
