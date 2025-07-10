import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useBookingDates } from '../../hooks/useBookingDates';

interface DateSelectorProps {
  initialStartDate?: string;
  initialEndDate?: string;
  initialPickupTime?: string;
  initialReturnTime?: string;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: (dates: {
    startDate: string;
    endDate: string;
    pickupTime: string;
    returnTime: string;
  }) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  initialStartDate,
  initialEndDate,
  initialPickupTime,
  initialReturnTime,
  isEditing,
  onEditToggle,
  onSave
}) => {
  const {
    startDate,
    endDate,
    pickupTime,
    returnTime,
    rentalDuration,
    validationMessage,
    isValidDates,
    handleStartDateChange,
    handleEndDateChange,
    handlePickupTimeChange,
    handleReturnTimeChange
  } = useBookingDates({
    initialStartDate,
    initialEndDate,
    initialPickupTime,
    initialReturnTime
  });

  const handleSave = () => {
    if (isValidDates) {
      onSave({ startDate, endDate, pickupTime, returnTime });
    }
  };

  const generateTimeOptions = () => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return { value: `${hour}:00`, label: `${hour}:00` };
    });
  };

  return (
    <div className="bg-secondary-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Rental Dates</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onEditToggle}
        >
          {isEditing ? 'Cancel' : 'Edit Dates'}
        </Button>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Pickup Date"
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              min={format(new Date(), 'yyyy-MM-dd')}
              leftIcon={<Calendar size={20} />}
            />
            
            <Input
              label="Return Date"
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate}
              leftIcon={<Calendar size={20} />}
              disabled={!startDate}
            />
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Pickup Time
              </label>
              <div className="relative">
                <Clock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500" />
                <select
                  value={pickupTime}
                  onChange={handlePickupTimeChange}
                  className="pl-10 pr-4 py-2 w-full border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  {generateTimeOptions().map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Return Time
              </label>
              <div className="relative">
                <Clock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500" />
                <select
                  value={returnTime}
                  onChange={handleReturnTimeChange}
                  className="pl-10 pr-4 py-2 w-full border border-secondary-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  {generateTimeOptions().map(({ value, label }) => {
                    const isSameDay = startDate === endDate;
                    const isDisabled = isSameDay && parseInt(value) <= parseInt(pickupTime);
                    
                    return (
                      <option 
                        key={value} 
                        value={value}
                        disabled={isDisabled}
                      >
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>
          
          {validationMessage && (
            <p className="text-error-500 text-sm">{validationMessage}</p>
          )}
          
          <div className="flex justify-end">
            <Button 
              variant="primary" 
              size="sm"
              onClick={handleSave}
              disabled={!isValidDates}
            >
              Save Changes
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-2 md:mb-0">
            <div className="text-sm text-secondary-600">Pickup Date</div>
            <div className="font-medium">
              {format(new Date(startDate), 'MMM d, yyyy')} at {pickupTime}
            </div>
          </div>
          <div>
            <div className="text-sm text-secondary-600">Return Date</div>
            <div className="font-medium">
              {format(new Date(endDate), 'MMM d, yyyy')} at {returnTime}
            </div>
          </div>
          <div>
            <div className="text-sm text-secondary-600">Duration</div>
            <div className="font-medium">{rentalDuration} days</div>
          </div>
        </div>
      )}
    </div>
  );
};