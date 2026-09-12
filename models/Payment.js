import mongoose from "mongoose";

const paymentItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    qty: {
      type: Number,
      required: true,
    },

    imgsrc: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    phonenumber: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Razorpay Order ID
  orderId: {
    type: String,
    required: true,
    unique: true,
  },

  // Razorpay Payment ID
  paymentId: {
    type: String,
    required: true,
    unique: true,
  },

  // Razorpay signature
  signature: {
    type: String,
    required: true,
  },

  // Amount in INR
  amount: {
    type: Number,
    required: true,
  },

  currency: {
    type: String,
    default: "INR",
  },

  status: {
    type: String,
    default: "Success",
  },

  // Cart snapshot
  items: {
    type: [paymentItemSchema],
    required: true,
  },

  // Shipping address snapshot
  shippingAddress: {
    type: shippingAddressSchema,
    required: true,
  },

  paidAt: {
    type: Date,
    default: Date.now,
  },
});

export const Payment = mongoose.model("Payment", paymentSchema);