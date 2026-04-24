// src/types/database.ts
type Plan = 'starter' | 'pro' | 'business';
type UserRole = 'carrier_admin' | 'carrier_driver' | 'customer' | 'superadmin';
type VehicleClass = 'moped' | 'car' | 'van_small' | 'van_large' | 'truck_3t5' | 'truck_7t5' | 'truck_12t' | 'semi_trailer';
type PricingModel = 'fixed' | 'per_km' | 'per_hour' | 'combo_base_km' | 'combo_base_h' | 'combo_full';
type SurchargeType = 'helper' | 'evening' | 'night' | 'weekend' | 'holiday' | 'hazardous' | 'overweight' | 'oversize' | 'cooling' | 'express';
type AmountType = 'fixed' | 'percent';
type AppliesPer = 'booking' | 'hour' | 'km' | 'kg' | 'm3';
type CargoType = 'furniture' | 'boxes' | 'pallet' | 'vehicle' | 'hazardous' | 'other';
type BookingStatus = 'draft' | 'pending_payment' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'refunded';
type InvoicePaymentMethod = 'mobilepay' | 'bank_transfer' | 'invoice';
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Tenant {
  id: string;
  slug: string;
  company_name: string;
  business_id?: string;
  contact_email?: string;
  phone?: string;
  plan: Plan;
  plan_expires_at?: string;
  vat_number?: string;
  mobilepay_merchant_id?: string;
  locale?: string;
  created_at: string;
}

export interface User {
  id: string;
  tenant_id: string;
  role: UserRole;
  full_name?: string;
  email?: string;
  phone?: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  tenant_id: string;
  name: string;
  vehicle_class: VehicleClass;
  reg_number?: string;
  max_payload_kg?: number;
  max_volume_m3?: number;
  max_length_cm?: number;
  has_lift?: boolean;
  has_cooling?: boolean;
  is_adr_certified?: boolean;
  active?: boolean;
  created_at: string;
}

export interface PricingRule {
  id: string;
  tenant_id: string;
  vehicle_id?: string;
  name: string;
  pricing_model: PricingModel;
  base_price?: number;
  price_per_km?: number;
  price_per_hour?: number;
  min_km?: number;
  min_hours?: number;
  free_km?: number;
  vat_rate?: number;
  currency?: string;
  active?: boolean;
  created_at: string;
}

export interface PricingSurcharge {
  id: string;
  pricing_rule_id: string;
  surcharge_type: SurchargeType;
  label?: string;
  amount_type: AmountType;
  amount: number;
  applies_per: AppliesPer;
  time_start?: string;
  time_end?: string;
  days_of_week?: number[];
  weight_over_kg?: number;
  is_optional?: boolean;
  active?: boolean;
}

export interface Booking {
  id: string;
  tenant_id: string;
  vehicle_id?: string;
  pricing_rule_id?: string;
  order_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  pickup_address?: string;
  pickup_lat?: number;
  pickup_lng?: number;
  delivery_address?: string;
  delivery_lat?: number;
  delivery_lng?: number;
  distance_km?: number;
  duration_hours?: number;
  cargo_weight_kg?: number;
  cargo_volume_m3?: number;
  cargo_length_cm?: number;
  cargo_description?: string;
  cargo_type?: CargoType;
  is_hazardous?: boolean;
  needs_lift?: boolean;
  needs_cooling?: boolean;
  helpers_count?: number;
  scheduled_at?: string;
  price_base?: number;
  price_km?: number;
  price_hours?: number;
  price_surcharges?: number;
  price_total_excl_vat?: number;
  price_total_incl_vat?: number;
  status: BookingStatus;
  notes?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  booking_id?: string;
  invoice_number?: string;
  invoice_date?: string;
  due_date?: string;
  recipient_name?: string;
  recipient_email?: string;
  recipient_address?: string;
  recipient_business_id?: string;
  lines?: any;
  total_excl_vat?: number;
  total_vat?: number;
  total_incl_vat?: number;
  payment_method?: InvoicePaymentMethod;
  status?: InvoiceStatus;
  paid_at?: string;
  pdf_url?: string;
  created_at: string;
}

export interface Database {
  tenants: Tenant;
  users: User;
  vehicles: Vehicle;
  pricing_rules: PricingRule;
  pricing_surcharges: PricingSurcharge;
  bookings: Booking;
  invoices: Invoice;
}
