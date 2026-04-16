# EcomPointer Admin Frontend

Next.js admin dashboard for Brand Owners using EcomPointer.

This app is the backoffice UI for managing catalog, media, customers, shop owners, orders, business settings, and storefront configuration. It consumes the NestJS backend API in `../ecompointer-backend`.

## Workspace Role

EcomPointer is split into three projects:

- `ecompointer-backend`: API, Prisma schema, PostgreSQL data model, uploads, and business rules.
- `ecompointer-frontend`: Brand Owner admin dashboard.
- `ecompointer-storefront`: Public customer storefront.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand
- Axios
- React Hook Form
- Zod
- Radix UI
- lucide-react
- Storybook and Vitest setup

## Main Areas

### Authentication

- Login page
- In-memory access token with Zustand
- Refresh-token cookie recovery through `/auth/refresh`
- Axios interceptor for bearer token injection and one retry after refresh
- Protected dashboard layout
- Brand Owner role access for dashboard routes

### Dashboard Shell

- Sidebar navigation
- Top navigation
- Dark/light theme toggle
- Global search dropdown
- Shared layout components: page shell, page header, data panel, common UI controls

### Products

- Product listing with filters, pagination, and sorting
- Product create/update flow
- Product details
- Category tree and category product assignments
- Product brands
- Product manufacturers
- Product variants
- Variant generator
- Product and variant media tabs
- Product code suggestion
- Order product search integration

### Media

- Media library
- Folder tree
- Upload flow
- Grid/list browsing
- Media picker modal
- Product/variant media assignment

### Customers

- Customer list, create, detail, and edit pages
- Address management
- Business profile management
- Customer groups
- Group member management

### Shop Owners

- Shop Owner list, create, and detail pages
- Link existing Shop Owner
- Status and Brand Owner link visibility
- Order search integration

### Orders

- Order list
- Guided order creation for customers and shop owners
- Product search and cart editor
- Buyer and address selection
- Order detail page
- Status actions and cancellation
- Payment modal and payments card

### Settings

- Profile settings
- Brand Owner location
- Language settings
- Service area settings
- Storefront settings
- Storefront domain management
- Shop order rules through Brand Owner APIs

### Global Search

The top navigation searches backend `/search` across:

- Products
- Customers
- Orders
- Shop Owners

## Environment

Create `.env.local` in this project:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development

Install dependencies:

```bash
npm install
```

Run the admin frontend:

```bash
npm run dev
```

The app defaults to:

```text
http://localhost:3000
```

The backend should be running at:

```text
http://localhost:3001
```

## Scripts

```bash
npm run dev             # Next dev server
npm run build           # Production build
npm run start           # Start production server
npm run lint            # ESLint
npm run storybook       # Storybook dev server
npm run build-storybook # Build Storybook
```

## Auth Flow

1. User logs in through `/auth/login`.
2. Backend returns an access token and sets the refresh token as an HTTP-only cookie.
3. Frontend stores the access token in Zustand.
4. Axios attaches `Authorization: Bearer <token>` to API calls.
5. On `401`, Axios calls `/auth/refresh` with credentials.
6. If refresh succeeds, the original request is retried.
7. If refresh fails, auth state is cleared.

## Current Status

The admin frontend covers most current backend domains and is usable as the Brand Owner control panel. Areas that should be cleaned up next:

- Auth role typing should match backend enum values like `BRAND_OWNER`.
- Logout should use the current Zustand token instead of reading an old localStorage key.
- Add or remove the `/unauthorized` route referenced by `ProtectedRoute`.
- Normalize older hardcoded `white/slate` surfaces to shared theme tokens.
- Reduce `any` usage and align frontend types with backend response DTOs.
- Fix React hook lint issues and Storybook import warnings.
- Update image handling where Next warns about raw `<img>` usage.

## Related Projects

- Backend API: `../ecompointer-backend`
- Public storefront: `../ecompointer-storefront`
