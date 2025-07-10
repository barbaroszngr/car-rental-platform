import React from 'react';
import { Users, Gauge, MapPin, CreditCard } from 'lucide-react';
import { Car } from '../../types';
import { useLocations } from '../../hooks/useLocations';

interface CarSummaryCardProps {
  car: Car;
  pickupLocation: string;
  returnLocation: string;
  deliveryFee: number;
  requiresQuote: boolean;
}

export const CarSummaryCard: React.FC<CarSummaryCardProps> = ({
  car,
  pickupLocation,
  returnLocation,
  deliveryFee,
  requiresQuote
}) => {
  const { getLocationByValue } = useLocations();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img 
          src={car.image_url} 
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-1">
          {car.make} {car.model} {car.year}
        </h2>
        <p className="text-primary-800 font-semibold mb-4">
          ${car.price_per_day}/day
        </p>
        
        <div className="border-t border-secondary-200 py-4 my-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-primary-700 mr-2" />
              <div>
                <p className="text-xs text-secondary-600">Seats</p>
                <p className="text-sm font-medium">{car.seats || 5}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Gauge className="h-5 w-5 text-primary-700 mr-2" />
              <div>
                <p className="text-xs text-secondary-600">Mileage</p>
                <p className="text-sm font-medium">{car.mileage_type || 'Unlimited'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-secondary-600 space-y-2">
          <div>
            <p className="font-medium text-secondary-800 mb-1">Pickup Location:</p>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary-600" />
              <span>{getLocationByValue(pickupLocation)?.label || 'Not specified'}</span>
            </div>
          </div>
          
          <div>
            <p className="font-medium text-secondary-800 mb-1">Return Location:</p>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary-600" />
              <span>{getLocationByValue(returnLocation)?.label || 'Not specified'}</span>
            </div>
          </div>
          
          {deliveryFee > 0 && !requiresQuote && (
            <div className="pt-2 border-t border-secondary-200">
              <span className="font-medium text-secondary-800">Delivery Fee: </span>
              <span className="text-green-600 font-medium">${deliveryFee}</span>
            </div>
          )}
          
          <div className="pt-2 flex items-center gap-2">
            <CreditCard size={16} className="text-green-600" />
            <span className="text-green-600 font-medium">Secure online payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};