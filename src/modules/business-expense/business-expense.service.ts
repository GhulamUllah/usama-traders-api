// src/modules/Business/Business.service.ts

import { AuthRequest } from "../../middleware/auth.middleware";
import BusinessModel from "./business-expense.schema";
import { BusinessResponse } from "./business-expense.types";
import { CreateBusiness, DeleteBusiness, UpdateBusiness } from "./business-expense.validators";

export const getAllBusinessExpense = async (): Promise<any> => {
  const business = await BusinessModel.find({ deletedAt: null }).sort({
    createdAt: -1,
  }).populate("createdBy", "-_id name");
  return business;
};

export const createBusiness = async (data: CreateBusiness, user: AuthRequest["user"]): Promise<any> => {

  const business = await BusinessModel.create({
    ...data,
    createdBy: (user as any).id
  });

  return {
    business,
  };
};

export const updateBusiness = async (data: UpdateBusiness, user: AuthRequest["user"]): Promise<any> => {

  const business = await BusinessModel.findByIdAndUpdate(data.id, {
    $set: {
      amount: data.amount,
      description: data.description,
      createdBy: (user as any).id
    }
  });

  return {
    business,
  };
};

export const deleteBusiness = async (data: DeleteBusiness): Promise<BusinessResponse> => {
  const { expenseId } = data;

  const update = await BusinessModel.findOneAndUpdate(
    { _id: expenseId },
    {
      $set: { deletedAt: new Date() },
    },
    { new: true },
  );
  if (!update) {
    throw new Error("Unable to delete Business");
  }

  return {
    message: "Business deleted successfully",
  };
};
