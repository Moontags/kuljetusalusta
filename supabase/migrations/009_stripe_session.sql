-- 009_stripe_session.sql
-- Add Stripe session tracking and awaiting_payment status

ALTER TABLE shipment_requests
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

-- Drop and recreate the CHECK constraint to include awaiting_payment
ALTER TABLE shipment_requests
  DROP CONSTRAINT IF EXISTS shipment_requests_status_check;

ALTER TABLE shipment_requests
  ADD CONSTRAINT shipment_requests_status_check
  CHECK (status IN ('awaiting_payment', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'));
