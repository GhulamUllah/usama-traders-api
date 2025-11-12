// src/modules/Product/Product.service.ts

import {
  CreateProduct,
  DeleteProduct,
  GetProduct,
  UpdateProduct,
} from "./product.validators";
import { ProductResponse } from "./product.types";
import ProductModel from "./product.schema";
import mongoose from "mongoose";
import ShopModel from "../shop/shop.schema";

export const getAllProducts = async (data: GetProduct): Promise<any> => {
  const product = await ProductModel.find({
    deletedAt: null,
    createdIn: new mongoose.Types.ObjectId(data.shopId as string),
  }).sort({ createdAt: -1 });
  return product;
};

export const createProduct = async (data: CreateProduct): Promise<any> => {
  const { name } = data;
  const session = await mongoose.connection.startSession();
  session.startTransaction();
  try {
    const isExists = await ProductModel.findOne({ name }).session(session);
    if (isExists) {
      throw new Error("Product already exists with this name");
    }
    const payload = {
      name: data.name,
      inStock: data.inStock,
      price: data.price,
      retail: data.retail,
      discount: data.discount,
      createdBy: new mongoose.Types.ObjectId(data.createdBy as string),
      createdIn: new mongoose.Types.ObjectId(data.createdIn as string),
    };
    const product = await ProductModel.create([payload], { session: session });
    await ShopModel.findByIdAndUpdate(data.createdIn, {
      $inc: { totalProducts: 1 },
    }).session(session);
    await session.commitTransaction();
    return {
      product,
    };
  } catch (error: any) {
    await session.abortTransaction();
    throw new Error(error);
  } finally {
    session.endSession();
  }
};

export const updateProduct = async (
  data: UpdateProduct,
): Promise<ProductResponse> => {
  const { productId, discount, inStock, price, retail } = data;

  const update = await ProductModel.findOneAndUpdate(
    { _id: productId },
    {
      $set: { discount, price, retail },
      $inc: { inStock: inStock }
    },
    { new: true },
  );
  if (!update) {
    throw new Error("Unable to update product");
  }

  return {
    message: "Product updated successfully",
  };
};

export const deleteProduct = async (
  data: DeleteProduct,
): Promise<ProductResponse> => {
  const { productId } = data;

  const update = await ProductModel.findOneAndUpdate(
    { _id: productId },
    {
      $set: { deletedAt: new Date() },
    },
    { new: true },
  );
  if (!update) {
    throw new Error("Unable to delete product");
  }

  return {
    message: "Product deleted successfully",
  };
};
