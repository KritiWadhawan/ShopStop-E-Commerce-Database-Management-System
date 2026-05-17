import React from 'react';
import { X, Phone, MapPin, Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';
import { useApp } from '../contexts/AppContext';

interface OrderTrackingProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusSteps = [
  { key: 'placed', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'preparing', label: 'Preparing', icon: Clock },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle }
];

export const OrderTracking: React.FC<OrderTrackingProps> = ({ isOpen, onClose }) => {
  const { activeOrders } = useApp();

  const getStatusProgress = (status: string) => {
    const statusIndex = statusSteps.findIndex(step => step.key === status);
    return ((statusIndex + 1) / statusSteps.length) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'bg-blue-500';
      case 'confirmed': return 'bg-green-500';
      case 'preparing': return 'bg-orange-500';
      case 'out_for_delivery': return 'bg-emerald-500';
      case 'delivered': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  if (activeOrders.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Track Orders
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-96">
            <Truck className="h-16 w-16 text-muted-foreground mb-4" />
            <h3>No active orders</h3>
            <p className="text-muted-foreground text-center mt-2">
              Your current orders will appear here for tracking
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
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2" />
            Track Orders ({activeOrders.length})
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4 overflow-auto">
          {activeOrders.map((order) => (
            <Card key={order.id} className="border border-gray-200">
              <CardContent className="p-4 space-y-4">
                {/* Order Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Order #{order.id.slice(-8)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} items • ₹{order.total.toFixed(2)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress value={getStatusProgress(order.status)} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Placed</span>
                    <span>Delivered</span>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-2">
                  {statusSteps.map((step, index) => {
                    const isCompleted = statusSteps.findIndex(s => s.key === order.status) >= index;
                    const isCurrent = step.key === order.status;
                    const IconComponent = step.icon;
                    
                    return (
                      <div key={step.key} className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-white" />
                          ) : (
                            <IconComponent className="h-3 w-3 text-gray-600" />
                          )}
                        </div>
                        <span className={`text-sm ${
                          isCurrent ? 'font-medium' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* ETA */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Estimated Delivery</span>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      {order.estimatedDeliveryTime}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Shop
                  </Button>
                  {order.status === 'out_for_delivery' && (
                    <Button size="sm" variant="outline" className="flex-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      Live Track
                    </Button>
                  )}
                </div>

                {/* Items */}
                <div className="border-t pt-3">
                  <p className="text-sm font-medium mb-2">Items ({order.items.length})</p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 py-1">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ${item.product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};