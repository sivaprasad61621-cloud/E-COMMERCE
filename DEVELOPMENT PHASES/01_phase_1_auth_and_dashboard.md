# Phase 1: Authentication & Dashboard Specification

This document details the functional, database, API, and UI design specifications for **Phase 1: Auth & Dashboard** of the S for Shopping admin platform.

---

## 1. Goal
Initialize the workspace, configure key dependencies, deploy the authentication system, and build the primary analytic dashboard using the Vintage Editorial visual style.

---

## 2. Infrastructure Setup
- **Admin**: Initialize React + Vite project in the `admin/` folder. Add dependencies: `react-router-dom`, `@reduxjs/toolkit`, `react-redux`, `framer-motion`, `recharts`, `lucide-react`.
- **Server**: Initialize Node.js + Express project in `server/` folder. Configure environment variables.
- **Supabase Link**: Initialize the Supabase Client SDK in the React admin app and Server Admin SDK in Express.

---

## 3. Database Schema (Auth Sync)
A trigger is configured to sync users authenticated via Supabase Auth with a public `users` profile table.

### DDL Dsp:
```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. API Endpoints

### `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "admin@sshopping.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "e9c0c1b4-...",
      "email": "admin@sshopping.com",
      "role": "admin"
    }
  }
  ```

---

## 5. State Management (Redux Slices)
- **`authSlice`**:
  - `user`: Authenticated user profile.
  - `token`: Supabase JWT session token.
  - `isAuthenticated`: Boolean status flags.
  - `loading`, `error`.
  - Actions: `loginSuccess()`, `logout()`, `clearError()`.
- **`uiSlice`**:
  - `sidebarOpen`: Sidebar visibility toggle.
  - `theme`: 'vintage-editorial'.

---

## 6. UI & Styling (Vintage Editorial)

### Fonts & Color Tokens
- Font Family: Headings: *Cormorant Garamond* (Serif), UI/Body: *Inter* (Sans-serif).
- Cream Background: `#F5F1E8`
- Charcoal Primary: `#2F2F2F`
- Off-white Card: `#FAF8F3`
- Accent Warm Brown: `#8B5E3C`

### Pages to Build
1.  **Login Page**: Minimalist editorial card styled with thin borders (`border-[0.5px] border-[#2F2F2F]/20`), centered layout, elegant serif typography, clean text fields.
2.  **Dashboard Dashboard**:
    - **Header**: Editorial styling with thin lines (`border-b border-[#2F2F2F]/20`).
    - **Metric Widgets**: 4 flat cards featuring metrics: *Total Products*, *Total Orders*, *Revenue*, and *Low Stock Alerts*.
    - **Recent Orders**: Clean list displaying recent 5 orders.
    - **Micro-Animations**: Framer Motion entry slide-up transition.
