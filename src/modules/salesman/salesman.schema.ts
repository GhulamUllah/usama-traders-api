// src/modules/Customer/Customer.model.ts

import mongoose, { Schema, Model } from "mongoose";
import { ISalesman } from "./salesman.types";


// Sub-schema for monthly record (hidden by default)
const monthlyRecordSchema = new Schema(
  {
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    month: { type: String, default: null },
  },
  {
    _id: false,
    select: false // hides the entire array by default
  }
);

const balanceTrail = new Schema(
  {
    updatedBy: { type: String, default: null },
    balance: { type: Number, default: 0 },
    reason: { type: String, default: "" }
  },
  {
    select: false,
    timestamps: true
  }
);



const salesmanSchema: Schema<ISalesman> = new Schema<ISalesman>(
  {
    name: {
      type: String,
      minlength: [3, "Name must be at least 3 characters"],
      trim: true,
      default: "",
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: [true, "Phone number is required"],
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    balanceTrail: [balanceTrail],
    // Uses the hidden monthly record schema
    monthlyRecord: [monthlyRecordSchema],

    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Index for fast text search
salesmanSchema.index({ name: "text", phoneNumber: "text" });

// Soft delete middleware (auto exclude deleted)
salesmanSchema.pre('find', function (next) {
  this.where({ deletedAt: null });
  next();
});

const SalesmanModel: Model<ISalesman> =
  mongoose.models.Salesman ||
  mongoose.model<ISalesman>("Salesman", salesmanSchema);

export default SalesmanModel;
