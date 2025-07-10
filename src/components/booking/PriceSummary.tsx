import React from 'react';

interface PriceSummaryProps {
  dailyRate: number;
  rentalDuration: number;
  discountCode?: string;
  deliveryFee: number;
  requiresQuote: boolean;
  baseTotal: number;
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  dailyRate,
  rentalDuration,
  discountCode,
  deliveryFee,
  requiresQuote,
  baseTotal
}) => {
  const total = baseTotal + (requiresQuote ? 0 : deliveryFee);

  return (
    <div className="bg-secondary-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-2">Price Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-secondary-600">Daily Rate:</span>
          <span>${dailyRate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-secondary-600">Duration:</span>
          <span>{rentalDuration} days</span>
        </div>
        {discountCode && (
          <div className="flex justify-between text-success-600">
            <span>Discount:</span>
            <span>Applied</span>
          </div>
        )}
        {deliveryFee > 0 && !requiresQuote && (
          <div className="flex justify-between">
            <span className="text-secondary-600">Delivery Fee:</span>
            <span>${deliveryFee}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-secondary-200">
          <span>Total:</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  );
};