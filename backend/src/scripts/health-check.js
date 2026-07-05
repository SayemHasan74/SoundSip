import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import models
import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Playlist } from "../models/playlist.model.js";
import { Favorite } from "../models/favorite.model.js";
import { Message } from "../models/message.model.js";
import { ListeningHistory } from "../models/listeningHistory.model.js";
import { Follow } from "../models/follow.model.js";
import { Friendship } from "../models/friendship.model.js";
import { Genre } from "../models/genre.model.js";

const healthCheck = async () => {
	console.log("🔍 Starting SoundSip Backend Health Check...\n");

	try {
		// 1. MongoDB Connection Test
		console.log("1️⃣ Testing MongoDB Connection...");
		const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/soundsip";
		await mongoose.connect(mongoURI);
		console.log("✅ MongoDB connected successfully");
		console.log(`📊 Database: ${mongoose.connection.name}`);
		console.log(`🌐 Host: ${mongoose.connection.host}\n`);

		// 2. Cloudinary Connection Test
		console.log("2️⃣ Testing Cloudinary Connection...");
		if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
			cloudinary.config({
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET,
			});
			
			// Test cloudinary connection
			const result = await cloudinary.api.ping();
			console.log("✅ Cloudinary connected successfully");
			console.log(`☁️  Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
		} else {
			console.log("⚠️  Cloudinary credentials not found in environment variables");
		}
		console.log("");

		// 3. Model Connection Tests
		console.log("3️⃣ Testing Database Models...");
		
		const models = [
			{ name: "User", model: User },
			{ name: "Song", model: Song },
			{ name: "Album", model: Album },
			{ name: "Playlist", model: Playlist },
			{ name: "Favorite", model: Favorite },
			{ name: "Message", model: Message },
			{ name: "ListeningHistory", model: ListeningHistory },
			{ name: "Follow", model: Follow },
			{ name: "Friendship", model: Friendship },
			{ name: "Genre", model: Genre }
		];

		for (const { name, model } of models) {
			try {
				const count = await model.countDocuments();
				console.log(`✅ ${name} model: ${count} documents`);
			} catch (error) {
				console.log(`❌ ${name} model: Error - ${error.message}`);
			}
		}
		console.log("");

		// 4. Database Statistics
		console.log("4️⃣ Database Statistics...");
		const stats = await Promise.all([
			User.countDocuments(),
			Song.countDocuments(),
			Album.countDocuments(),
			Playlist.countDocuments(),
			Favorite.countDocuments(),
			Message.countDocuments(),
			ListeningHistory.countDocuments(),
			Follow.countDocuments(),
			Friendship.countDocuments(),
			Genre.countDocuments()
		]);

		const totalDocuments = stats.reduce((sum, count) => sum + count, 0);
		console.log(`📈 Total documents: ${totalDocuments.toLocaleString()}`);
		console.log(`👥 Users: ${stats[0].toLocaleString()}`);
		console.log(`🎵 Songs: ${stats[1].toLocaleString()}`);
		console.log(`💿 Albums: ${stats[2].toLocaleString()}`);
		console.log(`📋 Playlists: ${stats[3].toLocaleString()}`);
		console.log(`❤️  Favorites: ${stats[4].toLocaleString()}`);
		console.log(`💬 Messages: ${stats[5].toLocaleString()}`);
		console.log(`📊 Listening History: ${stats[6].toLocaleString()}`);
		console.log(`👥 Follows: ${stats[7].toLocaleString()}`);
		console.log(`🤝 Friendships: ${stats[8].toLocaleString()}`);
		console.log(`🎼 Genres: ${stats[9].toLocaleString()}\n`);

		// 5. Environment Variables Check
		console.log("5️⃣ Environment Variables Check...");
		const requiredEnvVars = [
			"MONGODB_URI",
			"CLOUDINARY_CLOUD_NAME",
			"CLOUDINARY_API_KEY",
			"CLOUDINARY_API_SECRET",
			"CLERK_PUBLISHABLE_KEY",
			"CLERK_SECRET_KEY"
		];

		const missingVars = [];
		for (const varName of requiredEnvVars) {
			if (process.env[varName]) {
				console.log(`✅ ${varName}: Set`);
			} else {
				console.log(`❌ ${varName}: Missing`);
				missingVars.push(varName);
			}
		}

		if (missingVars.length > 0) {
			console.log(`\n⚠️  Missing environment variables: ${missingVars.join(", ")}`);
		}
		console.log("");

		// 6. Index Check
		console.log("6️⃣ Database Indexes Check...");
		const collections = await mongoose.connection.db.listCollections().toArray();
		console.log(`📚 Collections found: ${collections.length}`);
		collections.forEach(collection => {
			console.log(`   - ${collection.name}`);
		});
		console.log("");

		// 7. Connection Health Summary
		console.log("7️⃣ Health Check Summary...");
		const isHealthy = missingVars.length === 0 && mongoose.connection.readyState === 1;
		
		if (isHealthy) {
			console.log("🎉 All systems are healthy and ready!");
			console.log("✅ MongoDB: Connected");
			console.log("✅ Cloudinary: Configured");
			console.log("✅ Models: All accessible");
			console.log("✅ Environment: All variables set");
		} else {
			console.log("⚠️  Some issues detected:");
			if (missingVars.length > 0) {
				console.log(`   - Missing environment variables: ${missingVars.length}`);
			}
			if (mongoose.connection.readyState !== 1) {
				console.log("   - MongoDB connection issues");
			}
		}

		console.log("\n🔍 Health check completed!");

	} catch (error) {
		console.error("❌ Health check failed:", error);
		console.error("Error details:", error.message);
	} finally {
		// Close connection
		if (mongoose.connection.readyState === 1) {
			await mongoose.connection.close();
			console.log("🔌 MongoDB connection closed");
		}
		process.exit(0);
	}
};

// Run health check
healthCheck();
