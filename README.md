# VIBEGO Admin Dashboard

لوحة تحكم إدارة VIBEGO (React + Vite + Tailwind CSS v4).

## Getting started

```bash
npm install
npm run dev
```

Requires a running backend. By default the API base URL is `http://127.0.0.1:8000/api`;
override it with `VITE_API_URL` (e.g. in a `.env.local` file).

## Scripts

| Command              | Description                                     |
| -------------------- | ----------------------------------------------- |
| `npm run dev`        | Start the dev server                            |
| `npm run build`      | Production build into `dist/`                   |
| `npm run preview`    | Preview the production build                    |
| `npm run lint`       | Run ESLint                                      |
| `npm run dev:demo`   | Dev server in demo mode (mock data, no backend) |
| `npm run build:demo` | Production build in demo mode                   |

Demo mode can also be enabled with `VITE_DEMO=true`. In demo mode any email/password logs in
and all data comes from `src/services/mockApi.js`.

## Structure

```
src/
  components/   Shared UI (icons, FlightScene) and destinations/ (page sections and modals)
  pages/        Landing, Login, Dashboard, Users, Destinations
  utils/        Small helpers (destination image paths)
  services/     api.js (axios instance) and mockApi.js (demo backend)
  admin.css     Admin layout and shared styles
  index.css     Tailwind import and theme colors
public/         Static assets (bg.jpg, demo images, destination images)
```
