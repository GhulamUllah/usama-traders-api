import mongoose, { Schema, Document, Model } from 'mongoose';
import { ITransaction } from './transaction.types';

// 3️⃣ Schema Definition
const transactionSchema: Schema<ITransaction> = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    performer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// 4️⃣ Compound Index (Optional, improves reporting)
transactionSchema.index({ customerId: 1, createdAt: -1 });

// 5️⃣ Auto-filter soft deleted documents
transactionSchema.pre('find', function (next) {
  this.where({ deletedAt: null });
  next();
});
transactionSchema.pre('findOne', function (next) {
  this.where({ deletedAt: null });
  next();
});

// 6️⃣ Create Model
const TransactionModel: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema);

export default TransactionModel;
