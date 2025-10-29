// src/modules/Product/Product.service.ts

import { CreateProduct, DeleteProduct, GetProduct, UpdateProduct } from './product.validators';
import { ProductResponse } from './product.types';
import ProductModel from './product.schema';
import mongoose from 'mongoose';

export const getAllProducts = async (data: GetProduct): Promise<any> => {
  const product = await ProductModel.find({ deletedAt: null, createdIn: new mongoose.Types.ObjectId(data.shopId as string) }).sort({ createdAt: -1 });
  return product
};

export const createProduct = async (data: CreateProduct): Promise<any> => {
  const { name } = data;

  const isExists = await ProductModel.findOne({ name });
  if (isExists) {
    throw new Error('Product already exists with this name');
  }
  const payload = {
    name: data.name,
    inStock: data.inStock,
    price: data.price,
    discount: data.discount,
    createdBy: new mongoose.Types.ObjectId(data.createdBy as string),
    createdIn: new mongoose.Types.ObjectId(data.createdIn as string)
  }
  const product = await ProductModel.create(payload);
  return {
    product,
  };
};

export const updateProduct = async (data: UpdateProduct): Promise<ProductResponse> => {
  const { productId, ...rest } = data;

  const update = await ProductModel.findOneAndUpdate(
    { _id: productId },
    {
      $set: { ...rest },
    },
    { new: true },
  );
  if (!update) {
    throw new Error('Unable to update product');
  }

  return {
    message: 'Product updated successfully',
  };
};

export const deleteProduct = async (data: DeleteProduct): Promise<ProductResponse> => {
  const { productId } = data;

  const update = await ProductModel.findOneAndUpdate(
    { _id: productId },
    {
      $set: { deletedAt: new Date() },
    },
    { new: true },
  );
  if (!update) {
    throw new Error('Unable to delete product');
  }

  return {
    message: 'Product deleted successfully',
  };
};
