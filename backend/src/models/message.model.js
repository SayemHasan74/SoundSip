import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: { type: String, required: true }, // Clerk user ID
		receiverId: { type: String, required: true }, // Clerk user ID
		content: { type: String, required: false }, // Made optional to allow image-only messages
		imageUrl: { type: String }, // Optional image URL
		messageType: { 
			type: String, 
			enum: ['text', 'image', 'mixed', 'playlist'], 
			default: 'text' 
		}, // Type of message
		playlistData: {
			playlistId: { type: String },
			playlistName: { type: String },
			playlistImage: { type: String },
			songCount: { type: Number },
			description: { type: String }
		}
	},
	{ timestamps: true }
);

// Custom validator: either content, imageUrl, or playlistData must be present
messageSchema.pre('validate', function(next) {
	if (!this.content && !this.imageUrl && !this.playlistData) {
		this.invalidate('content', 'Either message content, image, or playlist data is required');
	}
	next();
});

export const Message = mongoose.model("Message", messageSchema);
