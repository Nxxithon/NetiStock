export interface Product {
  id: number;
  code: string;
  name: string;
  description: string | null;
  currentStock: number;
}

export interface ProductFormData {
  code: string;
  name: string;
  description: string;
  currentStock: number;
}
