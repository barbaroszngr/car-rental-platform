-- Rollback migration: Remove booking flow changes and restore original state

-- Drop the expire function
DROP FUNCTION IF EXISTS expire_draft_bookings();

-- Remove the index
DROP INDEX IF EXISTS idx_bookings_expires_at;

-- Remove the comment
COMMENT ON COLUMN bookings.status IS NULL;

-- Restore original status constraint
ALTER TABLE bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- Drop the new columns
ALTER TABLE bookings 
DROP COLUMN IF EXISTS payment_initiated_at,
DROP COLUMN IF EXISTS payment_completed_at,
DROP COLUMN IF EXISTS booking_expires_at;

-- Update any bookings that have the new statuses to valid ones
UPDATE bookings 
SET status = 'pending' 
WHERE status IN ('draft', 'pending_payment', 'expired');