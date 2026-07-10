-- S for Shopping - Database Scaffolding Script
-- Target: Supabase (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS PROFILE TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Sync Trigger: Auto-populate public.users when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role)
    VALUES (new.id, new.email, 'admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    discount NUMERIC(5, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0 AND discount <= 100),
    sku VARCHAR(100) NOT NULL UNIQUE,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
    images TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);

-- 4. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'United States',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'packed', 'shipped', 'delivered', 'cancelled')),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    shipping_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (shipping_amount >= 0),
    tracking_number VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);

-- Trigger: Automatic updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. USERS POLICIES
CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL TO authenticated USING (auth.jwt() ->> 'email' LIKE '%@sshopping.com');

-- 2. PRODUCTS POLICIES
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT TO public USING (status = 'active');

CREATE POLICY "Admins and staff can view all products" ON public.products
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins and staff can manage products" ON public.products
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
    );

-- 3. CATEGORIES POLICIES
CREATE POLICY "Anyone can view categories" ON public.categories
    FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage categories" ON public.categories
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- 4. ORDERS & ORDER ITEMS POLICIES
CREATE POLICY "Admins and staff can view orders" ON public.orders
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
    );

CREATE POLICY "Admins and staff can manage order status" ON public.orders
    FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
    );

CREATE POLICY "Admins and staff can view order details" ON public.order_items
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
    );

-- 5. CUSTOMERS POLICIES
CREATE POLICY "Admins and staff can view client profiles" ON public.customers
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
    );


-- ========================================================
-- STORAGE CONFIGURATION (Supabase Object Storage)
-- ========================================================

-- Policies for public 'product-images' bucket
-- Note: Bucket itself should be created in Supabase console dashboard.
-- Once created, run these policies to secure file uploads:

-- CREATE POLICY "Give public select access to product images"
-- ON storage.objects FOR SELECT TO public
-- USING (bucket_id = 'product-images');

-- CREATE POLICY "Give admins upload/delete access to product images"
-- ON storage.objects FOR ALL TO authenticated
-- USING (bucket_id = 'product-images' AND EXISTS (
--     SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
-- ));
