// src/modules/shop/shop.model.ts

import mongoose, { Schema, Model } from 'mongoose';
import { IShop } from './shop.types';

const shopSchema: Schema<IShop> = new Schema<IShop>(
  {
    name: {
      type: String,
      minlength: [3, 'Name must be at least 3 characters'],
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const ShopModel: Model<IShop> =
  mongoose.models.Shop || mongoose.model<IShop>('Shop', shopSchema);
shopSchema.index({ name: 'text', phoneNumber: 'text' });
shopSchema.pre('find', function (next) {
  this.where({ deletedAt: null });
  next();
});
export default ShopModel;
