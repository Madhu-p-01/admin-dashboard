# Syntellite Frontend

A Vite + React + TypeScript admin dashboard for Syntellite.

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Configure environment

Create a `.env` file in this folder (same as `package.json`) and set:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

3. Run the development server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
npm run preview
```

## Structure

- `src/components/layouts/AdminLayout.tsx` - Shell with sidebar/topbar
- `src/pages/*` - Feature pages
- `src/lib/api.ts` - Minimal API client

Update `VITE_API_BASE_URL` to point at your backend server.




