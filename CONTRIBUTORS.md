# 👥 SoundSip — Team Contributions

This project was built as a **group project**. Below is a breakdown of each team member's contributions.

---

## 🙋 Hasan Mohammad Sayem

**Role:** Full-Stack Developer

### 🎵 Music Player & Playback Controls
- Implemented the persistent bottom **playback bar** with full controls
- **Play / Pause** toggle with correct state sync across the app
- **Next song / Previous song** navigation through the queue
- **Progress bar** with click-to-seek functionality and live time display
- **Volume control** — smooth slider with mute/unmute toggle
- **Shuffle mode** — true randomization of the song queue with ability to restore original order
- **Repeat modes** — three-state cycle: Off → Repeat All → Repeat One
- Built the `usePlayerStore` (Zustand) to manage all playback state globally
- Integrated **Socket.io activity broadcasting** — when you play a song, friends see "Playing X by Y" in real time
- Built the hidden `AudioPlayer` component that manages the actual `<audio>` HTML element

### ❤️ Liked Songs Page & Favorites System
- Built the **Liked Songs** page — displays all songs the user has heart-liked
- Implemented the **heart button** on song cards and the player bar to like/unlike songs
- Connected likes to the **Favorites API** (backend) and the **Liked Songs playlist** (auto-synced)
- Built `useFavoritesStore` — handles adding/removing favorites, stats, and favorite status checks
- Implemented **favorites stats** (total liked songs, albums, artists)
- Wired favorite songs to automatically appear in the Liked Songs playlist

### 📋 Playlist Creation & Management
- Built the **Create Playlist** feature — modal with name, description, public/private toggle
- Implemented **Add Song to Playlist** — from any song card or context menu
- Built **Remove Song from Playlist** functionality
- Implemented **Edit Playlist** (rename, change description/visibility)
- Built **Delete Playlist** with guard against deleting the special Liked Songs playlist
- Built `usePlaylistStore` — full CRUD state management for all playlists
- Implemented the **Liked Songs special playlist** — auto-created for every user, auto-synced with favorites

### 🏠 Home Page Dashboard
- Built the **Home page** with all sections:
  - **Featured Songs** — hero section with top curated tracks
  - **Trending Songs** — most-played songs on the platform
  - **Made For You** — personalized recommendations
  - **Recently Played** — last listened tracks from listening history
  - **Browse Albums** — grid of all albums with cover art
- Connected all sections to backend API endpoints
- Implemented **music suggestions** based on user activity

### 📊 Listening History & "Recently Played"
- Built `useListeningHistoryStore` — tracks every song play
- Implemented **recent activity** display on the home page
- Listening stats: total time, top songs, top artists per time period (week/month/year)

### 👤 User-Related Work
- Profile page integration (viewing own & other users' profiles)
- User search — find users by name or @handle
- Settings page — audio quality, playback preferences, privacy controls

---

## 👤 Member 2

**Role:** Full-Stack Developer

- Assisted with backend database schema configuration and Clerk integration
- Contributed to real-time chat socket handlers and messaging routes
- Assisted with styling components and page layout styling

---

## 👤 Member 3

**Role:** Frontend Developer

- Implemented user and artist profile page UI interfaces
- Assisted with admin panel dashboard layout
- Contributed to settings page UI implementation
