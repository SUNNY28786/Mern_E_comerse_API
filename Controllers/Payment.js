import Razorpay from "razorpay";
import crypto from "crypto";
import { Cart } from "../models/Cart.js";
import { Payment } from "../models/Payment.js";

// Razorpay instance
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID) {
    throw new Error("RAZORPAY_KEY_ID environment variable is missing.");
  }

  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_SECRET environment variable is missing.");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};


// ======================================================
// 1. CREATE RAZORPAY ORDER
// ======================================================

export const checkout = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const totalAmount = cart.items.reduce((total, item) => {
      return total + Number(item.price) * Number(item.qty);
    }, 0);

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart amount",
      });
    }

    const razorpayAmount = Math.round(totalAmount * 100);

    const options = {
      amount: razorpayAmount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      message: "Razorpay order created",
      order: order,
      amount: totalAmount,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("========== RAZORPAY CHECKOUT ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Payment order creation failed",
    });
  }
};


// ======================================================
// 2. VERIFY PAYMENT + SAVE EVERYTHING IN MONGODB
// ======================================================

export const verify = async (req, res) => {
  try {
    const razorpay = getRazorpayInstance();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingAddress,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment details are missing",
      });
    }

    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = user._id;

    const alreadySaved = await Payment.findOne({
      paymentId: razorpay_payment_id,
    });

    if (alreadySaved) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        paymentId: razorpay_payment_id,
        payment: alreadySaved,
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature, verification failed",
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Payment verified but cart is empty",
      });
    }

    const totalAmount = cart.items.reduce((total, item) => {
      return total + Number(item.price) * Number(item.qty);
    }, 0);

    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart amount",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const requiredAddressFields = [
      "fullName",
      "address",
      "city",
      "state",
      "country",
      "pincode",
      "phonenumber",
    ];

    for (const field of requiredAddressFields) {
      if (!shippingAddress[field] || String(shippingAddress[field]).trim() === "") {
        return res.status(400).json({
          success: false,
          message: `Shipping address field "${field}" is required`,
        });
      }
    }

    const savedItems = cart.items.map((item) => ({
      productId: item.productId ? String(item.productId) : "",
      title: item.title,
      price: Number(item.price),
      qty: Number(item.qty),
      imgsrc: item.imgsrc || "",
    }));

    const savedShippingAddress = {
      fullName: String(shippingAddress.fullName).trim(),
      address: String(shippingAddress.address).trim(),
      city: String(shippingAddress.city).trim(),
      state: String(shippingAddress.state).trim(),
      country: String(shippingAddress.country).trim(),
      pincode: String(shippingAddress.pincode).trim(),
      phonenumber: String(shippingAddress.phonenumber).trim(),
    };

    const payment = await Payment.create({
      userId: userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount: totalAmount,
      currency: "INR",
      status: "Success",
      items: savedItems,
      shippingAddress: savedShippingAddress,
      paidAt: new Date(),
    });

    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [] } }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified and order data saved successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: totalAmount,
      payment: payment,
    });

  } catch (error) {
    console.error("========== VERIFY PAYMENT ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Payment verification failed",
    });
  }
};


// ======================================================
// 3. GET ALL PAYMENTS (ADMIN)
// ======================================================
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("GET ALL PAYMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to fetch payments",
    });
  }
};