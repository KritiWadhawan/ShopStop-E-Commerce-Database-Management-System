import React, { useState } from 'react';
import { Header } from './components/Header';
import { Homepage } from './components/Homepage';
import { ProductListing } from './components/ProductListing';
import { Cart } from './components/Cart';
import { ProductComparison } from './components/ProductComparison';
import { LoginModal } from './components/LoginModal';
import { LocationModal } from './components/LocationModal';
import { OrderTracking } from './components/OrderTracking';
import { SellerDashboard } from './components/SellerDashboard';
import { AppProvider } from './contexts/AppContext';
import { products, shops, getProductVariants, searchProducts } from './data/mockData';
import { Product, Shop } from './types';

type View = 'home' | 'products' | 'product-detail' | 'shop-detail' | 'price-compare';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [compareProductName, setCompareProductName] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showSellerDashboard, setShowSellerDashboard] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('products');
  };

  const handleViewCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('products');
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const handleViewShop = (shopId: string) => {
    const shop = shops.find(s => s.id === shopId);
    if (shop) {
      setSelectedShop(shop);
      setCurrentView('shop-detail');
    }
  };

  const handlePriceCompare = (productName: string) => {
    setCompareProductName(productName);
    setCurrentView('price-compare');
  };

  const handleBackToProducts = () => {
    setCurrentView('products');
    setSelectedProduct(null);
    setSelectedShop(null);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedProduct(null);
    setSelectedShop(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <Homepage
            featuredProducts={products}
            onViewProduct={handleViewProduct}
            onViewCategory={handleViewCategory}
            onViewShop={handleViewShop}
          />
        );

      case 'products':
        return (
          <ProductListing
            products={searchProducts(searchQuery, selectedCategory)}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onViewProduct={handleViewProduct}
            onViewShop={handleViewShop}
          />
        );

      case 'product-detail':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onBack={handleBackToProducts}
            onPriceCompare={handlePriceCompare}
            onViewShop={handleViewShop}
          />
        ) : null;

      case 'shop-detail':
        return selectedShop ? (
          <ShopDetail
            shop={selectedShop}
            onBack={handleBackToProducts}
            onViewProduct={handleViewProduct}
          />
        ) : null;

      case 'price-compare':
        return compareProductName ? (
          <PriceCompare
            productName={compareProductName}
            onBack={handleBackToProducts}
            onViewProduct={handleViewProduct}
          />
        ) : null;

      default:
        return null;
    }
  };

  // Format price in Indian currency
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <Header 
          onSearch={handleSearch}
          onShowCart={() => setShowCart(true)}
          onShowCompare={() => setShowCompare(true)}
          onShowOrders={() => setShowOrders(true)}
          onShowSellerDashboard={() => setShowSellerDashboard(true)}
        />
        
        {/* Breadcrumb Navigation */}
        <nav className="glass-card border-b px-4 sm:px-6 lg:px-8 sticky top-[73px] z-40">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 py-3 text-sm overflow-x-auto">
              <button
                onClick={handleBackToHome}
                className={`whitespace-nowrap hover:text-primary transition-colors ${
                  currentView === 'home' ? 'font-medium text-primary' : 'text-muted-foreground'
                }`}
              >
                Home
              </button>
              
              {currentView !== 'home' && <span className="text-muted-foreground">/</span>}
              
              {currentView === 'products' && (
                <span className="whitespace-nowrap">
                  {searchQuery ? `"${searchQuery}"` : 
                   selectedCategory === 'all' ? 'All Products' : selectedCategory}
                </span>
              )}
              
              {currentView === 'product-detail' && selectedProduct && (
                <>
                  <button
                    onClick={handleBackToProducts}
                    className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors"
                  >
                    Products
                  </button>
                  <span className="text-muted-foreground">/</span>
                  <span className="whitespace-nowrap truncate">{selectedProduct.name}</span>
                </>
              )}
              
              {currentView === 'shop-detail' && selectedShop && (
                <>
                  <button
                    onClick={handleBackToProducts}
                    className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors"
                  >
                    Shops
                  </button>
                  <span className="text-muted-foreground">/</span>
                  <span className="whitespace-nowrap">{selectedShop.name}</span>
                </>
              )}

              {currentView === 'price-compare' && (
                <>
                  <button
                    onClick={handleBackToProducts}
                    className="whitespace-nowrap text-muted-foreground hover:text-primary transition-colors"
                  >
                    Products
                  </button>
                  <span className="text-muted-foreground">/</span>
                  <span className="whitespace-nowrap">Price Comparison</span>
                </>
              )}
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {renderContent()}
        </main>

        {/* Enhanced Footer */}
        <footer className="glass-card mt-16 border-t-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <h3 className="font-bold bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
                    ShopStop
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your neighborhood shopping platform. Shop local, support businesses, get fast delivery.
                </p>
              </div>
              
              <div>
                <h4 className="mb-4 font-medium">For Customers</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Download App</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Terms & Conditions</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="mb-4 font-medium">For Sellers</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Become a Seller</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Seller Dashboard</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Pricing Plans</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Seller Support</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="mb-4 font-medium">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>

        {/* Modals and Sheets */}
        <Cart isOpen={showCart} onClose={() => setShowCart(false)} />
        <ProductComparison isOpen={showCompare} onClose={() => setShowCompare(false)} />
        <OrderTracking isOpen={showOrders} onClose={() => setShowOrders(false)} />
        {showSellerDashboard && (
          <SellerDashboard onClose={() => setShowSellerDashboard(false)} />
        )}
        <LoginModal />
        <LocationModal />
      </div>
    </AppProvider>
  );
}

