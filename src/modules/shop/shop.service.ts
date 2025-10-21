// src/modules/Shop/Shop.service.ts

import { CreateShop, DeleteShop, UpdateShop } from './shop.validators';
import { ShopResponse } from './shop.types';
import ShopModel from './shop.schema';

export const getAllShops = async (): Promise<any> => {
  const shop = await ShopModel.find({ deletedAt: null }).sort({ createdAt: -1 });
  return shop
};

export const createShop = async (data: CreateShop): Promise<any> => {
  const { name = '', createdBy } = data;

  const isExists = await ShopModel.findOne({ name, createdBy });
  if (isExists) {
    throw new Error('Shop already exists with this email');
  }

  const shop = await ShopModel.create({
    name,
  });

  return {
    shop,
  };
};

export const updateShop = async (data: UpdateShop): Promise<ShopResponse> => {
  const { name = '', shopId } = data;

  const update = await ShopModel.findOneAndUpdate(
    { _id: shopId },
    {
      $set: { name },
    },
    { new: true },
  );
  if (!update) {
    throw new Error('Unable to update shop');
  }

  return {
    message: 'Shop updated successfully',
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
    throw new Error('Unable to delete shop');
  }

  return {
    message: 'Shop deleted successfully',
  };
};
