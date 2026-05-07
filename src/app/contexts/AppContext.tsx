import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Product, CartItem, UserLocation, Shop, Order } from '../types';
import { users, userLocation, shops } from '../data/mockData';

interface AppContextType {
  user: User | null;
  userLocation: UserLocation | null;
  cart: CartItem[];
  compareProducts: Product[];
  nearbyShops: Shop[];
  activeOrders: Order[];
  isLoginOpen: boolean;
  isLocationModalOpen: boolean;
  setUser: (user: User | null) => void;
  setUserLocation: (location: UserLocation | null) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  setIsLoginOpen: (open: boolean) => void;
  setIsLocationModalOpen: (open: boolean) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  requestLocation: () => void;
  calculateDistance: (shopLocation: any) => number;
  getNearbyShops: () => Shop[];
  placeOrder: (shopId: string, deliveryAddress: any) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userCurrentLocation, setUserCurrentLocation] = useState<UserLocation | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Initialize with mock location
  useEffect(() => {
    setUserCurrentLocation({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      address: userLocation.address
    });
    setNearbyShops(shops);
  }, []);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToCompare = (product: Product) => {
    setCompareProducts(prev => {
      if (prev.length >= 4) {
        return prev; // Max 4 products for comparison
      }
      if (prev.find(p => p.id === product.id)) {
        return prev; // Already in comparison
      }
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareProducts([]);
  };

  const login = (email: string, password: string): boolean => {
    // Mock login - in real app this would call an API
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      setIsLoginOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    clearCart();
  };

  const requestLocation = () => {
    // Mock location request - in real app this would use navigator.geolocation
    setIsLocationModalOpen(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          // In real app, reverse geocode to get address
        },
        (error) => {
          console.error('Location error:', error);
          // Use mock location as fallback
          setUserCurrentLocation({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            address: userLocation.address
          });
        }
      );
    }
  };

  const calculateDistance = (shopLocation: any): number => {
    if (!userCurrentLocation) return 0;
    
    // Simple distance calculation (in km)
    const R = 6371; // Earth's radius in km
    const dLat = (shopLocation.latitude - userCurrentLocation.latitude) * Math.PI / 180;
    const dLon = (shopLocation.longitude - userCurrentLocation.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userCurrentLocation.latitude * Math.PI / 180) * Math.cos(shopLocation.latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getNearbyShops = (): Shop[] => {
    if (!userCurrentLocation) return shops;
    
    return shops
      .map(shop => ({
        ...shop,
        distance: calculateDistance(shop.location)
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  };

  const placeOrder = (shopId: string, deliveryAddress: any): string => {
    const orderId = `order_${Date.now()}`;
    const shopItems = cart.filter(item => item.product.shop.id === shopId);
    const shop = shops.find(s => s.id === shopId);
    
    if (!shop || shopItems.length === 0) return '';

    const subtotal = shopItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: orderId,
      userId: user?.id || 'guest',
      shopId,
      items: shopItems,
      subtotal,
      deliveryFee: shop.deliveryFee,
      total: subtotal + shop.deliveryFee,
      status: 'placed',
      deliveryAddress,
      estimatedDeliveryTime: shop.deliveryTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingUpdates: [
        {
          id: '1',
          status: 'placed',
          message: 'Order placed successfully',
          timestamp: new Date().toISOString()
        }
      ]
    };

    setActiveOrders(prev => [...prev, newOrder]);
    
    // Remove ordered items from cart
    setCart(prev => prev.filter(item => !shopItems.find(ordered => ordered.product.id === item.product.id)));
    
    return orderId;
  };

  return (
    <AppContext.Provider value={{
      user,
      userLocation: userCurrentLocation,
      cart,
      compareProducts,
      nearbyShops: getNearbyShops(),
      activeOrders,
      isLoginOpen,
      isLocationModalOpen,
      setUser,
      setUserLocation: setUserCurrentLocation,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      addToCompare,
      removeFromCompare,
      clearCompare,
      setIsLoginOpen,
      setIsLocationModalOpen,
      login,
      logout,
      requestLocation,
      calculateDistance,
      getNearbyShops,
      placeOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};