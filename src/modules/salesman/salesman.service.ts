// src/modules/Customer/Customer.service.ts

import {
  CreateSalesman,
  DeleteSalesman,
  GetSalesmanById,
  ResetSalesman,
  UpdateSalesman,
} from "./salesman.validators";
import { SalesmanResponse } from "./salesman.types";
import SalesmanModel from "./salesman.schema";
import dayjs from "dayjs";


export const getAllSalesman = async (): Promise<any> => {
  const Salesman = await SalesmanModel.find({ deletedAt: null }).sort({
    createdAt: -1,
  });
  return Salesman;
};

export const getSalesmanById = async (data: GetSalesmanById): Promise<any> => {
  const Salesman = await SalesmanModel.findById(data.salesmanId).select("+balanceTrail").sort({ "balanceTrail.createdAt": -1 })
  return Salesman;
};


export const createSalesman = async (data: CreateSalesman): Promise<any> => {
  const { name = "", phoneNumber } = data;

  const isExists = await SalesmanModel.findOne({ phoneNumber });
  if (isExists) {
    throw new Error("Customer already exists with this email");
  }

  const Salesman = await SalesmanModel.create({
    name,
    phoneNumber,
  });

  return {
    Salesman,
  };
};

export const updateSalesman = async (
  data: UpdateSalesman, user: any
): Promise<SalesmanResponse> => {
  const { name = "", salesmanId, balance, reason } = data;

  const update = await SalesmanModel.findOneAndUpdate(
    { _id: salesmanId },
    {
      $set: { name, balance },
      $inc: { totalSpent: balance },
      $push: { balanceTrail: { balance, updatedBy: user.name, reason } }
    },
    { new: true },
  );
  if (!update) {
    throw new Error("Unable to update Salesman");
  }

  return {
    message: "Salesman updated successfully",
  };
};


export const resetSalesman = async (data: ResetSalesman, user: any) => {
  const { salesmanId } = data;
  console.log({ salesmanId })
  // Get current state first
  const salesman = await SalesmanModel.findById(salesmanId).select("+monthlyRecord");
  if (!salesman) {
    throw new Error("Salesman not found");
  }

  const { balance, totalSpent, totalOrders } = salesman;

  // Prepare monthly record entry
  const monthName = dayjs().format("MMMM YYYY"); // e.g. "November 2025"

  const monthlyRecordEntry = {
    balance,
    totalSpent,
    totalOrders,
    month: monthName,
  };

  // Perform atomic update
  await SalesmanModel.findByIdAndUpdate(
    salesmanId,
    {
      $push: { monthlyRecord: monthlyRecordEntry, balanceTrail: { balance: 0, reason: "Balance Cycle Reset", updatedBy: user?.name } },
      $set: {
        balance: 0,
        totalSpent: 0,
        totalOrders: 0,
      },
    },
    { new: true }
  );

  return {
    message: "Salesman has been reset & monthly record stored successfully",
  };
};


export const deleteSalesman = async (
  data: DeleteSalesman,
): Promise<SalesmanResponse> => {
  const { salesmanId } = data;

  const update = await SalesmanModel.findOneAndUpdate(
    { _id: salesmanId },
    {
      $set: { deletedAt: new Date() },
    },
    { new: true },
  );
  if (!update) {
    throw new Error("Unable to delete Salesman");
  }

  return {
    message: "Customer deleted successfully",
  };
};
