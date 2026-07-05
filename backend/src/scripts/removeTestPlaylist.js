import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("✅ Connected to MongoDB");
	} catch (error) {
		console.error("❌ MongoDB connection error:", error);
		process.exit(1);
	}
};

const removeTestPlaylist = async () => {
	try {
		await connectDB();

		const testPlaylistName = "Test Playlist 1756666111732";

		console.log(`\n🧹 Removing test playlist: "${testPlaylistName}"`);

		// Find the test playlist
		const testPlaylist = await Playlist.findOne({ name: testPlaylistName });

		if (testPlaylist) {
			console.log(`✅ Found test playlist: ${testPlaylist.name} (ID: ${testPlaylist._id})`);
			console.log(`📊 Playlist has ${testPlaylist.songCount} songs`);

			// Delete the playlist
			await Playlist.findByIdAndDelete(testPlaylist._id);
			console.log(`✅ Successfully removed test playlist: "${testPlaylistName}"`);
		} else {
			console.log(`ℹ️ Test playlist "${testPlaylistName}" not found`);
		}

		// Show remaining playlists
		const remainingPlaylists = await Playlist.find({});
		console.log(`\n📊 Remaining playlists in database: ${remainingPlaylists.length}`);
		
		if (remainingPlaylists.length > 0) {
			console.log("\n📋 Current playlists:");
			remainingPlaylists.forEach((playlist, index) => {
				console.log(`  ${index + 1}. ${playlist.name} (${playlist.songCount} songs)`);
			});
		}

		console.log("\n🎉 Test playlist removal completed!");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error removing test playlist:", error);
		process.exit(1);
	}
};

removeTestPlaylist();
