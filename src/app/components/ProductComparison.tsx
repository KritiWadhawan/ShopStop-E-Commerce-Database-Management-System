import React from 'react';
import { X, Star, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';

interface ProductComparisonProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({ isOpen, onClose }) => {
  const { compareProducts, removeFromCompare, clearCompare, addToCart } = useApp();

  if (compareProducts.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-4xl">
          <SheetHeader>
            <SheetTitle>Product Comparison</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center h-96">
            <div className="text-6xl mb-4">⚖️</div>
            <h3>No products to compare</h3>
            <p className="text-muted-foreground text-center mt-2">
              Add products to compare their features and specifications
            </p>
            <Button className="mt-4" onClick={onClose}>
              Browse Products
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const comparisonFeatures = [
    'Price',
    'Brand',
    'Rating',
    'Reviews',
    'Stock',
    'Features'
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-7xl">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div>
              Product Comparison ({compareProducts.length})
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompare}
              className="text-destructive hover:text-destructive"
            >
              Clear All
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-auto h-full pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {compareProducts.map((product) => (
              <Card key={product.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute top-2 right-2 h-6 w-6 z-10"
                >
                  <X className="h-3 w-3" />
                </Button>

                <CardHeader className="pb-3">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded"
                  />
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="line-clamp-2">{product.name}</h4>
                  </div>

                  {/* Price Comparison */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Price</p>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Brand */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Brand</p>
                    <p className="text-sm">{product.brand}</p>
                  </div>

                  {/* Rating */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Rating</p>
                    <div className="flex items-center space-x-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Availability</p>
                    {product.inStock ? (
                      <Badge variant="secondary" className="text-xs">
                        In Stock ({product.stockCount})
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Out of Stock
                      </Badge>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Key Features</p>
                    <ul className="text-sm space-y-1">
                      {product.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-1">•</span>
                          <span className="text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <Button
                    className="w-full"
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Winner Analysis */}
          {compareProducts.length > 1 && (
            <Card className="mt-6">
              <CardHeader>
                <h3>Quick Comparison Summary</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-green-600 mb-1">Best Price</p>
                    <p className="text-sm">
                      {compareProducts.reduce((min, product) => 
                        product.price < min.price ? product : min
                      ).name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ₹{Math.min(...compareProducts.map(p => p.price))}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-blue-600 mb-1">Highest Rated</p>
                    <p className="text-sm">
                      {compareProducts.reduce((max, product) => 
                        product.rating > max.rating ? product : max
                      ).name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.max(...compareProducts.map(p => p.rating))}★
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-emerald-600 mb-1">Most Reviews</p>
                    <p className="text-sm">
                      {compareProducts.reduce((max, product) => 
                        product.reviewCount > max.reviewCount ? product : max
                      ).name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.max(...compareProducts.map(p => p.reviewCount)).toLocaleString()} reviews
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};