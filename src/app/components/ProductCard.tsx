import React, { useState } from 'react';
import { Star, ShoppingCart, Scale, Heart, MapPin, Clock, Store, Truck, Eye, Zap, TrendingDown, TrendingUp } from 'lucide-react';
import { Product } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardFooter } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';
import { getProductVariants } from '../data/mockData';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onViewShop?: (shopId: string) => void;
  showComparison?: boolean;
  comparisonData?: Product[];
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onViewProduct, 
  onViewShop,
  showComparison = false,
  comparisonData = []
}) => {
  const { addToCart, addToCompare, compareProducts } = useApp();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showPriceComparison, setShowPriceComparison] = useState(false);

  const isInCompare = compareProducts.some(p => p.id === product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;
  const savingsAmount = hasDiscount ? product.originalPrice! - product.price : 0;

  // Get price comparison data
  const variants = getProductVariants(product.name);
  const hasMultipleSellers = variants.length > 1;
  const lowestPrice = hasMultipleSellers ? Math.min(...variants.map(v => v.price)) : product.price;
  const highestPrice = hasMultipleSellers ? Math.max(...variants.map(v => v.price)) : product.price;
  const isLowestPrice = product.price === lowestPrice;
  const priceRank = variants.findIndex(v => v.id === product.id) + 1;

  // Format price in Indian style
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <Card className="group relative h-full flex flex-col glass-card hover-lift border-0 overflow-hidden">
      <CardContent className="p-0 relative">
        {/* Image Container with Enhanced Hover Effects */}
        <div className="relative overflow-hidden" onClick={() => onViewProduct(product)}>
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 cursor-pointer ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsImageLoaded(true)}
            />
            
            {/* Loading Shimmer */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
            )}
          </div>
          
          {/* Premium Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {hasDiscount && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-2 py-1 rounded-lg shadow-lg">
                -{discountPercentage}% OFF
              </Badge>
            )}
            {isLowestPrice && hasMultipleSellers && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-2 py-1 rounded-lg shadow-lg">
                <TrendingDown className="h-3 w-3 mr-1" />
                Lowest Price
              </Badge>
            )}
            {product.rating >= 4.5 && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-semibold px-2 py-1 rounded-lg shadow-lg">
                ⭐ Top Rated
              </Badge>
            )}
          </div>

          {/* Delivery Time Badge */}
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium px-2 py-1 rounded-lg shadow-lg">
            <Zap className="h-3 w-3 mr-1" />
            {product.deliveryTime}
          </Badge>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <div className="flex space-x-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full shadow-lg bg-white/90 hover:bg-white backdrop-blur-sm border-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProduct(product);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className={`h-10 w-10 rounded-full shadow-lg backdrop-blur-sm border-0 ${
                  isWishlisted 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-white/90 hover:bg-white text-gray-700'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsWishlisted(!isWishlisted);
                }}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              {hasMultipleSellers && (
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full shadow-lg bg-white/90 hover:bg-white backdrop-blur-sm border-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPriceComparison(!showPriceComparison);
                  }}
                >
                  <Scale className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Product Name & Unit */}
          <div>
            <h3 
              className="line-clamp-2 font-semibold text-gray-900 dark:text-white hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer" 
              onClick={() => onViewProduct(product)}
            >
              {product.name}
            </h3>
            {product.unit && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.unit}</p>
            )}
          </div>

          {/* Shop Info */}
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
              <Store className="h-3 w-3" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewShop?.(product.shop.id);
                }}
                className="hover:underline font-medium truncate max-w-28"
              >
                {product.shop.name}
              </button>
            </div>
            {product.shop.distance && (
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <span>•</span>
                <MapPin className="h-3 w-3 ml-1 mr-1" />
                <span className="text-xs">{product.shop.distance.toFixed(1)}km</span>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                  {formatPrice(product.originalPrice!)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Save {formatPrice(savingsAmount)}
              </p>
            )}

            {/* Price Comparison Info */}
            {hasMultipleSellers && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    Available at {variants.length} shops
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPriceComparison(!showPriceComparison);
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {showPriceComparison ? 'Hide' : 'Compare'} prices
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatPrice(lowestPrice)} - {formatPrice(highestPrice)}
                  </span>
                  {isLowestPrice ? (
                    <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">
                      Best Price
                    </Badge>
                  ) : (
                    <span className="text-orange-600 dark:text-orange-400 font-medium">
                      #{priceRank} of {variants.length}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Expanded Price Comparison */}
            {showPriceComparison && hasMultipleSellers && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2 shadow-lg">
                <h4 className="text-sm font-semibold mb-2">Price Comparison</h4>
                {variants.slice(0, 3).map((variant, index) => (
                  <div key={variant.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        variant.id === product.id ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-20">
                        {variant.shop.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        variant.id === product.id ? 'text-blue-600 dark:text-blue-400' : ''
                      }`}>
                        {formatPrice(variant.price)}
                      </span>
                      {index === 0 && (
                        <Badge className="bg-green-500 text-white text-xs px-1 py-0.5">
                          Lowest
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {variants.length > 3 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProduct(product);
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline w-full text-center pt-1"
                  >
                    View all {variants.length} options
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Stock & Delivery Info */}
          <div className="flex items-center justify-between">
            <div>
              {product.inStock ? (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                  ✓ In Stock ({product.stockCount})
                </Badge>
              ) : (
                <Badge variant="destructive" className="text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Truck className="h-3 w-3 mr-1 text-green-600" />
              <span>Free delivery</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <Button
          className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold py-2 h-11 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};