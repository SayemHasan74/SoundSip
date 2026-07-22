import { create } from "zustand";
import { Message } from "@/types";

export interface FriendRequestNotification {
	_id: string;
	senderId: string;
	receiverId: string;
	message?: string;
	createdAt: string;
	sender?: {
		clerkId: string;
		fullName: string;
		imageUrl: string;
		handle?: string;
		isArtist?: boolean;
		artistName?: string;
		isVerified?: boolean;
	};
}

interface NotificationStore {
	unreadMessagesByUser: Record<string, number>;
	unreadFriendRequests: number;
	lastMessage?: Message;
	lastFriendRequest?: FriendRequestNotification;
	incrementMessage: (message: Message) => void;
	clearMessagesForUser: (userId: string) => void;
	setFriendRequestCount: (count: number) => void;
	incrementFriendRequests: (request: FriendRequestNotification) => void;
	clearFriendRequests: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
	unreadMessagesByUser: {},
	unreadFriendRequests: 0,
	lastMessage: undefined,
	lastFriendRequest: undefined,

	incrementMessage: (message) =>
		set((state) => ({
			lastMessage: message,
			unreadMessagesByUser: {
				...state.unreadMessagesByUser,
				[message.senderId]: (state.unreadMessagesByUser[message.senderId] || 0) + 1,
			},
		})),

	clearMessagesForUser: (userId) =>
		set((state) => {
			const next = { ...state.unreadMessagesByUser };
			delete next[userId];
			return { unreadMessagesByUser: next };
		}),

	setFriendRequestCount: (count) => set({ unreadFriendRequests: count }),

	incrementFriendRequests: (request) =>
		set((state) => ({
			lastFriendRequest: request,
			unreadFriendRequests: state.unreadFriendRequests + 1,
		})),

	clearFriendRequests: () => set({ unreadFriendRequests: 0 }),
}));
