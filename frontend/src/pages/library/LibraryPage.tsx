import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { usePlaylistStore } from '@/stores/usePlaylistStore';
import { useMusicStore } from '@/stores/useMusicStore';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useListeningHistoryStore } from '@/stores/useListeningHistoryStore';
import { useFavoritesSync } from '@/hooks/useFavoritesSync';
import { 
	ChevronLeft, 
	ChevronRight, 
	Library, 
	Plus, 
	Search, 
	Clock, 
	List, 
	Heart, 
	Play, 
	MoreHorizontal,
	Music,
	X,
	Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import CreatePlaylistModal from '@/components/playlist/CreatePlaylistModal';
import PlaylistCard from '@/components/playlist/PlaylistCard';

const LibraryPage = () => {
	const navigate = useNavigate();
	const [activeFilter, setActiveFilter] = useState<'all' | 'playlists' | 'albums' | 'liked-songs' | 'recently-played'>('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState<'recents' | 'alphabetical'>('recents');
	const [showSearch, setShowSearch] = useState(false);
	const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
	const initialLoadStarted = useRef(false);
	
	const { 
		playlists, 
		likedSongsPlaylist, 
		getPlaylists, 
		deletePlaylist,
		isLoading: playlistsLoading 
	} = usePlaylistStore();
	
	const { isLoading: albumsLoading, getLibraryAlbums, libraryAlbums } = useMusicStore();
	const { playAlbum } = usePlayerStore();
	const { favorites, isLoading: favoritesLoading } = useFavoritesStore();
	const { history, getListeningHistory, isLoading: historyLoading } = useListeningHistoryStore();

	// Use the custom hook for real-time favorites synchronization
	useFavoritesSync();

	useEffect(() => {
		if (initialLoadStarted.current) return;
		initialLoadStarted.current = true;

		const initializeData = async () => {
			try {
				await Promise.all([
					playlists.length === 0 ? getPlaylists() : Promise.resolve(),
					libraryAlbums.length === 0 ? getLibraryAlbums() : Promise.resolve(),
					getListeningHistory(50)
				]);
			} catch (error) {
				console.error("❌ LibraryPage: Error initializing data:", error);
			}
		};
		
		void initializeData();
	}, [getPlaylists, getLibraryAlbums, getListeningHistory, playlists.length, libraryAlbums.length]);

	// Filter and sort playlists
	const filteredPlaylists = playlists
		.filter(playlist => 
			playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			playlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.sort((a, b) => {
			if (sortBy === 'recents') {
				return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
			}
			return a.name.localeCompare(b.name);
		});

	// Filter and sort albums (only user's library albums)
	const filteredAlbums = libraryAlbums
		.filter(album => 
			album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			album.artist.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.sort((a, b) => {
			if (sortBy === 'recents') {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			}
			return a.title.localeCompare(b.title);
		});

	// Filter and sort liked songs
	const filteredLikedSongs = favorites
		.filter(fav => fav.type === 'song')
		.filter(fav => 
			fav.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			fav.artist?.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.sort((a, b) => {
			if (sortBy === 'recents') {
				return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
			}
			return a.title.localeCompare(b.title);
		});

	// Filter and sort recently played
	const filteredRecentlyPlayed = history
		.filter(entry => 
			entry.songTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
			entry.artistName.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.sort((a, b) => {
			if (sortBy === 'recents') {
				return new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime();
			}
			return a.songTitle.localeCompare(b.songTitle);
		});

	const handlePlayPlaylist = (playlist: any) => {
		if (playlist.songs && playlist.songs.length > 0) {
			playAlbum(playlist.songs);
		}
	};

	const handlePlayAlbum = (album: any) => {
		if (album.songs && album.songs.length > 0) {
			playAlbum(album.songs);
		}
	};

	const handlePlaySong = (song: any) => {
		// Convert to Song format and play
		const songData = {
			_id: song._id || song.itemId,
			title: song.title || song.songTitle,
			artist: song.artist || song.artistName,
			imageUrl: song.imageUrl,
			audioUrl: song.audioUrl || song.metadata?.audioUrl,
			duration: song.duration || song.metadata?.duration || 0,
			genre: song.genre || song.metadata?.genre || '',
			albumId: song.albumId || song.metadata?.albumId || null
		};
		playAlbum([songData]);
	};

	const getLikedSongsImage = () => {
		return (
			<div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
				<Heart className="w-6 h-6 text-white fill-white" />
			</div>
		);
	};

	const renderContent = () => {
		// Show loading state if any data is still loading
		const isInitialLoad = (
			playlistsLoading || albumsLoading || favoritesLoading || historyLoading
		) && playlists.length === 0 && libraryAlbums.length === 0 && favorites.length === 0 && history.length === 0;

		if (isInitialLoad) {
			return (
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<Loader2 className="size-8 text-emerald-500 animate-spin mx-auto mb-4" />
						<p className="text-zinc-400">Loading your library...</p>
					</div>
				</div>
			);
		}

		if (activeFilter === 'all') {
			return (
				<>
					{/* Liked Songs */}
					{(likedSongsPlaylist || filteredLikedSongs.length > 0) && (
						<div 
							className="p-3 hover:bg-zinc-800/50 rounded-md group cursor-pointer touch-button"
							onClick={() => navigate('/liked-songs')}
						>
							<div className="flex items-center gap-3">
								{getLikedSongsImage()}
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<p className="font-medium text-white truncate text-sm sm:text-base">Liked Songs</p>
										<Badge variant="secondary" className="bg-green-500 text-white text-xs">
											<Heart className="w-3 h-3 mr-1" />
											Playlist
										</Badge>
									</div>
									<p className="text-xs sm:text-sm text-zinc-400 truncate">
										{likedSongsPlaylist?.songCount || filteredLikedSongs.length} songs
									</p>
								</div>
								<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
									<Button
										variant="ghost"
										size="icon"
										onClick={(e) => {
											e.stopPropagation();
											if (likedSongsPlaylist) {
												handlePlayPlaylist(likedSongsPlaylist);
											} else if (filteredLikedSongs.length > 0) {
												// Play liked songs from favorites
												const songsToPlay = filteredLikedSongs.map(fav => ({
													_id: fav.itemId,
													title: fav.title,
													artist: fav.artist || '',
													imageUrl: fav.imageUrl || '',
													audioUrl: fav.metadata?.audioUrl || '',
													duration: fav.metadata?.duration || 0,
													genre: fav.metadata?.genre || '',
													albumId: fav.metadata?.albumId || null
												}));
												playAlbum(songsToPlay);
											}
										}}
										className="text-white hover:bg-white/20 touch-button"
									>
										<Play className="w-4 h-4" />
									</Button>
									<Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white touch-button">
										<MoreHorizontal className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</div>
					)}

					{/* Playlists */}
					{filteredPlaylists.slice(0, 5).map((playlist) => (
						<PlaylistCard
							key={playlist._id}
							playlist={playlist}
							onDelete={async (playlistId) => {
								try {
									await deletePlaylist(playlistId);
									toast.success('Playlist deleted successfully');
								} catch (error) {
									console.error('Error deleting playlist:', error);
									toast.error('Failed to delete playlist');
								}
							}}
						/>
					))}

					{/* Albums */}
					{filteredAlbums.slice(0, 5).map((album) => (
						<Link key={album._id} to={`/album/${album._id}`}>
							<div className="p-3 hover:bg-zinc-800/50 rounded-md group cursor-pointer touch-button">
								<div className="flex items-center gap-3">
									<img 
										src={album.imageUrl} 
										alt={album.title}
										className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover"
									/>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<p className="font-medium text-white truncate text-sm sm:text-base">{album.title}</p>
											<Badge variant="secondary" className="bg-emerald-500 text-white text-xs">
												Album
											</Badge>
										</div>
										<p className="text-xs sm:text-sm text-zinc-400 truncate">
											{album.artist}
										</p>
									</div>
									<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
										<Button
											variant="ghost"
											size="icon"
											onClick={(e) => {
												e.stopPropagation();
												handlePlayAlbum(album);
											}}
											className="text-white hover:bg-white/20 touch-button"
										>
											<Play className="w-4 h-4" />
										</Button>
										<Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white touch-button">
											<MoreHorizontal className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</div>
						</Link>
					))}
				</>
			);
		}

		if (activeFilter === 'playlists') {
			return (
				<>
					{/* Liked Songs Playlist */}
					{likedSongsPlaylist && (
						<div 
							className="p-3 hover:bg-zinc-800/50 rounded-md group cursor-pointer"
							onClick={() => navigate('/liked-songs')}
						>
							<div className="flex items-center gap-3">
								{getLikedSongsImage()}
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<p className="font-medium text-white truncate">Liked Songs</p>
										<Badge variant="secondary" className="bg-green-500 text-white text-xs">
											<Heart className="w-3 h-3 mr-1" />
											Playlist
										</Badge>
									</div>
									<p className="text-sm text-zinc-400 truncate">
										{likedSongsPlaylist.songCount} songs
									</p>
								</div>
								<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
									<Button
										variant="ghost"
										size="icon"
										onClick={(e) => {
											e.stopPropagation();
											handlePlayPlaylist(likedSongsPlaylist);
										}}
										className="text-white hover:bg-white/20"
									>
										<Play className="w-4 h-4" />
									</Button>
									<Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
										<MoreHorizontal className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</div>
					)}

					{/* Other Playlists */}
					{playlistsLoading ? (
						<div className="space-y-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="p-3 animate-pulse">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 bg-zinc-700 rounded-md" />
										<div className="flex-1">
											<div className="h-4 bg-zinc-700 rounded mb-2" />
											<div className="h-3 bg-zinc-700 rounded w-24" />
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						filteredPlaylists.map((playlist) => (
							<PlaylistCard
								key={playlist._id}
								playlist={playlist}
								onDelete={async (playlistId) => {
									try {
										await deletePlaylist(playlistId);
										toast.success('Playlist deleted successfully');
									} catch (error) {
										console.error('Error deleting playlist:', error);
										toast.error('Failed to delete playlist');
									}
								}}
							/>
						))
					)}
				</>
			);
		}

		if (activeFilter === 'albums') {
			return (
				<>
					{albumsLoading ? (
						<div className="space-y-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="p-3 animate-pulse">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 bg-zinc-700 rounded-md" />
										<div className="flex-1">
											<div className="h-4 bg-zinc-700 rounded mb-2" />
											<div className="h-3 bg-zinc-700 rounded w-24" />
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						filteredAlbums.map((album) => (
							<Link key={album._id} to={`/album/${album._id}`}>
								<div className="p-3 hover:bg-zinc-800/50 rounded-md group cursor-pointer">
									<div className="flex items-center gap-3">
										<img 
											src={album.imageUrl} 
											alt={album.title}
											className="w-12 h-12 rounded-md object-cover"
										/>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<p className="font-medium text-white truncate">{album.title}</p>
												<Badge variant="secondary" className="bg-emerald-500 text-white text-xs">
													Album
												</Badge>
											</div>
											<p className="text-sm text-zinc-400 truncate">
												{album.artist}
											</p>
										</div>
										<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<Button
												variant="ghost"
												size="icon"
												onClick={(e) => {
													e.stopPropagation();
													handlePlayAlbum(album);
												}}
												className="text-white hover:bg-white/20"
											>
												<Play className="w-4 h-4" />
											</Button>
											<Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
												<MoreHorizontal className="w-4 h-4" />
											</Button>
										</div>
									</div>
								</div>
							</Link>
						))
					)}
				</>
			);
		}

		if (activeFilter === 'liked-songs') {
			return (
				<>
					{favoritesLoading ? (
						<div className="space-y-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="p-3 animate-pulse">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 bg-zinc-700 rounded-md" />
										<div className="flex-1">
											<div className="h-4 bg-zinc-700 rounded mb-2" />
											<div className="h-3 bg-zinc-700 rounded w-24" />
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						filteredLikedSongs.map((song) => (
							<div key={song._id} className="p-3 hover:bg-zinc-800/50 rounded-md group cursor-pointer">
								<div className="flex items-center gap-3">
									{song.imageUrl ? (
										<img 
											src={song.imageUrl} 
											alt={song.title}
											className="w-12 h-12 rounded-md object-cover"
										/>
									) : (
										<div className="w-12 h-12 rounded-md bg-zinc-700 flex items-center justify-center">
											<Music className="w-6 h-6 text-zinc-400" />
										</div>
									)}
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<p className="font-medium text-white truncate">{song.title}</p>
											<Badge variant="secondary" className="bg-red-500 text-white text-xs">
												<Heart className="w-3 h-3 mr-1" />
												Liked
											</Badge>
										</div>
										<p className="text-sm text-zinc-400 truncate">
											{song.artist}
										</p>
									</div>
									<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
										<Button
											variant="ghost"
											size="icon"
											onClick={(e) => {
												e.stopPropagation();
												handlePlaySong(song);
											}}
											className="text-white hover:bg-white/20"
										>
											<Play className="w-4 h-4" />
										</Button>
										<Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
											<MoreHorizontal className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</div>
						))
					)}
				</>
			);
		}

		if (activeFilter === 'recently-played') {
			return (
				<>
					{historyLoading ? (
						<div className="space-y-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="p-3 animate-pulse">
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 bg-zinc-700 rounded-md" />
										<div className="flex-1">
											<div className="h-4 bg-zinc-700 rounded mb-2" />
											<div className="h-3 bg-zinc-700 rounded w-24" />
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						filteredRecentlyPlayed.map((entry) => (
							<div key={entry._id} className="p-3 hover:bg-zinc-800/50 rounded-md group cursor-pointer">
								<div className="flex items-center gap-3">
									{entry.imageUrl ? (
										<img 
											src={entry.imageUrl} 
											alt={entry.songTitle}
											className="w-12 h-12 rounded-md object-cover"
										/>
									) : (
										<div className="w-12 h-12 rounded-md bg-zinc-700 flex items-center justify-center">
											<Music className="w-6 h-6 text-zinc-400" />
										</div>
									)}
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<p className="font-medium text-white truncate">{entry.songTitle}</p>
											<Badge variant="secondary" className="bg-blue-500 text-white text-xs">
												<Clock className="w-3 h-3 mr-1" />
												Recent
											</Badge>
										</div>
										<p className="text-sm text-zinc-400 truncate">
											{entry.artistName}
										</p>
									</div>
									<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
										<Button
											variant="ghost"
											size="icon"
											onClick={(e) => {
												e.stopPropagation();
												handlePlaySong(entry);
											}}
											className="text-white hover:bg-white/20"
										>
											<Play className="w-4 h-4" />
										</Button>
										<Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
											<MoreHorizontal className="w-4 h-4" />
										</Button>
									</div>
								</div>
							</div>
						))
					)}
				</>
			);
		}

		return null;
	};

	return (
		<div className="h-full bg-black text-white p-3 sm:p-4 md:p-6">
			
			{/* Top Navigation */}
			<div className="flex items-center justify-center mb-4 sm:mb-6">
				<Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white touch-button">
					<ChevronLeft className="w-5 h-5" />
				</Button>
				<Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white touch-button">
					<ChevronRight className="w-5 h-5" />
				</Button>
			</div>

			{/* Header */}
			<div className="flex items-center justify-between mb-4 sm:mb-6">
				<div className="flex items-center gap-2 sm:gap-3">
					<div className="w-6 h-6 sm:w-8 sm:h-8 bg-zinc-800 rounded flex items-center justify-center">
						<Library className="w-4 h-4 sm:w-5 sm:h-5" />
					</div>
					<h1 className="text-xl sm:text-2xl font-bold">Your Library</h1>
				</div>
				<div className="flex items-center gap-2">
					<Button 
						variant="ghost" 
						size="icon" 
						onClick={() => setShowCreatePlaylistModal(true)}
						className="text-zinc-400 hover:text-white touch-button"
						title="Create Playlist"
					>
						<Plus className="w-4 h-4 sm:w-5 sm:h-5" />
					</Button>
					<Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white touch-button">
						<List className="w-4 h-4 sm:w-5 sm:h-5" />
					</Button>
				</div>
			</div>

			{/* Filter Tabs */}
			<div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide">
				<Button
					variant={activeFilter === 'all' ? 'default' : 'ghost'}
					onClick={() => setActiveFilter('all')}
					className={cn(
						'rounded-full whitespace-nowrap text-sm touch-button',
						activeFilter === 'all' 
							? 'bg-white text-black hover:bg-white' 
							: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
					)}
				>
					All
				</Button>
				<Button
					variant={activeFilter === 'playlists' ? 'default' : 'ghost'}
					onClick={() => setActiveFilter('playlists')}
					className={cn(
						'rounded-full whitespace-nowrap text-sm touch-button',
						activeFilter === 'playlists' 
							? 'bg-white text-black hover:bg-white' 
							: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
					)}
				>
					<span className="hidden sm:inline">Playlists</span>
					<span className="sm:hidden">Lists</span>
				</Button>
				<Button
					variant={activeFilter === 'albums' ? 'default' : 'ghost'}
					onClick={() => setActiveFilter('albums')}
					className={cn(
						'rounded-full whitespace-nowrap text-sm touch-button',
						activeFilter === 'albums' 
							? 'bg-white text-black hover:bg-white' 
							: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
					)}
				>
					Albums
				</Button>
				<Button
					variant={activeFilter === 'liked-songs' ? 'default' : 'ghost'}
					onClick={() => setActiveFilter('liked-songs')}
					className={cn(
						'rounded-full whitespace-nowrap text-sm touch-button',
						activeFilter === 'liked-songs' 
							? 'bg-white text-black hover:bg-white' 
							: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
					)}
				>
					<Heart className="w-4 h-4 mr-1" />
					<span className="hidden sm:inline">Liked Songs</span>
					<span className="sm:hidden">Liked</span>
				</Button>
				<Button
					variant={activeFilter === 'recently-played' ? 'default' : 'ghost'}
					onClick={() => setActiveFilter('recently-played')}
					className={cn(
						'rounded-full whitespace-nowrap text-sm touch-button',
						activeFilter === 'recently-played' 
							? 'bg-white text-black hover:bg-white' 
							: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
					)}
				>
					<Clock className="w-4 h-4 mr-1" />
					<span className="hidden sm:inline">Recently Played</span>
					<span className="sm:hidden">Recent</span>
				</Button>
			</div>

			{/* Search and Sort */}
			<div className="flex items-center justify-between mb-4 sm:mb-6">
				{showSearch ? (
					<div className="flex items-center gap-2 flex-1">
						<Search className="w-4 h-4 text-zinc-400" />
						<Input
							placeholder="Search in library..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 flex-1 mobile-input"
						/>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => {
								setShowSearch(false);
								setSearchQuery('');
							}}
							className="text-zinc-400 hover:text-white touch-button"
						>
							<X className="w-4 h-4" />
						</Button>
					</div>
				) : (
					<Button 
						variant="ghost" 
						size="icon" 
						onClick={() => setShowSearch(true)}
						className="text-zinc-400 hover:text-white touch-button"
					>
						<Search className="w-4 h-4 sm:w-5 sm:h-5" />
					</Button>
				)}
				<div className="flex items-center gap-2 text-zinc-400">
					<Clock className="w-4 h-4" />
					<span className="text-xs sm:text-sm">{sortBy === 'recents' ? 'Recents' : 'Alphabetical'}</span>
					<Button 
						variant="ghost" 
						size="icon" 
						onClick={() => setSortBy(sortBy === 'recents' ? 'alphabetical' : 'recents')}
						className="text-zinc-400 hover:text-white touch-button"
					>
						<List className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* Content */}
			<ScrollArea className="h-[calc(100vh-280px)] sm:h-[calc(100vh-300px)]">
				<div className="space-y-2">
					{renderContent()}
				</div>
			</ScrollArea>

			{/* Debug info - remove in production */}
			{process.env.NODE_ENV === 'development' && (
				<div className="mt-4 p-3 sm:p-4 bg-zinc-800 rounded-lg border border-zinc-700">
					<h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Debug Information</h3>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
						<div>
							<p className="text-zinc-400">Playlists:</p>
							<p className="text-white">{playlists.length}</p>
						</div>
						<div>
							<p className="text-zinc-400">Liked Songs:</p>
							<p className="text-white">{likedSongsPlaylist?.songCount || 0}</p>
						</div>
						<div>
							<p className="text-zinc-400">Favorites:</p>
							<p className="text-white">{favorites.length}</p>
						</div>
						<div>
							<p className="text-zinc-400">Library Albums:</p>
							<p className="text-white">{libraryAlbums.length}</p>
						</div>
						<div>
							<p className="text-zinc-400">History:</p>
							<p className="text-white">{history.length}</p>
						</div>
						<div>
							<p className="text-zinc-400">Loading States:</p>
							<p className="text-white">
								{playlistsLoading ? 'P' : ''}
								{albumsLoading ? 'A' : ''}
								{favoritesLoading ? 'F' : ''}
								{historyLoading ? 'H' : ''}
								{!playlistsLoading && !albumsLoading && !favoritesLoading && !historyLoading ? 'None' : ''}
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Create Playlist Modal */}
			<CreatePlaylistModal
				isOpen={showCreatePlaylistModal}
				onClose={() => setShowCreatePlaylistModal(false)}
			/>
		</div>
	);
};

export default LibraryPage;
