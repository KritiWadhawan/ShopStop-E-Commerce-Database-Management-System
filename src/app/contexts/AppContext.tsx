import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Product, CartItem, UserLocation, Shop, Order } from '../types';
import { users, userLocation, shops } from '../data/mockData';
import { api, auth } from '../data/api';

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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requestLocation: () => void;
  calculateDistance: (shopLocation: any) => number;
  getNearbyShops: () => Shop[];
  placeOrder: (shopId: string, deliveryAddress: any) => Promise<string>;
  /** Live stock counts from the database, keyed by shop_product.listing_id. */
  liveStock: Record<number, number>;
  /** Re-fetch live stock from the backend. */
  refreshStock: () => Promise<void>;
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

  // Live stock counts from the backend, keyed by listing_id.
  // Falls back to the mockData stockCount when the API is unreachable.
  const [liveStock, setLiveStock] = useState<Record<number, number>>({});

  const refreshStock = async () => {
    try {
      const rows: any[] = await api.products();
      const next: Record<number, number> = {};
      for (const row of rows) {
        if (row.listing_id != null) next[row.listing_id] = Number(row.stock_count);
      }
      setLiveStock(next);
    } catch (err) {
      console.warn('Could not refresh stock from backend:', err);
    }
  };

  // Initialize with mock location + live stock
  useEffect(() => {
    setUserCurrentLocation({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      address: userLocation.address
    });
    setNearbyShops(shops);
    refreshStock();
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Hit the real backend (sets JWT in localStorage via api.ts).
      const apiUser: any = await api.login(email, password);

      // Marry the response with the local mock User (for avatar / addresses).
      const mock = users.find(u => u.email === email);
      const merged: User = {
        id: String(apiUser?.id ?? mock?.id ?? '0'),
        name: apiUser?.name ?? mock?.name ?? 'User',
        email: apiUser?.email ?? email,
        phone: apiUser?.phone ?? mock?.phone ?? '',
        role: (apiUser?.role ?? mock?.role ?? 'buyer') as 'buyer' | 'seller',
        avatar: apiUser?.avatar ?? mock?.avatar,
        location: mock?.location,
        addresses: mock?.addresses ?? [],
        shopId: mock?.shopId,
      };
      setUser(merged);
      setIsLoginOpen(false);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      // Fallback: pure-mock login so the UI demo still works even when the
      // backend is unreachable.
      const foundUser = users.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        setIsLoginOpen(false);
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    auth.setToken(null);
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

  const placeOrder = async (shopId: string, deliveryAddress: any): Promise<string> => {
    const shopItems = cart.filter(item => item.product.shop.id === shopId);
    const shop = shops.find(s => s.id === shopId);

    if (!shop || shopItems.length === 0) return '';

    const subtotal = shopItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // ---- Live DB write through the backend ----
    // Requires the buyer to be logged-in.  The backend's sp_place_order +
    // trg_before_orderitem_insert handle stock validation and decrement
    // atomically.  If any product is over-stocked we get a 400 back here.
    let dbOrderId: number | null = null;
    if (auth.token()) {
      try {
        const items = shopItems
          .filter(it => typeof it.product.listingId === 'number')
          .map(it => ({ listingId: it.product.listingId as number, quantity: it.quantity }));

        if (items.length > 0) {
          const res = await api.orders.placeDirect(
            Number(shopId),
            1,            // address_id 1 is the seeded "Home" address for the demo buyer
            items
          );
          dbOrderId = res?.orderId ?? null;
        }
      } catch (err: any) {
        // Bubble the error up so the Cart can show "Out of stock" etc.
        throw err;
      }
    }

    const orderId = dbOrderId ? `order_${dbOrderId}` : `order_${Date.now()}`;

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
          message: dbOrderId
            ? `Order #${dbOrderId} placed successfully (stock updated in DB)`
            : 'Order placed successfully (offline mode)',
          timestamp: new Date().toISOString()
        }
      ]
    };

    setActiveOrders(prev => [...prev, newOrder]);

    // Remove ordered items from local cart
    setCart(prev => prev.filter(item => !shopItems.find(ordered => ordered.product.id === item.product.id)));

    // Refresh live stock so the UI shows the new (decremented) counts.
    if (dbOrderId) refreshStock();

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
      placeOrder,
      liveStock,
      refreshStock,
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