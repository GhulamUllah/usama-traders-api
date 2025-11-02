// src/modules/Shop/Shop.service.ts

import { CreateShop, DeleteShop, UpdateShop } from "./shop.validators";
import { ShopResponse } from "./shop.types";
import ShopModel from "./shop.schema";
import UserModel from "../auth/auth.schema";
import { AuthRequest } from "../../middleware/auth.middleware";

export const getAllShops = async (): Promise<any> => {
  const shop = await ShopModel.find({ deletedAt: null }).sort({
    createdAt: -1,
  });
  return shop;
};

export const getUserShop = async (user: AuthRequest["user"]): Promise<any> => {
  const shop = await UserModel.findById((user as any).id)
    .populate("assignedShop")
    .sort({ createdAt: -1 });
  return shop;
};

export const createShop = async (data: CreateShop): Promise<any> => {
  const { name = "", createdBy, taxRate } = data;

  const isExists = await ShopModel.findOne({ name });
  if (isExists) {
    throw new Error("Shop with this name already exists");
  }

  const shop = await ShopModel.create({
    name,
    createdBy,
    taxRate,
  });

  return {
    shop,
  };
};

export const updateShop = async (data: UpdateShop): Promise<ShopResponse> => {
  const { name = "", shopId, taxRate } = data;
  const updateObject = {
    $set: { name },
  };
  if (taxRate) {
    (updateObject.$set as any).taxRate = taxRate;
  }
  const update = await ShopModel.findOneAndUpdate(
    { _id: shopId },
    updateObject,
    { new: true },
  );
  if (!update) {
    throw new Error("Unable to update shop");
  }

  return {
    message: "Shop updated successfully",
  };
};

export const deleteShop = async (data: DeleteShop): Promise<ShopResponse> => {
  const { shopId } = data;

  const update = await ShopModel.findOneAndUpdate(
    { _id: shopId },
    {
      $set: { deletedAt: new Date() },
    },
    { new: true },
  );
  if (!update) {
    throw new Error("Unable to delete shop");
  }

  return {
    message: "Shop deleted successfully",
  };
};
