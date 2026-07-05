# Friend Request and Follow System Implementation

## Overview
This document outlines the implementation of a comprehensive friend request and follow system for the Amar Gaan music platform. The system distinguishes between regular users and artists, with different interaction rules for each.

## Key Features Implemented

### 1. Friend Request System
- **Any user can send friend requests to other users**
- **Users cannot send friend requests to artists** (they can only follow artists)
- **Artists can send friend requests to anyone** (users or other artists)
- **Friend requests can include optional messages**
- **Users can accept, reject, or cancel friend requests**
- **Friend count is private and only visible to the user themselves**

### 2. Follow System
- **Only artists can be followed** by users or other artists
- **Regular users cannot be followed** (they use the friend system instead)
- **Followers count is public** and visible on artist profiles
- **Following count tracks who the user is following**

### 3. Profile Display Rules
- **Regular Users**: Show friend count (private), no followers/following counts
- **Artists**: Show followers and following counts (public), plus friend count (private)

## Backend Implementation

### New Models Created

#### 1. FriendRequest Model (`backend/src/models/friendRequest.model.js`)
```javascript
{
  senderId: String,      // clerkId of sender
  receiverId: String,    // clerkId of receiver
  status: String,        // 'pending', 'accepted', 'rejected'
  message: String,       // optional message (max 200 chars)
  timestamps: true
}
```

#### 2. Friendship Model (`backend/src/models/friendship.model.js`)
```javascript
{
  user1Id: String,       // clerkId of first user (smaller ID first)
  user2Id: String,       // clerkId of second user
  timestamps: true
}
```

#### 3. Follow Model (`backend/src/models/follow.model.js`)
```javascript
{
  followerId: String,    // clerkId of follower
  followingId: String,   // clerkId of person being followed
  timestamps: true
}
```

### Updated User Model
- Added `friendCount` field for all users
- Kept `followers` and `following` fields for artists
- Added proper indexing for performance

### New Controllers

#### 1. Friend Controller (`backend/src/controller/friend.controller.js`)
- `sendFriendRequest()` - Send friend request
- `acceptFriendRequest()` - Accept friend request
- `rejectFriendRequest()` - Reject friend request
- `cancelFriendRequest()` - Cancel sent request
- `removeFriend()` - Remove existing friend
- `getFriendRequests()` - Get received requests
- `getSentFriendRequests()` - Get sent requests
- `getFriendsList()` - Get friends list
- `checkFriendshipStatus()` - Check relationship status

#### 2. Follow Controller (`backend/src/controller/follow.controller.js`)
- `followArtist()` - Follow an artist
- `unfollowArtist()` - Unfollow an artist
- `checkFollowStatus()` - Check if following
- `getFollowers()` - Get artist's followers
- `getFollowing()` - Get user's following list

### New Routes

#### Friend Routes (`backend/src/routes/friend.route.js`)
- `POST /api/friends/request/:receiverId` - Send friend request
- `PUT /api/friends/request/:requestId/accept` - Accept request
- `PUT /api/friends/request/:requestId/reject` - Reject request
- `DELETE /api/friends/request/:requestId` - Cancel request
- `DELETE /api/friends/:friendId` - Remove friend
- `GET /api/friends/requests` - Get received requests
- `GET /api/friends/requests/sent` - Get sent requests
- `GET /api/friends/list` - Get friends list
- `GET /api/friends/status/:userId` - Check friendship status

#### Follow Routes (`backend/src/routes/follow.route.js`)
- `POST /api/follows/:artistId` - Follow artist
- `DELETE /api/follows/:artistId` - Unfollow artist
- `GET /api/follows/status/:artistId` - Check follow status
- `GET /api/follows/followers/:artistId` - Get artist's followers
- `GET /api/follows/following` - Get user's following list

## Frontend Implementation

### New Stores

#### 1. Friend Store (`frontend/src/stores/useFriendStore.ts`)
- Manages friend requests, friendships, and related state
- Handles all friend-related API calls
- Provides real-time updates for friend status

#### 2. Follow Store (`frontend/src/stores/useFollowStore.ts`)
- Manages follow relationships for artists
- Handles follow/unfollow API calls
- Tracks following and followers lists

### New Components

#### 1. FriendRequestModal (`frontend/src/components/FriendRequestModal.tsx`)
- Modal for sending friend requests
- Includes optional message field
- Shows user information and status

#### 2. FriendRequestsPanel (`frontend/src/components/FriendRequestsPanel.tsx`)
- Displays received and sent friend requests
- Allows accepting, rejecting, and canceling requests
- Shows user information and request messages

#### 3. FriendsList (`frontend/src/components/FriendsList.tsx`)
- Displays user's friends list
- Allows removing friends
- Shows friend information and quick actions

### Updated Components

#### 1. UserProfilePage
- **For Regular Users**: Shows friend count, "Add Friend" button
- **For Artists**: Shows followers/following counts, "Follow" button
- **Friend Request Status**: Shows appropriate button based on relationship
- **Friend Request Modal**: Integrated for sending requests

#### 2. ArtistProfilePage
- Updated to use new follow store
- Proper follow/unfollow functionality
- Real-time follower count updates

#### 3. FriendsActivity (Right Sidebar)
- **Three Tabs**: Activity, Requests, Friends
- **Activity Tab**: Shows what friends are listening to
- **Requests Tab**: Shows friend request management
- **Friends Tab**: Shows friends list with actions

## Business Rules Implemented

### Friend Request Rules
1. **Users can send friend requests to other users**
2. **Users cannot send friend requests to artists** (only follow)
3. **Artists can send friend requests to anyone**
4. **Cannot send friend request to yourself**
5. **Cannot send duplicate friend requests**
6. **Cannot send friend request if already friends**

### Follow Rules
1. **Only artists can be followed**
2. **Anyone can follow artists** (users and other artists)
3. **Cannot follow yourself**
4. **Cannot follow the same artist twice**
5. **Followers count is public for artists**

### Profile Display Rules
1. **Regular Users**: 
   - Show friend count (private)
   - No followers/following counts
   - "Add Friend" button for other users
2. **Artists**:
   - Show followers and following counts (public)
   - Show friend count (private)
   - "Follow" button for other users

### Sidebar Activity Rules
1. **Right sidebar shows friend activity only**
2. **Three tabs**: Activity, Requests, Friends
3. **Activity tab**: Shows what friends are listening to
4. **Requests tab**: Manage friend requests
5. **Friends tab**: View and manage friends list

## Database Indexes
- Friend requests: `{ senderId: 1, receiverId: 1 }` (unique)
- Friendships: `{ user1Id: 1, user2Id: 1 }` (unique)
- Follows: `{ followerId: 1, followingId: 1 }` (unique)
- Additional indexes for query performance

## Security Considerations
- All endpoints require authentication
- Users can only manage their own friend requests
- Proper validation of user relationships
- Rate limiting should be implemented for production

## Future Enhancements
1. **Real-time notifications** for friend requests
2. **Friend suggestions** based on mutual friends
3. **Friend activity feed** with more detailed information
4. **Group listening sessions** with friends
5. **Friend playlists** and collaborative features
6. **Privacy settings** for friend visibility

## Testing
- Backend API endpoints tested
- Frontend components integrated
- User flows verified for both regular users and artists
- Error handling implemented
- Loading states and user feedback added

This implementation provides a complete friend request and follow system that distinguishes between regular users and artists while maintaining a clean and intuitive user experience.
