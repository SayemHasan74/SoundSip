import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
	Play, 
	Pause, 
	Shuffle, 
	Repeat, 
	Heart, 
	MoreHorizontal, 
	Clock,
	ArrowLeft,
	Music
} from "lucide-react";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { useFavoritesSync } from "@/hooks/useFavoritesSync";
import { toast } from "react-hot-toast";

const LikedSongsPage = () => {
	const navigate = useNavigate();
	const { likedSongsPlaylist, getLikedSongsPlaylist, isLoading } = usePlaylistStore();
	const { 
		currentSong, 
		isPlaying, 
		playAlbum, 
		togglePlay, 
		toggleShuffle, 
		toggleRepeat,
		isShuffled,
		repeatMode
	} = usePlayerStore();
	const { removeFromFavorites } = useFavoritesStore();
	const [isHovered, setIsHovered] = useState<string | null>(null);

	// Use the custom hook for real-time favorites synchronization
	useFavoritesSync();

	const handlePlay = () => {
		if (likedSongsPlaylist?.songs && likedSongsPlaylist.songs.length > 0) {
			// Check if we're already playing this playlist
			const isCurrentPlaylist = currentSong && likedSongsPlaylist.songs.some(song => song._id === currentSong._id);
			
			if (isCurrentPlaylist && isPlaying) {
				// If we're playing this playlist, toggle pause
				togglePlay();
			} else {
				// Start playing the playlist
				playAlbum(likedSongsPlaylist.songs as any);
			}
		} else {
			toast.error("No songs in your Liked Songs playlist");
		}
	};

	const handlePlaySong = (song: any, index: number) => {
		if (likedSongsPlaylist?.songs) {
			// Start playing from the selected song
			const songsFromIndex = likedSongsPlaylist.songs.slice(index);
			playAlbum(songsFromIndex as any);
		}
	};

	const handleUnfavorite = async (songId: string) => {
		try {
			await removeFromFavorites(songId);
			// Refresh the liked songs playlist to get updated data
			await getLikedSongsPlaylist();
			toast.success("Song removed from Liked Songs");
		} catch (error) {
			console.error("Error removing from favorites:", error);
			toast.error("Failed to remove song from Liked Songs");
		}
	};

	const formatDuration = (minutes: number) => {
		if (!minutes || minutes <= 0) return "0:00";
		const mins = Math.floor(minutes);
		const secs = Math.round((minutes - mins) * 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { 
			year: 'numeric', 
			month: 'short', 
			day: 'numeric' 
		});
	};

	if (isLoading) {
		return (
			<div className="h-full bg-black text-white p-6">
				<div className="flex items-center gap-4 mb-6">
					<Button 
						variant="ghost" 
						size="icon" 
						onClick={() => navigate(-1)}
						className="text-white hover:bg-white/20"
					>
						<ArrowLeft className="w-6 h-6" />
					</Button>
					<div className="animate-pulse">
						<div className="h-8 bg-zinc-700 rounded w-48 mb-2" />
						<div className="h-4 bg-zinc-700 rounded w-32" />
					</div>
				</div>
				<div className="animate-pulse space-y-2">
					{Array.from({ length: 10 }).map((_, i) => (
						<div key={i} className="flex items-center gap-4 p-3">
							<div className="w-8 h-8 bg-zinc-700 rounded" />
							<div className="flex-1">
								<div className="h-4 bg-zinc-700 rounded w-48 mb-2" />
								<div className="h-3 bg-zinc-700 rounded w-32" />
							</div>
							<div className="w-12 h-3 bg-zinc-700 rounded" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!likedSongsPlaylist) {
		return (
			<div className="h-full bg-black text-white p-6">
				<div className="flex items-center gap-4 mb-6">
					<Button 
						variant="ghost" 
						size="icon" 
						onClick={() => navigate(-1)}
						className="text-white hover:bg-white/20"
					>
						<ArrowLeft className="w-6 h-6" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold">Liked Songs</h1>
						<p className="text-zinc-400">No liked songs yet</p>
					</div>
				</div>
				<div className="text-center py-12">
					<Heart className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
					<p className="text-zinc-500">Start liking songs to see them here</p>
				</div>
			</div>
		);
	}

	const isCurrentPlaylist = currentSong && likedSongsPlaylist.songs.some(song => song._id === currentSong._id);

	return (
		<div className="h-full bg-black text-white p-6">
			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<Button 
					variant="ghost" 
					size="icon" 
					onClick={() => navigate(-1)}
					className="text-white hover:bg-white/20"
				>
					<ArrowLeft className="w-6 h-6" />
				</Button>
				<div className="flex-1">
					<h1 className="text-2xl font-bold">Liked Songs</h1>
					<p className="text-zinc-400">
						{likedSongsPlaylist.songCount} song{likedSongsPlaylist.songCount !== 1 ? 's' : ''}
					</p>
				</div>
			</div>

			{/* Album Art and Info */}
			<div className="flex items-end gap-6 mb-8">
				<div className="w-48 h-48 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
					<Heart className="w-24 h-24 text-white fill-white" />
				</div>
				<div className="flex-1">
					<div className="mb-4">
						<h2 className="text-4xl font-bold mb-2">Liked Songs</h2>
						<p className="text-zinc-400">Your favorite songs collection</p>
					</div>
					<div className="flex items-center gap-4">
						<Button 
							onClick={handlePlay}
							className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-full"
						>
							{isCurrentPlaylist && isPlaying ? (
								<>
									<Pause className="w-5 h-5 mr-2" />
									Pause
								</>
							) : (
								<>
									<Play className="w-5 h-5 mr-2" />
									Play
								</>
							)}
						</Button>
						<Button 
							variant="ghost" 
							size="icon" 
							onClick={toggleShuffle}
							className={`text-white hover:bg-white/20 ${isShuffled ? 'text-green-500' : ''}`}
						>
							<Shuffle className="w-5 h-5" />
						</Button>
						<Button 
							variant="ghost" 
							size="icon" 
							onClick={toggleRepeat}
							className={`text-white hover:bg-white/20 ${repeatMode !== 'off' ? 'text-green-500' : ''}`}
						>
							<Repeat className={`w-5 h-5 ${repeatMode === 'one' ? 'text-green-500' : ''}`} />
						</Button>
						<Button 
							variant="ghost" 
							size="icon" 
							className="text-white hover:bg-white/20"
						>
							<MoreHorizontal className="w-5 h-5" />
						</Button>
					</div>
				</div>
			</div>

			{/* Songs List */}
			<div className="space-y-1">
				{/* Header */}
				<div className="flex items-center gap-4 p-3 text-zinc-400 text-sm border-b border-zinc-800">
					<div className="w-8 text-center">#</div>
					<div className="flex-1">Title</div>
					<div className="w-32">Album</div>
					<div className="w-32">Date Added</div>
					<div className="w-16 text-center">
						<Clock className="w-4 h-4" />
					</div>
				</div>

				{/* Songs */}
				{likedSongsPlaylist.songs.length === 0 ? (
					<div className="text-center py-12">
						<Music className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
						<p className="text-zinc-500">No liked songs yet</p>
						<p className="text-zinc-600 text-sm">Start liking songs to see them here</p>
					</div>
				) : (
					likedSongsPlaylist.songs.map((song: any, index: number) => {
						const isCurrentSong = currentSong?._id === song._id;
						const isPlayingCurrent = isCurrentSong && isPlaying;

						return (
							<div
								key={song._id}
								className="flex items-center gap-4 p-3 hover:bg-zinc-800/50 rounded-md group cursor-pointer"
								onMouseEnter={() => setIsHovered(song._id)}
								onMouseLeave={() => setIsHovered(null)}
								onClick={() => handlePlaySong(song, index)}
							>
								<div className="w-8 text-center text-zinc-400">
									{isHovered === song._id ? (
										<Play className="w-4 h-4 text-white" />
									) : isCurrentSong ? (
										<div className="w-4 h-4 bg-green-500 rounded-full" />
									) : (
										index + 1
									)}
								</div>
								
								<div className="flex items-center gap-3 flex-1">
									<img 
										src={song.imageUrl || "https://via.placeholder.com/40x40/374151/FFFFFF?text=🎵"} 
										alt={song.title}
										className="w-10 h-10 rounded object-cover"
									/>
									<div>
										<div className="flex items-center gap-2">
											<p className={`font-medium ${isCurrentSong ? 'text-green-500' : 'text-white'}`}>
												{song.title}
											</p>
											{isCurrentSong && isPlaying && (
												<div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
											)}
										</div>
										<p className="text-sm text-zinc-400">{song.artist}</p>
									</div>
								</div>

								<div className="w-32 text-zinc-400 text-sm truncate">
									{song.albumId || 'Unknown Album'}
								</div>

								<div className="w-32 text-zinc-400 text-sm">
									{formatDate(song.addedAt || new Date().toISOString())}
								</div>

								<div className="flex items-center gap-2 w-16">
									<div className="text-zinc-400 text-sm">
										{formatDuration(song.duration || 0)}
									</div>
									<Button
										variant="ghost"
										size="icon"
										onClick={(e) => {
											e.stopPropagation();
											handleUnfavorite(song._id);
										}}
										className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white hover:bg-white/20"
									>
										<Heart className="w-4 h-4 fill-current" />
									</Button>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default LikedSongsPage;
