import { Product, Category, User, Shop, Location } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'Electronics', icon: '📱', color: 'bg-blue-100 text-blue-700' },
  { id: '2', name: 'Fashion', icon: '👕', color: 'bg-purple-100 text-purple-700' },
  { id: '3', name: 'Home & Garden', icon: '🏠', color: 'bg-green-100 text-green-700' },
  { id: '4', name: 'Sports & Fitness', icon: '⚽', color: 'bg-orange-100 text-orange-700' },
  { id: '5', name: 'Automotive', icon: '🚗', color: 'bg-red-100 text-red-700' },
  { id: '6', name: 'Books & Media', icon: '📚', color: 'bg-indigo-100 text-indigo-700' },
  { id: '7', name: 'Health & Beauty', icon: '💄', color: 'bg-pink-100 text-pink-700' },
  { id: '8', name: 'Groceries', icon: '🛒', color: 'bg-emerald-100 text-emerald-700' },
  { id: '9', name: 'Furniture', icon: '🪑', color: 'bg-amber-100 text-amber-700' },
  { id: '10', name: 'Jewelry', icon: '💎', color: 'bg-cyan-100 text-cyan-700' },
  { id: '11', name: 'Baby & Kids', icon: '🍼', color: 'bg-yellow-100 text-yellow-700' },
  { id: '12', name: 'Pet Supplies', icon: '🐕', color: 'bg-lime-100 text-lime-700' }
];

// Mock user location (Mumbai, India)
export const userLocation: Location = {
  latitude: 19.0760,
  longitude: 72.8777,
  address: 'Bandra West, Mumbai, Maharashtra',
  city: 'Mumbai',
  state: 'Maharashtra',
  zipCode: '400050'
};

export const shops: Shop[] = [
  {
    id: '1',
    name: 'TechHub Electronics',
    description: 'Premium electronics and gadgets with latest technology. Authorized dealer for Apple, Samsung, and OnePlus.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    location: {
      latitude: 19.0596,
      longitude: 72.8295,
      address: 'Linking Road, Bandra West, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050'
    },
    rating: 4.8,
    reviewCount: 1234,
    isOpen: true,
    openHours: { open: '10:00 AM', close: '9:00 PM' },
    deliveryTime: '15-30 min',
    deliveryFee: 49,
    minOrderAmount: 500,
    phone: '+91 98765 43210',
    categories: ['Electronics'],
    distance: 1.2,
    sellerId: '2'
  },
  {
    id: '2',
    name: 'Fashion Junction',
    description: 'Trendy fashion boutique featuring designer brands and ethnic wear. Perfect for all occasions.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    location: {
      latitude: 19.0544,
      longitude: 72.8256,
      address: 'Hill Road, Bandra West, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050'
    },
    rating: 4.6,
    reviewCount: 856,
    isOpen: true,
    openHours: { open: '11:00 AM', close: '10:00 PM' },
    deliveryTime: '20-45 min',
    deliveryFee: 59,
    minOrderAmount: 799,
    phone: '+91 98765 43211',
    categories: ['Fashion'],
    distance: 0.8,
    sellerId: '3'
  },
  {
    id: '3',
    name: 'Home Essentials Store',
    description: 'Complete home and garden solutions. From furniture to kitchenware, everything for Indian homes.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    location: {
      latitude: 19.0469,
      longitude: 72.8191,
      address: 'Turner Road, Bandra West, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050'
    },
    rating: 4.7,
    reviewCount: 642,
    isOpen: true,
    openHours: { open: '9:00 AM', close: '8:00 PM' },
    deliveryTime: '30-60 min',
    deliveryFee: 89,
    minOrderAmount: 1500,
    phone: '+91 98765 43212',
    categories: ['Home & Garden', 'Furniture'],
    distance: 2.1,
    sellerId: '4'
  },
  {
    id: '4',
    name: 'Spice & Grocery Mart',
    description: 'Fresh groceries, spices, and daily essentials. Quality products at affordable prices.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
    location: {
      latitude: 19.0728,
      longitude: 72.8826,
      address: 'Pali Market, Bandra West, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050'
    },
    rating: 4.9,
    reviewCount: 1567,
    isOpen: true,
    openHours: { open: '7:00 AM', close: '11:00 PM' },
    deliveryTime: '10-25 min',
    deliveryFee: 29,
    minOrderAmount: 299,
    phone: '+91 98765 43213',
    categories: ['Groceries'],
    distance: 0.5,
    sellerId: '5'
  },
  {
    id: '5',
    name: 'AutoCare Parts',
    description: 'Genuine auto parts and accessories for all vehicle brands. Expert advice included.',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
    location: {
      latitude: 19.0625,
      longitude: 72.8442,
      address: 'S.V. Road, Bandra West, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050'
    },
    rating: 4.5,
    reviewCount: 423,
    isOpen: true,
    openHours: { open: '8:00 AM', close: '7:00 PM' },
    deliveryTime: '45-90 min',
    deliveryFee: 99,
    minOrderAmount: 1000,
    phone: '+91 98765 43214',
    categories: ['Automotive'],
    distance: 1.8,
    sellerId: '6'
  },
  {
    id: '6',
    name: 'Sports Zone',
    description: 'Complete sports equipment and fitness gear. Official dealer for major sports brands.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    location: {
      latitude: 19.0521,
      longitude: 72.8308,
      address: 'Carter Road, Bandra West, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050'
    },
    rating: 4.4,
    reviewCount: 789,
    isOpen: true,
    openHours: { open: '10:00 AM', close: '9:00 PM' },
    deliveryTime: '25-50 min',
    deliveryFee: 79,
    minOrderAmount: 999,
    phone: '+91 98765 43215',
    categories: ['Sports & Fitness'],
    distance: 1.5,
    sellerId: '7'
  }
];

