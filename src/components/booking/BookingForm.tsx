import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DateSelector } from './DateSelector';
import { LocationSection } from './LocationSection';
import { PriceSummary } from './PriceSummary';
import { Car } from '../../types';

interface BookingFormProps {
  car: Car;
  dates: {
    startDate: string;
    endDate: string;
    pickupTime: string;
    returnTime: string;
  };
  pickupLocation: string;
  returnLocation: string;
  sameReturnLocation: boolean;
  deliveryFees: {
    pickupFee: number;
    returnFee: number;
    totalFee: number;
    requiresQuote: boolean;
  };
  discountCode: string;
  totalPrice: number;
  rentalDuration: number;
  isAvailable: boolean | null;
  isEditingDates: boolean;
  showPriceSummary: boolean;
  isCheckingAvailability: boolean;
  bookingLoading: boolean;
  onDatesSave: (dates: any) => void;
  onEditDatesToggle: () => void;
  onPickupLocationChange: (value: string) => void;
  onReturnLocationChange: (value: string) => void;
  onSameReturnLocationChange: (value: boolean) => void;
  onDiscountCodeChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  car,
  dates,
  pickupLocation,
  returnLocation,
  sameReturnLocation,
  deliveryFees,
  discountCode,
  totalPrice,
  rentalDuration,
  isAvailable,
  isEditingDates,
  showPriceSummary,
  isCheckingAvailability,
  bookingLoading,
  onDatesSave,
  onEditDatesToggle,
  onPickupLocationChange,
  onReturnLocationChange,
  onSameReturnLocationChange,
  onDiscountCodeChange,
  onSubmit
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold mb-6">Book Your Rental</h1>
      
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Rental Dates Section */}
        <DateSelector
          initialStartDate={dates.startDate}
          initialEndDate={dates.endDate}
          initialPickupTime={dates.pickupTime}
          initialReturnTime={dates.returnTime}
          isEditing={isEditingDates}
          onEditToggle={onEditDatesToggle}
          onSave={onDatesSave}
        />
        
        {/* Pickup & Return Locations */}
        <LocationSection
          pickupLocation={pickupLocation}
          returnLocation={returnLocation}
          sameReturnLocation={sameReturnLocation}
          deliveryFees={deliveryFees}
          onPickupLocationChange={onPickupLocationChange}
          onReturnLocationChange={onReturnLocationChange}
          onSameReturnLocationChange={onSameReturnLocationChange}
        />
        
        {/* Availability Status */}
        {!isEditingDates && isAvailable !== null && (
          <div className={`flex items-center justify-center p-3 rounded-md ${
            isAvailable 
              ? 'bg-success-50 text-success-700' 
              : 'bg-secondary-50 text-secondary-700'
          }`}>
            {isAvailable ? (
              <>
                <CheckCircle size={20} className="mr-2" />
                Car is available for your selected dates
              </>
            ) : (
              <>
                <AlertCircle size={20} className="mr-2" />
                Car is not available for these dates. Please select different dates.
              </>
            )}
          </div>
        )}
        
        {/* Loading Indicator */}
        {isCheckingAvailability && (
          <div className="flex items-center justify-center text-secondary-600">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-800 mr-2"></div>
            Checking availability...
          </div>
        )}
        
        {/* Discount Code */}
        <div>
          <Input
            label="Discount Code (Optional)"
            value={discountCode}
            onChange={(e) => onDiscountCodeChange(e.target.value)}
            placeholder="Enter discount code"
          />
        </div>
        
        {/* Price Summary */}
        {showPriceSummary && isAvailable && !isEditingDates && (
          <PriceSummary
            dailyRate={car.price_per_day}
            rentalDuration={rentalDuration}
            discountCode={discountCode}
            deliveryFee={deliveryFees.totalFee}
            requiresQuote={deliveryFees.requiresQuote}
            baseTotal={totalPrice}
          />
        )}
        
        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          isLoading={bookingLoading}
          disabled={(!isAvailable && !deliveryFees.requiresQuote) || bookingLoading || !dates.startDate || !dates.endDate || isEditingDates}
        >
          {deliveryFees.requiresQuote ? 'Request Quote' : 'Complete Booking'}
        </Button>
      </form>
    </div>
  );
};