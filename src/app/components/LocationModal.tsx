import React, { useState } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useApp } from '../contexts/AppContext';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, requestLocation, setUserLocation } = useApp();
  const [searchAddress, setSearchAddress] = useState('');

  const handleUseCurrentLocation = () => {
    requestLocation();
  };

  const handleSearchAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchAddress.trim()) {
      // Mock geocoding - in real app this would call a geocoding API
      setUserLocation({
        latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
        address: searchAddress
      });
      setIsLocationModalOpen(false);
    }
  };

  const popularAreas = [
    'Downtown San Francisco',
    'Mission District',
    'Castro',
    'Chinatown',
    'Financial District',
    'SOMA'
  ];

  return (
    <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-red-500" />
            Choose Location
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Location */}
          <div className="text-center">
            <Button 
              onClick={handleUseCurrentLocation}
              className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Use My Current Location
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Get accurate delivery time and nearby shops
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Search Address */}
          <form onSubmit={handleSearchAddress} className="space-y-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter your address..."
                value={searchAddress}
                onChange={(e) => setSearchAddress(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button type="submit" variant="outline" className="w-full">
              Set Location
            </Button>
          </form>

          {/* Popular Areas */}
          <div>
            <h4 className="text-sm font-medium mb-3">Popular Areas</h4>
            <div className="grid grid-cols-2 gap-2">
              {popularAreas.map((area) => (
                <Button
                  key={area}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-left h-auto py-2 px-3"
                  onClick={() => {
                    setUserLocation({
                      latitude: 37.7749 + (Math.random() - 0.5) * 0.02,
                      longitude: -122.4194 + (Math.random() - 0.5) * 0.02,
                      address: area
                    });
                    setIsLocationModalOpen(false);
                  }}
                >
                  <MapPin className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span className="text-xs">{area}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};