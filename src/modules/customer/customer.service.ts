// src/modules/Customer/Customer.service.ts

import {
  CreateCustomer,
  DeleteCustomer,
  UpdateCustomer,
} from "./customer.validators";
import { CostumerResponse } from "./customer.types";
import CustomerModel from "./customer.schema";

export const getAllCustomers = async (): Promise<any> => {
  const customer = await CustomerModel.find({ deletedAt: null }).sort({
    createdAt: -1,
  });
  return customer;
};

export const createCostumer = async (data: CreateCustomer): Promise<any> => {
  const { name = "", phoneNumber } = data;

  const isExists = await CustomerModel.findOne({ phoneNumber });
  if (isExists) {
    throw new Error("Customer already exists with this email");
  }

  const customer = await CustomerModel.create({
    name,
    phoneNumber,
  });

  return {
    customer,
  };
};

export const updateCustomer = async (
  data: UpdateCustomer,
): Promise<CostumerResponse> => {
  const { name = "", costumerId } = data;

  const update = await CustomerModel.findOneAndUpdate(
    { _id: costumerId },
    {
      $set: { name },
    },
    { new: true },
  );
  if (!update) {
    throw new Error("Unable to update customer");
  }

  return {
    message: "Customer updated successfully",
  };
};

export const deleteCustomer = async (
  data: DeleteCustomer,
): Promise<CostumerResponse> => {
  const { costumerId } = data;

  const update = await CustomerModel.findOneAndUpdate(
    { _id: costumerId },
    {
      $set: { deletedAt: new Date() },
    },
    { new: true },
  );
  if (!update) {
    throw new Error("Unable to delete customer");
  }

  return {
    message: "Customer deleted successfully",
  };
};
