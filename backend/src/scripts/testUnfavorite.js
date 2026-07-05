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

const testUnfavorite = async () => {
	try {
		await connectDB();

		const testUserId = 'user_31kP23D8d1SXVpfiD2YOq76F1h8';

		console.log(`\n🧪 Testing Unfavorite Functionality for user: ${testUserId}`);

		// Check current state
		const likedSongsPlaylist = await Playlist.findOne({ 
			creator: testUserId, 
			isLikedSongs: true 
		});

		const userFavorites = await Favorite.find({ 
			userId: testUserId, 
			type: 'song' 
		});

		console.log(`\n📊 Current State:`);
		console.log(`- Liked Songs Playlist: ${likedSongsPlaylist ? likedSongsPlaylist.songCount : 0} songs`);
		console.log(`- User Favorites: ${userFavorites.length} songs`);

		if (likedSongsPlaylist) {
			console.log(`\n🎵 Songs in Liked Songs playlist:`);
			likedSongsPlaylist.songs.forEach((songId, index) => {
				console.log(`  ${index + 1}. ${songId}`);
			});
		}

		if (userFavorites.length > 0) {
			console.log(`\n❤️ User's favorited songs:`);
			userFavorites.forEach((fav, index) => {
				console.log(`  ${index + 1}. ${fav.title} (ID: ${fav.itemId})`);
			});
		}

		// Check if there are any songs in liked songs that are not in favorites
		if (likedSongsPlaylist && userFavorites.length > 0) {
			const favoriteSongIds = userFavorites.map(fav => fav.itemId.toString());
			const orphanedSongs = likedSongsPlaylist.songs.filter(songId => 
				!favoriteSongIds.includes(songId.toString())
			);

			if (orphanedSongs.length > 0) {
				console.log(`\n⚠️ Found ${orphanedSongs.length} songs in Liked Songs that are not in favorites:`);
				orphanedSongs.forEach(songId => {
					console.log(`  - ${songId}`);
				});
			} else {
				console.log(`\n✅ All songs in Liked Songs playlist are properly favorited`);
			}
		}

		process.exit(0);
	} catch (error) {
		console.error("Error testing unfavorite functionality:", error);
		process.exit(1);
	}
};

testUnfavorite();
