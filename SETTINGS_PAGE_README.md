# Amar Gaan Settings Page

A comprehensive settings page for the Amar Gaan music streaming platform with advanced customization options.

## Features

### 🎯 Common Settings
- **Language & Appearance**
  - Multi-language support (English, Bengali, Hindi, Urdu, Arabic, Spanish, French, German, Japanese, Korean)
  - Theme selection (Light, Dark, Auto)
- **Notifications**
  - Email notifications
  - Push notifications
  - SMS notifications
- **Privacy & Visibility**
  - Profile visibility (Public, Friends, Private)
  - Online status display
  - Listening activity sharing
  - Message permissions

### 🔊 Enhanced Settings
- **Audio Quality & Processing**
  - Audio quality selection (Low, Medium, High, Lossless)
  - Audio normalization
  - Crossfade with duration control
  - Equalizer with presets (Flat, Bass, Treble, Vocal, Custom)
- **Playback Behavior**
  - Autoplay settings
  - Shuffle mode
  - Repeat modes (Off, One, All)
  - Gapless playback
  - Preload next song
- **Interface & Display**
  - Compact mode
  - Lyrics display
  - Audio visualizer
  - Animations toggle
  - Reduced motion for accessibility

### 🌟 Unique Settings
- **Music Discovery**
  - Recommendation engine (AI, Collaborative, Hybrid)
  - New releases display
  - Trending content
  - Friends activity
  - Personalized playlists
- **Social Features**
  - Listening activity sharing
  - Friend requests
  - Search visibility
  - Activity feed
  - Group listening sessions
- **Content Preferences**
  - Explicit content filtering
  - Advertisement display
  - Download quality
  - Offline mode
- **Regional & Cultural Features**
  - Bengali music focus
  - Cultural events notifications
  - Community features

### ⚙️ Advanced Settings
- **Developer Options**
  - Debug mode
  - Analytics collection
  - Crash reporting
  - Beta features access
- **Performance & Optimization**
  - Cache size management
  - Background playback
  - High performance mode
  - Data saver mode
- **External Integrations**
  - Last.fm scrobbling
  - Spotify sync
  - Apple Music sync
  - YouTube Music sync
  - Discord Rich Presence

### 🎵 Platform Integration
- **Major Platforms**
  - Spotify
  - Apple Music
  - YouTube Music
  - Tidal
  - Deezer
  - Amazon Music

- **Unique & Regional Platforms**
  - Wynk Music (Airtel)
  - Gaana (Indian music)
  - JioSaavn (Reliance)
  - Hungama Music
  - SoundCloud
  - Bandcamp

## Technical Implementation

### Frontend
- **React TypeScript** with modern hooks
- **Zustand** for state management with persistence
- **Radix UI** components for accessibility
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Node.js/Express** API endpoints
- **MongoDB** with Mongoose for data persistence
- **JWT authentication** with Clerk integration
- **Settings storage** in user document

### Key Features
- **Real-time updates** with unsaved changes detection
- **Import/Export** settings functionality
- **Reset to defaults** option
- **Responsive design** for mobile and desktop
- **Accessibility** features (reduced motion, keyboard navigation)
- **Persistent storage** with local backup

## Usage

1. Navigate to `/settings` in the application
2. Use the tabbed interface to access different setting categories
3. Modify settings as needed
4. Click "Save Changes" to persist modifications
5. Use "Reset" to restore default settings
6. Export/Import settings for backup or transfer

## API Endpoints

- `GET /users/settings` - Retrieve user settings
- `PUT /users/settings` - Update user settings

## File Structure

```
frontend/src/
├── pages/settings/
│   ├── SettingsPage.tsx
│   └── components/
│       ├── CommonSettingsTab.tsx
│       ├── EnhancedSettingsTab.tsx
│       ├── UniqueSettingsTab.tsx
│       ├── AdvancedSettingsTab.tsx
│       └── PlatformSettingsTab.tsx
├── stores/
│   └── useSettingsStore.ts
└── components/ui/
    └── switch.tsx

backend/src/
├── controller/
│   └── user.controller.js (settings functions)
├── routes/
│   └── user.route.js (settings routes)
└── models/
    └── user.model.js (settings field)
```

## Future Enhancements

- **Theme customization** with color picker
- **Keyboard shortcuts** configuration
- **Voice commands** settings
- **Advanced equalizer** with custom bands
- **Platform-specific** advanced settings
- **Settings templates** for different use cases
- **Cloud sync** across devices
- **Settings analytics** and recommendations
