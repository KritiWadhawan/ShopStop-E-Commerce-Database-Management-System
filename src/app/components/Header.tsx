import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Scale, MapPin, Truck, Bell, Heart, Sun, Moon, Store } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useApp } from '../contexts/AppContext';

interface HeaderProps {
  onSearch: (query: string) => void;
  onShowCart: () => void;
  onShowCompare: () => void;
  onShowOrders: () => void;
  onShowSellerDashboard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onShowCart, 
  onShowCompare, 
  onShowOrders,
  onShowSellerDashboard
}) => {
  const { user, cart, compareProducts, activeOrders, userLocation, setIsLoginOpen, setIsLocationModalOpen, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isSeller = user?.role === 'seller';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleBecomeSellerClick = () => {
    if (user) {
      if (isSeller) {
        onShowSellerDashboard?.();
      } else {
        // In a real app, this would redirect to seller onboarding
        alert('Seller onboarding coming soon! You can start by creating your shop profile.');
      }
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <>
      {/* Premium notification bar */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white text-center py-2 text-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative z-10 flex items-center justify-center space-x-4">
          <span className="animate-pulse">🚚</span>
          <span>FREE delivery on orders ₹500+ • 📍 Now delivering in 10-20 minutes • 💎 Premium member exclusive deals</span>
          <span className="animate-pulse">✨</span>
        </div>
      </div>

      <header className="glass-card sticky top-0 z-50 border-b-0 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Premium Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ShopStop
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Shop Local, Live Better</p>
              </div>
            </div>

            {/* Enhanced Location Display */}
            <div className="hidden lg:flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 px-3 py-2 rounded-lg border border-violet-200 dark:border-violet-800">
                <MapPin className="h-4 w-4 text-violet-500" />
                <div>
                  <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">Deliver to</p>
                  <button 
                    onClick={() => setIsLocationModalOpen(true)}
                    className="font-medium hover:text-violet-600 transition-colors truncate max-w-32 text-left"
                  >
                    {userLocation?.address || 'Select location'}
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className="hidden md:block flex-1 max-w-2xl mx-6">
              <form onSubmit={handleSearch} className="relative group">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search for products, brands, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 h-12 bg-white/80 dark:bg-gray-900/80 border-violet-200 dark:border-violet-800 focus:border-violet-500 focus:ring-violet-500 rounded-xl shadow-sm transition-all duration-200 focus:shadow-lg"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-500" />
                  <Button 
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 rounded-lg"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>

            {/* Premium Actions */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Become Seller / Seller Dashboard */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBecomeSellerClick}
                className="relative p-3 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl text-violet-600 dark:text-violet-400 font-medium"
              >
                <Store className="h-5 w-5 mr-2" />
                {isSeller ? 'Dashboard' : 'Sell'}
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="relative p-3 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-violet-500" />
                ) : (
                  <Moon className="h-5 w-5 text-violet-500" />
                )}
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-3 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl"
              >
                <Bell className="h-5 w-5 text-violet-500" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 animate-pulse">
                  3
                </Badge>
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-3 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl"
              >
                <Heart className="h-5 w-5 text-violet-500" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-pink-500">
                  7
                </Badge>
              </Button>

              {/* Track Orders */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowOrders}
                className="relative p-3 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl"
              >
                <Truck className="h-5 w-5 text-violet-500" />
                {activeOrders.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-green-500 animate-pulse">
                    {activeOrders.length}
                  </Badge>
                )}
              </Button>

              {/* Compare Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowCompare}
                className="relative p-3 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl"
              >
                <Scale className="h-5 w-5 text-violet-500" />
                {compareProducts.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-500">
                    {compareProducts.length}
                  </Badge>
                )}
              </Button>

              {/* Cart Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onShowCart}
                className="relative p-3 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl"
              >
                <ShoppingCart className="h-5 w-5 text-violet-500" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500 animate-bounce">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              {/* User Actions */}
              {user ? (
                <div className="flex items-center space-x-3 ml-2">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 px-3 py-2 rounded-xl border border-violet-200 dark:border-violet-800">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="text-left">
                      <span className="text-sm font-medium block">Hi, {user.name.split(' ')[0]}!</span>
                      {isSeller && (
                        <span className="text-xs text-violet-600 dark:text-violet-400">Seller</span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout} className="rounded-xl">
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  onClick={() => setIsLoginOpen(true)} 
                  className="ml-2 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-3 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Enhanced Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-violet-200 dark:border-violet-800 space-y-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              {/* Mobile Location */}
              <div className="flex items-center space-x-3 px-2">
                <div className="flex items-center space-x-2 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 px-3 py-2 rounded-lg border border-violet-200 dark:border-violet-800 flex-1">
                  <MapPin className="h-4 w-4 text-violet-500" />
                  <div>
                    <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">Deliver to</p>
                    <button 
                      onClick={() => setIsLocationModalOpen(true)}
                      className="font-medium hover:text-violet-600 transition-colors text-left"
                    >
                      {userLocation?.address || 'Select location'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 h-12 bg-white/80 dark:bg-gray-900/80 border-violet-200 dark:border-violet-800 rounded-xl"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-500" />
              </form>

              {/* Mobile Actions Grid */}
              <div className="grid grid-cols-4 gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBecomeSellerClick}
                  className="flex flex-col items-center space-y-1 h-auto py-3 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  <Store className="h-5 w-5 text-violet-500" />
                  <span className="text-xs">{isSeller ? 'Dashboard' : 'Sell'}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowOrders}
                  className="flex flex-col items-center space-y-1 h-auto py-3 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  <div className="relative">
                    <Truck className="h-5 w-5 text-violet-500" />
                    {activeOrders.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-green-500">
                        {activeOrders.length}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs">Orders</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowCompare}
                  className="flex flex-col items-center space-y-1 h-auto py-3 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  <div className="relative">
                    <Scale className="h-5 w-5 text-violet-500" />
                    {compareProducts.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-blue-500">
                        {compareProducts.length}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs">Compare</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowCart}
                  className="flex flex-col items-center space-y-1 h-auto py-3 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5 text-violet-500" />
                    {cartItemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-orange-500">
                        {cartItemCount}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs">Cart</span>
                </Button>
              </div>

              {/* Mobile User Section */}
              <div className="pt-4 border-t border-violet-200 dark:border-violet-800">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <span className="font-medium">Hi, {user.name}!</span>
                        {isSeller && (
                          <span className="block text-xs text-violet-600 dark:text-violet-400">Seller Account</span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={logout} className="rounded-xl">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => setIsLoginOpen(true)} 
                    className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 rounded-xl"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};