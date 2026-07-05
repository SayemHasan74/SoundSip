# SoundSip

SoundSip is a full-stack music streaming and social listening app with a React frontend, Express backend, MongoDB database, Clerk authentication, Cloudinary uploads, playlists, favorites, artist profiles, and real-time chat/activity powered by Socket.IO.

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Socket.IO
- Database: MongoDB with Mongoose
- Auth: Clerk
- Media uploads: Cloudinary

## Project Structure

```txt
backend/    Express API, Socket.IO server, MongoDB models and routes
frontend/   React/Vite client app
```

## Environment Variables

Create `backend/.env`:

```env
PORT=5001
MONGODB_URI=
ADMIN_EMAILS=
NODE_ENV=development
CLIENT_URL=http://localhost:3000
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Create `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=
```

## Local Development

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend:

```bash
cd frontend
npm run dev
```

## Production Build

```bash
cd frontend
npm run build

cd ../backend
npm start
```

When `NODE_ENV=production`, the backend serves the built frontend from `frontend/dist`.

## Render Deployment

Recommended Render settings:

```txt
Root Directory: backend
Build Command: npm install --include=dev && cd ../frontend && npm install --include=dev && npm run build
Start Command: npm start
Health Check Path: /healthz
```

Set the backend and frontend environment variables in Render. Do not set `PORT`; Render provides it automatically.
