# Food Delivery Admin Panel (TypeScript)

Monorepo with backend (Express + TS) and frontend (React + TS) scaffolding.

## Structure

- `backend/`: Express server with basic routes and shared types
- `frontend/`: React app scaffolding with basic components and shared types

## Environment Setup

### Backend Environment Variables

Copy `.env.example` to `.env` in the `backend/` directory:
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development/production)

### Frontend Environment Variables

Copy `.env.example` to `.env` in the `frontend/` directory:
```bash
cd frontend
cp .env.example .env
```

Edit `.env` with your configuration:
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Backend

- Install: `cd backend && npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`
- Health check: `GET /health`

Routes (stubbed in-memory):
- `/api/users`
- `/api/categories`
- `/api/products`
- `/api/orders`
- `/api/dashboard/stats`

## Frontend

- Install: `cd frontend && npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

Note: An `index.html` with a `#root` element is required to run in the browser when using Vite. Add one at the project root of `frontend/` if running locally.

## Shared Types

Each package exposes `src/types/index.ts` for common utility types like `ApiResponse`, `UUID`, and pagination.

## License

MIT