export const products: Product[] = [
  // Electronics from multiple sellers
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 134900,
    originalPrice: 159900,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1585060280525-7cd35806a87c?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Apple',
    description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and the best iPhone camera system.',
    features: ['6.7-inch Super Retina XDR Display', 'A17 Pro Chip', '48MP Main Camera', '5G Connectivity', 'Titanium Design'],
    rating: 4.8,
    reviewCount: 2547,
    shop: shops[0],
    inStock: true,
    stockCount: 25,
    deliveryTime: '15-30 min'
  },
  {
    id: '1a',
    name: 'iPhone 15 Pro Max',
    price: 139900,
    originalPrice: 159900,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Apple',
    description: 'Latest iPhone 15 Pro Max with 1 year warranty and free screen guard.',
    features: ['6.7-inch Super Retina XDR Display', 'A17 Pro Chip', '48MP Main Camera', '5G Connectivity', 'Free Accessories'],
    rating: 4.7,
    reviewCount: 1234,
    shop: shops[1],
    inStock: true,
    stockCount: 12,
    deliveryTime: '20-45 min'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 124999,
    originalPrice: 129999,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Samsung',
    description: 'Ultimate mobile experience with S Pen, 200MP camera, and AI-powered features.',
    features: ['6.8-inch Dynamic AMOLED Display', 'Snapdragon 8 Gen 3', '200MP Camera', 'S Pen Included', 'AI Features'],
    rating: 4.7,
    reviewCount: 1834,
    shop: shops[0],
    inStock: true,
    stockCount: 18,
    deliveryTime: '15-30 min'
  },
  {
    id: '3',
    name: 'Designer Kurta Set',
    price: 2499,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'
    ],
    category: 'Fashion',
    brand: 'Ethnic Wear Co.',
    description: 'Beautiful cotton kurta set perfect for festivals and special occasions.',
    features: ['Pure Cotton', 'Comfortable Fit', 'Machine Washable', 'Traditional Design', 'Available in Multiple Sizes'],
    rating: 4.6,
    reviewCount: 456,
    shop: shops[1],
    inStock: true,
    stockCount: 12,
    deliveryTime: '20-45 min',
    unit: 'Size: M'
  },
  {
    id: '4',
    name: 'Wooden Dining Table',
    price: 24999,
    originalPrice: 32999,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop'
    ],
    category: 'Furniture',
    brand: 'HomeComfort',
    description: 'Solid wood dining table for 6 people. Perfect for Indian homes and families.',
    features: ['Solid Wood', '6-Seater', 'Scratch Resistant', 'Easy Assembly', '5-Year Warranty'],
    rating: 4.8,
    reviewCount: 234,
    shop: shops[2],
    inStock: true,
    stockCount: 5,
    deliveryTime: '30-60 min',
    unit: '6-seater set'
  },
  {
    id: '5',
    name: 'Basmati Rice Premium',
    price: 899,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
    ],
    category: 'Groceries',
    brand: 'India Gate',
    description: 'Premium quality basmati rice, aged for perfect aroma and taste.',
    features: ['Premium Quality', 'Long Grain', 'Aged Rice', 'Perfect for Biryani', 'Export Quality'],
    rating: 4.9,
    reviewCount: 567,
    shop: shops[3],
    inStock: true,
    stockCount: 50,
    deliveryTime: '10-25 min',
    unit: '5kg pack'
  },
  {
    id: '6',
    name: 'Organic Vegetables Bundle',
    price: 599,
    image: 'https://images.unsplash.com/photo-1506368083636-6defb67639a7?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506368083636-6defb67639a7?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop'
    ],
    category: 'Groceries',
    brand: 'Fresh Farms',
    description: 'Fresh organic vegetables bundle including seasonal vegetables. Farm fresh guaranteed.',
    features: ['100% Organic', 'Farm Fresh', 'Seasonal Vegetables', 'Pesticide Free', 'Same Day Harvest'],
    rating: 4.7,
    reviewCount: 892,
    shop: shops[3],
    inStock: true,
    stockCount: 100,
    deliveryTime: '10-25 min',
    unit: '2kg mixed bundle'
  },
  {
    id: '7',
    name: 'Cricket Kit Professional',
    price: 8999,
    originalPrice: 12999,
    image: 'https://images.unsplash.com/photo-1593766827228-8737b8d10b46?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593766827228-8737b8d10b46?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    ],
    category: 'Sports & Fitness',
    brand: 'MRF',
    description: 'Professional cricket kit with bat, pads, gloves, and helmet. Perfect for serious players.',
    features: ['Professional Grade', 'Complete Kit', 'ISI Certified Helmet', 'Leather Ball Included', 'Kit Bag Included'],
    rating: 4.5,
    reviewCount: 1245,
    shop: shops[5],
    inStock: true,
    stockCount: 15,
    deliveryTime: '25-50 min',
    unit: 'Complete kit'
  },
  {
    id: '8',
    name: 'Gold Plated Earrings',
    price: 1299,
    originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=400&fit=crop'
    ],
    category: 'Jewelry',
    brand: 'Jewel Craft',
    description: 'Beautiful gold plated earrings with traditional Indian design. Perfect for festivals.',
    features: ['22K Gold Plated', 'Traditional Design', 'Lightweight', 'Tarnish Resistant', 'Gift Box Included'],
    rating: 4.9,
    reviewCount: 178,
    shop: shops[1],
    inStock: true,
    stockCount: 25,
    deliveryTime: '20-45 min'
  },
  // Additional products from different sellers for comparison
  {
    id: '2a',
    name: 'Samsung Galaxy S24 Ultra',
    price: 119999,
    originalPrice: 129999,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop'
    ],
    category: 'Electronics',
    brand: 'Samsung',
    description: 'Samsung Galaxy S24 Ultra with extended warranty and free accessories.',
    features: ['6.8-inch Display', 'Snapdragon 8 Gen 3', '200MP Camera', 'S Pen', 'Extended Warranty'],
    rating: 4.6,
    reviewCount: 987,
    shop: shops[1],
    inStock: true,
    stockCount: 8,
    deliveryTime: '20-45 min'
  },
  {
    id: '5a',
    name: 'Basmati Rice Premium',
    price: 849,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
    ],
    category: 'Groceries',
    brand: 'India Gate',
    description: 'Premium basmati rice with bulk discount available.',
    features: ['Premium Quality', 'Long Grain', 'Aged Rice', 'Bulk Discount', 'Free Home Delivery'],
    rating: 4.8,
    reviewCount: 423,
    shop: shops[2],
    inStock: true,
    stockCount: 75,
    deliveryTime: '30-60 min',
    unit: '5kg pack'
  }
];

