import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Favorite } from "../models/favorite.model.js";
import { Song } from "../models/song.model.js";
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

const testFavoriteIntegration = async () => {
	try {
		await connectDB();

		const testUserId = 'user_31kP23D8d1SXVpfiD2YOq76F1h8';

		console.log(`\n🧪 Testing Favorite Integration for user: ${testUserId}`);

		// Get a sample song to test with
		const sampleSong = await Song.findOne();
		if (!sampleSong) {
			console.log("❌ No songs found in database");
			process.exit(1);
		}

		console.log(`\n🎵 Using test song: "${sampleSong.title}" (ID: ${sampleSong._id})`);

		// Check if this song is already favorited
		const existingFavorite = await Favorite.findOne({
			userId: testUserId,
			itemId: sampleSong._id,
			type: 'song'
		});

		if (existingFavorite) {
			console.log("ℹ️ Song is already favorited, removing it first...");
			await Favorite.findByIdAndDelete(existingFavorite._id);
		}

		// Simulate favoriting the song
		console.log("❤️ Favoriting the song...");
		const newFavorite = new Favorite({
			userId: testUserId,
			type: 'song',
			itemId: sampleSong._id,
			title: sampleSong.title,
			artist: sampleSong.artist,
			imageUrl: sampleSong.imageUrl,
			metadata: {
				audioUrl: sampleSong.audioUrl,
				duration: sampleSong.duration,
				genre: sampleSong.genre,
				albumId: sampleSong.albumId
			}
		});

		await newFavorite.save();
		console.log("✅ Song favorited!");

		// Check if it was added to liked songs playlist
		const likedSongsPlaylist = await Playlist.findOne({
			creator: testUserId,
			isLikedSongs: true
		});

		if (likedSongsPlaylist) {
			const songInPlaylist = likedSongsPlaylist.songs.find(song => song.toString() === sampleSong._id.toString());
			if (songInPlaylist) {
				console.log("✅ Song automatically added to Liked Songs playlist!");
			} else {
				console.log("❌ Song NOT added to Liked Songs playlist");
				console.log("🔧 This means the frontend integration needs to be tested");
			}
		} else {
			console.log("❌ Liked Songs playlist not found");
		}

		// Clean up - remove the test favorite
		console.log("\n🧹 Cleaning up test favorite...");
		await Favorite.findByIdAndDelete(newFavorite._id);
		console.log("✅ Test favorite removed");

		process.exit(0);
	} catch (error) {
		console.error("Error testing favorite integration:", error);
		process.exit(1);
	}
};

testFavoriteIntegration();
