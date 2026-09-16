import express from "express";

import {
  checkout,
  verify,
  getAllPayments
} from "../Controllers/Payment.js";

import {
  Authenticated,
} from "../Middlewares/auth.js";

const router = express.Router();

router.post(
  "/checkout",
  Authenticated,
  checkout
);

router.post(
  "/verify",
  Authenticated,
  verify
);

router.get(
  "/all",
  getAllPayments
);

export default router;