// Enhanced product variants for price comparison
export const getProductVariants = (productName: string) => {
  // Find all products with the same name from different sellers
  return products.filter(p => p.name === productName).sort((a, b) => a.price - b.price);
};

export const users: User[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43200',
    role: 'buyer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    location: userLocation,
    addresses: [
      {
        id: '1',
        label: 'Home',
        address: 'Bandra West, Mumbai, Maharashtra',
        location: userLocation,
        isDefault: true
      },
      {
        id: '2',
        label: 'Office',
        address: 'Andheri East, Mumbai, Maharashtra',
        location: {
          latitude: 19.1197,
          longitude: 72.8526,
          address: 'Andheri East, Mumbai, Maharashtra',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400069'
        },
        isDefault: false
      }
    ]
  },
  {
    id: '2',
    name: 'Amit Patel',
    email: 'amit@example.com',
    phone: '+91 98765 43201',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    shopId: '1'
  },
  {
    id: '3',
    name: 'Priya Singh',
    email: 'priya@example.com',
    phone: '+91 98765 43202',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1a7?w=100&h=100&fit=crop&crop=face',
    shopId: '2'
  },
  {
    id: '4',
    name: 'Suresh Kumar',
    email: 'suresh@example.com',
    phone: '+91 98765 43203',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    shopId: '3'
  },
  {
    id: '5',
    name: 'Meena Devi',
    email: 'meena@example.com',
    phone: '+91 98765 43204',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    shopId: '4'
  },
  {
    id: '6',
    name: 'Raj Malhotra',
    email: 'raj@example.com',
    phone: '+91 98765 43205',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    shopId: '5'
  },
  {
    id: '7',
    name: 'Deepak Joshi',
    email: 'deepak@example.com',
    phone: '+91 98765 43206',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    shopId: '6'
  }
];

