# Food Delivery Admin Panel (TypeScript)

Full-stack app (React TS frontend + Node TS backend + MongoDB(Atlas)). Manage users, categories, products, orders and dashboard.
Tech: React (TS), Express (TS), Mongoose. Deploy: Vercel.

## Backend (Express TS)

### Checks

- Ports free: Backend 5000 (lsof -i :5000).
- Create `.env` file in the `backend/` directory:
```bash
cd backend
cp .env
```

### Frontend Environment Variables
- Edit `.env` with your configuration:
    -- `PORT`: Server port (default: 5000)
    -- `MONGODB_URI`: MongoDB connection string

### Run

- Install: `cd backend && npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`

***------------------------------------***

## Frontend (React TS)

### Checks

- Ports free: Frontend 3000 (lsof -i :3000).
- Create `.env` file in the `frontend/` directory:
```bash
cd frontend
cp .env
```

### Frontend Environment Variables
- Edit `.env` with your configuration:
    -- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:5000/api)

### Run

- Install: `cd frontend && npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

Note: An `index.html` with a `#root` element is required to run in the browser when using Vite. Add one at the project root of `frontend/` if running locally.

## License

MIT


