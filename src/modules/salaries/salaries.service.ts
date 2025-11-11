// src/modules/Salaries/Salaries.service.ts

import { AuthRequest } from "../../middleware/auth.middleware";
import SalariesModel from "./salaries.schema";
import { SalariesResponse } from "./salaries.types";
import { CreateSalaries, DeleteSalaries } from "./salaries.validators";

export const getAllSalariesExpense = async (): Promise<any> => {
  const salary = await SalariesModel.find({ deletedAt: null }).sort({
    createdAt: -1,
  }).populate("createdBy", '-_id name').populate("createdFor", '-_id name');
  return salary;
};

export const createSalaries = async (data: CreateSalaries, user: AuthRequest["user"]): Promise<any> => {

  const salary = await SalariesModel.create({
    ...data,
    createdBy: (user as any).id
  });

  return {
    salary,
  };
};

export const deleteSalaries = async (data: DeleteSalaries): Promise<SalariesResponse> => {
  const { salaryId } = data;

  const update = await SalariesModel.findOneAndUpdate(
    { _id: salaryId },
    {
      $set: { deletedAt: new Date() },
    },
    { new: true },
  );
  if (!update) {
    throw new Error("Unable to delete Salaries");
  }

  return {
    message: "Salaries deleted successfully",
  };
};
