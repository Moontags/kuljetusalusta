-- 001_create_tenants.sql
CREATE TABLE tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    company_name text NOT NULL,
    business_id text,
    contact_email text,
    phone text,
    plan text NOT NULL CHECK (plan IN ('starter', 'pro', 'business')),
    plan_expires_at timestamptz,
    vat_number text,
    mobilepay_merchant_id text,
    locale text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX tenants_slug_idx ON tenants(slug);
CREATE INDEX tenants_created_at_idx ON tenants(created_at);

-- RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenants_tenant_rls ON tenants
    USING (auth.uid() IS NOT NULL);