// Mock data for trending searches and popular brands in India
export const trendingSearches = [
  'iPhone 15', 'Kurta Sets', 'Basmati Rice', 'Cricket Kit', 'Gold Jewelry',
  'Dining Table', 'Samsung Galaxy', 'Organic Vegetables', 'Sports Shoes', 'Traditional Wear'
];

export const popularBrands = [
  'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'India Gate', 'Tata', 'Amul', 'MRF',
  'Titan', 'Godrej', 'ITC', 'Patanjali', 'Britannia', 'Parle', 'Bata', 'Asian Paints'
];

// Helper function to search products across all sellers
export const searchProducts = (query: string, category: string = 'all', userLocation?: Location) => {
  let filteredProducts = products;

  // Filter by category
  if (category !== 'all') {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by search query
  if (query) {
    const searchTerms = query.toLowerCase().split(' ');
    filteredProducts = filteredProducts.filter(p => 
      searchTerms.some(term => 
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      )
    );
  }

  // Sort by distance if user location is available
  if (userLocation) {
    filteredProducts = filteredProducts.sort((a, b) => {
      const distanceA = a.shop.distance || 0;
      const distanceB = b.shop.distance || 0;
      return distanceA - distanceB;
    });
  }

  return filteredProducts;
};

// Helper function to group products by name for comparison
export const groupProductsForComparison = (products: Product[]) => {
  const grouped: { [key: string]: Product[] } = {};
  
  products.forEach(product => {
    const key = product.name.toLowerCase();
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(product);
  });

  // Sort each group by price
  Object.keys(grouped).forEach(key => {
    grouped[key] = grouped[key].sort((a, b) => a.price - b.price);
  });

  return grouped;
};