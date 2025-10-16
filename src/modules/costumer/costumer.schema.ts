// src/modules/Costumer/Costumer.model.ts

import mongoose, { Schema, Model } from 'mongoose';
import { ICostumer } from './costumer.types';

const costumerSchema: Schema<ICostumer> = new Schema<ICostumer>(
  {
    name: {
      type: String,
      minlength: [3, 'Name must be at least 3 characters'],
      trim: true,
      default: '',
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: [true, 'Phone number is required'],
      unique: true,
    },
    balance: [
      {
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        description: {
          type: String,
          trim: true,
          default: '',
        },
        type: {
          type: String,
          enum: ['credit', 'debit'],
          required: true,
        },
      },
    ],
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const CostumerModel: Model<ICostumer> =
  mongoose.models.Costumer || mongoose.model<ICostumer>('Costumer', costumerSchema);
costumerSchema.index({ name: 'text', phoneNumber: 'text' });
costumerSchema.pre('find', function (next) {
  this.where({ deletedAt: null });
  next();
});
export default CostumerModel;
