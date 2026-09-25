-- AR FURNITURE - Complete Bill Book, POS, Clients & Ledger Schema
-- Run this complete script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CLIENTS TABLE (CRM / Khata Isolation)
-- =============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. INVOICES TABLE (Bill Book / POS / Order Form / Quotation)
-- =============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_mobile TEXT NOT NULL,
  customer_address TEXT,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_mode TEXT DEFAULT 'Cash',
  document_type TEXT DEFAULT 'Invoice',
  status TEXT DEFAULT 'unpaid',
  notes TEXT,
  terms TEXT DEFAULT '1. Goods once sold will not be taken back.\n2. Advance payment required for custom orders.\n3. Balance must be cleared before or at delivery.',
  delivery_date DATE,
  created_by TEXT,
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. INVOICE ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  warranty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 4. PAYMENTS TABLE (Client Ledger Sync)
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  client_mobile TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_mode TEXT NOT NULL DEFAULT 'Cash',
  transaction_ref TEXT,
  payment_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. INVOICE PAYMENTS TABLE (Legacy Fallback)
-- =============================================
CREATE TABLE IF NOT EXISTS invoice_payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_mode TEXT NOT NULL DEFAULT 'Cash',
  transaction_ref TEXT,
  payment_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR FAST SEARCH & PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_clients_mobile ON clients(mobile);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_mobile ON invoices(customer_mobile);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_mobile ON payments(client_mobile);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access clients" ON clients FOR ALL USING (true);
CREATE POLICY "Admin full access invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Admin full access invoice items" ON invoice_items FOR ALL USING (true);
CREATE POLICY "Admin full access payments" ON payments FOR ALL USING (true);
CREATE POLICY "Admin full access invoice payments" ON invoice_payments FOR ALL USING (true);
