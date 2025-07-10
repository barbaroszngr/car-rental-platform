import { useState, useCallback, useEffect } from 'react';
import { format, isBefore, isValid, parseISO } from 'date-fns';
import { toast } from 'sonner';

interface UseBookingDatesProps {
  initialStartDate?: string;
  initialEndDate?: string;
  initialPickupTime?: string;
  initialReturnTime?: string;
}

interface UseBookingDatesReturn {
  startDate: string;
  endDate: string;
  pickupTime: string;
  returnTime: string;
  rentalDuration: number;
  validationMessage: string;
  isValidDates: boolean;
  handleStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePickupTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleReturnTimeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  validateDates: () => boolean;
  resetValidation: () => void;
}

export const useBookingDates = ({
  initialStartDate,
  initialEndDate,
  initialPickupTime = '10:00',
  initialReturnTime = '10:00'
}: UseBookingDatesProps = {}): UseBookingDatesReturn => {
  // Initialize dates
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [startDate, setStartDate] = useState(initialStartDate || format(today, 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(initialEndDate || format(tomorrow, 'yyyy-MM-dd'));
  const [pickupTime, setPickupTime] = useState(initialPickupTime);
  const [returnTime, setReturnTime] = useState(initialReturnTime);
  const [validationMessage, setValidationMessage] = useState('');

  // Calculate rental duration
  const rentalDuration = startDate && endDate 
    ? (() => {
        const startDateTime = new Date(`${startDate}T${pickupTime}`);
        const endDateTime = new Date(`${endDate}T${returnTime}`);
        const diffMs = endDateTime.getTime() - startDateTime.getTime();
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      })()
    : 0;

  // Validate dates
  const validateDates = useCallback(() => {
    if (!startDate || !endDate) {
      setValidationMessage('Please select both dates');
      return false;
    }

    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    if (!isValid(start) || !isValid(end)) {
      setValidationMessage('Invalid date format');
      return false;
    }

    if (isBefore(end, start)) {
      setValidationMessage('Return date cannot be before pickup date');
      return false;
    }
    
    // For same-day rentals, validate time
    if (startDate === endDate) {
      const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
      const [returnHour, returnMinute] = returnTime.split(':').map(Number);
      const pickupTimeInMinutes = pickupHour * 60 + pickupMinute;
      const returnTimeInMinutes = returnHour * 60 + returnMinute;
      
      if (returnTimeInMinutes <= pickupTimeInMinutes) {
        setValidationMessage('For same-day rentals, return time must be after pickup time');
        return false;
      }
    }

    setValidationMessage('');
    return true;
  }, [startDate, endDate, pickupTime, returnTime]);

  // Auto-validate when dates change
  useEffect(() => {
    if (startDate && endDate) {
      validateDates();
    }
  }, [startDate, endDate, pickupTime, returnTime, validateDates]);

  const resetValidation = useCallback(() => {
    setValidationMessage('');
  }, []);

  const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    
    // If end date is before new start date, adjust it
    if (endDate && isBefore(parseISO(endDate), parseISO(newStartDate))) {
      const nextDay = new Date(newStartDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setEndDate(format(nextDay, 'yyyy-MM-dd'));
    }
    // If no end date set, default to next day
    else if (!endDate) {
      const nextDay = new Date(newStartDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setEndDate(format(nextDay, 'yyyy-MM-dd'));
    }
  }, [endDate]);

  const handleEndDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    
    // If switching to same-day rental, validate return time
    if (startDate === newEndDate) {
      const [pickupHour] = pickupTime.split(':').map(Number);
      const [returnHour] = returnTime.split(':').map(Number);
      
      if (returnHour <= pickupHour) {
        // Auto-adjust return time to be at least 1 hour after pickup
        const newReturnHour = pickupHour + 1;
        if (newReturnHour < 24) {
          setReturnTime(`${newReturnHour.toString().padStart(2, '0')}:00`);
        } else {
          // Can't do same-day rental if pickup is too late
          toast.info('Same-day rental not available for late pickup times');
          const nextDay = new Date(startDate);
          nextDay.setDate(nextDay.getDate() + 1);
          setEndDate(format(nextDay, 'yyyy-MM-dd'));
        }
      }
    }
  }, [startDate, pickupTime, returnTime]);

  const handlePickupTimeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPickupTime = e.target.value;
    setPickupTime(newPickupTime);
    
    // If same-day rental, ensure return time is still valid
    if (startDate === endDate) {
      const [newPickupHour] = newPickupTime.split(':').map(Number);
      const [returnHour] = returnTime.split(':').map(Number);
      
      if (returnHour <= newPickupHour) {
        // Auto-adjust return time to be at least 1 hour after pickup
        const newReturnHour = newPickupHour + 1;
        if (newReturnHour < 24) {
          setReturnTime(`${newReturnHour.toString().padStart(2, '0')}:00`);
        } else {
          // If it would go past midnight, set return to next day
          const nextDay = new Date(startDate);
          nextDay.setDate(nextDay.getDate() + 1);
          setEndDate(format(nextDay, 'yyyy-MM-dd'));
          setReturnTime('10:00');
        }
      }
    }
  }, [startDate, endDate, returnTime]);

  const handleReturnTimeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newReturnTime = e.target.value;
    
    // If same-day rental, validate return time is after pickup time
    if (startDate === endDate) {
      const [pickupHour] = pickupTime.split(':').map(Number);
      const [returnHour] = newReturnTime.split(':').map(Number);
      
      if (returnHour <= pickupHour) {
        toast.error('Return time must be after pickup time for same-day rentals');
        // Set to first available time
        const firstAvailableHour = pickupHour + 1;
        if (firstAvailableHour < 24) {
          setReturnTime(`${firstAvailableHour.toString().padStart(2, '0')}:00`);
        }
        return;
      }
    }
    
    setReturnTime(newReturnTime);
  }, [startDate, endDate, pickupTime]);

  // Memoize isValidDates to prevent recalculation on every render
  const isValidDates = !validationMessage && startDate && endDate;

  return {
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
    handleReturnTimeChange,
    validateDates,
    resetValidation
  };
};