# Phase 4: Analytics & Reporting Specification

This document details the functional, database, API, and UI design specifications for **Phase 4: Analytics & Reporting** of the S for Shopping admin platform.

---

## 1. Goal
Integrate visual analysis tools, run data aggregation queries on PostgreSQL, and render interactive sales graphs utilizing custom-styled Recharts elements.

---

## 2. API Endpoints

### `GET /api/reports/summary`
- **Access**: Protected (Admin/Staff)
- **Response (200 OK)**:
  ```json
  {
    "total_products": 248,
    "total_orders": 1420,
    "revenue": 184500.50,
    "low_stock_count": 8
  }
  ```

### `GET /api/reports/sales-chart`
- **Access**: Protected
- **Query Params**: `range` (`7d`, `30d`, `12m`, `1y`)
- **Response (200 OK)**:
  ```json
  [
    { "date": "2026-06-23", "revenue": 1200.00, "orders": 5 },
    { "date": "2026-06-24", "revenue": 1850.50, "orders": 8 }
  ]
  ```

### `GET /api/reports/low-stock`
- **Access**: Protected
- **Response (200 OK)**: Lists all active products with `stock` < 10.

---

## 3. UI Component Layout (Vintage Recharts Styling)

Recharts graphs must fit the overall Vintage Editorial visual guidelines by utilizing matching palette colors and typography:

### Color Integration
- **Grid Lines**: `#2F2F2F` at `0.1` opacity.
- **Line / Bar strokes**: Accent Brown `#8B5E3C` or Primary Charcoal `#2F2F2F`.
- **Background Fill**: Warm Card Ivory `#FAF8F3`.
- **Fonts**: Axis labels configured with `fontFamily: "Inter"` or `"Cormorant Garamond"`.

### UI Panels
1.  **Revenue Line Chart**: Smooth line charts graphing earnings over selected time horizons (7 Days, 30 Days, or 12 Months).
2.  **Order Volume Bar Chart**: Structured editorial grids charting orders count.
3.  **Low Stock Alert Panel**: Sidebar list displaying warning indicators next to SKU codes for low-inventory items.
