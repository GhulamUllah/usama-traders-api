// src/modules/Product/Product.model.ts

import mongoose, { Schema, Model } from 'mongoose';
import { IProduct } from './product.types';

const productSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    name: {
      type: String,
      minlength: [3, 'Name must be at least 3 characters'],
      trim: true,
      unique: true,
      required: [true, 'Product Name is Required'],
      lowercase: true
    },
    inStock: {
      type: Number,
      required: [true, 'Total stock is required'],
    },
    price: {
      type: Number,
      required: true
    },
    discount:{
      type: Number,
      default: 0
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    createdIn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop"
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
productSchema.pre('find', function (next) {
  this.where({ deletedAt: null });
  next();
});
export default ProductModel;
