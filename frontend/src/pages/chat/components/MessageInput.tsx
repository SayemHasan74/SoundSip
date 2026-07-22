import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { 
	Image, 
	Send, 
	X, 
	Music, 
	Smile,
	Upload,
	FileImage
} from "lucide-react";
import { useRef, useState, useCallback, DragEvent, useEffect } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import EmojiPicker from "./EmojiPicker";

interface MessageInputProps {
	replyingToMessageId?: string | null;
	onCancelReply?: () => void;
}

const MessageInput = ({ replyingToMessageId, onCancelReply }: MessageInputProps = {}) => {
	const [newMessage, setNewMessage] = useState("");
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [isDragOver, setIsDragOver] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const { user } = useUser();
	const { selectedUser, sendMessage } = useChatStore();
	const { playlists, getPlaylists } = usePlaylistStore();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Load playlists when component mounts
	useEffect(() => {
		getPlaylists().catch(error => {
			console.error("Error loading playlists:", error);
		});
	}, [getPlaylists]);

	// Close playlist picker when clicking outside
	useEffect(() => {
		const handleClickOutside = () => {
			if (showPlaylistPicker) {
				setShowPlaylistPicker(false);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [showPlaylistPicker]);

	const handleImageSelect = (file: File) => {
		if (file.size > 10 * 1024 * 1024) { // 10MB limit
			toast.error("Image size should be less than 10MB");
			return;
		}
		
		if (!file.type.startsWith('image/')) {
			toast.error("Please select an image file");
			return;
		}

		setSelectedImage(file);
		const reader = new FileReader();
		reader.onload = () => {
			setImagePreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleImageSelect(file);
		}
	};

	const removeImage = () => {
		setSelectedImage(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleSend = async () => {
		if (!selectedUser || !user || isSending) return;
		if (!newMessage.trim() && !selectedImage) {
			toast.error("Please enter a message or select an image");
			return;
		}

		try {
			setIsSending(true);
			await sendMessage(selectedUser.clerkId, user.id, newMessage.trim(), selectedImage);
			setNewMessage("");
			removeImage();
			setShowPlaylistPicker(false);
			setShowEmojiPicker(false);
			onCancelReply?.();
			
			// Reset textarea height
			if (textareaRef.current) {
				textareaRef.current.style.height = 'auto';
			}
		} catch (error) {
			console.error('Error sending message:', error);
		} finally {
			setIsSending(false);
		}
	};

	const handleSendPlaylist = async (playlist: any) => {
		if (!selectedUser || !user) return;

		try {
			// Send a rich playlist message
							const playlistMessage = `🎵 **${playlist.name}**\n\n` +
				`📊 ${playlist.songCount} song${playlist.songCount !== 1 ? 's' : ''}\n` +
				`👤 Created by me\n\n` +
				`Check out this awesome playlist! 🎧`;

			await sendMessage(
				selectedUser.clerkId, 
				user.id, 
				playlistMessage, 
				null,
				{
					playlistId: playlist._id,
					playlistName: playlist.name,
					playlistImage: playlist.imageUrl || "https://via.placeholder.com/48x48/374151/FFFFFF?text=🎵",
					songCount: playlist.songCount || 0,
					description: playlist.description
				}
			);
			
			toast.success(`Shared playlist: ${playlist.name}`);
			setShowPlaylistPicker(false);
		} catch (error) {
			console.error('Error sharing playlist:', error);
			toast.error('Failed to share playlist');
		}
	};

	// Drag and drop handlers
	const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(true);
	}, []);

	const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragOver(false);
		
		const files = Array.from(e.dataTransfer.files);
		const imageFile = files.find(file => file.type.startsWith('image/'));
		
		if (imageFile) {
			handleImageSelect(imageFile);
		} else {
			toast.error("Please drop an image file");
		}
	}, []);

	// Handle emoji selection
	const handleEmojiSelect = (emoji: string) => {
		setNewMessage(prev => prev + emoji);
		setShowEmojiPicker(false);
	};

	// Auto-resize textarea
	const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewMessage(e.target.value);
		
		// Auto-resize
		const textarea = e.target;
		textarea.style.height = 'auto';
		textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
	};

	return (
		<div 
			className={cn(
				"p-3 sm:p-4 transition-all duration-200 relative",
				isDragOver && "bg-green-500/10 border-green-500/50"
			)}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			{/* Reply preview */}
			{replyingToMessageId && (
				<div className="mb-2 sm:mb-3 p-2 sm:p-3 bg-zinc-800/50 rounded-lg border-l-4 border-green-500">
					<div className="flex items-center justify-between mb-1">
						<span className="text-xs sm:text-sm text-green-400 font-medium">
							Replying to message
						</span>
						<Button
							size="sm"
							variant="ghost"
							onClick={onCancelReply}
							className="h-5 w-5 sm:h-6 sm:w-6 p-0"
						>
							<X className="h-3 w-3 sm:h-4 sm:w-4" />
						</Button>
					</div>
					<p className="text-xs sm:text-sm text-zinc-400 truncate">
						Original message content would appear here...
					</p>
				</div>
			)}

			{/* Image preview area - responsive sizing */}
			{imagePreview && (
				<div className="mb-2 sm:mb-3 transition-all duration-200 ease-in-out">
					<div className="relative inline-block animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
						<div className="relative">
							<img
								src={imagePreview}
								alt="Preview"
								className="max-h-12 max-w-12 sm:max-h-16 sm:max-w-16 rounded-lg object-cover border-2 border-zinc-600 shadow-lg"
							/>
							<Button
								size="icon"
								variant="destructive"
								className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 shadow-lg"
								onClick={removeImage}
							>
								<X className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
							</Button>
						</div>
						<Badge className="absolute -bottom-0.5 -left-0.5 bg-green-600 text-white text-xs px-1 py-0">
							<FileImage className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-1" />
							<span className="hidden sm:inline">Image</span>
						</Badge>
					</div>
				</div>
			)}
			
			{/* Input area - responsive layout */}
			<div className="flex gap-1.5 sm:gap-2 items-end">
				{/* Main input - responsive sizing */}
				<div className="flex-1 relative">
					<Textarea
						ref={textareaRef}
						placeholder="Type a message..."
						value={newMessage}
						onChange={handleTextareaChange}
						onKeyDown={handleKeyDown}
						className="min-h-[40px] sm:min-h-[44px] max-h-[100px] sm:max-h-[120px] bg-black/20 border-white/10 text-zinc-100 rounded-xl px-4 py-2.5 sm:py-3 pr-12 resize-none transition-all duration-200 focus:border-green-500/50 focus:ring-green-500/20 backdrop-blur-sm placeholder:text-zinc-400 text-sm sm:text-base"
						rows={1}
					/>
					
					{/* Drag overlay */}
					{isDragOver && (
						<div className="absolute inset-0 bg-green-500/20 border-2 border-dashed border-green-500 rounded-2xl flex items-center justify-center">
							<div className="text-center">
								<Upload className="w-6 h-6 text-green-500 mx-auto mb-2" />
								<p className="text-sm text-green-500 font-medium">Drop image here</p>
							</div>
						</div>
					)}
				</div>

				{/* Action buttons - responsive sizing */}
				<div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0 relative z-10">
					{/* Image button */}
					<Button
						size="icon"
						variant="ghost"
						onClick={() => {
							if (fileInputRef.current) {
								fileInputRef.current.value = "";
							}
							fileInputRef.current?.click();
						}}
						className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full hover:bg-white/10 transition-all duration-200 cursor-pointer"
						title="Attach image"
						type="button"
					>
						<Image className="size-4 sm:size-5" />
					</Button>

					{/* Playlist button */}
					<Button
						size="icon"
						variant="ghost"
						onClick={() => {
							console.log("Playlist button clicked, current state:", showPlaylistPicker);
							setShowPlaylistPicker(!showPlaylistPicker);
						}}
						className={cn(
							'h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full transition-all duration-200 cursor-pointer',
							showPlaylistPicker 
								? 'bg-green-600/20 text-green-500 hover:bg-green-600/30' 
								: 'hover:bg-white/10'
						)}
						title="Share playlist"
						type="button"
					>
						<Music className="w-4 h-4 sm:w-5 sm:h-5" />
					</Button>

					{/* Emoji button - hidden on very small screens */}
					<div className="relative">
						<Button
							size="icon"
							variant="ghost"
							onClick={() => setShowEmojiPicker(!showEmojiPicker)}
							className={cn(
								"hidden xs:flex h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full transition-all duration-200",
								showEmojiPicker 
									? "bg-green-600/20 text-green-500 hover:bg-green-600/30" 
									: "hover:bg-white/10"
							)}
							title="Add emoji"
						>
							<Smile className="size-4 sm:size-5" />
						</Button>

						{/* Emoji Picker */}
						{showEmojiPicker && (
							<div className="absolute bottom-full right-0 mb-2 z-50">
								<EmojiPicker 
									onEmojiSelect={handleEmojiSelect}
									onClose={() => setShowEmojiPicker(false)}
								/>
							</div>
						)}
					</div>

					{/* Send button - responsive sizing */}
					<Button 
						size="icon" 
						onClick={handleSend} 
						disabled={isSending || (!newMessage.trim() && !selectedImage)}
						className="bg-green-600 hover:bg-green-700 text-white rounded-full h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg ml-1"
						title="Send message"
					>
						<Send className="size-4 sm:size-5" />
					</Button>
				</div>
			</div>

			{/* Playlist Picker - positioned correctly */}
			{showPlaylistPicker && (
				<div 
					className="absolute bottom-full right-0 mb-2 z-50 w-64 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="p-3 border-b border-zinc-700">
						<h3 className="text-white font-medium text-sm">Share Playlist</h3>
					</div>
					<div className="max-h-48 overflow-y-auto">
						{playlists.length === 0 ? (
							<div className="p-3 text-center">
								<p className="text-zinc-400 text-sm">No playlists found</p>
								<p className="text-zinc-500 text-xs mt-1">Create a playlist first to share it</p>
							</div>
						) : (
							playlists.map((playlist) => (
								<div
									key={playlist._id}
									onClick={() => handleSendPlaylist(playlist)}
									className="p-3 hover:bg-zinc-800 cursor-pointer border-b border-zinc-800 last:border-b-0"
								>
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-zinc-700 rounded flex items-center justify-center flex-shrink-0">
											<Music className="w-5 h-5 text-zinc-400" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-white font-medium text-sm truncate">
												{playlist.name}
											</p>
											<p className="text-zinc-400 text-xs">
												{playlist.songCount} song{playlist.songCount !== 1 ? 's' : ''}
											</p>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			)}

			{/* Hidden file input */}
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileInput}
				className="sr-only"
				aria-label="Attach image"
			/>

			{/* Drag and drop hint - responsive */}
			{!selectedImage && !showPlaylistPicker && (
				<div className="mt-1 sm:mt-2 text-center">
					<p className="text-xs text-zinc-500 hidden sm:block">
						Drag & drop an image here, or use the buttons above
					</p>
					<p className="text-xs text-zinc-500 sm:hidden">
						Tap buttons to attach files
					</p>
				</div>
			)}
		</div>
	);
};

export default MessageInput;
