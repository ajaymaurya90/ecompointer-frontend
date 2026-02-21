# EcomPointer Admin Panel (Next.js)

EcomPointer Admin Panel is a scalable SaaS dashboard built with Next.js for multi-brand garment management.

This frontend application allows Brand Owners to securely manage products, variants, and future business modules such as inventory, orders, and retail operations.

The project is structured for long-term SaaS scalability using role-based access control and modular architecture.

---

## Project Scope

This repository contains the **frontend admin panel only**, built with Next.js.

It integrates with a separate backend API that provides:

- Authentication
- Role validation
- Product data
- Pagination metadata

The frontend is designed to consume structured API responses and maintain scalable state management.

---

## Technology Stack

- Next.js (App Router)
- TypeScript
- Zustand (State Management)
- Axios (API Layer with interceptors)
- Tailwind CSS

---

## Authentication & Access Control Architecture

The system implements a structured JWT-based authentication flow with refresh handling and role restrictions.

### Authentication Flow

- User logs in with email and password.
- Backend returns:
  - Access Token (JWT) in response body.
  - Refresh Token stored as HTTP-only cookie.
- Access token is stored in frontend state (Zustand).
- Axios interceptor attaches the access token to all protected API requests.
- When access token expires:
  - Axios interceptor automatically calls the refresh endpoint.
  - Backend validates refresh token from cookie.
  - New access token is issued.
  - Original request is retried automatically.
- If refresh fails:
  - User is logged out.
  - Redirected to login page.

### Current Access Control Rules

- ProtectedRoute component restricts dashboard access.
- Role-based restriction implemented on frontend.
- Dashboard currently restricted to: `BRAND_OWNER`.
- Routes protected under:
  - `/dashboard`
  - `/dashboard/products`
- Unauthorized users are redirected to `/login`.

This structure prevents unauthorized dashboard access and supports future multi-role expansion.

---

## Role System (Frontend Awareness)

Roles currently recognized by frontend:

- BRAND_OWNER
- SHOP_OWNER (structure ready)
- ADMIN (future expansion)

Role validation is enforced through the ProtectedRoute wrapper.

---

## Product Module (Current Implementation)

### Features Implemented

- Product listing page at `/dashboard/products`
- Zustand product store
- Pagination-ready state structure:
  - products
  - total
  - page
  - lastPage
  - loading
  - error
- Loading skeleton UI
- Error handling
- Clean separation between layout and feature pages

### API Response Mapping

Frontend expects API response structure:


{
data: Product[],
meta: {
total: number,
page: number,
lastPage: number
}
}


Store mapping:

- `response.data.data` → products
- `response.data.meta` → pagination state

The architecture supports large product catalogs without structural changes.

---

## Dashboard Routing Architecture

Implemented routes:

- `/dashboard` (Overview page)
- `/dashboard/products` (Product listing)

Shared layout:

- Sidebar
- Top Navigation
- ProtectedRoute wrapper

Layout is implemented in:


src/app/dashboard/layout.tsx


All dashboard routes automatically inherit layout and access restrictions.

---

## Folder Structure


src/
│
├── app/
│ ├── dashboard/
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ └── products/
│ │ └── page.tsx
│ └── login/
│
├── components/
│ ├── Dashboard/
│ │ ├── Sidebar.tsx
│ │ └── TopNav.tsx
│ ├── Product/
│ │ ├── ProductCard.tsx
│ │ └── ProductSkeleton.tsx
│ └── ProtectedRoute.tsx
│
├── store/
│ ├── authStore.ts
│ └── productStore.ts
│
├── lib/
│ ├── api.ts
│ └── auth.ts


Architecture principle:

- Routing logic → `app/`
- Reusable UI → `components/`
- State management → `store/`
- API abstraction → `lib/`

---

## Security Highlights

- Refresh token stored in HTTP-only cookie (not accessible via JavaScript)
- Automatic token refresh handling
- Logout on refresh failure
- Role-based route restriction
- Interceptor retry protection to prevent infinite loops

---

## Current Milestone

Version: v0.1

Completed:

- Authentication flow with refresh logic
- Role-based dashboard protection
- Structured dashboard layout
- Product listing with pagination-ready state
- Clean modular architecture

The system is stable and ready for feature expansion.

---

## Next Planned Features

- Product Create (UI + API integration)
- Product Update
- Product Delete
- Variant Management UI
- Pagination Controls (UI)
- Dashboard statistics overview
- Order management module
- Inventory tracking

---

## Purpose

This admin panel is being developed as part of a scalable SaaS system intended to support multi-brand garment businesses with centralized operational control.