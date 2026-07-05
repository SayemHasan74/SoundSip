<h1 align="center">🎵 SoundSip</h1>
<p align="center">A full-stack real-time music streaming web application — built as a group project.</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge" />
</p>

---

## 📖 About

**SoundSip** is a feature-rich Spotify-inspired music streaming platform built with a modern full-stack architecture. It supports music playback with full player controls, playlist management, real-time social features, artist profiles, messaging, and much more.

> Built as a **group project** — see [CONTRIBUTORS.md](./CONTRIBUTORS.md) for individual contributions.

---

## ✨ Features

### 🎵 Music Playback & Player
- **Full playback controls** — Play, Pause, Skip to Next / Previous song
- **Progress bar** — Click-to-seek through a song
- **Shuffle mode** — True randomized queue shuffle with original order restore
- **Repeat modes** — Cycle through Off → Repeat All → Repeat One
- **Volume control** — Slider with mute toggle
- **Queue management** — Songs queued from albums or playlists
- **Activity broadcasting** — Friends can see what you're listening to in real time

### 🏠 Home Dashboard
- **Featured Songs** — Curated top songs displayed in a hero section
- **Trending Songs** — Most-played songs across the platform
- **Made For You** — Personalized song recommendations
- **Recently Played** — Your last listened songs (tracked via listening history)
- **Browse Albums** — All available albums on the platform
- **Genre browsing** — Discover music by genre

### ❤️ Liked Songs & Favorites
- **Like any song** — Heart button on every song card / player bar
- **Liked Songs playlist** — Auto-created special playlist; synced with every like/unlike
- **Favorite albums & artists** — Save albums and artists to your favorites
- **Favorites stats** — Count of liked songs, albums, and artists

### 📋 Playlist System
- **Create playlists** — Custom name, description, public/private toggle
- **Edit / Delete playlists** — Full CRUD on your playlists
- **Add / Remove songs** — Add any song to any playlist
- **Like public playlists** — Save other users' playlists to your library
- **Playlist search** — Full-text search across playlist names, descriptions, tags
- **Collaborative playlists** — Allow other users to add songs

### 🔍 Search
- **Global search** — Search songs by title or artist name
- **User & artist search** — Find users by handle, name, or artist name
- **Playlist search** — Discover public playlists
- **Real-time suggestions** — Debounced search with instant results
- **Filter by type** — Toggle between songs, users, artists

### 👤 User Profiles & Settings
- **User profiles** — View profile with bio, handle, avatar, social links
- **Edit profile** — Update name, handle, profile picture, favorite genres, social media
- **Settings page** — Configure audio quality, playback, notifications, privacy, integrations
- **Delete account** — Full account and data removal

### 🎤 Artist System
- **Artist registration** — Apply to become a verified artist
- **Verification flow** — Upload documents; admin reviews and approves/rejects
- **Artist profiles** — Dedicated public profile pages with songs, follower count
- **Artist verification badge** — Verified checkmark for approved artists
- **Browse all artists** — Discover all artists on the platform
- **Follow artists** — Follow/unfollow artists; follower counts tracked

### 👥 Social Features
- **Friends system** — Send, accept, reject, and cancel friend requests
- **Friends list** — See all your friends
- **Remove friends** — Unfriend at any time
- **Real-time online presence** — See which friends are currently online
- **"Now Playing" activity** — See exactly what friends are listening to live
- **Real-time chat** — Direct messaging with friends
- **Share playlists in chat** — Send a playlist link inside a message
- **Image messages** — Send images in chat
- **Friend requests panel** — Manage incoming/outgoing friend requests in-app

### 🛠️ Admin Dashboard
- **Upload songs** — Upload audio + cover image to Cloudinary
- **Upload albums** — Create album with cover art
- **Edit songs/albums** — Update metadata and files
- **Delete songs/albums** — Remove content from the platform
- **Artist applications** — Approve or reject artist verification requests
- **Platform stats** — Total songs, albums, users, artists

### 📊 Listening History & Stats
- **Auto-track plays** — Every song play is recorded
- **Recent activity** — See your recently played songs
- **Listening stats** — Total time, top songs, top artists (weekly/monthly/yearly/all-time)
- **Unique song/artist counts** — Statistics dashboard

### 🎧 Library
- **Your playlists** — All playlists you've created in one place
- **Saved albums** — Albums you've favorited
- **Quick access** — Left sidebar shows library at a glance

---

## 🏗️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Socket.io | Real-time presence & messaging |
| Clerk (`@clerk/express`) | Authentication middleware |
| Cloudinary | Audio & image file storage |
| express-fileupload | File upload handling |
| node-cron | Cleanup temp uploads (hourly) |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Zustand | Global state management |
| React Router DOM v6 | Client-side routing |
| Socket.io-client | Real-time communication |
| Clerk (`@clerk/clerk-react`) | Auth UI & hooks |
| Radix UI | Headless UI primitives |
| Axios | HTTP client |
| react-hot-toast | Toast notifications |
| react-resizable-panels | Collapsible sidebar layout |
| lucide-react | Icon library |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account
- Clerk account

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/SoundSip.git
cd SoundSip
```

### 2. Backend Setup
```bash
cd backend
cp .env.sample .env
# Fill in your values in .env
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.sample .env
# Fill in your values in .env
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:5001`.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/soundsip
ADMIN_EMAIL=your_admin_email@example.com
NODE_ENV=development

CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Frontend (`frontend/.env`)
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

---

## 📁 Project Structure

```
SoundSip/
├── backend/
│   └── src/
│       ├── index.js          ← Express server entry point
│       ├── lib/              ← DB, Socket.io, Cloudinary setup
│       ├── middleware/       ← Auth, upload middleware
│       ├── models/           ← 13 Mongoose schemas
│       ├── controller/       ← 14 business logic controllers
│       ├── routes/           ← 14 API route groups
│       └── seeds/            ← Database seed scripts
│
└── frontend/
    └── src/
        ├── App.tsx           ← Router with all routes
        ├── layout/           ← Main 3-panel layout + audio player
        ├── pages/            ← 16 page components
        ├── components/       ← Shared components (Topbar, Chat, etc.)
        ├── stores/           ← 12 Zustand state stores
        ├── hooks/            ← Custom React hooks
        ├── providers/        ← Auth provider
        └── types/            ← TypeScript interfaces
```

---

## 👥 Team & Contributions

See [CONTRIBUTORS.md](./CONTRIBUTORS.md) for detailed individual contributions.

---

## 📄 License

This project was built for educational purposes as a group project.
