// src/modules/shop/shop.model.ts

import mongoose, { Schema, Model } from "mongoose";
import { IBusiness } from "./business-expense.types";

const businessSchema: Schema<IBusiness> = new Schema<IBusiness>(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const BusinessModel: Model<IBusiness> =
  mongoose.models.BusinessExpense || mongoose.model<IBusiness>("BusinessExpense", businessSchema);
businessSchema.pre("find", function (next) {
  this.where({ deletedAt: null });
  next();
},
);
export default BusinessModel;
