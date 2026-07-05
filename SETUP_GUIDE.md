# Spotify Clone Setup Guide 🎵

## 🚀 Project Status
✅ **Backend Server**: Running on http://localhost:5001  
✅ **Frontend Server**: Running on http://localhost:3000  
✅ **Database**: MongoDB connected and seeded with sample data  
✅ **Dependencies**: All packages installed  

## 📋 Prerequisites
- Node.js (v18+)
- MongoDB (already running on your system)
- Git

## 🔧 Environment Setup

### Backend (.env file in `/backend` folder)
```bash
PORT=5001
MONGODB_URI=mongodb://localhost:27017/spotify-clone
ADMIN_EMAIL=admin@example.com
NODE_ENV=development

# Optional: Cloudinary for image uploads
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# Optional: Clerk for authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### Frontend (.env file in `/frontend` folder)
```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## 🎯 How to Run

### Option 1: Using the root package.json (Recommended)
```bash
# Install all dependencies
npm install

# Build and start the project
npm run build
npm start
```

### Option 2: Run servers separately
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend  
cd frontend
npm run dev
```

## 🌐 Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **Database**: MongoDB on localhost:27017

## 📊 Sample Data
The database has been seeded with:
- Sample albums and songs
- Ready for testing the music player functionality

## 🔑 Important Notes

### Authentication
- The project uses Clerk for authentication
- You'll need to set up Clerk account and get API keys for full functionality
- Without Clerk keys, some features may not work

### File Uploads
- Cloudinary is used for image uploads
- Set up Cloudinary account and add credentials for admin features

### Admin Access
- Set your email in `ADMIN_EMAIL` to access admin dashboard
- Admin can create albums and songs

## 🐛 Troubleshooting

### Port Issues
- Backend runs on port 5001 (changed from 5000 due to macOS Control Center)
- Frontend runs on port 3000

### Database Issues
- Ensure MongoDB is running: `brew services start mongodb-community`
- Check connection string in backend .env file

### Dependencies
- Run `npm install` in both `/backend` and `/frontend` folders if needed
- Clear node_modules and reinstall if you encounter issues

## 🎵 Features Available
- Music player with play/pause, next/previous
- Volume control
- Real-time chat
- User online/offline status
- Admin dashboard for content management
- Real-time listening status
- Analytics dashboard

## 📱 Next Steps
1. Open http://localhost:3000 in your browser
2. Set up Clerk authentication (optional but recommended)
3. Set up Cloudinary for file uploads (optional)
4. Customize the admin email in backend .env
5. Start building your music collection!

---

**Happy Coding! 🎸**

