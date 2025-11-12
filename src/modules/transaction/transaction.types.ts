import mongoose, { Document, Types } from "mongoose";

// 1️⃣ Enums & Type Aliases
export type PaymentType = "PARTIAL" | "FULL";
export type DebtStatus = "Paid" | "Unpaid";
export type ReturnStatus = "Processed" | "Pending";

// 2️⃣ Embedded Subdocument Types
export interface IProductItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  retail: number;
  discount?: number;
  returnedQuantity?: number; // tracks total quantity returned
}

export interface IDebt extends mongoose.Types.Subdocument {
  description?: string;
  amount: number;
  status: DebtStatus;
  paidAt?: Date;
}

export interface IReturnTrail extends mongoose.Types.Subdocument {
  productId: mongoose.Types.ObjectId;
  quantity: number;        // number of items returned in this instance
  refundAmount: number;    // total refunded amount for this return
  reason?: string;         // optional reason for return
  returnedBy?: mongoose.Types.ObjectId; // staff/admin who processed return
  returnedAt?: Date;       // date of return
  status?: ReturnStatus;   // processed or pending
}

// 3️⃣ Transaction Interface
export interface ITransaction extends Document {
  customerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  shopId: mongoose.Types.ObjectId;
  actualAmount: number;
  productsList: IProductItem[];
  debt: Types.DocumentArray<IDebt>;
  returnTrail: Types.DocumentArray<IReturnTrail>;
  paidAmount: number;
  totalRefund?: number;
  tax: number;
  flatDiscount: number;
  totalDiscount: number;
  paidThroughCash: number;
  paidThroughAccountBalance: number;
  paymentType: PaymentType;
  taxRateApplied?: number;
  previousBalance: number;
  currentBalance: number;
  invoiceNumber: string;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// 4️⃣ Optional API Response Interface
export interface TransactionResponse {
  message: string;
  data?: ITransaction | ITransaction[];
}
