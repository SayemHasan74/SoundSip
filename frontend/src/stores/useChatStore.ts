import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

interface ChatStore {
	users: User[];
	isLoading: boolean;
	error: string | null;
	socket: any;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;

	fetchUsers: () => Promise<void>;
	initSocket: (userId: string) => Promise<void>;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string, imageFile?: File | null, playlistData?: any) => void;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
	deleteAccount: () => Promise<any>;
}

const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const socket = io(baseURL, {
	autoConnect: false, // only connect if user is authenticated
	withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
	users: [],
	isLoading: false,
	error: null,
	socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,

	setSelectedUser: (user) => set({ selectedUser: user }),

	fetchUsers: async () => {
		set({ isLoading: true, error: null });
		try {
			console.log("🔄 Fetching users from backend...");
			const response = await axiosInstance.get("/users");
			console.log("✅ Users fetched successfully:", response.data);
			set({ users: response.data });
		} catch (error: any) {
			console.error("❌ Error fetching users:", error);
			set({ error: error.response?.data?.message || "Failed to fetch users" });
		} finally {
			set({ isLoading: false });
		}
	},

	initSocket: async (userId) => {
		if (!get().isConnected && !socket.connected && !socket.active) {
			console.log("🔌 Initializing socket connection for user:", userId);

			const token = await (window as any).Clerk?.session?.getToken();
			if (!token) {
				console.warn("⚠️ Cannot connect socket without an auth token");
				return;
			}
			
			socket.removeAllListeners();
			socket.auth = { token };
			socket.connect();

			socket.on("connect", () => {
				console.log("✅ Socket connected with ID:", socket.id);
				console.log("📡 Emitting user_connected for:", userId);
				
				// Emit user_connected event to notify backend
				socket.emit("user_connected");
				
				set({ isConnected: true });
			});

			socket.on("users_online", (users: string[]) => {
				console.log("👥 Users online received:", users);
				set({ onlineUsers: new Set(users) });
			});

			socket.on("activities", (activities: [string, string][]) => {
				console.log("📱 Activities received:", activities);
				set({ userActivities: new Map(activities) });
			});

			socket.on("user_connected", (userId: string) => {
				console.log("🟢 User connected event received:", userId);
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				console.log("🔴 User disconnected event received:", userId);
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

			socket.on("receive_message", (message: Message) => {
				console.log("📨 Received message:", message);
				set((state) => {
					const selectedUserId = state.selectedUser?.clerkId;
					const belongsToSelectedConversation =
						selectedUserId &&
						(message.senderId === selectedUserId || message.receiverId === selectedUserId);

					if (!belongsToSelectedConversation) {
						return state;
					}

					if (state.messages.some((existingMessage) => existingMessage._id === message._id)) {
						return state;
					}

					return { messages: [...state.messages, message] };
				});
			});

			socket.on("activity_updated", ({ userId, activity }) => {
				console.log("📱 Activity updated:", userId, activity);
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			socket.on("user_deleted", (userId: string) => {
				console.log("🗑️ User deleted event received:", userId);
				set((state) => {
					// Remove user from online users
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					
					// Remove user from activities
					const newActivities = new Map(state.userActivities);
					newActivities.delete(userId);
					
					// Remove user from users list
					const newUsers = state.users.filter(user => user.clerkId !== userId);
					
					return { 
						onlineUsers: newOnlineUsers, 
						userActivities: newActivities,
						users: newUsers
					};
				});
			});

			socket.on("disconnect", () => {
				console.log("❌ Socket disconnected");
				set({ isConnected: false, onlineUsers: new Set(), userActivities: new Map() });
			});

			socket.on("connect_error", (error) => {
				console.error("❌ Socket connection error:", error);
				set({ isConnected: false });
			});
		} else {
			console.log("🔌 Socket already connected, skipping initialization");
		}
	},

	disconnectSocket: () => {
		if (get().isConnected || socket.connected || socket.active) {
			socket.removeAllListeners();
			socket.disconnect();
			set({ isConnected: false, onlineUsers: new Set(), userActivities: new Map() });
		}
	},

	sendMessage: async (receiverId, senderId, content, imageFile, playlistData?: any) => {
		try {
			console.log("Sending message:", { receiverId, senderId, content, imageFile });
			
			const formData = new FormData();
			formData.append("receiverId", receiverId);
			if (content) {
				formData.append("content", content);
			}
			if (imageFile) {
				formData.append("imageFile", imageFile);
				console.log("Image file added to FormData:", imageFile.name, imageFile.size);
			}
			if (playlistData) {
				formData.append("playlistData", JSON.stringify(playlistData));
				console.log("Playlist data added to FormData:", playlistData);
			}

			// Log FormData contents for debugging
			for (const [key, value] of formData.entries()) {
				console.log(`FormData entry: ${key} =`, value);
			}

			const response = await axiosInstance.post("/messages", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			console.log("Message sent successfully:", response.data);
			const message = response.data;
			
			// Add message to local state immediately for instant feedback
			set((state) => ({
				messages: [...state.messages, message],
			}));
			
			// No need to emit socket event - the backend will handle real-time delivery
			// This prevents duplicate messages and database entries
		} catch (error: any) {
			console.error("Error sending message:", error);
			console.error("Error response:", error.response?.data);
			console.error("Error status:", error.response?.status);
			console.error("Error headers:", error.response?.headers);
			
			let errorMessage = "Failed to send message";
			if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error.message) {
				errorMessage = error.message;
			}
			
			toast.error(errorMessage);
		}
	},

	fetchMessages: async (userId: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/messages/${userId}`);
			set({ messages: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to fetch messages" });
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAccount: async () => {
		try {
			console.log("🗑️ Deleting user account...");
			const response = await axiosInstance.delete("/users");
			console.log("✅ Account deleted successfully:", response.data);
			
			// Disconnect socket after account deletion
			get().disconnectSocket();
			
			return response.data;
		} catch (error: any) {
			console.error("❌ Error deleting account:", error);
			throw error;
		}
	},
}));
