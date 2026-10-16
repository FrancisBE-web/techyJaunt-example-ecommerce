const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const walletsSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "JPY", "NGN"],
      default: "NGN",
    },
    accountNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const Wallets = mongoose.model("Wallets", walletsSchema);

module.exports = Wallets;
