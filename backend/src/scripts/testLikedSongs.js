import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Favorite } from "../models/favorite.model.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		process.exit(1);
	}
};

const testLikedSongs = async () => {
	try {
		await connectDB();

		const testUserId = 'user_31kP23D8d1SXVpfiD2YOq76F1h8';

		// Check if user has a liked songs playlist
		const likedSongsPlaylist = await Playlist.findOne({ 
			creator: testUserId, 
			isLikedSongs: true 
		});

		console.log(`\n🎵 Liked Songs Playlist for user ${testUserId}:`);
		if (likedSongsPlaylist) {
			console.log(`✅ Found: ${likedSongsPlaylist.name}`);
			console.log(`📊 Songs: ${likedSongsPlaylist.songCount}`);
			console.log(`🆔 ID: ${likedSongsPlaylist._id}`);
		} else {
			console.log(`❌ No liked songs playlist found`);
		}

		// Check user's favorites
		const userFavorites = await Favorite.find({ userId: testUserId });
		console.log(`\n❤️ User Favorites: ${userFavorites.length}`);
		userFavorites.forEach(fav => {
			console.log(`- ${fav.type}: ${fav.title} (ID: ${fav.itemId})`);
		});

		// Check all playlists for this user
		const userPlaylists = await Playlist.find({ creator: testUserId });
		console.log(`\n📋 All User Playlists: ${userPlaylists.length}`);
		userPlaylists.forEach(playlist => {
			console.log(`- ${playlist.name} (Songs: ${playlist.songCount}, Liked Songs: ${playlist.isLikedSongs})`);
		});

		process.exit(0);
	} catch (error) {
		console.error("Error testing liked songs:", error);
		process.exit(1);
	}
};

testLikedSongs();
