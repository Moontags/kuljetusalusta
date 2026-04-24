-- 003_create_vehicles.sql
CREATE TABLE vehicles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    vehicle_class text NOT NULL CHECK (vehicle_class IN ('moped', 'car', 'van_small', 'van_large', 'truck_3t5', 'truck_7t5', 'truck_12t', 'semi_trailer')),
    reg_number text,
    max_payload_kg numeric,
    max_volume_m3 numeric,
    max_length_cm numeric,
    has_lift boolean DEFAULT false,
    has_cooling boolean DEFAULT false,
    is_adr_certified boolean DEFAULT false,
    active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX vehicles_tenant_id_idx ON vehicles(tenant_id);
CREATE INDEX vehicles_active_idx ON vehicles(active);
CREATE INDEX vehicles_created_at_idx ON vehicles(created_at);

-- RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY vehicles_tenant_rls ON vehicles
    USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
