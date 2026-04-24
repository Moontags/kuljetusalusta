-- 004_create_pricing_rules.sql
CREATE TABLE pricing_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    vehicle_id uuid REFERENCES vehicles(id),
    name text NOT NULL,
    pricing_model text NOT NULL CHECK (pricing_model IN ('fixed', 'per_km', 'per_hour', 'combo_base_km', 'combo_base_h', 'combo_full')),
    base_price numeric,
    price_per_km numeric,
    price_per_hour numeric,
    min_km numeric,
    min_hours numeric,
    free_km numeric,
    vat_rate numeric,
    currency text,
    active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX pricing_rules_tenant_id_idx ON pricing_rules(tenant_id);
CREATE INDEX pricing_rules_active_idx ON pricing_rules(active);
CREATE INDEX pricing_rules_created_at_idx ON pricing_rules(created_at);

-- RLS
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY pricing_rules_tenant_rls ON pricing_rules
    USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
