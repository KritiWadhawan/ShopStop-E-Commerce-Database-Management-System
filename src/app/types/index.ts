export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  image: string;
  location: Location;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openHours: {
    open: string;
    close: string;
  };
  deliveryTime: string; // e.g., "10-20 min"
  deliveryFee: number;
  minOrderAmount: number;
  phone: string;
  categories: string[];
  distance?: number; // calculated based on user location
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  brand: string;
  description: string;
  features: string[];
  rating: number;
  reviewCount: number;
  shop: Shop;
  inStock: boolean;
  stockCount: number;
  deliveryTime: string;
  unit?: string; // e.g., "500ml", "1kg"
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller';
  avatar?: string;
  location?: Location;
  addresses: Address[];
  shopId?: string; // for sellers
}

export interface Address {
  id: string;
  label: string; // Home, Work, etc.
  address: string;
  location: Location;
  isDefault: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle: string;
  currentLocation: Location;
}

export interface Order {
  id: string;
  userId: string;
  shopId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  deliveryPerson?: DeliveryPerson;
  createdAt: string;
  updatedAt: string;
  trackingUpdates: TrackingUpdate[];
}

export interface TrackingUpdate {
  id: string;
  status: Order['status'];
  message: string;
  timestamp: string;
  location?: Location;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}