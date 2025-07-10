import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { useLocations } from '../../hooks/useLocations';
import { QuoteRequestModal, type QuoteRequestData } from '../../components/ui/QuoteRequestModal';
import { useCarStore } from '../../stores/carStore';
import { useBookingStore } from '../../stores/bookingStore';
import { useAuthStore } from '../../stores/authStore';
import { useSearchStore } from '../../stores/searchStore';
import { useExtrasStore } from '../../stores/extrasStore';
import ExtrasModal from '../../components/booking/ExtrasModal';
import { BookingForm } from '../../components/booking/BookingForm';
import { CarSummaryCard } from '../../components/booking/CarSummaryCard';

const BookingPage: React.FC = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentCar, loading: carLoading, error: carError, fetchCarById } = useCarStore();
  const { 
    createBooking, 
    calculatePrice, 
    checkAvailability,
    loading: bookingLoading,
    isCheckingAvailability
  } = useBookingStore();
  const { searchParams, isSearchPerformed, updateSearchParams } = useSearchStore();
  const { saveBookingExtras, calculateTotal } = useExtrasStore();
  const { calculateDeliveryFee, DEFAULT_LOCATION } = useLocations();
  
  // Date states
  const [dates, setDates] = useState(() => ({
    startDate: isSearchPerformed ? searchParams.pickupDate : '',
    endDate: isSearchPerformed ? searchParams.returnDate : '',
    pickupTime: isSearchPerformed ? searchParams.pickupTime : '10:00',
    returnTime: isSearchPerformed ? searchParams.returnTime : '10:00'
  }));
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [showPriceSummary, setShowPriceSummary] = useState(false);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  
  // Location states - use lazy initialization
  const [pickupLocation, setPickupLocation] = useState(() => 
    searchParams.pickupLocation || DEFAULT_LOCATION?.value || ''
  );
  const [returnLocation, setReturnLocation] = useState(() => 
    searchParams.returnLocation || DEFAULT_LOCATION?.value || ''
  );
  const [sameReturnLocation, setSameReturnLocation] = useState(() => {
    const pickup = searchParams.pickupLocation || DEFAULT_LOCATION?.value || '';
    const returnLoc = searchParams.returnLocation || DEFAULT_LOCATION?.value || '';
    return pickup === returnLoc;
  });
  const [deliveryFees, setDeliveryFees] = useState({ 
    pickupFee: 0, 
    returnFee: 0, 
    totalFee: 0, 
    requiresQuote: false 
  });
  
  // Calculate delivery fees when locations change
  useEffect(() => {
    const returnLoc = sameReturnLocation ? pickupLocation : returnLocation;
    const fees = calculateDeliveryFee(pickupLocation, returnLoc);
    setDeliveryFees(fees);
  }, [pickupLocation, returnLocation, sameReturnLocation, calculateDeliveryFee]);
  
  // Update return location when pickup changes and same location is checked
  useEffect(() => {
    if (sameReturnLocation && returnLocation !== pickupLocation) {
      setReturnLocation(pickupLocation);
    }
  }, [pickupLocation, sameReturnLocation, returnLocation]);
  
  // Fetch car details on mount
  useEffect(() => {
    if (carId) {
      fetchCarById(parseInt(carId));
    }
    
    // If user navigated here without search parameters, redirect to car details
    if (!isSearchPerformed && carId) {
      toast.info('Please select rental dates first');
      navigate(`/cars/${carId}`);
    }
  }, [carId, fetchCarById, isSearchPerformed, navigate]);
  
  // Save date changes handler
  const handleDatesSave = (newDates: typeof dates) => {
    setDates(newDates);
    updateSearchParams({
      pickupDate: newDates.startDate,
      returnDate: newDates.endDate,
      pickupTime: newDates.pickupTime,
      returnTime: newDates.returnTime
    });
    setIsEditingDates(false);
    toast.success('Dates updated successfully');
    
    // Check availability immediately after saving
    checkAvailability(
      parseInt(carId!), 
      newDates.startDate, 
      newDates.endDate, 
      newDates.pickupTime, 
      newDates.returnTime
    ).then(available => setIsAvailable(available));
  };
  
  // Update price when dates change
  useEffect(() => {
    const updatePrice = async () => {
      if (!carId || !dates.startDate || !dates.endDate) {
        setTotalPrice(0);
        return;
      }
      
      const price = await calculatePrice(
        parseInt(carId), 
        dates.startDate, 
        dates.endDate, 
        dates.pickupTime, 
        dates.returnTime
      );
      setTotalPrice(price);
      setShowPriceSummary(true);
    };
    
    const timeoutId = setTimeout(updatePrice, 300);
    return () => clearTimeout(timeoutId);
  }, [carId, dates, calculatePrice]);
  
  // Check availability with debouncing
  useEffect(() => {
    const checkCarAvailability = async () => {
      if (!carId || !dates.startDate || !dates.endDate) {
        setIsAvailable(null);
        return;
      }
      
      const available = await checkAvailability(
        parseInt(carId), 
        dates.startDate, 
        dates.endDate, 
        dates.pickupTime, 
        dates.returnTime
      );
      setIsAvailable(available);
    };
    
    const timeoutId = setTimeout(checkCarAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [carId, dates, checkAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if locations are selected
    if (!pickupLocation || pickupLocation === 'select location') {
      toast.error('Please select a pickup location');
      return;
    }
    
    const finalReturnLocation = sameReturnLocation ? pickupLocation : returnLocation;
    if (!finalReturnLocation || finalReturnLocation === 'select location') {
      toast.error('Please select a return location');
      return;
    }
    
    // Check if quote is required
    if (deliveryFees.requiresQuote) {
      setShowQuoteModal(true);
      return;
    }
    
    if (!isAvailable) {
      toast.info('Please select dates when the car is available');
      // Scroll to the availability message for better visibility
      document.querySelector('.bg-secondary-50.text-secondary-700')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    
    // Open extras modal instead of creating booking directly
    setShowExtrasModal(true);
  };

  const handleExtrasModalContinue = async () => {
    try {
      
      // Calculate extras total
      const { extrasTotal } = calculateTotal(rentalDuration);
      const grandTotal = totalPrice + extrasTotal + (deliveryFees.requiresQuote ? 0 : deliveryFees.totalFee);
      
      // Create booking with draft status - if no user, we'll store the booking data temporarily
      if (user) {
        const booking = await createBooking({
          car_id: currentCar!.id,
          user_id: user.id,
          start_date: dates.startDate,
          end_date: dates.endDate,
          total_price: grandTotal,
          status: 'pending',
          pickup_location: pickupLocation,
          return_location: sameReturnLocation ? pickupLocation : returnLocation,
          pickup_time: dates.pickupTime,
          return_time: dates.returnTime
        });
        
        if (booking) {
          // Save selected extras to the booking
          await saveBookingExtras(booking.id, rentalDuration);
          
          // Navigate to payment page
          navigate(`/payment/${booking.id}`);
        }
      } else {
        // Get selected extras from the store
        const { selectedExtras } = useExtrasStore.getState();
        
        // Store booking data in localStorage for anonymous users
        const bookingData = {
          car_id: currentCar!.id,
          start_date: dates.startDate,
          end_date: dates.endDate,
          total_price: grandTotal,
          pickup_location: pickupLocation,
          return_location: sameReturnLocation ? pickupLocation : returnLocation,
          pickup_time: dates.pickupTime,
          return_time: dates.returnTime,
          extras: Array.from(selectedExtras.entries()).map(([id, { extra, quantity }]) => ({
            id,
            extra,
            quantity
          }))
        };
        
        localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
        
        // Navigate to payment page which will handle authentication
        navigate('/payment/pending');
      }
    } catch (error) {
      toast.error((error as Error).message || 'Failed to create booking');
    } finally {
      setShowExtrasModal(false);
    }
  };
  
  const handleQuoteRequest = async (quoteData: QuoteRequestData) => {
    // Here you would typically send the quote request to your backend
    // For now, we'll just store it in localStorage as a placeholder
    const quoteRequest = {
      ...quoteData,
      carId: currentCar?.id,
      carDetails: currentCar ? {
        make: currentCar.make,
        model: currentCar.model,
        year: currentCar.year
      } : null,
      pickupLocation,
      returnLocation,
      pickupDate: dates.startDate,
      returnDate: dates.endDate,
      pickupTime: dates.pickupTime,
      returnTime: dates.returnTime,
      requestDate: new Date().toISOString()
    };
    
    // Store in localStorage for demo purposes
    const existingQuotes = JSON.parse(localStorage.getItem('quoteRequests') || '[]');
    existingQuotes.push(quoteRequest);
    localStorage.setItem('quoteRequests', JSON.stringify(existingQuotes));
    
    // In a real app, you would send this to your backend API
    // await fetch('/api/quote-requests', { method: 'POST', body: JSON.stringify(quoteRequest) });
  };
  
  if (carLoading) {
    return (
      <div className="min-h-screen pt-16 pb-12 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-800"></div>
      </div>
    );
  }
  
  if (carError || !currentCar) {
    return (
      <div className="min-h-screen pt-16 pb-12 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Error loading car details</h2>
          <Link to="/cars">
            <Button variant="primary" leftIcon={<ArrowLeft size={20} />}>
              Back to Cars
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate rental duration
  const rentalDuration = dates.startDate && dates.endDate 
    ? (() => {
        const startDateTime = new Date(`${dates.startDate}T${dates.pickupTime}`);
        const endDateTime = new Date(`${dates.endDate}T${dates.returnTime}`);
        const diffMs = endDateTime.getTime() - startDateTime.getTime();
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      })()
    : 0;
  
  // Generate breadcrumb items
  const breadcrumbItems = currentCar ? [
    { label: 'Cars', path: '/cars' },
    { label: `${currentCar.make} ${currentCar.model} ${currentCar.year}`, path: `/cars/${carId}` },
    { label: 'Book Now', path: `/booking/${carId}` }
  ] : [];

  return (
    <div className="min-h-screen pt-16 pb-12 bg-secondary-50">
      <div className="container-custom">
        <PageHeader
          title="Complete Your Booking"
          subtitle={currentCar ? `${currentCar.make} ${currentCar.model} ${currentCar.year}` : ''}
          breadcrumbItems={breadcrumbItems}
          fallbackPath={`/cars/${carId}`}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm
              car={currentCar}
              dates={dates}
              pickupLocation={pickupLocation}
              returnLocation={returnLocation}
              sameReturnLocation={sameReturnLocation}
              deliveryFees={deliveryFees}
              discountCode={discountCode}
              totalPrice={totalPrice}
              rentalDuration={rentalDuration}
              isAvailable={isAvailable}
              isEditingDates={isEditingDates}
              showPriceSummary={showPriceSummary}
              isCheckingAvailability={isCheckingAvailability}
              bookingLoading={bookingLoading}
              onDatesSave={handleDatesSave}
              onEditDatesToggle={() => setIsEditingDates(!isEditingDates)}
              onPickupLocationChange={setPickupLocation}
              onReturnLocationChange={setReturnLocation}
              onSameReturnLocationChange={setSameReturnLocation}
              onDiscountCodeChange={setDiscountCode}
              onSubmit={handleSubmit}
            />
          </div>
          
          {/* Car Summary */}
          <div className="lg:col-span-1">
            <CarSummaryCard
              car={currentCar}
              pickupLocation={pickupLocation}
              returnLocation={returnLocation}
              deliveryFee={deliveryFees.totalFee}
              requiresQuote={deliveryFees.requiresQuote}
            />
          </div>
        </div>
      </div>
      {showExtrasModal && (
        <ExtrasModal
          isOpen={showExtrasModal}
          onClose={() => setShowExtrasModal(false)}
          onContinue={handleExtrasModalContinue}
          pickupDate={dates.startDate}
          returnDate={dates.endDate}
          rentalDays={rentalDuration}
          carTotal={totalPrice}
          deliveryFee={deliveryFees.totalFee}
          requiresQuote={deliveryFees.requiresQuote}
        />
      )}
      
      {showQuoteModal && (
        <QuoteRequestModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          onSubmit={handleQuoteRequest}
          pickupLocation={pickupLocation}
          returnLocation={returnLocation}
          pickupDate={dates.startDate}
          returnDate={dates.endDate}
          carDetails={currentCar ? {
            make: currentCar.make,
            model: currentCar.model,
            year: currentCar.year
          } : undefined}
        />
      )}
    </div>
  );
};

export default BookingPage;