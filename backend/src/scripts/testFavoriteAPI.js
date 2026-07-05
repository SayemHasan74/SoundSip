import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { Favorite } from "../models/favorite.model.js";
import { Song } from "../models/song.model.js";
import dotenv from "dotenv";
import axios from "axios";

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

const testFavoriteAPI = async () => {
	try {
		await connectDB();

		const testUserId = 'user_31kP23D8d1SXVpfiD2YOq76F1h8';
		const baseURL = 'http://localhost:5001/api';

		console.log(`\n🧪 Testing Favorite API Endpoints for user: ${testUserId}`);

		// Get a sample song to test with
		const sampleSong = await Song.findOne();
		if (!sampleSong) {
			console.log("❌ No songs found in database");
			process.exit(1);
		}

		console.log(`\n🎵 Using test song: "${sampleSong.title}" (ID: ${sampleSong._id})`);

		// Check initial state
		const initialLikedSongsPlaylist = await Playlist.findOne({ 
			creator: testUserId, 
			isLikedSongs: true 
		});

		const initialFavorites = await Favorite.find({ 
			userId: testUserId, 
			type: 'song' 
		});

		console.log(`\n📊 Initial State:`);
		console.log(`- Liked Songs Playlist: ${initialLikedSongsPlaylist ? initialLikedSongsPlaylist.songCount : 0} songs`);
		console.log(`- User Favorites: ${initialFavorites.length} songs`);

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

		// Test adding to favorites via API
		console.log("\n❤️ Testing addToFavorites API...");
		try {
			const addResponse = await axios.post(`${baseURL}/favorites`, {
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
			}, {
				headers: {
					'Authorization': `Bearer ${testUserId}`,
					'Content-Type': 'application/json'
				}
			});

			console.log("✅ Add to favorites API call successful!");
		} catch (error) {
			console.log("❌ Add to favorites API call failed:", error.response?.data || error.message);
		}

		// Check if it was added to liked songs playlist
		const updatedLikedSongsPlaylist = await Playlist.findOne({
			creator: testUserId,
			isLikedSongs: true
		});

		if (updatedLikedSongsPlaylist) {
			const songInPlaylist = updatedLikedSongsPlaylist.songs.find(song => song.toString() === sampleSong._id.toString());
			if (songInPlaylist) {
				console.log("✅ Song automatically added to Liked Songs playlist!");
			} else {
				console.log("❌ Song NOT added to Liked Songs playlist");
			}
		} else {
			console.log("❌ Liked Songs playlist not found");
		}

		// Test removing from favorites via API
		console.log("\n💔 Testing removeFromFavorites API...");
		try {
			const removeResponse = await axios.delete(`${baseURL}/favorites/${sampleSong._id}`, {
				headers: {
					'Authorization': `Bearer ${testUserId}`
				}
			});

			console.log("✅ Remove from favorites API call successful!");
		} catch (error) {
			console.log("❌ Remove from favorites API call failed:", error.response?.data || error.message);
		}

		// Check if it was removed from liked songs playlist
		const finalLikedSongsPlaylist = await Playlist.findOne({
			creator: testUserId,
			isLikedSongs: true
		});

		if (finalLikedSongsPlaylist) {
			const songStillInPlaylist = finalLikedSongsPlaylist.songs.find(song => song.toString() === sampleSong._id.toString());
			if (songStillInPlaylist) {
				console.log("❌ Song still in Liked Songs playlist after unfavoriting");
			} else {
				console.log("✅ Song properly removed from Liked Songs playlist!");
			}
		}

		// Final state check
		const finalFavorites = await Favorite.find({ 
			userId: testUserId, 
			type: 'song' 
		});

		console.log(`\n📊 Final State:`);
		console.log(`- Liked Songs Playlist: ${finalLikedSongsPlaylist ? finalLikedSongsPlaylist.songCount : 0} songs`);
		console.log(`- User Favorites: ${finalFavorites.length} songs`);

		console.log(`\n🎉 Favorite API test completed!`);

		process.exit(0);
	} catch (error) {
		console.error("Error testing favorite API:", error);
		process.exit(1);
	}
};

testFavoriteAPI();
