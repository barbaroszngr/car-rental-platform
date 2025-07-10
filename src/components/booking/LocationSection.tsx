import React from 'react';
import { Info } from 'lucide-react';
import { LocationSelector } from '../ui/LocationSelector';

interface LocationSectionProps {
  pickupLocation: string;
  returnLocation: string;
  sameReturnLocation: boolean;
  deliveryFees: {
    pickupFee: number;
    returnFee: number;
    totalFee: number;
    requiresQuote: boolean;
  };
  onPickupLocationChange: (value: string) => void;
  onReturnLocationChange: (value: string) => void;
  onSameReturnLocationChange: (value: boolean) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  pickupLocation,
  returnLocation,
  sameReturnLocation,
  deliveryFees,
  onPickupLocationChange,
  onReturnLocationChange,
  onSameReturnLocationChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Pickup & Return Locations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LocationSelector
          label="Pickup Location"
          value={pickupLocation}
          onChange={onPickupLocationChange}
          showCategories={true}
          hideFeesInOptions={true}
          excludeCustom={true}
        />
        
        <LocationSelector
          label="Return Location"
          value={returnLocation}
          onChange={onReturnLocationChange}
          showCategories={true}
          hideFeesInOptions={true}
          excludeCustom={true}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="same-return-booking"
          checked={sameReturnLocation}
          onChange={(e) => onSameReturnLocationChange(e.target.checked)}
          className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="same-return-booking" className="text-sm text-gray-700">
          Return to same location
        </label>
      </div>
      
      {(deliveryFees.totalFee > 0 || deliveryFees.requiresQuote) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                {deliveryFees.requiresQuote ? (
                  <>
                    <p className="text-blue-900 font-semibold">Custom Location Quote</p>
                    <p className="text-blue-700 text-sm">We'll contact you with delivery pricing</p>
                  </>
                ) : (
                  <>
                    <p className="text-blue-900 font-semibold">
                      {sameReturnLocation ? 'Delivery Service' : 'Pickup & Return Service'}
                    </p>
                    <p className="text-blue-700 text-sm">
                      {sameReturnLocation 
                        ? `Same location pickup & return`
                        : `Split delivery: Pickup + Return`
                      }
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              {deliveryFees.requiresQuote ? (
                <span className="text-lg font-bold text-orange-600">Quote</span>
              ) : (
                <span className="text-2xl font-bold text-blue-900">${deliveryFees.totalFee}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};