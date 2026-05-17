import React from 'react';
import { ArrowRight, MapPin, Clock, Star, Store, Truck, Shield, HeadphonesIcon, Zap, TrendingUp, Award, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ProductCard } from './ProductCard';
import { Product, Category, Shop } from '../types';
import { categories, shops, trendingSearches, popularBrands, products } from '../data/mockData';
import { useApp } from '../contexts/AppContext';

interface HomepageProps {
  featuredProducts: Product[];
  onViewProduct: (product: Product) => void;
  onViewCategory: (category: string) => void;
  onViewShop: (shopId: string) => void;
}

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: '10-20 min delivery from nearby shops',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  {
    icon: MapPin,
    title: 'Local First',
    description: 'Support neighborhood businesses',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  {
    icon: Shield,
    title: 'Secure & Safe',
    description: 'Protected payments & quality assured',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'Curated products from trusted sellers',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800'
  }
];

const stats = [
  { icon: Store, value: '10K+', label: 'Local Shops', color: 'text-red-500' },
  { icon: Users, value: '500K+', label: 'Happy Customers', color: 'text-blue-500' },
  { icon: Truck, value: '15 min', label: 'Avg Delivery', color: 'text-green-500' },
  { icon: TrendingUp, value: '99.2%', label: 'Success Rate', color: 'text-emerald-500' }
];

export const Homepage: React.FC<HomepageProps> = ({ 
  featuredProducts, 
  onViewProduct, 
  onViewCategory,
  onViewShop 
}) => {
  const { userLocation, nearbyShops } = useApp();

  return (
    <div className="space-y-12 lg:space-y-16">
      {/* Hero Section with Premium Design */}
      <section className="relative overflow-hidden rounded-3xl">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGNpcmNsZSBpZD0iYSIgY3g9IjUwIiBjeT0iNTAiIHI9IjQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9kZWZzPjx1c2UgeGxpbms6aHJlZj0iI2EiLz48L3N2Zz4=')] opacity-20"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center items-center">
              <div className="space-y-8 text-center max-w-3xl">
                {/* Location Badge */}
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                  <MapPin className="h-4 w-4 text-white mr-2" />
                  <span className="text-white font-medium">
                    📍 {userLocation?.address || 'Set your location for best experience'}
                  </span>
                </div>
                
                {/* Hero Title */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
                    Shop Smart.
                    <br />
                    <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                      Live Local.
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl text-white/90 max-w-2xl leading-relaxed">
                    Discover amazing products from local shops with lightning-fast delivery. 
                    Compare prices, support local businesses, and get everything you need in minutes.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => onViewCategory('all')}
                    className="bg-white text-green-600 hover:bg-white/90 rounded-2xl px-8 py-4 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
                  >
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-white/80">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose ShopStop?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of local shopping with premium features designed for modern consumers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className={`glass-card hover-lift border-0 ${feature.borderColor}`}>
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4 ${feature.color}`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
              <p className="text-muted-foreground">Explore our comprehensive range of products</p>
            </div>
            <Button variant="outline" onClick={() => onViewCategory('all')} className="rounded-xl">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6">
            {categories
              .filter((category) =>
                products.some(
                  (p) => p.category.toLowerCase() === category.name.toLowerCase()
                )
              )
              .map((category) => (
                <Card
                  key={category.id}
                  className="glass-card hover-lift cursor-pointer border-0 text-center group"
                  onClick={() => onViewCategory(category.name)}
                >
                  <CardContent className="p-4 lg:p-6">
                    <div className="text-3xl lg:text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-200">
                      {category.icon}
                    </div>
                    <h4 className="text-sm lg:text-base font-medium group-hover:text-green-600 transition-colors">
                      {category.name}
                    </h4>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* Trending Searches */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">🔥 Trending Searches</h3>
          <div className="flex flex-wrap gap-3">
            {trendingSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="rounded-full hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-colors"
                onClick={() => onViewCategory(search)}
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Shops */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">🏪 Nearby Shops</h2>
              <p className="text-muted-foreground">
                Discover local businesses delivering to your area
              </p>
            </div>
            <Button variant="outline" className="rounded-xl">
              View All Shops
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyShops.slice(0, 4).map((shop) => (
              <Card 
                key={shop.id}
                className="glass-card hover-lift cursor-pointer border-0 overflow-hidden"
                onClick={() => onViewShop(shop.id)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full h-40 object-cover"
                    />
                    <Badge className={`absolute top-3 right-3 ${
                      shop.isOpen 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-red-500 hover:bg-red-600'
                    }`}>
                      {shop.isOpen ? '🟢 Open' : '🔴 Closed'}
                    </Badge>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-semibold line-clamp-1">{shop.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{shop.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">{shop.rating}</span>
                      </div>
                      <span className="text-muted-foreground">({shop.reviewCount})</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{shop.distance?.toFixed(1)}km away</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-green-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {shop.deliveryTime}
                      </span>
                      <span className="text-muted-foreground">
                        Min order ₹{shop.minOrderAmount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">✨ Featured Products</h2>
              <p className="text-muted-foreground">
                Handpicked products with amazing deals and fast delivery
              </p>
            </div>
            <Button variant="outline" onClick={() => onViewCategory('all')} className="rounded-xl">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {featuredProducts.slice(0, 10).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={onViewProduct}
                onViewShop={onViewShop}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-center">🏆 Popular Brands</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
            {popularBrands.slice(0, 8).map((brand, index) => (
              <Card key={index} className="glass-card hover-lift cursor-pointer border-0 aspect-square flex items-center justify-center">
                <CardContent className="p-3 text-center">
                  <span className="font-semibold text-sm">{brand}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card className="glass-card border-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10">
            <CardContent className="p-8 lg:p-12 text-center">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Stay Updated with ShopStop
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Get exclusive deals, new shop alerts, and be the first to know about exciting offers in your area.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 rounded-xl px-8">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};