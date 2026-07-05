Playlist Merging Feature - Quick Implementation Guide

Feature Overview
Allow users to merge multiple playlists into one new playlist with duplicate song removal.

Main Requirements
1. Add "Merge Playlists" option before "Create Playlist" in left sidebar
2. Search existing playlists
3. Multi-select playlists to merge
4. Name the new merged playlist
5. Remove duplicate songs automatically

Frontend Changes

1. LeftSidebar.tsx
- Add "Merge Playlists" menu option
- Add state for merge modal
- Import MergePlaylistsModal

2. New Components
- MergePlaylistsModal.tsx - Main merge interface
- PlaylistSearch.tsx - Search functionality
- SelectedPlaylistsList.tsx - Show selected playlists

3. usePlaylistStore.ts
- Add searchPlaylists function
- Add mergePlaylists function
- Add getDuplicateSongs function

Backend Changes

1. playlist.controller.js
- searchPlaylistsForMerge - Search user's playlists
- getDuplicateSongs - Find duplicate songs
- mergePlaylists - Create merged playlist

2. playlist.route.js
- GET /search-for-merge
- POST /check-duplicates  
- POST /merge

3. playlist.model.js
- Add mergedFrom array
- Add isMerged boolean
- Add mergeMetadata object

Implementation Steps

1. Backend First
- Create search endpoint
- Implement merge logic
- Update database schema
- Test APIs

2. Frontend Components
- Build MergePlaylistsModal
- Create PlaylistSearch
- Update LeftSidebar
- Connect to store

3. Integration
- Connect frontend to backend
- Test merge workflow
- Add error handling
- Polish UI

Key Files to Modify

Frontend:
- frontend/src/layout/components/LeftSidebar.tsx
- frontend/src/stores/usePlaylistStore.ts
- New: frontend/src/components/playlist/MergePlaylistsModal.tsx
- New: frontend/src/components/playlist/PlaylistSearch.tsx

Backend:
- backend/src/controller/playlist.controller.js
- backend/src/routes/playlist.route.js
- backend/src/models/playlist.model.js

User Flow
1. Click "Merge Playlists" in sidebar
2. Search for playlists
3. Select multiple playlists
4. Enter new playlist name
5. Preview duplicate songs
6. Create merged playlist

Duplicate Handling
- Collect all songs from selected playlists
- Use Set to track unique song IDs
- Add each song only once
- Maintain order from first occurrence

Estimated Time: 1-2 weeks