// Enhanced Product Detail Component with Price Comparison
const ProductDetail: React.FC<{ 
  product: Product; 
  onBack: () => void; 
  onPriceCompare: (name: string) => void;
  onViewShop: (shopId: string) => void;
}> = ({ product, onBack, onPriceCompare, onViewShop }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const variants = getProductVariants(product.name);
  const hasMultipleSellers = variants.length > 1;

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-4">
        <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
          <img
            src={product.images[selectedImage] || product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex space-x-2 overflow-x-auto">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index ? 'border-primary' : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <img src={image} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl mb-2">{product.name}</h1>
          <p className="text-muted-foreground">{product.brand} • {product.unit}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-3xl font-bold">{formatPrice(product.price)}</div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-xl text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </div>
          )}
        </div>

        {/* Enhanced Price Comparison Section */}
        {hasMultipleSellers && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium mb-4 text-blue-700 dark:text-blue-300">
              💰 Price Comparison - Available at {variants.length} shops
            </h4>
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={variant.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      variant.id === product.id ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                    <div>
                      <p className="font-medium">{variant.shop.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {variant.shop.distance?.toFixed(1)}km • {variant.deliveryTime}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      variant.id === product.id ? 'text-blue-600 dark:text-blue-400' : ''
                    }`}>
                      {formatPrice(variant.price)}
                    </p>
                    {index === 0 && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Lowest Price
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-muted-foreground">{product.description}</p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Key Features</h4>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="glass-card p-4 rounded-xl">
          <h4 className="font-medium mb-2">Available at</h4>
          <button
            onClick={() => onViewShop(product.shop.id)}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {product.shop.name}
          </button>
          <p className="text-sm text-muted-foreground mt-1">
            📍 {product.shop.distance?.toFixed(1)}km away • 🚚 {product.deliveryTime} delivery
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-muted transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Shop Detail Component
const ShopDetail: React.FC<{ 
  shop: Shop; 
  onBack: () => void; 
  onViewProduct: (product: Product) => void;
}> = ({ shop, onBack, onViewProduct }) => {
  const shopProducts = products.filter(p => p.shop.id === shop.id);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-64 object-cover rounded-xl"
          />
          
          <div>
            <h1 className="text-3xl mb-2">{shop.name}</h1>
            <p className="text-muted-foreground">{shop.description}</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl h-fit">
          <h3 className="font-medium mb-4">Shop Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Rating:</span>
              <span>⭐ {shop.rating} ({shop.reviewCount} reviews)</span>
            </div>
            <div className="flex justify-between">
              <span>Distance:</span>
              <span>📍 {shop.distance?.toFixed(1)}km away</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>🚚 {shop.deliveryTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>₹{shop.deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Min Order:</span>
              <span>₹{shop.minOrderAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className={shop.isOpen ? 'text-green-600' : 'text-red-600'}>
                {shop.isOpen ? '🟢 Open' : '🔴 Closed'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-6">Products ({shopProducts.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {shopProducts.map((product) => (
            <div 
              key={product.id} 
              onClick={() => onViewProduct(product)} 
              className="cursor-pointer glass-card p-4 rounded-xl hover-lift"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="font-medium line-clamp-2 mb-2">{product.name}</h4>
              <p className="text-lg font-bold">{formatPrice(product.price)}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onBack}
        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-muted transition-colors"
      >
        Back to Products
      </button>
    </div>
  );
};

// Enhanced Price Compare Component
const PriceCompare: React.FC<{ 
  productName: string; 
  onBack: () => void;
  onViewProduct: (product: Product) => void;
}> = ({ productName, onBack, onViewProduct }) => {
  const variants = getProductVariants(productName);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl mb-2">💰 Compare Prices: {productName}</h1>
        <p className="text-muted-foreground">Compare prices from different shops near you</p>
      </div>

      <div className="grid gap-4">
        {variants.map((variant, index) => (
          <div key={variant.id} className="glass-card p-4 rounded-xl hover-lift cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={variant.image}
                  alt={variant.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium">{variant.shop.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    📍 {variant.shop.distance?.toFixed(1)}km • 🚚 {variant.deliveryTime}
                  </p>
                  <p className="text-sm">⭐ {variant.shop.rating} • 📦 Stock: {variant.stockCount}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{formatPrice(variant.price)}</p>
                  {index === 0 && (
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
                      Lowest
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onViewProduct(variant)}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-1"
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onBack}
        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-muted transition-colors"
      >
        Back
      </button>
    </div>
  );
};