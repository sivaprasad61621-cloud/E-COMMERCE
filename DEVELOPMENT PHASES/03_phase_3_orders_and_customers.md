# Phase 3: Orders & Customers Specification

This document details the functional, database, API, and UI design specifications for **Phase 3: Orders & Customers** of the S for Shopping admin platform.

---

## 1. Goal
Implement order fulfillment pipelines, customer profile directories, order invoice view interfaces, and status workflow transitions.

---

## 2. Database Schema DDL

```sql
-- CUSTOMERS TABLE
CREATE TABLE public.customers (
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

CREATE INDEX idx_customers_email ON public.customers(email);

-- ORDERS TABLE
CREATE TABLE public.orders (
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

CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- ORDER ITEMS TABLE
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0)
);

CREATE INDEX idx_order_items_order ON public.order_items(order_id);
```

---

## 3. API Endpoints

### Orders
- `GET /api/orders` - Fetch orders (supports status, page, limit filters).
- `GET /api/orders/:id` - Fetch order by ID, including order items and customer fields.
- `PUT /api/orders/:id/status` - Update order status check constraints: `pending`, `packed`, `shipped`, `delivered`, `cancelled`.

### Customers
- `GET /api/customers` - Fetch customers catalog.
- `GET /api/customers/:id` - Fetch customer detailed profile and complete order history logs.

---

## 4. State Management (Redux Slices)
- **`orderSlice`**:
  - `ordersList`: Array of loaded orders.
  - `currentOrderDetail`: Full details for the active order detail view.
  - Actions: `setOrders()`, `updateOrderStatus()`, `setOrderDetail()`.

---

## 5. UI Layout

### Order Details Invoice Page
- Rendered in a clean, publication-style format matching vintage editorial print catalogs.
- High-contrast, sharp layouts using thin border tables to list purchases.
- Header detailing invoice numbers, tracking information, and status workflow tracker.

### Customer Directory
- Multi-column editorial table listing customers with details: email, location, joined date, order count, and lifetime value (LTV).
- Clicking a row routes to the Customer Order History panel.
