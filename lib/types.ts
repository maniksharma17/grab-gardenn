export interface Product {
  id: number;
  name: string;
  hindiName?: string;
  description: string;
  price: number[];
  category: string;
  image: string;
  benefits: string[];
  ingredients: string[];
  storage: string;
  cutoffPrice: number[];
  rating: number;
  variants: string[];
  instructions?: string[];
}

export interface CartItem {
  id: number;
  name: string;
  hindiName?: string;
  description: string;
  price: number;
  category: string;
  image: string;
  cutoffPrice: number;
  rating: number;
  variants: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}