-- 007_create_invoices.sql
CREATE TABLE invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    booking_id uuid REFERENCES bookings(id),
    invoice_number text,
    invoice_date date,
    due_date date,
    recipient_name text,
    recipient_email text,
    recipient_address text,
    recipient_business_id text,
    lines jsonb,
    total_excl_vat numeric,
    total_vat numeric,
    total_incl_vat numeric,
    payment_method text CHECK (payment_method IN ('mobilepay', 'bank_transfer', 'invoice')),
    status text CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    paid_at timestamptz,
    pdf_url text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX invoices_tenant_id_idx ON invoices(tenant_id);
CREATE INDEX invoices_status_idx ON invoices(status);
CREATE INDEX invoices_created_at_idx ON invoices(created_at);

-- RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY invoices_tenant_rls ON invoices
    USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
