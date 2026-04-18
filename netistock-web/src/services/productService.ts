import api from "./api";
import type { Product, ProductFormData } from "../types/product";

const ENDPOINT = "/Product";

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>(ENDPOINT);
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await api.get<Product>(`${ENDPOINT}/${id}`);
  return response.data;
};

export const createProduct = async (data: ProductFormData): Promise<void> => {
  await api.post(ENDPOINT, data);
};

export const updateProduct = async (id: number, data: ProductFormData): Promise<void> => {
  await api.put(`${ENDPOINT}/${id}`, data);
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`${ENDPOINT}/${id}`);
};
