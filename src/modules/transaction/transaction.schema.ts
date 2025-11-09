import mongoose, { Schema, Model, Query } from "mongoose";
import { ITransaction } from "./transaction.types";

// Schema Definition
const transactionSchema = new Schema<ITransaction>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    invoiceNumber: {
      type: String,
      unique: true,
      index: true,
    },
    actualAmount: {
      type: Number,
      required: true,
    },
    productsList: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        retail: {
          type: Number,
          required: true,
        },
        discount: {
          type: Number,
          default: 0,
        },
      },
    ],
    paidAmount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    flatDiscount: {
      type: Number,
      default: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    paidThroughCash: {
      type: Number,
      default: 0,
    },
    paidThroughAccountBalance: {
      type: Number,
      default: 0,
    },
    paymentType: {
      type: String,
      enum: ["PARTIAL", "FULL"],
      required: true,
    },
    taxRateApplied: {
      type: Number,
      default: 0,
    },
    previousBalance: {
      type: Number,
      required: true,
    },
    currentBalance: {
      type: Number,
      required: true,
    },
    debtDescription: [String],
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Compound Index
transactionSchema.index({ customerId: 1, createdAt: -1 });
// ✅ Auto-generate invoice number before save
transactionSchema.pre("save", async function (next) {
  if (this.invoiceNumber) return next(); // already set

  const TransactionModel = mongoose.model<ITransaction>("Transaction");
  const shopId = this.shopId;

  const lastTransaction = await TransactionModel.findOne()
    .sort({ createdAt: -1 })
    .select("invoiceNumber")
    .lean();

  let nextNumber = 1;
  if (lastTransaction?.invoiceNumber) {
    const match = lastTransaction.invoiceNumber.match(/(\d+)$/);
    if (match) nextNumber = parseInt(match[1], 10) + 1;
  }
  console.log(nextNumber, lastTransaction, shopId)
  this.invoiceNumber = `INV-${String(nextNumber).padStart(5, "0")}`;
  next();
});
// Auto-filter soft-deleted documents — ✅ Type-safe version
transactionSchema.pre<Query<any, any>>("find", function (next) {
  this.where({ deletedAt: null });
  next();
});

transactionSchema.pre<Query<any, any>>("findOne", function (next) {
  this.where({ deletedAt: null });
  next();
});

// Model
const TransactionModel: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", transactionSchema);

export default TransactionModel;
