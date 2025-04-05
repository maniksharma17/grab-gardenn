export interface Product {
  _id: string;
  name: string;
  hindiName?: string;
  description: string;
  price: number[];
  cutoffPrice: number[];
  variants: {
    display: string;
    value: number;
  }[];
  images: string[];
  category: string; // or Category type if populated
  benefits: string[];
  ingredients: string[];
  storage: string;
  rating?: number;
  instructions: string[];
  stock: number;
  dimensions: {
    length: number;
    breadth: number;
    height: number;
  }[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
  variant: {
    display: string;
    value: number;
  };
  dimensions: {
    length: number;
    breadth: number;
    height: number;
  };
}


export interface User {
  id: string;
  email: string;
  name: string;
}