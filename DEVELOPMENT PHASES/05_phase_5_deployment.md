# Phase 5: Deployment & Configuration Specification

This document details the configuration, security setup, and production deployment specifications for **Phase 5: Deployment** of the S for Shopping admin platform.

---

## 1. Goal
Configure environment variables, secure database tables with Row Level Security (RLS) policies, initialize object storage buckets, and build optimized production packages.

---

## 2. Supabase Configuration

### 2.1 Storage Buckets Setup
- **Bucket Name**: `product-images`
- **Visibility**: Public (all visitors can read images).
- **Access Policies**:
  - `SELECT`: `true` (Public access).
  - `INSERT / UPDATE / DELETE`: Only Authenticated users with role = `admin`.
- **File System Structure**: `/products/{sku}/{image_name}.jpg`.

### 2.2 Row Level Security (RLS) SQL Scripts

Enable RLS and define policies for each entity table in PostgreSQL:

```sql
-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. USERS POLICIES
CREATE POLICY "Admins can manage all users" ON public.users
    FOR ALL TO authenticated USING (auth.jwt() ->> 'email' LIKE '%@sshopping.com');

-- 2. PRODUCTS & CATEGORIES POLICIES
CREATE POLICY "Anyone can view products" ON public.products
    FOR SELECT TO public USING (true);

CREATE POLICY "Only admins can modify products" ON public.products
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- 3. ORDERS & CUSTOMERS POLICIES
CREATE POLICY "Admins and staff can view orders" ON public.orders
    FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
    );
```

---

## 3. Environment Variables Configuration

### Admin Environment Setup (`admin/.env.production`)
```env
VITE_SUPABASE_URL=https://your-live-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_API_URL=https://api.sshopping.com/api
```

### Server Environment Setup (`server/.env.production`)
```env
PORT=80
SUPABASE_URL=https://your-live-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
JWT_SECRET=production_secret_key_change_me
NODE_ENV=production
```

---

## 4. Production Build Process

### Frontend
- Execute the build command in the `admin/` directory:
  ```bash
  npm run build
  ```
- This triggers the Vite build pipeline, rendering optimized assets into `admin/dist`.

### Backend Node server
- Serve via standard production cluster processes:
  ```bash
  node index.js
  ```
- Set `NODE_ENV=production` to disable developer error output verbosity.
