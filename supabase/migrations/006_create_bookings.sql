-- 006_create_bookings.sql
CREATE TABLE bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    vehicle_id uuid REFERENCES vehicles(id),
    pricing_rule_id uuid REFERENCES pricing_rules(id),
    order_id text UNIQUE NOT NULL,
    customer_name text,
    customer_email text,
    customer_phone text,
    pickup_address text,
    pickup_lat numeric,
    pickup_lng numeric,
    delivery_address text,
    delivery_lat numeric,
    delivery_lng numeric,
    distance_km numeric,
    duration_hours numeric,
    cargo_weight_kg numeric,
    cargo_volume_m3 numeric,
    cargo_length_cm numeric,
    cargo_description text,
    cargo_type text CHECK (cargo_type IN ('furniture', 'boxes', 'pallet', 'vehicle', 'hazardous', 'other')),
    is_hazardous boolean DEFAULT false,
    needs_lift boolean DEFAULT false,
    needs_cooling boolean DEFAULT false,
    helpers_count int,
    scheduled_at timestamptz,
    price_base numeric,
    price_km numeric,
    price_hours numeric,
    price_surcharges numeric,
    price_total_excl_vat numeric,
    price_total_incl_vat numeric,
    status text NOT NULL CHECK (status IN ('draft', 'pending_payment', 'confirmed', 'in_transit', 'delivered', 'cancelled', 'refunded')),
    notes text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX bookings_tenant_id_idx ON bookings(tenant_id);
CREATE INDEX bookings_status_idx ON bookings(status);
CREATE INDEX bookings_created_at_idx ON bookings(created_at);

-- RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY bookings_tenant_rls ON bookings
    USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
