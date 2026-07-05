import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import {
	Search,
	Users,
	Circle,
	MoreHorizontal,
	Archive,
	Ban,
	EyeOff,
	Music,
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface UsersListProps {
	showOnlineUsers?: boolean;
	setShowOnlineUsers?: (show: boolean) => void;
}

const UsersList = ({
	showOnlineUsers = false,
	setShowOnlineUsers,
}: UsersListProps) => {
	const { user } = useUser();
	const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } =
		useChatStore();
	const [searchQuery, setSearchQuery] = useState("");

	const filteredUsers = useMemo(() => {
		let filtered = users;

		if (showOnlineUsers) {
			filtered = filtered.filter((user) => onlineUsers.has(user.clerkId));
		}

		if (searchQuery.trim()) {
			filtered = filtered.filter(
				(user) =>
					user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
					user.isArtist?.toString().includes(searchQuery.toLowerCase())
			);
		}

		return filtered;
	}, [users, searchQuery, showOnlineUsers, onlineUsers]);

	const onlineCount = useMemo(() => {
		const currentUserId = user?.id;
		return Array.from(onlineUsers).filter((userId) => userId !== currentUserId)
			.length;
	}, [onlineUsers, user?.id]);

	const handleAction = (action: string, userName: string) => {
		toast.success(`${action} ${userName}`);
	};

	return (
		<div className="h-full flex flex-col bg-zinc-900">
			{/* Header */}
			<div className="flex-shrink-0 p-4 border-b border-white/10">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-bold text-zinc-100">Chats</h2>
					<Badge
						variant="outline"
						className={cn(
							"bg-green-500/10 text-green-400 border-green-500/20 cursor-pointer transition-all hover:bg-green-500/20",
							showOnlineUsers && "bg-green-500/20 border-green-500/40"
						)}
						onClick={() => setShowOnlineUsers?.(!showOnlineUsers)}
					>
						<Circle className="w-2 h-2 mr-2 fill-current" />
						{onlineCount} Online
					</Badge>
				</div>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
					<Input
						placeholder="Search music or friends..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 bg-black/25 border-white/10 text-zinc-100 placeholder:text-zinc-400 focus:border-green-500/50 focus:ring-green-500/20 rounded-md"
					/>
				</div>
			</div>

			{/* Users list / Activity Feed */}
			<div className="flex-1 overflow-y-auto">
				<ScrollArea className="h-full">
					<div className="p-2">
						{isLoading ? (
							<UsersListSkeleton />
						) : filteredUsers.length === 0 ? (
							<div className="text-center py-12">
								<Users className="w-10 h-10 text-zinc-500 mx-auto mb-4" />
								<p className="text-zinc-400 text-sm font-medium">
									{showOnlineUsers
										? searchQuery
											? "No one found"
											: "No friends are online"
										: searchQuery
										? "No users found"
										: "Your chats will appear here"}
								</p>
								<p className="text-xs text-zinc-500 mt-1">
									Try searching for a friend to start a conversation.
								</p>
							</div>
						) : (
							<div className="space-y-1">
								{filteredUsers.map((userItem) => {
									const isOnline = onlineUsers.has(userItem.clerkId);
									const isSelected =
										selectedUser?.clerkId === userItem.clerkId;
									// Mocked listening data
									const listeningData = isOnline
										? {
												song: "Stairway to Heaven",
												artist: "Led Zeppelin",
												albumArt: "/cover-images/1.jpg",
										  }
										: null;

									return (
										<div
											key={userItem._id}
											onClick={() => setSelectedUser(userItem)}
											className={cn(
												"flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 group",
												isSelected
													? "bg-green-500/15"
													: "hover:bg-white/10"
											)}
										>
											{/* Avatar & Album Art */}
											<div className="relative flex-shrink-0">
												<Avatar className="size-12 border-2 border-black/20">
													<AvatarImage src={userItem.imageUrl} />
													<AvatarFallback className="bg-zinc-700 text-zinc-300">
														{userItem.fullName[0]}
													</AvatarFallback>
												</Avatar>
												{listeningData ? (
													<img
														src={listeningData.albumArt}
														alt="album art"
														className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full ring-2 ring-zinc-800"
													/>
												) : (
													<div
														className={cn(
															"absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-zinc-900",
															isOnline ? "bg-green-500" : "bg-zinc-500"
														)}
													/>
												)}
											</div>

											{/* User & Activity Info */}
											<div className="flex-1 min-w-0">
												<div className="flex items-center justify-between">
													<h3
														className={cn(
															"font-semibold text-sm truncate",
															isSelected
																? "text-green-300"
																: "text-zinc-200"
														)}
													>
														{userItem.fullName}
													</h3>
													<span className="text-xs text-zinc-400 flex-shrink-0">
														12:45 PM
													</span>
												</div>
												<div className="flex items-center gap-2 mt-1">
													{listeningData ? (
														<>
															<Music className="w-3 h-3 text-green-400 flex-shrink-0" />
															<p className="text-xs text-zinc-300 truncate">
																<span className="font-medium">
																	{listeningData.song}
																</span>{" "}
																- {listeningData.artist}
															</p>
														</>
													) : (
														<p className="text-xs text-zinc-400 truncate">
															Last seen recently
														</p>
													)}
												</div>
											</div>

											{/* Action buttons */}
											<div className="opacity-0 group-hover:opacity-100 transition-opacity">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															size="sm"
															variant="ghost"
															className="h-8 w-8 p-0 hover:bg-white/10"
														>
															<MoreHorizontal className="w-4 h-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="w-48 bg-zinc-800 border-zinc-700"
													>
														<DropdownMenuItem
															className="cursor-pointer"
															onClick={() =>
																handleAction(
																	"Archived chat with",
																	userItem.fullName
																)
															}
														>
															<Archive className="w-4 h-4 mr-2" />{" "}
															Archive
														</DropdownMenuItem>
														<DropdownMenuItem
															className="cursor-pointer"
															onClick={() =>
																handleAction("Muted", userItem.fullName)
															}
														>
															<EyeOff className="w-4 h-4 mr-2" /> Mute
														</DropdownMenuItem>
														<DropdownMenuSeparator className="bg-zinc-700" />
														<DropdownMenuItem
															className="text-red-400 cursor-pointer"
															onClick={() =>
																handleAction("Blocked", userItem.fullName)
															}
														>
															<Ban className="w-4 h-4 mr-2" /> Block
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default UsersList;
