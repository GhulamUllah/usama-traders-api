// src/modules/shop/shop.model.ts

import mongoose, { Schema, Model } from "mongoose";
import { ISalaries } from "./salaries.types";

const businessSchema: Schema<ISalaries> = new Schema<ISalaries>(
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
      ref: 'User',
    },
    createdFor: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'createdForModel',
    },
    createdForModel: {
      type: String,
      enum: ["Customer", "Salesman"],
      required: true
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const SalaryModel: Model<ISalaries> =
  mongoose.models.Salaries || mongoose.model<ISalaries>("Salaries", businessSchema);
businessSchema.pre("find", function (next) {
  this.where({ deletedAt: null });
  next();
},
);
export default SalaryModel;
