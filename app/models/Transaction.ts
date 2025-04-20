import mongoose, { Schema, models } from "mongoose";

const TransactionSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String, // could be Date, but for simplicity let's keep string for now
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const Transaction = models.Transaction || mongoose.model("Transaction", TransactionSchema);
export default Transaction;
