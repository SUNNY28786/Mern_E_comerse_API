import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Absolute path create karne ke liye
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly .env file ka full path pass karein
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("CHECK KEY:", process.env.RAZORPAY_KEY_ID);
import express from "express";
import mongoose from "mongoose";
import bodyparser from "express"
import userRouter from "./Routes/user.js";
import productRouter from './Routes/product.js'
import cartRouter from './Routes/cart.js'
import addressRouter from "./Routes/address.js";
import paymentRouter from './Routes/payment.js'
import { addAddress } from "./Controllers/address.js";
import cors from "cors"



const app = express();

app.use(
  cors({
    origin: true,
    methods:["GET","POST","PUT","DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "this is home route",
  });
});

app.use("/api/user", userRouter);

/// PRODUCT ROUTER
app.use('/api/product', productRouter)


/// CART ADD  ROUTER
  app.use('/api/cart',cartRouter)

//   ADDRESS ROUTER

app.use('/api/address', addressRouter)

// PAYMENT ROUTER
app.use('/api/payment',paymentRouter)


mongoose
  .connect("mongodb+srv://sy4741091_db_user:Ecom12345Test@cluster0.sf7ndvs.mongodb.net/", {
    dbName:"SHOPPING"
  })
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const port = 1000;

app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);


// db username  sy4741091_db_user
//db password  orgWxz1up1TMgZ3Ls


//mongodb+srv://sy4741091_db_user:<db_password>@cluster0.sf7ndvs.mongodb.net/
//mongodb+srv://sy4741091_db_user:<db_password>@cluster0.sf7ndvs.mongodb.net/