import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { SignedIn, useUser } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle, Plus, Search, Clock, Mic, User, Heart, Music, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFavoritesSync } from "@/hooks/useFavoritesSync";

const LeftSidebar = () => {
	const { fetchAlbums, getLibraryAlbums, libraryAlbums } = useMusicStore();
	const { 
		playlists, 
		likedSongsPlaylist, 
		getPlaylists, 
		initializeLikedSongsPlaylist, 
		getLikedSongsPlaylist,
		isLoading: playlistsLoading 
	} = usePlaylistStore();
	const { favorites, getFavorites } = useFavoritesStore();
	const { user } = useUser();
	const [activeFilter, setActiveFilter] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [showSearch, setShowSearch] = useState(false);

	// Use the custom hook for real-time favorites synchronization
	useFavoritesSync();

	useEffect(() => {
		console.log("🔍 LeftSidebar: Initializing data fetch");
		const initializeData = async () => {
			try {
				await Promise.all([
					fetchAlbums(),
					getPlaylists(),
					initializeLikedSongsPlaylist(),
					getLikedSongsPlaylist(),
					getFavorites('song'),
					getLibraryAlbums()
				]);
				console.log("✅ LeftSidebar: Data initialization completed");
			} catch (error) {
				console.error("❌ LeftSidebar: Error initializing data:", error);
			}
		};
		
		initializeData();
	}, []); // Empty dependency array to run only once on mount

	// Removed console.log to prevent unnecessary re-renders

	const filters = [
		{ id: 'all', label: 'All', icon: null },
		{ id: 'playlists', label: 'Playlists', icon: null },
		{ id: 'albums', label: 'Albums', icon: null }
	];

	// Filter playlists based on active filter and search query
	const filteredPlaylists = playlists.filter(playlist => {
		const matchesSearch = playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			playlist.description?.toLowerCase().includes(searchQuery.toLowerCase());
		
		if (activeFilter === 'all') {
			return matchesSearch;
		} else if (activeFilter === 'playlists') {
			return matchesSearch;
		}
		return false;
	});

	// Filter albums based on active filter and search query (only user's library albums)
	const filteredAlbums = libraryAlbums.filter(album => {
		const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			album.artist.toLowerCase().includes(searchQuery.toLowerCase());
		
		if (activeFilter === 'all') {
			return matchesSearch;
		} else if (activeFilter === 'albums') {
			return matchesSearch;
		}
		return false;
	});

	// Filter liked songs playlist based on search query
	const shouldShowLikedSongs = activeFilter === 'all' || activeFilter === 'playlists';
	const likedSongsMatchesSearch = !searchQuery || 
		'Liked Songs'.toLowerCase().includes(searchQuery.toLowerCase());

	// Check if we should show liked songs (either from playlist or favorites)
	const hasLikedSongs = likedSongsPlaylist?.songCount > 0 || favorites.filter(f => f.type === 'song').length > 0;
	const likedSongsCount = likedSongsPlaylist?.songCount || favorites.filter(f => f.type === 'song').length;

	return (
		<div className='h-full flex flex-col gap-2'>
			{/* Navigation menu */}
			<div className='rounded-lg bg-zinc-900 p-4'>
				{/* SoundScape Logo and Brand */}
				<div className='flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800'>
					<img src='/soundscape-logo.svg' className='size-8' alt='SoundScape logo' />
					<span className="text-xl font-bold text-white">SoundScape</span>
				</div>

				<div className='space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<HomeIcon className='mr-2 size-5' />
						<span className='hidden md:inline'>Home</span>
					</Link>

					<Link
						to={"/search"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<Search className='mr-2 size-5' />
						<span className='hidden md:inline'>Search</span>
					</Link>

					<SignedIn>
						<Link
							to={"/chat"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800",
								})
							)}
						>
							<MessageCircle className='mr-2 size-5' />
							<span className='hidden md:inline'>Messages</span>
						</Link>
					</SignedIn>

					{/* Profile and Settings buttons */}
					<div className='pt-2 border-t border-zinc-800'>
						<Link
							to={user ? `/profile/${user.id}` : "/profile"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800",
								})
							)}
						>
							<User className='mr-2 size-5' />
							<span className='hidden md:inline'>Profile</span>
						</Link>

						{/* Settings and Premium links - HIDDEN FOR NOW */}
						{/* <Link
							to={"/settings"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800",
								})
							)}
						>
							<Settings className='mr-2 size-5' />
							<span className='hidden md:inline'>Settings</span>
						</Link>

						<Link
							to={"/premium"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800",
								})
							)}
						>
							<Crown className='mr-2 size-5' />
							<span className='hidden md:inline'>Premium</span>
						</Link> */}

						<Link
							to={"/artist/signup"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-start text-white hover:bg-zinc-800",
								})
							)}
						>
							<Mic className='mr-2 size-5' />
							<span className='hidden md:inline'>Join as Artist</span>
						</Link>
					</div>
				</div>
			</div>

			{/* Library section */}
			<div className='flex-1 rounded-lg bg-zinc-900 p-4 flex flex-col'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center text-white px-2'>
						<Library className='size-5 mr-2' />
						<span className='font-semibold'>Your Library</span>
					</div>
					<div className='flex items-center gap-2'>
						<Link to="/library" className='p-1 hover:bg-zinc-800 rounded-full transition-colors'>
							<Plus className='size-4 text-zinc-400' />
						</Link>
					</div>
				</div>

				{/* Filter buttons */}
				<div className='flex gap-2 mb-4'>
					{filters.map((filter) => (
						<button
							key={filter.id}
							onClick={() => setActiveFilter(filter.id)}
							className={cn(
								'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
								activeFilter === filter.id
									? 'bg-white text-black'
									: 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
							)}
						>
							{filter.label}
						</button>
					))}
				</div>

				{/* Search and Recents */}
				<div className='flex items-center gap-2 mb-4'>
					{showSearch ? (
						<div className='flex items-center gap-2 flex-1'>
							<Search className='size-4 text-zinc-400' />
							<Input
								placeholder="Search in library..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 text-xs h-8"
							/>
							<button
								onClick={() => {
									setShowSearch(false);
									setSearchQuery('');
								}}
								className='p-1 hover:bg-zinc-800 rounded-full transition-colors'
							>
								<X className='size-4 text-zinc-400' />
							</button>
						</div>
					) : (
						<>
							<button 
								onClick={() => setShowSearch(true)}
								className='p-2 hover:bg-zinc-800 rounded-full transition-colors'
							>
								<Search className='size-4 text-zinc-400' />
							</button>
							<div className='flex items-center gap-2 text-zinc-400'>
								<Clock className='size-4' />
								<span className='text-sm'>Recents</span>
							</div>
						</>
					)}
				</div>

				{/* Library Content */}
				<div className='flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent'>
					<div className='space-y-2 pr-2'>
						{playlistsLoading ? (
							<PlaylistSkeleton />
						) : (
							<>
								{/* Liked Songs Playlist - Show if we have liked songs or if it's a playlist */}
								{hasLikedSongs && shouldShowLikedSongs && likedSongsMatchesSearch && (
									<Link
										to="/liked-songs"
										className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
									>
										<div className='size-12 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0'>
											<Heart className='size-6 text-white fill-white' />
										</div>
										<div className='flex-1 min-w-0 hidden md:block'>
											<p className='font-medium truncate'>Liked Songs</p>
											<p className='text-sm text-zinc-400 truncate'>Playlist • {likedSongsCount} songs</p>
										</div>
									</Link>
								)}

								{/* Other Playlists */}
								{filteredPlaylists.map((playlist) => (
									<Link
										to={`/playlist/${playlist._id}`}
										key={playlist._id}
										className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
									>
										{playlist.imageUrl ? (
											<img
												src={playlist.imageUrl}
												alt={playlist.name}
												className='size-12 rounded-md flex-shrink-0 object-cover'
											/>
										) : (
											<div className='size-12 rounded-md bg-zinc-700 flex items-center justify-center flex-shrink-0'>
												<Music className='size-6 text-zinc-400' />
											</div>
										)}
										<div className='flex-1 min-w-0 hidden md:block'>
											<p className='font-medium truncate'>{playlist.name}</p>
											<p className='text-sm text-zinc-400 truncate'>Playlist • {playlist.songCount} songs</p>
										</div>
									</Link>
								))}

								{/* Albums */}
								{filteredAlbums.map((album) => (
									<Link
										to={`/album/${album._id}`}
										key={album._id}
										className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
									>
										<img
											src={album.imageUrl}
											alt={album.title}
											className='size-12 rounded-md flex-shrink-0 object-cover'
										/>
										<div className='flex-1 min-w-0 hidden md:block'>
											<p className='font-medium truncate'>{album.title}</p>
											<p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
										</div>
									</Link>
								))}

								{/* No results message */}
								{searchQuery && filteredPlaylists.length === 0 && filteredAlbums.length === 0 && !hasLikedSongs && (
									<div className='text-center py-4'>
										<p className='text-zinc-400 text-sm'>No results found</p>
									</div>
								)}


							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
export default LeftSidebar;
