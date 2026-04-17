export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  weight: number;
  purity: string;
  description: string;
  details: string;
  icon: string;
  color: string;
  image?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface GoldRate {
  type: string;
  price: number;
  change: number;
  unit: string;
}

export interface Appointment {
  id: number;
  name: string;
  date: string;
  time: string;
  service: string;
}