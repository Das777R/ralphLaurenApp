import mongoose, { Schema } from "mongoose";

const OrderList = new Schema(
  {
    products: {
      type: Array,
      required: true,
    },
    addressName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      required: true,
    },
    postcode: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    payment: {
      type: String,
      enum: ["Paid", "Unpaid", "Refunded"],
      default: "Paid",
    },
  },
  { timestamps: true }
);

export default mongoose.model("OrderList", OrderList);