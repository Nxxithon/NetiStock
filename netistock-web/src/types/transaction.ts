import type { Product } from "./product";

export type TransactionType = "RECEIVE" | "WITHDRAW";
export type TransactionStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface InventoryTransaction {
  id: number;
  productId: number;
  productCode?: string;
  productName?: string;
  transactionType: TransactionType;
  quantity: number;
  transactionDate: string;
  referenceNo?: string;
  partnerName?: string;
  status: TransactionStatus;
  actionBy?: string;
  remark?: string;
}

export interface InventoryTransactionFormData {
  productId: number;
  transactionType: TransactionType;
  quantity: number;
  referenceNo?: string;
  partnerName?: string;
  remark?: string;
  actionBy: string;
}
