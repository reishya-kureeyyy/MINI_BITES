export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: 'Cake & Tartlet' | 'Mousse & Pudding' | 'Macaron & Choux' | 'Healthy Sweet';
  image: string;
  rating: number;
  reviewsCount: number;
  ingredients: string[];
  calories: number;
  size: string;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  paymentMethod: 'qris' | 'va_bca' | 'va_mandiri' | 'credit_card';
  deliveryService: 'instant' | 'sameday' | 'regular';
  promoCode?: string;
  notes?: string;
}

export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  description: string;
}
