import mongoose, { Schema } from "mongoose";

const productMediaSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    kind: {
      type: String,
      required: true,
      trim: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      default: "Polo Ralph Lauren",
    },
    colorName: {
      type: String,
      required: false,
      trim: true,
    },
    colorImage: {
      type: String,
      required: false,
      trim: true,
    },
    price: {
      type: Number,
      required: false,
    },
    stock: {
       type: Number,
      required: false,
    },
    sizesAvailable: {
      type: [String],
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    trending: {
      type: Boolean,
      required: false,
      default: false,
    },
    slideImage: {
      type: [String],
      default: [],
    },
    lookImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productMediaSchema);