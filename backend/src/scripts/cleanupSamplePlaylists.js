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

const cleanupSamplePlaylists = async () => {
	try {
		await connectDB();

		// Find and remove sample playlists (those with mock names)
		const samplePlaylistNames = [
			'Chill Vibes',
			'Workout Mix', 
			'Study Focus',
			'Party Hits',
			'Road Trip',
			'Music Lover',
			'Fitness Guru',
			'Student Life',
			'Party Master',
			'Traveler'
		];

		const samplePlaylists = await Playlist.find({
			name: { $in: samplePlaylistNames }
		});

		console.log(`Found ${samplePlaylists.length} sample playlists to remove:`);
		samplePlaylists.forEach(playlist => {
			console.log(`- ${playlist.name} (ID: ${playlist._id})`);
		});

		if (samplePlaylists.length > 0) {
			const result = await Playlist.deleteMany({
				name: { $in: samplePlaylistNames }
			});
			console.log(`✅ Removed ${result.deletedCount} sample playlists`);
		} else {
			console.log("✅ No sample playlists found");
		}

		// Also remove any playlists with mock creator names
		const mockCreatorNames = [
			'Music Lover',
			'Fitness Guru', 
			'Student Life',
			'Party Master',
			'Traveler'
		];

		const mockCreatorPlaylists = await Playlist.find({
			creatorName: { $in: mockCreatorNames }
		});

		console.log(`Found ${mockCreatorPlaylists.length} playlists with mock creator names to remove:`);
		mockCreatorPlaylists.forEach(playlist => {
			console.log(`- ${playlist.name} (Creator: ${playlist.creatorName})`);
		});

		if (mockCreatorPlaylists.length > 0) {
			const result = await Playlist.deleteMany({
				creatorName: { $in: mockCreatorNames }
			});
			console.log(`✅ Removed ${result.deletedCount} playlists with mock creator names`);
		} else {
			console.log("✅ No playlists with mock creator names found");
		}

		// Show remaining playlists
		const remainingPlaylists = await Playlist.find({});
		console.log(`\n📊 Remaining playlists in database: ${remainingPlaylists.length}`);
		remainingPlaylists.forEach(playlist => {
			console.log(`- ${playlist.name} (Creator: ${playlist.creatorName}, Songs: ${playlist.songCount})`);
		});

		process.exit(0);
	} catch (error) {
		console.error("Error cleaning up sample playlists:", error);
		process.exit(1);
	}
};

cleanupSamplePlaylists();
