import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { categories } from '../data/mockData';

interface ProductListingProps {
  products: Product[];
  searchQuery?: string;
  selectedCategory?: string;
  onViewProduct: (product: Product) => void;
  onViewShop?: (shopId: string) => void;
}

interface Filters {
  category: string[];
  brand: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
}

export const ProductListing: React.FC<ProductListingProps> = ({
  products,
  searchQuery = '',
  selectedCategory = 'all',
  onViewProduct,
  onViewShop
}) => {
  const [filters, setFilters] = useState<Filters>({
    category: selectedCategory === 'all' ? [] : [selectedCategory],
    brand: [],
    priceRange: [0, 2000],
    rating: 0,
    inStock: false
  });
  
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique brands
  const brands = useMemo(() => {
    return Array.from(new Set(products.map(p => p.brand))).sort();
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search query
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.brand.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.category.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(product.category)) {
        return false;
      }

      // Brand filter
      if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
        return false;
      }

      // Price range
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (product.rating < filters.rating) {
        return false;
      }

      // Stock filter
      if (filters.inStock && !product.inStock) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // In a real app, you'd have a createdAt field
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [products, searchQuery, filters, sortBy]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      brand: [],
      priceRange: [0, 2000],
      rating: 0,
      inStock: false
    });
  };

  const activeFilterCount = [
    ...filters.category,
    ...filters.brand,
    filters.rating > 0 ? 1 : 0,
    filters.inStock ? 1 : 0,
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) ? 1 : 0
  ].length;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <Card className="sticky top-24">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2">{activeFilterCount}</Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Categories */}
            <div>
              <h4 className="mb-3">Categories</h4>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={filters.category.includes(category.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleFilterChange('category', [...filters.category, category.name]);
                        } else {
                          handleFilterChange('category', filters.category.filter(c => c !== category.name));
                        }
                      }}
                    />
                    <label htmlFor={category.id} className="text-sm cursor-pointer">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Brands */}
            <div>
              <h4 className="mb-3">Brands</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={filters.brand.includes(brand)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleFilterChange('brand', [...filters.brand, brand]);
                        } else {
                          handleFilterChange('brand', filters.brand.filter(b => b !== brand));
                        }
                      }}
                    />
                    <label htmlFor={brand} className="text-sm cursor-pointer">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
              <h4 className="mb-3">Price Range</h4>
              <div className="space-y-4">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  max={2000}
                  step={10}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Rating */}
            <div>
              <h4 className="mb-3">Minimum Rating</h4>
              <Select 
                value={filters.rating.toString()} 
                onValueChange={(value) => handleFilterChange('rating', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="4">4 Stars & Up</SelectItem>
                  <SelectItem value="3">3 Stars & Up</SelectItem>
                  <SelectItem value="2">2 Stars & Up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
              />
              <label htmlFor="in-stock" className="text-sm cursor-pointer">
                In Stock Only
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2">{activeFilterCount}</Badge>
              )}
            </Button>
            
            <div>
              <h2>
                {searchQuery ? `Search results for "${searchQuery}"` : 
                 selectedCategory === 'all' ? 'All Products' : selectedCategory}
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} products found
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="hidden sm:flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3>No products found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your filters or search terms
            </p>
            <Button className="mt-4" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewProduct={onViewProduct}
                onViewShop={onViewShop}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};