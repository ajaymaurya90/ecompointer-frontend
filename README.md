# EcomPointer SaaS – Backend & Admin Panel

EcomPointer is a multi-brand garment SaaS platform designed for Brand Owners to manage products, variants, pricing, and inventory through a structured admin dashboard.

The system is built with scalability, role-based access control, and clean architecture principles to support future expansion into orders, sales tracking, retail POS integration, and multi-brand operations.

---

## Project Overview

This repository contains:

- Backend API (NestJS + PostgreSQL + Prisma)
- Admin Panel (Next.js App Router + TypeScript)
- Authentication and Role-Based Access Control
- Product module with pagination-ready architecture

The system is structured to support multi-tenant SaaS architecture.

---

## Technology Stack

### Backend
- NestJS
- PostgreSQL
- Prisma ORM
- JWT Authentication
- HTTP-only Refresh Token Cookies
- Role-Based Access Control (RBAC)

### Frontend (Admin Panel)
- Next.js (App Router)
- TypeScript
- Zustand (State Management)
- Axios (API Layer with interceptors)
- Tailwind CSS

---

## Authentication System

The authentication system includes:

- Login with email and password
- JWT Access Token (returned in response body)
- Refresh Token stored in HTTP-only cookie
- Secure token refresh endpoint
- Axios interceptor for automatic token refresh
- ProtectedRoute component for frontend route guarding
- Backend role validation for protected endpoints

Refresh tokens are securely stored and validated. Frontend handles expired access tokens automatically via interceptor retry logic.

---

## Role System

Roles currently implemented:

- BRAND_OWNER
- SHOP_OWNER (structure prepared)
- ADMIN (backend enum present)

Role-based access is enforced on both backend and frontend.

Dashboard access is restricted to BRAND_OWNER.

---

## Product Module (Brand Owner Scope)

### Backend

- GET /products endpoint
- Pagination support
- Response structure includes:
  - data (product array)
  - meta (total, page, lastPage)
- Products include:
  - Media
  - Variants
  - Metadata (createdAt, updatedAt)

### Frontend

- Zustand product store
- Pagination-ready state:
  - products
  - total
  - page
  - lastPage
  - loading
  - error
- Product listing page under /dashboard/products
- ProductCard component
- Loading skeletons
- Error handling

The frontend store correctly maps backend response:
- response.data.data → products
- response.data.meta → pagination state

---

## Dashboard Architecture

Routes implemented:

/dashboard  
/dashboard/products  

The dashboard uses a shared layout:

- Sidebar
- Top Navigation
- ProtectedRoute wrapper

Layout is implemented in:

src/app/dashboard/layout.tsx

Separation of responsibilities:

- Routing logic → src/app
- Reusable UI components → src/components
- State management → src/store

This structure supports scalable admin expansion.

---

## Folder Structure (Simplified)
src/
├── app/
│ ├── dashboard/
│ │ ├── layout.tsx
│ │ ├── page.tsx
│ │ └── products/
│ │ └── page.tsx
│
├── components/
│ ├── Dashboard/
│ │ ├── Sidebar.tsx
│ │ ├── TopNav.tsx
│ │
│ ├── Product/
│ │ ├── ProductCard.tsx
│ │ ├── ProductSkeleton.tsx
│
├── store/
│ ├── authStore.ts
│ ├── productStore.ts
│
├── lib/
│ ├── api.ts
│ ├── auth.ts



---

## Architecture Principles

- Multi-tenant ready structure
- Pagination-first design
- Variant-based pricing model
- Backend-driven contracts
- Separation of layout and feature logic
- Role-based access enforcement
- Clean SaaS dashboard pattern

The system is designed to scale to thousands of products per brand without architectural changes.

---

## Security Highlights

- Refresh token stored in HTTP-only cookie
- Backend validation of refresh token
- Axios interceptor prevents infinite retry loops
- Protected routes enforced at API and UI level
- Role-based endpoint protection

---

## Current Development Status (Milestone v0.1)

Completed:

- Authentication system
- Token refresh mechanism
- Role-based access control
- Dashboard layout structure
- Product listing with pagination-ready state
- Zustand state management integration
- Clean Next.js App Router structure

System is stable for further feature development.

---

## Next Planned Features

- Product Create (UI + API)
- Product Update
- Product Delete
- Variant Management UI
- Pagination Controls (UI)
- Dashboard statistics overview
- Order module
- Inventory tracking
- Multi-brand data isolation enforcement

---

## Version

v0.1 – Authentication and Product Listing Foundation