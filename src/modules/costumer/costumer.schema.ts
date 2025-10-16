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
    balance: {
      type: Number,
      default: 0,
    },
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
