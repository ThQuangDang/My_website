const express = require("express")
const {
  createPayment,
  returnPayment,
  inpPayment,
} = require("../controllers/PaymentController.js")

const PaymentRouter = express.Router();

PaymentRouter.post("/create", createPayment);
PaymentRouter.get("/vnpay_return", returnPayment);
PaymentRouter.get("/vnpay_ipn", inpPayment);

module.exports = PaymentRouter