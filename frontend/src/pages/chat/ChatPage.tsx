
import { useChatStore } from "@/stores/useChatStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import MessageReactions from "./components/MessageReactions";
import MessageStatus from "./components/MessageStatus";
import TypingIndicator from "./components/TypingIndicator";
import MessageContextMenu from "./components/MessageContextMenu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
	ChevronDown, 
	Image as ImageIcon, 
	Music, 
	Play, 
	Users,
	Heart,
	Share2,
	MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";



const formatMessageTime = (date: string) => {
	const messageDate = new Date(date);
	return messageDate.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

const ChatPage = () => {
	const { user } = useUser();
	const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();
	const { currentSong } = usePlayerStore();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const [showOnlineUsers, setShowOnlineUsers] = useState(false);
	const [messageReactions, setMessageReactions] = useState<{[key: string]: any[]}>({});
	const [typingUsers, setTypingUsers] = useState<Array<{id: string, name: string, avatar?: string}>>([]);
	const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
	const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(null);

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser.clerkId);
	}, [selectedUser, fetchMessages]);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	// Handle scroll events to show/hide scroll button
	useEffect(() => {
		const handleScroll = () => {
			if (scrollAreaRef.current) {
				const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
				const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
				setShowScrollButton(!isNearBottom);
			}
		};

		const scrollElement = scrollAreaRef.current;
		if (scrollElement) {
			scrollElement.addEventListener('scroll', handleScroll);
			return () => scrollElement.removeEventListener('scroll', handleScroll);
		}
	}, []);

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	};

	// Group messages by date for better organization
	const groupMessagesByDate = (messages: any[]) => {
		const groups: { [key: string]: any[] } = {};
		
		messages.forEach(message => {
			const date = new Date(message.createdAt).toDateString();
			if (!groups[date]) {
				groups[date] = [];
			}
			groups[date].push(message);
		});
		
		return groups;
	};

	const messageGroups = groupMessagesByDate(messages);

	// Handle message reactions
	const handleReactionAdd = (messageId: string, emoji: string) => {
		setMessageReactions(prev => {
			const current = prev[messageId] || [];
			const existingReaction = current.find(r => r.emoji === emoji);
			
			if (existingReaction) {
				if (!existingReaction.hasReacted) {
					existingReaction.count++;
					existingReaction.hasReacted = true;
					existingReaction.users.push(user?.firstName || "You");
				}
			} else {
				current.push({
					emoji,
					count: 1,
					users: [user?.firstName || "You"],
					hasReacted: true
				});
			}
			
			return { ...prev, [messageId]: [...current] };
		});
	};

	const handleReactionRemove = (messageId: string, emoji: string) => {
		setMessageReactions(prev => {
			const current = prev[messageId] || [];
			const reactionIndex = current.findIndex(r => r.emoji === emoji);
			
			if (reactionIndex !== -1) {
				const reaction = current[reactionIndex];
				if (reaction.hasReacted) {
					reaction.count--;
					reaction.hasReacted = false;
					reaction.users = reaction.users.filter((u: string) => u !== (user?.firstName || "You"));
					
					if (reaction.count === 0) {
						current.splice(reactionIndex, 1);
					}
				}
			}
			
			return { ...prev, [messageId]: [...current] };
		});
	};

	// Mock typing indicator (in real app, this would come from websocket)
	useEffect(() => {
		if (selectedUser) {
			// Simulate typing users occasionally
			const interval = setInterval(() => {
				if (Math.random() < 0.1) { // 10% chance
					setTypingUsers([{
						id: selectedUser.clerkId,
						name: selectedUser.fullName,
						avatar: selectedUser.imageUrl
					}]);
					
					setTimeout(() => setTypingUsers([]), 3000);
				}
			}, 5000);
			
			return () => clearInterval(interval);
		}
	}, [selectedUser]);

	// Message actions
	const handleMessageReply = (messageId: string) => {
		setReplyingToMessageId(messageId);
	};

	const handleMessageEdit = (messageId: string) => {
		setEditingMessageId(messageId);
	};

	const handleMessageDelete = (messageId: string) => {
		// In real app, this would make API call to delete message
		console.log('Delete message:', messageId);
	};

	const handleMessageCopy = (messageId: string) => {
		const message = messages.find(m => m._id === messageId);
		if (message?.content) {
			navigator.clipboard.writeText(message.content);
		}
	};

	const handleMessagePin = (messageId: string) => {
		// In real app, this would pin the message
		console.log('Pin message:', messageId);
	};

	const handleMessageForward = (messageId: string) => {
		// In real app, this would open forward dialog
		console.log('Forward message:', messageId);
	};

	const handleMessageShare = (messageId: string) => {
		// In real app, this would open share dialog
		console.log('Share message:', messageId);
	};



	return (
		<div className="min-h-screen bg-black text-zinc-200">
			<div className="flex h-screen relative">
				{/* Left sidebar - Users List */}
				<div
					className={cn(
						"relative border-r border-white/10 bg-zinc-900/50 h-full w-full max-w-xs flex-col"
					)}
				>
					<UsersList
						showOnlineUsers={showOnlineUsers}
						setShowOnlineUsers={setShowOnlineUsers}
					/>
				</div>

				{/* Main chat area */}
				<div className={cn("relative flex flex-col flex-1 min-w-0 h-full")}>
					{selectedUser ? (
						<>
							{/* Chat Header */}
							<div className="flex-shrink-0 border-b border-white/10 bg-black/20 backdrop-blur-sm">
								<ChatHeader />
							</div>

							{/* Messages Area */}
							<div className="flex-1 relative overflow-hidden">
								<ScrollArea
									ref={scrollAreaRef}
									className="h-full px-3 py-4 sm:px-4 sm:py-6 md:px-6"
								>
									<div className="space-y-6">
										{Object.entries(messageGroups).map(
											([date, dateMessages]) => (
												<div key={date} className="space-y-4">
													{/* Date separator */}
													<div className="flex justify-center">
														<Badge
															variant="secondary"
															className="bg-zinc-800/80 text-zinc-300 border-zinc-600"
														>
															{new Date(date).toDateString() ===
															new Date().toDateString()
																? "Today"
																: new Date(date).toLocaleDateString(
																		"en-US",
																		{
																			weekday: "long",
																			month: "long",
																			day: "numeric",
																		}
																  )}
														</Badge>
													</div>

													{/* Messages */}
													<div className="space-y-2 sm:space-y-3">
														{dateMessages.map((message, index) => {
															const isOwnMessage =
																message.senderId === user?.id;
															const showAvatar =
																index === 0 ||
																dateMessages[index - 1]
																	?.senderId !== message.senderId;

															return (
																<div
																	key={message._id}
																	className={cn(
																		"flex items-end gap-2 sm:gap-3 group",
																		isOwnMessage
																			? "flex-row-reverse"
																			: ""
																	)}
																>
																	{/* Avatar */}
																	{showAvatar && (
																		<Avatar className="size-8 sm:size-10 flex-shrink-0">
																			<AvatarImage
																				src={
																					isOwnMessage
																						? user?.imageUrl ||
																						  ""
																						: selectedUser.imageUrl
																				}
																			/>
																			<AvatarFallback className="bg-zinc-700 text-zinc-300 text-xs sm:text-sm">
																				{isOwnMessage
																					? user?.firstName?.charAt(
																							0
																					  ) || "U"
																					: selectedUser.fullName?.charAt(
																							0
																					  ) || "U"}
																			</AvatarFallback>
																		</Avatar>
																	)}

																	{/* Message Bubble */}
																	<div
																		className={cn(
																			"relative group flex-1",
																			"max-w-[90%] xs:max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[60%]",
																			!showAvatar &&
																				(isOwnMessage
																					? "mr-10 sm:mr-13"
																					: "ml-10 sm:ml-13")
																		)}
																	>
																		{/* Message Content */}
																		<div
																			className={cn(
																				"rounded-2xl shadow-lg transition-all duration-200",
																				"px-3 py-2 sm:px-4 sm:py-3",
																				isOwnMessage
																					? "bg-green-600/90 text-white rounded-br-md"
																					: "bg-zinc-800/80 text-zinc-100 rounded-bl-md"
																			)}
																		>
																			{/* Text */}
																			{message.content && (
																				<p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
																					{message.content}
																				</p>
																			)}

																			{/* Image */}
																			{message.imageUrl && (
																				<div className="mt-2 sm:mt-3">
																					<img
																						src={
																							message.imageUrl
																						}
																						alt="Message image"
																						className="max-w-full max-h-48 sm:max-h-64 md:max-h-80 rounded-lg object-cover shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
																						onClick={() =>
																							window.open(
																								message.imageUrl,
																								"_blank"
																							)
																						}
																					/>
																				</div>
																			)}

																			{/* Playlist */}
																			{message.playlistData && (
																				<div className="mt-2 sm:mt-3 bg-zinc-900/50 rounded-lg p-2 sm:p-3 border border-white/10">
																					<div className="flex items-center gap-2 sm:gap-3">
																						<img
																							src={
																								message
																									.playlistData
																									.playlistImage
																							}
																							alt={
																								message
																									.playlistData
																									.playlistName
																							}
																							className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover flex-shrink-0"
																						/>
																						<div className="flex-1 min-w-0">
																							<h4 className="font-medium text-xs sm:text-sm truncate">
																								{
																									message
																										.playlistData
																										.playlistName
																								}
																							</h4>
																							<p className="text-xs text-zinc-400 flex items-center gap-1 sm:gap-2">
																								<Music className="w-3 h-3 flex-shrink-0" />
																								<span className="truncate">
																									{
																										message
																											.playlistData
																											.songCount
																									}{" "}
																									songs
																								</span>
																							</p>
																						</div>
																						<Button
																							size="sm"
																							className="bg-green-600 hover:bg-green-700 h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
																						>
																							<Play className="w-3 h-3 sm:w-4 sm:h-4" />
																						</Button>
																					</div>
																				</div>
																			)}

																			{/* Time & Status */}
																			<div
																				className={cn(
																					"flex items-center justify-between gap-1 sm:gap-2 mt-1 sm:mt-2",
																					isOwnMessage
																						? "text-green-100"
																						: "text-zinc-400"
																				)}
																			>
																				<span className="text-xs">
																					{formatMessageTime(
																						message.createdAt
																					)}
																				</span>
																				{isOwnMessage && (
																					<MessageStatus
																						status="read"
																						compact={true}
																					/>
																				)}
																			</div>

																			{/* Reactions */}
																			<MessageReactions
																				messageId={
																					message._id
																				}
																				reactions={
																					messageReactions[
																						message._id
																					] || []
																				}
																				onReactionAdd={
																					handleReactionAdd
																				}
																				onReactionRemove={
																					handleReactionRemove
																				}
																				compact={true}
																			/>
																		</div>

																		{/* Message Actions */}
																		<div
																			className={cn(
																				"absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
																				"hidden sm:block",
																				isOwnMessage
																					? "-left-10 sm:-left-12"
																					: "-right-10 sm:-right-12"
																			)}
																		>
																			<div className="flex items-center gap-0.5 sm:gap-1">
																				<Button
																					size="sm"
																					variant="ghost"
																					className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-zinc-600/50"
																					onClick={() =>
																						handleReactionAdd(
																							message._id,
																							"👍"
																						)
																					}
																				>
																					<Heart className="w-3 h-3 sm:w-4 sm:h-4" />
																				</Button>
																				<Button
																					size="sm"
																					variant="ghost"
																					className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-zinc-600/50"
																					onClick={() =>
																						handleMessageShare(
																							message._id
																						)
																					}
																				>
																					<Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
																				</Button>
																				<MessageContextMenu
																					messageId={
																						message._id
																					}
																					isOwnMessage={
																						isOwnMessage
																					}
																					onReply={
																						handleMessageReply
																					}
																					onEdit={
																						handleMessageEdit
																					}
																					onDelete={
																						handleMessageDelete
																					}
																					onCopy={
																						handleMessageCopy
																					}
																					onPin={
																						handleMessagePin
																					}
																					onForward={
																						handleMessageForward
																					}
																					onReact={() =>
																						handleReactionAdd(
																							message._id,
																							"👍"
																						)
																					}
																					onShare={
																						handleMessageShare
																					}
																					compact={true}
																				/>
																			</div>
																		</div>
																	</div>
																</div>
															);
														})}
													</div>
												</div>
											)
										)}

										{/* Typing Indicator */}
										{typingUsers.length > 0 && (
											<TypingIndicator users={typingUsers} />
										)}

										<div ref={messagesEndRef} />
									</div>
								</ScrollArea>

								{/* Scroll to bottom button */}
								{showScrollButton && (
									<Button
										onClick={scrollToBottom}
										size="sm"
										className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-zinc-800/90 hover:bg-zinc-700/90 text-white rounded-full p-2 shadow-lg backdrop-blur-sm border border-zinc-600/50 transition-all duration-200 z-10"
									>
										<ChevronDown className="w-4 h-4" />
									</Button>
								)}
							</div>

							{/* Message Input */}
							<div className="flex-shrink-0 border-t border-white/10 bg-black/20 backdrop-blur-sm">
								<MessageInput
									replyingToMessageId={replyingToMessageId}
									onCancelReply={() => setReplyingToMessageId(null)}
								/>
							</div>
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatPage;

const NoConversationPlaceholder = () => (
	<div className="flex flex-col items-center justify-center h-full space-y-6 bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm">
		<div className="relative">
			<div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-full flex items-center justify-center animate-pulse">
				<MessageCircle className="w-10 h-10 text-white" />
			</div>
			<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-zinc-700 rounded-full border-2 border-zinc-900 flex items-center justify-center">
				<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
			</div>
		</div>
		<div className="text-center space-y-2">
			<h3 className="text-zinc-300 text-xl font-semibold">No conversation selected</h3>
			<p className="text-zinc-500 text-sm max-w-md">
				Choose a friend from the list to start sharing music and chatting
			</p>
		</div>
		<div className="flex items-center gap-4 text-zinc-600">
			<div className="flex items-center gap-2">
				<ImageIcon className="w-4 h-4" />
				<span className="text-xs">Share images</span>
			</div>
			<div className="flex items-center gap-2">
				<Music className="w-4 h-4" />
				<span className="text-xs">Share playlists</span>
			</div>
			<div className="flex items-center gap-2">
				<Users className="w-4 h-4" />
				<span className="text-xs">Real-time chat</span>
			</div>
		</div>
	</div>
);
