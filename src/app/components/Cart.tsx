import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, placeOrder, user, userLocation, setIsLoginOpen } = useApp();

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over ₹100
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    // Backend stock check requires login. Prompt if not signed in.
    if (!user) {
      alert('Please sign in to place an order so we can update real stock in the database.');
      onClose();
      setIsLoginOpen(true);
      return;
    }

    // Group cart items by shop and place a separate order per shop
    const shopIds = Array.from(new Set(cart.map((item) => item.product.shop.id)));

    const deliveryAddress = user?.addresses?.[0] || {
      id: 'guest',
      label: 'Home',
      address: userLocation?.address || 'Bandra West, Mumbai',
      location: {
        latitude: userLocation?.latitude || 19.076,
        longitude: userLocation?.longitude || 72.8777,
        address: userLocation?.address || 'Bandra West, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400050',
      },
      isDefault: true,
    };

    const placed: string[] = [];
    const failed: string[] = [];

    for (const shopId of shopIds) {
      try {
        const id = await placeOrder(shopId, deliveryAddress);
        if (id) placed.push(id);
      } catch (err: any) {
        failed.push(err?.message || 'Unknown error');
      }
    }

    if (failed.length > 0) {
      alert(
        `❌ Could not place ${failed.length} order(s):\n\n${failed.join('\n')}\n\n` +
          (placed.length > 0
            ? `${placed.length} other order(s) placed successfully.`
            : 'Please reduce the quantity and try again.')
      );
    } else if (placed.length > 0) {
      alert(
        `✅ ${placed.length} order${
          placed.length > 1 ? 's' : ''
        } placed successfully! Stock has been updated in the database. Track them from the 🚚 icon in the header.`
      );
    }

    if (placed.length > 0) onClose();
  };

  if (cart.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shopping Cart
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-96">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3>Your cart is empty</h3>
            <p className="text-muted-foreground text-center mt-2">
              Browse our products and add items to your cart
            </p>
            <Button className="mt-4" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Shopping Cart
              <Badge className="ml-2">{cart.length}</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto">
          <div className="space-y-4 py-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <ImageWithFallback
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="truncate">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                  <p className="font-semibold">₹{item.product.price}</p>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.product.id)}
                    className="h-6 w-6 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="h-6 w-6"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="h-6 w-6"
                      disabled={item.quantity >= item.product.stockCount}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};