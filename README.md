# Food Delivery Mockup - React + Node Implementation

This repository was bootstrapped from scratch to implement the provided multi-screen food delivery mockup across frontend and backend.

## Stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express

## Run locally
```bash
npm install
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Implemented feature groups
- Onboarding, sign in, sign up, forgot password shells
- Home/menu/catalog and search
- Product detail cards
- Cart operations and checkout API
- Orders list, tracking placeholder, order review shell
- Chat endpoint and UI
- Notifications
- Profile, addresses, payment methods, settings shell

## Backend API summary
- `GET /api/onboarding`
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/forgot-password`
- `GET /api/home`
- `GET /api/products`, `GET /api/products/:id`
- `GET/POST/PATCH/DELETE /api/cart`
- `GET /api/orders`, `POST /api/orders/checkout`, `POST /api/orders/:id/review`
- `GET/PATCH /api/profile`
- `GET/POST /api/addresses`
- `GET/POST /api/payment-methods`
- `GET /api/notifications`
- `GET/POST /api/chat`

## Known gaps vs full production app
- No real authentication/session management
- In-memory data storage only (resets on restart)
- No file uploads, OTP verification, payment gateway, live maps, or push notifications
- No admin panel or restaurant-side management
- UI is a compact implementation of all major flows, not 1:1 pixel-perfect with every single mockup screen
