CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fname VARCHAR(100),
  mname VARCHAR(100),
  lname VARCHAR(100),
  full_name VARCHAR(255),
  gender VARCHAR(50),
  birthday DATE,
  profile_image_url TEXT,
  prc_number VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  role TEXT DEFAULT 'agent',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_profiles_user_id_key UNIQUE (user_id)
);

ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS prc_number VARCHAR(50);

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, fname, lname, full_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'first_name', 
    NEW.raw_user_meta_data->>'last_name',
    CONCAT(NEW.raw_user_meta_data->>'first_name', ' ', NEW.raw_user_meta_data->>'last_name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

CREATE TABLE public.user_roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.user_roles (role_name, description) VALUES
('super_admin', 'Full system access, including system configuration and logs'),
('admin', 'General administrative access for managing users and projects'),
('broker', 'Licensed real estate broker overseeing multiple salespersons'),
('salesperson', 'Accredited salesperson focused on lead management and sales'),
('buyer', 'Property seeker or current unit owner'),
('ambassador', 'Referral partner or influencer promoting projects'),
('developer', 'Representative from the real estate development company'),
('bank_manager', 'Banking partner for home loan processing and financing');

-- This ensures the role in user_profiles matches a role_name in user_roles
ALTER TABLE public.user_profiles
ADD CONSTRAINT fk_user_role
FOREIGN KEY (role) 
REFERENCES public.user_roles(role_name)
ON UPDATE CASCADE;

-- Function to update the timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to Contact Info
CREATE TRIGGER update_contact_info_modtime
    BEFORE UPDATE ON public.contact_information
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Apply to Addresses
CREATE TRIGGER update_addresses_modtime
    BEFORE UPDATE ON public.addresses
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Link Contact Information to Companies and Developers
ALTER TABLE public.contact_information
ADD CONSTRAINT fk_contact_company FOREIGN KEY (company_id) REFERENCES public.company_profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_contact_developer FOREIGN KEY (developer_id) REFERENCES public.developers_profiles(id) ON DELETE CASCADE;

-- Link Addresses to Companies and Developers
ALTER TABLE public.addresses
ADD CONSTRAINT fk_address_company FOREIGN KEY (company_id) REFERENCES public.company_profiles(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_address_developer FOREIGN KEY (developer_id) REFERENCES public.developers_profiles(id) ON DELETE CASCADE;

-- Re-create Company Profiles
DROP TABLE IF EXISTS public.company_profiles CASCADE;
CREATE TABLE public.company_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_profile_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(150),
  website_url TEXT,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Re-create Developer Profiles
DROP TABLE IF EXISTS public.developers_profiles CASCADE;
CREATE TABLE public.developers_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_profile_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  developer_name VARCHAR(255) NOT NULL,
  industry VARCHAR(150),
  website_url TEXT,
  description TEXT,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.developers_profiles
ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- Create Contact Information
DROP TABLE IF EXISTS public.contact_information CASCADE;
CREATE TABLE public.contact_information (
  id BIGSERIAL PRIMARY KEY,
  user_profile_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  company_id BIGINT REFERENCES public.company_profiles(id) ON DELETE CASCADE,
  developer_id BIGINT REFERENCES public.developers_profiles(id) ON DELETE CASCADE,
  primary_mobile VARCHAR(20),
  secondary_mobile VARCHAR(20),
  telephone VARCHAR(20),
  email VARCHAR(255),
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Addresses
DROP TABLE IF EXISTS public.addresses CASCADE;
CREATE TABLE public.addresses (
  id BIGSERIAL PRIMARY KEY,
  user_profile_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  company_id BIGINT REFERENCES public.company_profiles(id) ON DELETE CASCADE,
  developer_id BIGINT REFERENCES public.developers_profiles(id) ON DELETE CASCADE,
  label VARCHAR(100),
  full_address TEXT,
  street VARCHAR(150),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Philippines',
  zip_code VARCHAR(20),
  longitude DECIMAL(9,6),
  latitude DECIMAL(9,6),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.developer_contact_persons (
  id BIGSERIAL PRIMARY KEY,
  developer_id BIGINT REFERENCES public.developers_profiles(id) ON DELETE CASCADE,
  fname VARCHAR(100),
  mname VARCHAR(100),
  lname VARCHAR(100),
  full_name VARCHAR(255),
  position VARCHAR(150), -- e.g., 'Sales Director', 'Account Manager'
  email VARCHAR(255),
  mobile_number VARCHAR(20),
  telephone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.set_developer_contact_fullname()
RETURNS trigger AS $$
BEGIN
  NEW.full_name := TRIM(CONCAT(NEW.fname, ' ', NEW.mname, ' ', NEW.lname));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_set_developer_contact_fullname
  BEFORE INSERT OR UPDATE ON public.developer_contact_persons
  FOR EACH ROW EXECUTE FUNCTION public.set_developer_contact_fullname();

  -----

CREATE TABLE public.amenities (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.project_amenities (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE,
  amenity_id BIGINT REFERENCES public.amenities(id) ON DELETE CASCADE,
  -- Ensure a project doesn't have the same amenity listed twice
  CONSTRAINT unique_project_amenity UNIQUE(project_id, amenity_id)
);

CREATE TABLE public.property_types (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.project_property_types (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE,
  property_type_id BIGINT REFERENCES public.property_types(id) ON DELETE CASCADE,
  -- Ensure a project doesn't have the same type listed twice
  CONSTRAINT unique_project_property_type UNIQUE(project_id, property_type_id)
);

-----

CREATE TABLE public.projects (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  developer_id BIGINT REFERENCES public.developers_profiles(id) ON DELETE SET NULL,

  -- Regulatory Fields (PH Compliance)
  lts_number TEXT,
  lts_issued_date DATE,
  dhsud_registration_number TEXT,
  project_type TEXT, -- e.g., Condominium, Subdivision
  classification TEXT, -- e.g., Socialized, Economic, Open Market

  -- Location Details
  region TEXT,
  province TEXT,
  city_municipality TEXT,
  barangay TEXT,
  island_group TEXT, -- Luzon, Visayas, Mindanao
  address_details TEXT,
  latitude NUMERIC,
  longitude NUMERIC,

  -- Timeline & Status
  status TEXT NOT NULL, -- e.g., Pre-selling, RFO, Completed
  expected_completion_date DATE,
  turnover_date DATE,

  -- Pricing
  currency TEXT DEFAULT 'PHP',
  price_range_min NUMERIC,
  price_range_max NUMERIC,
  average_price NUMERIC,
  vat_inclusive BOOLEAN DEFAULT true,

  -- Media & Marketing
  main_image_url TEXT,
  video_tour_url TEXT,
  is_featured BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.project_units (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE,
  unit_name TEXT,
  unit_type TEXT NOT NULL,
  floor_area_sqm NUMERIC,
  lot_area_sqm NUMERIC,
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  has_balcony BOOLEAN DEFAULT false,
  has_parking BOOLEAN DEFAULT false,
  is_furnished TEXT,
  status TEXT, -- Available, Reserved, Sold
  is_rfo BOOLEAN DEFAULT false,
  selling_price NUMERIC,
  reservation_fee NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Project Attachments (Legal/Tech Docs)
CREATE TABLE public.project_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  document_type TEXT, -- e.g., 'LTS', 'Title', 'ECC'
  metadata JSONB DEFAULT '{}',
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Project Gallery (Marketing Images)
CREATE TABLE public.project_galleries (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-----

CREATE TABLE public.property_listings (
  id BIGSERIAL PRIMARY KEY,
  user_profile_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  developer_id BIGINT REFERENCES public.developers_profiles(id) ON DELETE SET NULL,
  project_id BIGINT REFERENCES public.projects(id) ON DELETE SET NULL,
  project_unit_id BIGINT REFERENCES public.project_units(id) ON DELETE SET NULL,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  listing_type TEXT, -- e.g., 'for_sale', 'for_rent', 'pre_selling', 'lease_to_own'
  status TEXT DEFAULT 'draft', -- e.g., 'active', 'inactive', 'draft', 'archived', 'sold'

  -- Pricing
  currency TEXT DEFAULT 'PHP',
  price NUMERIC,
  negotiable BOOLEAN DEFAULT false,

  -- Visibility & Marketing
  is_featured BOOLEAN DEFAULT false,
  views_count INT DEFAULT 0,
  inquiries_count INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.property_listing_galleries (
  id BIGSERIAL PRIMARY KEY,
  listing_id BIGINT REFERENCES public.property_listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Track user messages regarding specific properties
CREATE TABLE public.inquiries (
  id BIGSERIAL PRIMARY KEY,
  sender_profile_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  listing_id BIGINT REFERENCES public.property_listings(id) ON DELETE SET NULL,
  project_id BIGINT REFERENCES public.projects(id) ON DELETE SET NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread', -- unread, read, replied
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Allow users to bookmark properties
CREATE TABLE public.saved_listings (
  id BIGSERIAL PRIMARY KEY,
  user_profile_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  listing_id BIGINT REFERENCES public.property_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_favorite UNIQUE(user_profile_id, listing_id)
);

-- Allow users to bookmark projects
CREATE TABLE public.saved_projects (
  id BIGSERIAL PRIMARY KEY,
  user_profile_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_saved_project UNIQUE(user_profile_id, project_id)
);

-- Store allowed dashboard actions per role and page/module
CREATE TABLE public.role_page_action_permissions (
  id BIGSERIAL PRIMARY KEY,
  role_name VARCHAR(100) NOT NULL REFERENCES public.user_roles(role_name) ON DELETE CASCADE ON UPDATE CASCADE,
  page_key TEXT NOT NULL,
  page_label TEXT NOT NULL,
  page_path TEXT,
  can_view BOOLEAN NOT NULL DEFAULT false,
  can_create BOOLEAN NOT NULL DEFAULT false,
  can_edit BOOLEAN NOT NULL DEFAULT false,
  can_delete BOOLEAN NOT NULL DEFAULT false,
  can_manage BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_role_page_permission UNIQUE(role_name, page_key)
);

CREATE TRIGGER update_role_page_action_permissions_modtime
  BEFORE UPDATE ON public.role_page_action_permissions
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TABLE public.leads (
  id BIGSERIAL PRIMARY KEY,
  user_profile_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL, -- The potential buyer
  assigned_to uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL, -- The agent/broker
  project_id BIGINT REFERENCES public.projects(id),
  
  source TEXT, -- e.g., 'facebook', 'website', 'referral'
  lead_score INT DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status = ANY (ARRAY['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'closed_won', 'closed_lost'])),
  
  notes TEXT,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.user_documents (
  id BIGSERIAL PRIMARY KEY,
  user_profile_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Flexible Categorization
  category TEXT NOT NULL, -- e.g., 'identification', 'legal', 'verification'
  document_type TEXT, -- e.g., 'passport', 'drivers_license', 'spa', 'selfie_verification'
  
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  mime_type TEXT, -- e.g., 'image/jpeg', 'application/pdf'
  
  -- Verification status (Critical for PH Real Estate)
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMPTZ,
  verified_by uuid REFERENCES public.user_profiles(id),
  
  metadata JSONB DEFAULT '{}', -- Store expiry dates or ID numbers here
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Support and Knowledge Base
CREATE TABLE public.faqs (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES public.projects(id) ON DELETE CASCADE, -- Optional: Link to specific project
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT, -- e.g., 'buying_process', 'financing', 'project_specific'
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Trail for Security
CREATE TABLE public.activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_profile_id uuid REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- e.g., 'UPDATE_PROJECT', 'DELETE_LISTING'
  table_name TEXT NOT NULL,
  record_id TEXT NOT NULL, -- The ID of the affected record
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);