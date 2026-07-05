# 🔍 Search Functionality Comprehensive Test

## 📋 **Test Plan**

### **Content Types to Test:**
1. **Songs** - Search by title and artist
2. **Artists** - Search by artist name and genre
3. **Users** - Search by full name, handle, and artist name
4. **Albums** - Search by title and artist
5. **Playlists** - Search by name and creator
6. **Genres** - Search by genre name

### **Pages to Test:**
1. **Homepage (Topbar)** - Quick search functionality
2. **Search Page** - Comprehensive search with filters

## 🧪 **Test Cases**

### **1. Songs Search**
- [ ] **Homepage**: Search for song titles
- [ ] **Homepage**: Search for artist names
- [ ] **Search Page**: Search for songs with filters
- [ ] **Search Page**: Song results display correctly
- [ ] **Search Page**: Song play functionality works

### **2. Artists Search**
- [ ] **Homepage**: Search for artist names
- [ ] **Search Page**: Search for artists with filters
- [ ] **Search Page**: Artist results display correctly
- [ ] **Search Page**: Artist verification badges show
- [ ] **Search Page**: Artist navigation works

### **3. Users Search**
- [ ] **Homepage**: Search for user names
- [ ] **Homepage**: Search for user handles (@username)
- [ ] **Homepage**: Search for artist names
- [ ] **Search Page**: Search for users with filters
- [ ] **Search Page**: User results display correctly
- [ ] **Search Page**: User verification badges show
- [ ] **Search Page**: User profile navigation works

### **4. Albums Search**
- [ ] **Homepage**: Search for album titles
- [ ] **Homepage**: Search for album artists
- [ ] **Search Page**: Search for albums with filters
- [ ] **Search Page**: Album results display correctly
- [ ] **Search Page**: Album play functionality works

### **5. Playlists Search**
- [ ] **Search Page**: Search for playlist names
- [ ] **Search Page**: Search for playlist creators
- [ ] **Search Page**: Playlist results display correctly
- [ ] **Search Page**: Playlist play functionality works

### **6. Genres Search**
- [ ] **Search Page**: Search for genre names
- [ ] **Search Page**: Genre results display correctly
- [ ] **Search Page**: Genre navigation works

### **7. Search Features**
- [ ] **Real-time search**: Results update as you type
- [ ] **Search suggestions**: Recent, trending, and genre suggestions
- [ ] **Search filters**: All content type filters work
- [ ] **Search sorting**: Relevance, popularity, newest, oldest
- [ ] **Clear search**: Stays on search page
- [ ] **Search navigation**: URL updates with search query

## 🔧 **Backend API Endpoints Status**

### **✅ Available Endpoints:**
- `GET /api/songs/search` - Song search
- `GET /api/artists/search` - Artist search
- `GET /api/users/search` - User search (with authentication)
- `GET /api/playlists/search` - Playlist search
- `GET /api/genres/search` - Genre search
- `GET /api/albums` - Get all albums (client-side filtering)

### **❌ Missing Endpoints:**
- `GET /api/albums/search` - Dedicated album search endpoint

## 🐛 **Known Issues to Check**

### **1. Authentication Issues**
- [ ] User search requires authentication
- [ ] Axios interceptor adds auth tokens correctly
- [ ] Fallback to chat store users works

### **2. Data Issues**
- [ ] Mock data fallbacks work when APIs fail
- [ ] Empty results handled gracefully
- [ ] Loading states display correctly

### **3. UI Issues**
- [ ] Search suggestions display correctly
- [ ] Search results layout is responsive
- [ ] Navigation between results works
- [ ] Clear search functionality works

## 📊 **Expected Results**

### **Homepage Search (Topbar)**
- ✅ Songs: Backend API search
- ✅ Users: Chat store filtering (working)
- ✅ Albums: Client-side filtering from albums store
- ❌ Artists: Mock data (empty array)
- ❌ Playlists: Mock data (empty array)

### **Search Page**
- ✅ Songs: Backend API search
- ✅ Artists: Backend API search
- ✅ Users: Backend API search with fallback
- ✅ Albums: Client-side filtering from albums API
- ✅ Playlists: Backend API search with fallback
- ✅ Genres: Backend API search with fallback

## 🚀 **Test Execution**

### **Step 1: Start Services**
```bash
# Backend
cd backend && npm start

# Frontend  
cd frontend && npm run dev
```

### **Step 2: Manual Testing**
1. **Homepage Search**
   - Type in Topbar search
   - Check songs, users, albums results
   - Verify navigation works

2. **Search Page**
   - Navigate to /search
   - Test all content types
   - Test filters and sorting
   - Test clear functionality

### **Step 3: API Testing**
```bash
# Test song search
curl "http://localhost:5001/api/songs/search?q=test"

# Test artist search  
curl "http://localhost:5001/api/artists/search?q=test"

# Test user search (requires auth)
curl "http://localhost:5001/api/users/search?q=test"

# Test playlist search
curl "http://localhost:5001/api/playlists/search?q=test"

# Test genre search
curl "http://localhost:5001/api/genres/search?q=test"

# Test albums
curl "http://localhost:5001/api/albums"
```

## 📝 **Test Results**

### **Homepage Search Results:**
- [ ] Songs: Working/Not Working
- [ ] Users: Working/Not Working  
- [ ] Albums: Working/Not Working
- [ ] Artists: Working/Not Working
- [ ] Playlists: Working/Not Working

### **Search Page Results:**
- [ ] Songs: Working/Not Working
- [ ] Artists: Working/Not Working
- [ ] Users: Working/Not Working
- [ ] Albums: Working/Not Working
- [ ] Playlists: Working/Not Working
- [ ] Genres: Working/Not Working

### **Search Features Results:**
- [ ] Real-time search: Working/Not Working
- [ ] Search suggestions: Working/Not Working
- [ ] Filters: Working/Not Working
- [ ] Sorting: Working/Not Working
- [ ] Clear search: Working/Not Working
- [ ] Navigation: Working/Not Working

## 🎯 **Success Criteria**

✅ **All content types searchable on both pages**
✅ **Real-time search works smoothly**
✅ **Search suggestions provide helpful options**
✅ **Filters and sorting work correctly**
✅ **Navigation between results works**
✅ **Clear search stays on page**
✅ **Error handling works gracefully**
✅ **Responsive design works on all devices**

---

*This test plan will be updated with actual results after testing.*
