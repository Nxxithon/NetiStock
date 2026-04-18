import api from "./api";
import type { InventoryTransaction, InventoryTransactionFormData } from "../types/transaction";

const ENDPOINT = "/InventoryTransactions";

export const getAllTransactions = async (): Promise<InventoryTransaction[]> => {
  const response = await api.get<InventoryTransaction[]>(ENDPOINT);
  return response.data;
};

export const createTransaction = async (data: InventoryTransactionFormData): Promise<InventoryTransaction> => {
  const response = await api.post<InventoryTransaction>(ENDPOINT, data);
  return response.data;
};

export const confirmTransaction = async (id: number, actionBy: string): Promise<void> => {
  await api.put(`${ENDPOINT}/${id}/confirm`, null, {
    params: { actionBy },
  });
};

export const cancelTransaction = async (id: number, actionBy: string, reason?: string): Promise<void> => {
  await api.put(`${ENDPOINT}/${id}/cancel`, null, {
    params: { actionBy, reason },
  });
};
