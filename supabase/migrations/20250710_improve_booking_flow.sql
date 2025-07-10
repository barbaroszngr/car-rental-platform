-- Improve booking flow with better status management
-- This migration adds new booking statuses and tracking fields

-- First, add new columns for better payment tracking
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS payment_initiated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS payment_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS booking_expires_at TIMESTAMPTZ;

-- Update the status constraint to include new statuses
ALTER TABLE bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('draft', 'pending_payment', 'pending', 'confirmed', 'cancelled', 'completed', 'expired'));

-- Create an index for finding expired draft bookings
CREATE INDEX IF NOT EXISTS idx_bookings_expires_at ON bookings(booking_expires_at) 
WHERE status IN ('draft', 'pending_payment');

-- Add a comment explaining the status flow
COMMENT ON COLUMN bookings.status IS 'Booking status flow: draft (initial) → pending_payment (payment started) → confirmed (paid) → completed (rental finished) or cancelled/expired';

-- Function to automatically expire old draft bookings
CREATE OR REPLACE FUNCTION expire_draft_bookings()
RETURNS void AS $$
BEGIN
  UPDATE bookings 
  SET status = 'expired'
  WHERE status IN ('draft', 'pending_payment')
    AND booking_expires_at < NOW()
    AND stripe_payment_intent_id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to run this function (requires pg_cron extension)
-- SELECT cron.schedule('expire-draft-bookings', '*/15 * * * *', 'SELECT expire_draft_bookings();');