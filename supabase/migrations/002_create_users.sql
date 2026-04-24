-- 002_create_users.sql
CREATE TABLE users (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('carrier_admin', 'carrier_driver', 'customer', 'superadmin')),
    full_name text,
    email text,
    phone text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX users_tenant_id_idx ON users(tenant_id);
CREATE INDEX users_role_idx ON users(role);
CREATE INDEX users_created_at_idx ON users(created_at);

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_tenant_rls ON users
    USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
