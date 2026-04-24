-- 008_create_shipment_requests.sql
CREATE TABLE shipment_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name text NOT NULL,
    sender_email text NOT NULL,
    sender_phone text,
    pickup_address text NOT NULL,
    delivery_address text NOT NULL,
    distance_km numeric NOT NULL,
    cargo_description text,
    cargo_weight_kg numeric,
    cargo_volume_m3 numeric,
    needs_lift boolean DEFAULT false,
    is_hazardous boolean DEFAULT false,
    helpers_count integer DEFAULT 0,
    scheduled_at timestamptz,
    price_total_excl_vat numeric,
    price_total_incl_vat numeric,
    pricing_rule_id uuid REFERENCES pricing_rules(id),
    status text NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    notes text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX shipment_requests_status_idx ON shipment_requests(status);
CREATE INDEX shipment_requests_created_at_idx ON shipment_requests(created_at);
