import mongoose, { Document } from "mongoose";

// 1️⃣ Enums & Type Aliases
export type PaymentType = "PARTIAL" | "FULL";

// 2️⃣ Embedded Subdocument Type
export interface IProductItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  discount?: number;
}

// 3️⃣ Transaction Interface
export interface ITransaction extends Document {
  customerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  shopId: mongoose.Types.ObjectId;
  actualAmount: number;
  productsList: IProductItem[];
  debtDescription: String[]
  paidAmount: number;
  tax: number;
  flatDiscount: number;
  totalDiscount: number;
  paidThroughCash: number;
  invoiceNumber: string;
  paidThroughAccountBalance: number;
  taxRateApplied?: number;
  previousBalance: number;
  currentBalance: number;
  paymentType: PaymentType;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// 4️⃣ Optional API Response Interface
export interface TransactionResponse {
  message: string;
  data?: ITransaction | ITransaction[];
}
