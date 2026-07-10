# Phase 2: Products & Categories CRUD Specification

This document details the functional, database, API, and UI design specifications for **Phase 2: Products & Categories CRUD** of the S for Shopping admin platform.

---

## 1. Goal
Implement database structures, backend REST APIs, state handlers, and vintage editorial UI forms for managing e-commerce categories and product listings.

---

## 2. Database Schema DDL

```sql
-- CATEGORIES TABLE
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON public.categories(slug);

-- PRODUCTS TABLE
CREATE TABLE public.products (
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

CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_category ON public.products(category_id);
```

---

## 3. API Endpoints

### Categories APIs
- `GET /api/categories` - Fetch all categories with product counts.
- `POST /api/categories` - Create new category.
- `PUT /api/categories/:id` - Update category details.
- `DELETE /api/categories/:id` - Delete category.

### Products APIs
- `GET /api/products` - Fetch paginated list of products. (Supports query params: `category_id`, `status`, `search`, `page`, `limit`).
- `POST /api/products` - Create new product profile.
- `PUT /api/products/:id` - Update product details.
- `DELETE /api/products/:id` - Delete or archive product.

---

## 4. State Management (Redux Slices)
- **`productSlice`**:
  - `productsList`: Array of loaded products.
  - `currentProduct`: Product currently selected for details/edit.
  - `filters`: Active filters (e.g., search text, category, status).
  - Actions: `setProducts()`, `setFilters()`, `addProduct()`, `updateProduct()`, `removeProduct()`.
- **`categorySlice`**:
  - `categoriesList`: Array of loaded categories.
  - Actions: `setCategories()`, `addCategory()`, `updateCategory()`, `removeCategory()`.

---

## 5. UI Elements & Asset Upload
- **Products Grid**: Typographic table with thin lines (`border-[0.5px] border-[#2F2F2F]/20`). Displays thumbnail, SKU, name, stock indicators, price, status badge, and custom popover actions.
- **Product Modal Form**: Standardized cream forms with inputs: Product Name, Description (rich textarea), Category dropdown, Price, Discount percentage, SKU code, Stock amount, Status select, and Drag-and-Drop Image Uploader.
- **Supabase Asset Bucket Uploader**: Connects admin components directly to the public `product-images` storage bucket, uploading files into `products/{sku}/{file_id}.jpg`.
