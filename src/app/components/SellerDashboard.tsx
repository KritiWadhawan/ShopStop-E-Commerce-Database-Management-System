import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload, MapPin, Star, TrendingUp, Package, DollarSign, Eye, BarChart3, Users, Clock, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useApp } from '../contexts/AppContext';
import { Product, Shop } from '../types';
import { categories } from '../data/mockData';

interface SellerDashboardProps {
  onClose: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onClose }) => {
  const { user } = useApp();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditShopOpen, setIsEditShopOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Mock seller data - in real app, this would come from API
  const [sellerStats] = useState({
    totalProducts: 24,
    totalOrders: 156,
    revenue: 125000,
    rating: 4.7,
    views: 2340
  });

  const [sellerProducts, setSellerProducts] = useState<Product[]>([
    {
      id: 'sp1',
      name: 'Wireless Bluetooth Headphones',
      price: 2999,
      originalPrice: 4999,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'],
      category: 'Electronics',
      brand: 'TechSound',
      description: 'High-quality wireless headphones with noise cancellation.',
      features: ['Bluetooth 5.0', 'Noise Cancellation', '30hr Battery', 'Fast Charging'],
      rating: 4.5,
      reviewCount: 89,
      shop: { 
        id: '1', 
        name: 'TechHub Electronics',
        distance: 1.2,
        deliveryTime: '15-30 min'
      } as Shop,
      inStock: true,
      stockCount: 15,
      deliveryTime: '15-30 min'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    brand: '',
    description: '',
    features: '',
    stockCount: '',
    images: ['']
  });

  const [shopDetails, setShopDetails] = useState({
    name: 'TechHub Electronics',
    description: 'Premium electronics and gadgets with latest technology.',
    address: 'Linking Road, Bandra West, Mumbai',
    phone: '+91 98765 43210',
    openTime: '10:00',
    closeTime: '21:00',
    deliveryFee: '49',
    minOrderAmount: '500'
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert('Please fill all required fields');
      return;
    }

    const product: Product = {
      id: `sp${sellerProducts.length + 1}`,
      name: newProduct.name,
      price: parseInt(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseInt(newProduct.originalPrice) : undefined,
      image: newProduct.images[0] || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=400&fit=crop',
      images: newProduct.images.filter(img => img.trim() !== ''),
      category: newProduct.category,
      brand: newProduct.brand,
      description: newProduct.description,
      features: newProduct.features.split(',').map(f => f.trim()),
      rating: 0,
      reviewCount: 0,
      shop: { 
        id: '1', 
        name: shopDetails.name,
        distance: 1.2,
        deliveryTime: '15-30 min'
      } as Shop,
      inStock: true,
      stockCount: parseInt(newProduct.stockCount) || 0,
      deliveryTime: '15-30 min'
    };

    setSellerProducts([...sellerProducts, product]);
    setNewProduct({
      name: '',
      price: '',
      originalPrice: '',
      category: '',
      brand: '',
      description: '',
      features: '',
      stockCount: '',
      images: ['']
    });
    setIsAddProductOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    setSellerProducts(sellerProducts.filter(p => p.id !== productId));
  };

  const addImageField = () => {
    setNewProduct({
      ...newProduct,
      images: [...newProduct.images, '']
    });
  };

  const updateImageField = (index: number, value: string) => {
    const updatedImages = [...newProduct.images];
    updatedImages[index] = value;
    setNewProduct({
      ...newProduct,
      images: updatedImages
    });
  };

  const removeImageField = (index: number) => {
    if (newProduct.images.length > 1) {
      const updatedImages = newProduct.images.filter((_, i) => i !== index);
      setNewProduct({
        ...newProduct,
        images: updatedImages
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-7xl my-8">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Seller Dashboard</h2>
            <p className="text-muted-foreground">Manage your shop and products</p>
          </div>
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Close Dashboard
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="shop">Shop</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Products</p>
                        <p className="text-xl font-bold">{sellerStats.totalProducts}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Orders</p>
                        <p className="text-xl font-bold">{sellerStats.totalOrders}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                        <div className="h-5 w-5 flex items-center justify-center text-yellow-600 font-bold text-sm">
                          ₹
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-xl font-bold">₹{sellerStats.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Star className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="text-xl font-bold">{sellerStats.rating}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
                        <Eye className="h-5 w-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Views</p>
                        <p className="text-xl font-bold">{sellerStats.views}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">New order received</p>
                        <p className="text-sm text-muted-foreground">iPhone 15 Pro Max - ₹134,900</p>
                      </div>
                      <span className="text-sm text-muted-foreground">2 mins ago</span>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Product viewed</p>
                        <p className="text-sm text-muted-foreground">Samsung Galaxy S24 Ultra viewed 15 times</p>
                      </div>
                      <span className="text-sm text-muted-foreground">5 mins ago</span>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Stock running low</p>
                        <p className="text-sm text-muted-foreground">Wireless Headphones - Only 5 left</p>
                      </div>
                      <span className="text-sm text-muted-foreground">1 hour ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Products ({sellerProducts.length})</h3>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary rounded-xl">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="productName">Product Name *</Label>
                          <Input
                            id="productName"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            placeholder="Enter product name"
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="brand">Brand</Label>
                          <Input
                            id="brand"
                            value={newProduct.brand}
                            onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                            placeholder="Enter brand name"
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="price">Price (₹) *</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            placeholder="0"
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="originalPrice">Original Price (₹)</Label>
                          <Input
                            id="originalPrice"
                            type="number"
                            value={newProduct.originalPrice}
                            onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                            placeholder="0"
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock">Stock Count *</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stockCount}
                            onChange={(e) => setNewProduct({...newProduct, stockCount: e.target.value})}
                            placeholder="0"
                            className="rounded-xl"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.icon} {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          placeholder="Describe your product..."
                          rows={3}
                          className="rounded-xl"
                        />
                      </div>

                      <div>
                        <Label htmlFor="features">Features (comma separated)</Label>
                        <Textarea
                          id="features"
                          value={newProduct.features}
                          onChange={(e) => setNewProduct({...newProduct, features: e.target.value})}
                          placeholder="Feature 1, Feature 2, Feature 3..."
                          rows={2}
                          className="rounded-xl"
                        />
                      </div>

                      <div>
                        <Label>Product Images</Label>
                        <div className="space-y-3">
                          {newProduct.images.map((image, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Input
                                value={image}
                                onChange={(e) => updateImageField(index, e.target.value)}
                                placeholder="Enter image URL"
                                className="flex-1 rounded-xl"
                              />
                              {index === 0 ? (
                                <Button type="button" onClick={addImageField} size="sm" variant="outline" className="rounded-xl">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button type="button" onClick={() => removeImageField(index)} size="sm" variant="outline" className="rounded-xl">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Add image URLs. You can use Unsplash, Google Images, or upload to image hosting services.
                        </p>
                      </div>

                      <div className="flex space-x-4">
                        <Button onClick={handleAddProduct} className="flex-1 bg-gradient-primary rounded-xl">
                          Add Product
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddProductOpen(false)}
                          className="flex-1 rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellerProducts.map((product) => (
                  <Card key={product.id} className="glass-card border-0 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className={`absolute top-3 right-3 ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                      
                      <div className="p-4 space-y-3">
                        <div>
                          <h4 className="font-semibold line-clamp-1">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Stock: {product.stockCount}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                            <span className="text-muted-foreground">({product.reviewCount})</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 rounded-lg"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <Card className="glass-card border-0">
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">No orders yet</h4>
                    <p className="text-muted-foreground">Orders will appear here once customers start buying your products.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shop" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Shop Settings</h3>
                <Dialog open={isEditShopOpen} onOpenChange={setIsEditShopOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="rounded-xl">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Shop
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Shop Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="shopName">Shop Name</Label>
                        <Input
                          id="shopName"
                          value={shopDetails.name}
                          onChange={(e) => setShopDetails({...shopDetails, name: e.target.value})}
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shopDescription">Description</Label>
                        <Textarea
                          id="shopDescription"
                          value={shopDetails.description}
                          onChange={(e) => setShopDetails({...shopDetails, description: e.target.value})}
                          rows={3}
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shopAddress">Address</Label>
                        <Input
                          id="shopAddress"
                          value={shopDetails.address}
                          onChange={(e) => setShopDetails({...shopDetails, address: e.target.value})}
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shopPhone">Phone</Label>
                        <Input
                          id="shopPhone"
                          value={shopDetails.phone}
                          onChange={(e) => setShopDetails({...shopDetails, phone: e.target.value})}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="openTime">Open Time</Label>
                          <Input
                            id="openTime"
                            type="time"
                            value={shopDetails.openTime}
                            onChange={(e) => setShopDetails({...shopDetails, openTime: e.target.value})}
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="closeTime">Close Time</Label>
                          <Input
                            id="closeTime"
                            type="time"
                            value={shopDetails.closeTime}
                            onChange={(e) => setShopDetails({...shopDetails, closeTime: e.target.value})}
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="deliveryFee">Delivery Fee (₹)</Label>
                          <Input
                            id="deliveryFee"
                            type="number"
                            value={shopDetails.deliveryFee}
                            onChange={(e) => setShopDetails({...shopDetails, deliveryFee: e.target.value})}
                            className="rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="minOrder">Min Order (₹)</Label>
                          <Input
                            id="minOrder"
                            type="number"
                            value={shopDetails.minOrderAmount}
                            onChange={(e) => setShopDetails({...shopDetails, minOrderAmount: e.target.value})}
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <Button className="flex-1 bg-gradient-primary rounded-xl">
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditShopOpen(false)}
                          className="flex-1 rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="glass-card border-0">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        {shopDetails.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold">{shopDetails.name}</h4>
                        <p className="text-muted-foreground">{shopDetails.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {shopDetails.address}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {shopDetails.openTime} - {shopDetails.closeTime}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                        <h5 className="font-medium text-blue-700 dark:text-blue-400">Delivery Fee</h5>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">₹{shopDetails.deliveryFee}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                        <h5 className="font-medium text-green-700 dark:text-green-400">Min Order</h5>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-300">₹{shopDetails.minOrderAmount}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};