import { Message } from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

// Helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
	try {
		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto",
		});
		return result.secure_url;
	} catch (error) {
		console.log("Error in uploadToCloudinary", error);
		throw new Error("Error uploading to cloudinary");
	}
};

export const sendMessage = async (req, res, next) => {
	try {
		console.log("Request body:", req.body);
		console.log("Request files:", req.files);
		
		const { receiverId, content, playlistData } = req.body;
		const senderId = req.auth.userId;

		if (!receiverId) {
			return res.status(400).json({ message: "Receiver ID is required" });
		}

		if (!content && !req.files?.imageFile && !playlistData) {
			return res.status(400).json({ message: "Message content, image, or playlist data is required" });
		}

		let messageData = {
			senderId,
			receiverId,
			content: content || "", // Allow empty content for image-only or playlist-only messages
			messageType: "text"
		};

		// Handle playlist data if present
		if (playlistData) {
			try {
				const parsedPlaylistData = JSON.parse(playlistData);
				messageData.playlistData = parsedPlaylistData;
				messageData.messageType = content ? "mixed" : "playlist";
				console.log("Playlist data added to message:", parsedPlaylistData);
			} catch (parseError) {
				console.log("Error parsing playlist data:", parseError);
				return res.status(400).json({ message: "Invalid playlist data format" });
			}
		}

		// Handle image upload if present
		if (req.files?.imageFile) {
			try {
				console.log("Processing image file:", req.files.imageFile);
				const imageUrl = await uploadToCloudinary(req.files.imageFile);
				console.log("Image uploaded successfully:", imageUrl);
				messageData.imageUrl = imageUrl;
				messageData.messageType = content ? "mixed" : "image";
			} catch (uploadError) {
				console.log("Error uploading image:", uploadError);
				return res.status(500).json({ message: "Failed to upload image: " + uploadError.message });
			}
		}

		console.log("Creating message with data:", messageData);
		const message = new Message(messageData);
		await message.save();

		console.log("Message saved successfully:", message);

		// Emit real-time event for the receiver if they're online
		// We'll need to access the socket from the request context
		if (req.io && req.userSockets) {
			const receiverSocketId = req.userSockets.get(receiverId);
			if (receiverSocketId) {
				console.log("📤 Sending real-time message to receiver:", receiverId);
				req.io.to(receiverSocketId).emit("receive_message", message);
			} else {
				console.log("📤 Receiver offline, message stored:", receiverId);
			}
		}

		res.status(201).json(message);
	} catch (error) {
		console.log("Error in sendMessage:", error);
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const { userId } = req.params;
		const currentUserId = req.auth.userId;

		const messages = await Message.find({
			$or: [
				{ senderId: currentUserId, receiverId: userId },
				{ senderId: userId, receiverId: currentUserId }
			]
		}).sort({ createdAt: 1 });

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages", error);
		next(error);
	}
};

export const deleteMessage = async (req, res, next) => {
	try {
		const { messageId } = req.params;
		const currentUserId = req.auth.userId;

		const message = await Message.findById(messageId);
		
		if (!message) {
			return res.status(404).json({ message: "Message not found" });
		}

		if (message.senderId !== currentUserId) {
			return res.status(403).json({ message: "You can only delete your own messages" });
		}

		await Message.findByIdAndDelete(messageId);
		res.status(200).json({ message: "Message deleted successfully" });
	} catch (error) {
		console.log("Error in deleteMessage", error);
		next(error);
	}
};
