-- 005_create_pricing_surcharges.sql
CREATE TABLE pricing_surcharges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pricing_rule_id uuid NOT NULL REFERENCES pricing_rules(id) ON DELETE CASCADE,
    surcharge_type text NOT NULL CHECK (surcharge_type IN ('helper', 'evening', 'night', 'weekend', 'holiday', 'hazardous', 'overweight', 'oversize', 'cooling', 'express')),
    label text,
    amount_type text NOT NULL CHECK (amount_type IN ('fixed', 'percent')),
    amount numeric NOT NULL,
    applies_per text NOT NULL CHECK (applies_per IN ('booking', 'hour', 'km', 'kg', 'm3')),
    time_start time,
    time_end time,
    days_of_week int[],
    weight_over_kg numeric,
    is_optional boolean DEFAULT false,
    active boolean DEFAULT true
);

-- Indexes
CREATE INDEX pricing_surcharges_pricing_rule_id_idx ON pricing_surcharges(pricing_rule_id);
CREATE INDEX pricing_surcharges_active_idx ON pricing_surcharges(active);

-- RLS
ALTER TABLE pricing_surcharges ENABLE ROW LEVEL SECURITY;
CREATE POLICY pricing_surcharges_rls ON pricing_surcharges
    USING (pricing_rule_id IN (SELECT id FROM pricing_rules WHERE tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid())));
