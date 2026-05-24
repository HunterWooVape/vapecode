create table if not exists merchants (
  id text primary key,
  name text not null,
  domain text not null unique,
  homepage_url text not null,
  category text,
  country text default 'US',
  supports_wholesale boolean default true,
  requires_license boolean default true,
  age_gate_present boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  merchant_id text references merchants(id) on delete cascade,
  offer_type text not null check (offer_type in ('coupon_code', 'automatic_discount', 'free_shipping', 'reward', 'sale')),
  code text,
  title text not null,
  description text,
  discount_value text,
  minimum_order_value numeric,
  applicable_products text,
  source_url text not null,
  source_type text not null check (source_type in ('official', 'semrush_backlink', 'coupon_site', 'newsletter', 'community')),
  confidence text not null check (confidence in ('verified', 'official', 'reported', 'expired', 'rejected')),
  last_checked_at date,
  expires_at date,
  requires_account boolean default true,
  requires_license boolean default true,
  stackable boolean,
  state_restrictions text,
  internal_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists source_pages (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  domain text,
  page_title text,
  anchor_text text,
  target_domain text,
  semrush_export_batch_id text,
  detected_codes text[],
  raw_offer_text text,
  review_status text not null default 'new' check (review_status in ('new', 'parsed', 'needs_review', 'approved', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  buyer_type text,
  state text,
  interested_categories text,
  is_21_plus boolean not null default false,
  consent_text text not null,
  consented_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  business_email text not null,
  state text not null,
  monthly_purchase_volume text,
  product_categories text,
  license_status text,
  notes text,
  partner_contact_consent boolean not null default false,
  consent_text text not null,
  consented_at timestamptz default now(),
  review_status text not null default 'new' check (review_status in ('new', 'qualified', 'contacted', 'rejected')),
  created_at timestamptz default now()
);
