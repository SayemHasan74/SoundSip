import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Favorite } from "../models/favorite.model.js";
import { Song } from "../models/song.model.js";
import { clerkClient } from "@clerk/express";
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

const fixLikedSongs = async () => {
	try {
		await connectDB();

		const testUserId = 'user_31kP23D8d1SXVpfiD2YOq76F1h8';

		console.log(`\n🔧 Fixing Liked Songs for user: ${testUserId}`);

		// Check if user has a liked songs playlist
		let likedSongsPlaylist = await Playlist.findOne({ 
			creator: testUserId, 
			isLikedSongs: true 
		});

		if (!likedSongsPlaylist) {
			console.log("📝 Creating Liked Songs playlist...");
			
			// Get user details from Clerk
			const clerkUser = await clerkClient.users.getUser(testUserId);
			const creatorName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Unknown User';

			// Create liked songs playlist
			likedSongsPlaylist = new Playlist({
				name: 'Liked Songs',
				description: 'Your favorite songs',
				creator: testUserId,
				creatorName,
				isPublic: false,
				isLikedSongs: true,
				songs: [],
				songCount: 0
			});

			await likedSongsPlaylist.save();
			console.log("✅ Liked Songs playlist created!");
		} else {
			console.log("✅ Liked Songs playlist already exists");
		}

		// Get user's favorited songs
		const userFavorites = await Favorite.find({ 
			userId: testUserId, 
			type: 'song' 
		});

		console.log(`\n🎵 Found ${userFavorites.length} favorited songs`);

		// Add each favorited song to the liked songs playlist
		for (const favorite of userFavorites) {
			// Check if song already exists in playlist
			const existingSong = likedSongsPlaylist.songs.find(song => song.toString() === favorite.itemId);
			
			if (!existingSong) {
				// Verify the song exists
				const song = await Song.findById(favorite.itemId);
				if (song) {
					likedSongsPlaylist.songs.push(favorite.itemId);
					console.log(`➕ Added "${favorite.title}" to Liked Songs`);
				} else {
					console.log(`⚠️ Song "${favorite.title}" not found in database`);
				}
			} else {
				console.log(`ℹ️ Song "${favorite.title}" already in Liked Songs`);
			}
		}

		// Update song count and save
		likedSongsPlaylist.songCount = likedSongsPlaylist.songs.length;
		await likedSongsPlaylist.save();

		console.log(`\n🎉 Liked Songs playlist updated!`);
		console.log(`📊 Total songs: ${likedSongsPlaylist.songCount}`);

		process.exit(0);
	} catch (error) {
		console.error("Error fixing liked songs:", error);
		process.exit(1);
	}
};

fixLikedSongs();
