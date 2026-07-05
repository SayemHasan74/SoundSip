# Artist Verification and Username Search Features

## Overview

This document describes the implementation of two key features for the Amar Gaan music platform:

1. **Artist Verification System** - Verified artists get a blue verification badge
2. **Username Search Functionality** - Users can be found by searching their username/handle

## Features Implemented

### 1. Artist Verification System

#### Backend Changes

**User Model Updates (`backend/src/models/user.model.js`):**
- Added text index for search functionality on `fullName`, `artistName`, `handle`, and `bio` fields
- Existing verification fields are already present:
  - `isVerified`: Boolean flag for verification status
  - `verificationDate`: Date when verification was approved
  - `verificationType`: Type of verification ('artist' or 'industry')
  - `verificationStatus`: Current status ('pending', 'approved', 'rejected')
  - `verificationNotes`: Admin notes for verification

**Artist Controller (`backend/src/controller/artist.controller.js`):**
- `submitVerification()`: Allows artists to submit verification requests
- `getVerificationStatus()`: Check current verification status
- `updateVerificationStatus()`: Admin function to approve/reject verification

#### Frontend Changes

**VerifiedBadge Component (`frontend/src/components/ui/VerifiedBadge.tsx`):**
- New reusable component for displaying verification badges
- Supports different sizes: `sm`, `md`, `lg`
- Blue background with white checkmark icon

**Profile Pages:**
- **UserProfilePage**: Shows verification badge on profile image and name
- **ArtistProfilePage**: Shows verification badge on profile image and artist name
- **SearchPage**: Shows verification badges in search results

### 2. Username Search Functionality

#### Backend Changes

**User Controller (`backend/src/controller/user.controller.js`):**
- `searchUsers()`: New endpoint for searching users by username, full name, or artist name
- Supports filtering by type: 'all', 'artists', 'users'
- Returns users sorted by verification status, followers, and name

**User Routes (`backend/src/routes/user.route.js`):**
- Added `GET /users/search` endpoint with query parameters:
  - `q`: Search query (required, minimum 2 characters)
  - `type`: Filter type ('all', 'artists', 'users')
  - `limit`: Maximum results (default: 20)

#### Frontend Changes

**Search Page (`frontend/src/pages/search/SearchPage.tsx`):**
- Added "Users" filter option
- New "Users" section in search results
- Displays user cards with:
  - Profile image with verification badge
  - Full name with verification badge
  - Username/handle
  - Artist name (if applicable)
  - Follower count
- Clicking on user cards navigates to their profile

**Types (`frontend/src/types/index.ts`):**
- Added `handle` field to User interface for username support

## Database Schema

### User Model Fields for Verification

```javascript
{
  isArtist: Boolean,           // Whether user is an artist
  isVerified: Boolean,         // Verification status
  verificationDate: Date,      // When verification was approved
  verificationType: String,    // 'artist' or 'industry'
  verificationStatus: String,  // 'pending', 'approved', 'rejected'
  verificationNotes: String,   // Admin notes
  handle: String,              // Username/handle for search
  artistName: String,          // Artist name (if applicable)
  genre: String,               // Music genre
  bio: String,                 // Artist biography
  followers: Number,           // Follower count
  // ... other fields
}
```

## API Endpoints

### User Search
```
GET /api/users/search?q={query}&type={type}&limit={limit}
```

**Parameters:**
- `q` (required): Search query (minimum 2 characters)
- `type` (optional): Filter type - 'all', 'artists', 'users' (default: 'all')
- `limit` (optional): Maximum results (default: 20)

**Response:**
```json
{
  "users": [
    {
      "_id": "user_id",
      "fullName": "Artist Name",
      "handle": "username",
      "imageUrl": "profile_image_url",
      "isArtist": true,
      "artistName": "Artist Name",
      "isVerified": true,
      "followers": 125000,
      "genre": "Pop"
    }
  ],
  "query": "search_query",
  "total": 5
}
```

### Artist Verification
```
POST /api/artists/verification
GET /api/artists/verification/status
PUT /api/admin/artists/{userId}/verification
```

## Usage Examples

### Searching for Users

1. **Search all users:**
   ```
   GET /api/users/search?q=emon
   ```

2. **Search only artists:**
   ```
   GET /api/users/search?q=emon&type=artists
   ```

3. **Search regular users:**
   ```
   GET /api/users/search?q=rafi&type=users
   ```

### Verification Process

1. **Artist submits verification:**
   ```javascript
   await axios.post('/api/artists/verification', {
     verificationType: 'artist'
   });
   ```

2. **Check verification status:**
   ```javascript
   const response = await axios.get('/api/artists/verification/status');
   console.log(response.data.verificationStatus); // 'pending', 'approved', 'rejected'
   ```

3. **Admin approves verification:**
   ```javascript
   await axios.put(`/api/admin/artists/${userId}/verification`, {
     status: 'approved',
     notes: 'Verified artist with good track record'
   });
   ```

## Seed Data

A seed file (`backend/src/seeds/users.js`) has been created with sample users:

- **3 Verified Artists:**
  - Emon Chowdhury (@emonchowdhury) - Bangla Rock
  - Aleya Begum (@aleyabegum) - Pop
  - Arfan Mredha Shiblu (@arfanshiblu) - Folk

- **2 Non-verified Artists:**
  - Ritu Raj (@rituraj) - Classical
  - Nandita (@nandita) - Jazz

- **5 Regular Users:**
  - Rafi Adnan (@rafiadnan)
  - Sadia Rahman (@sadiarahman)
  - Tahmid Khan (@tahmidkhan)
  - Zara Ahmed (@zaraahmed)
  - Fahim Islam (@fahimislam)

## Testing the Features

### 1. Run the Seed Script
```bash
cd backend
node src/seeds/users.js
```

### 2. Test User Search
- Go to the search page
- Search for usernames like "emon", "rafi", "sadia"
- Filter by "Users" to see only user results
- Click on user cards to navigate to profiles

### 3. Test Verification Badges
- Verified artists will show blue verification badges
- Check both profile pages and search results
- Badges appear on profile images and names

## Visual Indicators

### Verification Badge
- **Blue circular badge** with white checkmark
- Appears on profile images and names
- Different sizes available: small, medium, large
- Positioned in top-right corner of profile images

### Search Results
- **User cards** show profile image, name, username, and verification status
- **Verified artists** have blue badges prominently displayed
- **Artist names** shown in green for artist users
- **Follower counts** displayed for social proof

## Future Enhancements

1. **Verification Levels**: Different badge types for different verification levels
2. **Search Filters**: Filter by genre, verification status, follower count
3. **Search Suggestions**: Autocomplete for usernames
4. **Verification Process**: More detailed verification workflow with document upload
5. **Analytics**: Track search patterns and popular searches

## Security Considerations

1. **Search Rate Limiting**: Implement rate limiting on search endpoints
2. **Privacy Settings**: Allow users to control search visibility
3. **Admin Permissions**: Ensure only admins can approve/reject verification
4. **Input Validation**: Sanitize search queries to prevent injection attacks

## Performance Optimizations

1. **Database Indexes**: Text indexes on searchable fields
2. **Caching**: Cache popular search results
3. **Pagination**: Implement proper pagination for large result sets
4. **Debouncing**: Frontend debouncing for search input
