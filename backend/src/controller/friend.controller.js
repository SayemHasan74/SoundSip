import { User } from "../models/user.model.js";
import { FriendRequest } from "../models/friendRequest.model.js";
import { Friendship } from "../models/friendship.model.js";
import { Follow } from "../models/follow.model.js";

// Send friend request
export const sendFriendRequest = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const { receiverId } = req.params;
		const { message } = req.body;

		// Check if receiver exists
		const receiver = await User.findOne({ clerkId: receiverId });
		if (!receiver) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if trying to send request to self
		if (currentUserId === receiverId) {
			return res.status(400).json({ message: "Cannot send friend request to yourself" });
		}

		// Check if already friends
		const existingFriendship = await Friendship.findOne({
			$or: [
				{ user1Id: currentUserId, user2Id: receiverId },
				{ user1Id: receiverId, user2Id: currentUserId }
			]
		});

		if (existingFriendship) {
			return res.status(400).json({ message: "Already friends" });
		}

		// Check if friend request already exists
		const existingRequest = await FriendRequest.findOne({
			senderId: currentUserId,
			receiverId: receiverId
		});

		if (existingRequest) {
			return res.status(400).json({ message: "Friend request already sent" });
		}

		// Create friend request
		const friendRequest = new FriendRequest({
			senderId: currentUserId,
			receiverId: receiverId,
			message: message || ""
		});

		await friendRequest.save();

		res.status(201).json({
			message: "Friend request sent successfully",
			friendRequest
		});
	} catch (error) {
		next(error);
	}
};

// Accept friend request
export const acceptFriendRequest = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const { requestId } = req.params;

		// Find the friend request
		const friendRequest = await FriendRequest.findById(requestId);
		if (!friendRequest) {
			return res.status(404).json({ message: "Friend request not found" });
		}

		// Check if current user is the receiver
		if (friendRequest.receiverId !== currentUserId) {
			return res.status(403).json({ message: "Not authorized to accept this request" });
		}

		// Check if request is pending
		if (friendRequest.status !== 'pending') {
			return res.status(400).json({ message: "Friend request is not pending" });
		}

		// Update request status
		friendRequest.status = 'accepted';
		await friendRequest.save();

		// Create friendship (store smaller clerkId first)
		const user1Id = friendRequest.senderId < friendRequest.receiverId 
			? friendRequest.senderId 
			: friendRequest.receiverId;
		const user2Id = friendRequest.senderId < friendRequest.receiverId 
			? friendRequest.receiverId 
			: friendRequest.senderId;

		const friendship = new Friendship({
			user1Id,
			user2Id
		});
		await friendship.save();

		// Update friend counts for both users
		await User.updateMany(
			{ clerkId: { $in: [friendRequest.senderId, friendRequest.receiverId] } },
			{ $inc: { friendCount: 1 } }
		);

		res.status(200).json({
			message: "Friend request accepted",
			friendship
		});
	} catch (error) {
		next(error);
	}
};

// Reject friend request
export const rejectFriendRequest = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const { requestId } = req.params;

		// Find the friend request
		const friendRequest = await FriendRequest.findById(requestId);
		if (!friendRequest) {
			return res.status(404).json({ message: "Friend request not found" });
		}

		// Check if current user is the receiver
		if (friendRequest.receiverId !== currentUserId) {
			return res.status(403).json({ message: "Not authorized to reject this request" });
		}

		// Update request status
		friendRequest.status = 'rejected';
		await friendRequest.save();

		res.status(200).json({
			message: "Friend request rejected"
		});
	} catch (error) {
		next(error);
	}
};

// Cancel friend request
export const cancelFriendRequest = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const { requestId } = req.params;

		// Find the friend request
		const friendRequest = await FriendRequest.findById(requestId);
		if (!friendRequest) {
			return res.status(404).json({ message: "Friend request not found" });
		}

		// Check if current user is the sender
		if (friendRequest.senderId !== currentUserId) {
			return res.status(403).json({ message: "Not authorized to cancel this request" });
		}

		// Delete the request
		await FriendRequest.findByIdAndDelete(requestId);

		res.status(200).json({
			message: "Friend request cancelled"
		});
	} catch (error) {
		next(error);
	}
};

// Remove friend
export const removeFriend = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const { friendId } = req.params;

		// Find the friendship
		const friendship = await Friendship.findOne({
			$or: [
				{ user1Id: currentUserId, user2Id: friendId },
				{ user1Id: friendId, user2Id: currentUserId }
			]
		});

		if (!friendship) {
			return res.status(404).json({ message: "Friendship not found" });
		}

		// Delete the friendship
		await Friendship.findByIdAndDelete(friendship._id);

		// Update friend counts for both users
		await User.updateMany(
			{ clerkId: { $in: [currentUserId, friendId] } },
			{ $inc: { friendCount: -1 } }
		);

		res.status(200).json({
			message: "Friend removed"
		});
	} catch (error) {
		next(error);
	}
};

// Get friend requests (received)
export const getFriendRequests = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;

		const friendRequests = await FriendRequest.find({
			receiverId: currentUserId,
			status: 'pending'
		}).populate('senderId', 'clerkId fullName imageUrl handle isArtist artistName');

		res.status(200).json({
			friendRequests
		});
	} catch (error) {
		next(error);
	}
};

// Get sent friend requests
export const getSentFriendRequests = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;

		const sentRequests = await FriendRequest.find({
			senderId: currentUserId,
			status: 'pending'
		}).populate('receiverId', 'clerkId fullName imageUrl handle isArtist artistName');

		res.status(200).json({
			sentRequests
		});
	} catch (error) {
		next(error);
	}
};

// Get friends list
export const getFriendsList = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;

		// Find all friendships where current user is involved
		const friendships = await Friendship.find({
			$or: [
				{ user1Id: currentUserId },
				{ user2Id: currentUserId }
			]
		});

		// Get the other user's ID from each friendship
		const friendIds = friendships.map(friendship => 
			friendship.user1Id === currentUserId ? friendship.user2Id : friendship.user1Id
		);

		// Get friend details
		const friends = await User.find({
			clerkId: { $in: friendIds }
		}).select('clerkId fullName imageUrl handle isArtist artistName isVerified');

		res.status(200).json({
			friends
		});
	} catch (error) {
		next(error);
	}
};

// Check friendship status
export const checkFriendshipStatus = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		const { userId } = req.params;

		// Check if they are friends
		const friendship = await Friendship.findOne({
			$or: [
				{ user1Id: currentUserId, user2Id: userId },
				{ user1Id: userId, user2Id: currentUserId }
			]
		});

		// Check if there's a pending friend request
		const sentRequest = await FriendRequest.findOne({
			senderId: currentUserId,
			receiverId: userId,
			status: 'pending'
		});

		const receivedRequest = await FriendRequest.findOne({
			senderId: userId,
			receiverId: currentUserId,
			status: 'pending'
		});

		let status = 'none';
		if (friendship) {
			status = 'friends';
		} else if (sentRequest) {
			status = 'request_sent';
		} else if (receivedRequest) {
			status = 'request_received';
		}

		res.status(200).json({
			status,
			requestId: sentRequest?._id || receivedRequest?._id
		});
	} catch (error) {
		next(error);
	}
};
