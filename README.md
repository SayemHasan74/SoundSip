# SoundSip

SoundSip is a full-stack music streaming and social listening platform. It combines a modern React music player with playlists, favorites, artist profiles, admin tools, authentication, media uploads, and real-time chat/activity updates.

## Features

- Music discovery home page with featured sections and popular artists
- Full audio player with play, pause, queue, next/previous, shuffle, repeat, and volume controls
- Albums, playlists, liked songs, and personal library pages
- Search experience for songs, albums, artists, and users
- User profiles with editable profile data, favorites, playlists, followers, and listening history
- Artist signup, verification flow, and public artist profile pages
- Admin dashboard for managing songs, albums, artists, and platform stats
- Real-time chat with message status, reactions, typing indicators, image sharing, and user activity
- Friend requests, friends list, following system, and online/offline presence
- Settings pages for general, audio, discovery, platform, and developer preferences
- Clerk authentication with protected routes
- Cloudinary-backed media upload support
- Socket.IO real-time events for chat, presence, and listening activity
- Production backend that serves the built frontend from one deployed service

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, TypeScript, Tailwind CSS, Zustand |
| UI | Radix UI, Lucide React, custom reusable components |
| Backend | Node.js, Express, Socket.IO |
| Database | MongoDB, Mongoose |
| Authentication | Clerk |
| Media Storage | Cloudinary |
| Deployment | Render-ready full-stack service |

## Project Structure

```txt
SoundSip/
  backend/            Express API, Socket.IO server, models, routes, controllers
  frontend/           React/Vite client app
  README.md
```

## Main Routes

| Route | Description |
| --- | --- |
| `/landing` | Public landing page |
| `/` | Authenticated home/music discovery |
| `/search` | Search songs, albums, artists, and users |
| `/library` | User library |
| `/liked-songs` | Liked songs collection |
| `/playlist/:id` | Playlist details |
| `/album/:id` | Album details |
| `/artists` | Artist discovery |
| `/artist/:id` | Artist profile |
| `/chat` | Real-time chat |
| `/profile/:id` | User profile |
| `/settings` | User settings |
| `/admin` | Admin dashboard |

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

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
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

Local URLs:

```txt
Frontend: http://localhost:3000
Backend:  http://localhost:5001
Health:   http://localhost:5001/healthz
```

## Available Scripts

Backend:

```bash
npm run dev
npm start
npm run seed:genres
npm run seed:all
npm run health-check
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Production Build

Build the frontend:

```bash
cd frontend
npm run build
```

Start the backend:

```bash
cd backend
NODE_ENV=production npm start
```

When `NODE_ENV=production`, the backend serves the built React app from `frontend/dist`.

## Render Deployment

Recommended Render Web Service settings:

```txt
Root Directory: backend
Build Command: npm install --include=dev && cd ../frontend && npm install --include=dev && npm run build
Start Command: npm start
Health Check Path: /healthz
```

Add the environment variables from both `backend/.env` and `frontend/.env` to Render. Do not set `PORT`; Render provides it automatically.

For MongoDB Atlas, make sure Network Access allows your Render service. For quick testing you can allow:

```txt
0.0.0.0/0
```

## Notes

- The frontend build uses `vite build`.
- Runtime data requires a working MongoDB connection.
- Upload and media features require valid Cloudinary credentials.
- Authentication requires valid Clerk keys.
- Production Clerk keys are recommended for public deployments.
