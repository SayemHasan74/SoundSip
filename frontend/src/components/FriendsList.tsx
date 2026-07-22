import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useFriendStore } from '@/stores/useFriendStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { 
	Users, 
	UserMinus,
	Loader2,
	MessageCircle
} from 'lucide-react';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import { useNavigate } from 'react-router-dom';

const FriendsList = () => {
	const { 
		friends, 
		getFriendsList,
		removeFriend,
		isLoading 
	} = useFriendStore();
	const { unreadMessagesByUser, clearMessagesForUser } = useNotificationStore();
	const navigate = useNavigate();

	useEffect(() => {
		getFriendsList();
	}, [getFriendsList]);

	const handleUserClick = (clerkId: string) => {
		console.log("🔗 FriendsList - Navigating to profile:", clerkId);
		navigate(`/profile/${clerkId}`);
	};

	const handleRemoveFriend = async (friendId: string) => {
		await removeFriend(friendId);
	};

	const handleMessageFriend = (friendId: string) => {
		clearMessagesForUser(friendId);
		navigate(`/chat?user=${friendId}`);
	};

	if (isLoading) {
		return (
			<Card className="bg-zinc-800/50 border-zinc-700">
				<CardContent className="p-6">
					<div className="flex items-center justify-center">
						<Loader2 className="size-6 animate-spin text-blue-500" />
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-zinc-800/50 border-zinc-700">
			<CardHeader className="pb-3">
				<CardTitle className="text-white text-lg flex items-center gap-2">
					<Users className="size-5" />
					Friends ({friends.length})
				</CardTitle>
				<CardDescription className="text-zinc-400">
					Your friends list
				</CardDescription>
			</CardHeader>
			
			<CardContent>
				<ScrollArea className="h-64">
					{friends.length === 0 ? (
						<div className="text-center py-8">
							<Users className="size-12 text-zinc-500 mx-auto mb-3" />
							<p className="text-zinc-400 text-sm">No friends yet</p>
							<p className="text-zinc-500 text-xs mt-1">
								Start connecting with other users!
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{friends.map((friend) => (
								<div
									key={friend._id}
									className="flex items-center gap-3 p-3 bg-zinc-700/30 rounded-lg group"
								>
									<Avatar 
										className="w-10 h-10 cursor-pointer"
										onClick={() => handleUserClick(friend.clerkId)}
									>
										<AvatarImage 
											src={friend.imageUrl} 
											alt={friend.fullName} 
										/>
										<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
											{friend.fullName.charAt(0)}
										</AvatarFallback>
									</Avatar>
									
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<h4 
												className="text-white font-medium truncate cursor-pointer hover:text-blue-400"
												onClick={() => handleUserClick(friend.clerkId)}
											>
												{friend.isArtist ? friend.artistName : friend.fullName}
											</h4>
											{friend.isVerified && <VerifiedBadge size="sm" />}
											{friend.isArtist && (
												<Badge variant="secondary" className="text-xs">
													Artist
												</Badge>
											)}
											{unreadMessagesByUser[friend.clerkId] > 0 && (
												<Badge className="bg-emerald-600 text-white text-xs">
													{unreadMessagesByUser[friend.clerkId]} new
												</Badge>
											)}
										</div>
										{friend.handle && (
											<p className="text-zinc-400 text-xs">@{friend.handle}</p>
										)}
									</div>
									
									<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleMessageFriend(friend.clerkId)}
											className="border-zinc-600 text-zinc-400 hover:bg-zinc-600 hover:text-white"
										>
											<MessageCircle className="size-3" />
										</Button>
										<Button
											size="sm"
											variant="outline"
											onClick={() => handleRemoveFriend(friend.clerkId)}
											className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
										>
											<UserMinus className="size-3" />
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</ScrollArea>
			</CardContent>
		</Card>
	);
};

export default FriendsList;
