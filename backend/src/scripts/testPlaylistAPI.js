import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
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

const testPlaylistAPI = async () => {
	try {
		await connectDB();

		// Check all playlists in database
		const allPlaylists = await Playlist.find({});
		console.log(`\n📊 All playlists in database: ${allPlaylists.length}`);
		allPlaylists.forEach(playlist => {
			console.log(`- ${playlist.name} (Creator: ${playlist.creatorName}, Creator ID: ${playlist.creator}, Songs: ${playlist.songCount})`);
		});

		// Check if there are any playlists with sample names
		const sampleNames = ['Chill Vibes', 'Workout Mix', 'Study Focus', 'Party Hits', 'Road Trip'];
		const samplePlaylists = await Playlist.find({
			name: { $in: sampleNames }
		});
		
		console.log(`\n🔍 Sample playlists found: ${samplePlaylists.length}`);
		samplePlaylists.forEach(playlist => {
			console.log(`- ${playlist.name} (ID: ${playlist._id})`);
		});

		// Check playlists by a specific user ID (replace with actual user ID)
		const testUserId = 'user_31kP23D8d1SXVpfiD2YOq76F1h8'; // From the logs
		const userPlaylists = await Playlist.find({ creator: testUserId });
		console.log(`\n👤 Playlists for user ${testUserId}: ${userPlaylists.length}`);
		userPlaylists.forEach(playlist => {
			console.log(`- ${playlist.name} (Songs: ${playlist.songCount})`);
		});

		process.exit(0);
	} catch (error) {
		console.error("Error testing playlist API:", error);
		process.exit(1);
	}
};

testPlaylistAPI();
