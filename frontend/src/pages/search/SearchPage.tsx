import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import SearchSuggestions from "@/components/SearchSuggestions";
import { useSearch } from "@/hooks/useSearch";
import { useChatStore } from "@/stores/useChatStore";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { setChatStoreUsers } from "@/lib/searchService";
import { 
	Search, 
	X, 
	Cast, 
	Play, 
	Clock, 
	Mic, 
	Heart, 
	MoreHorizontal, 
	Filter,
	TrendingUp,
	Music,
	Users,
	Disc3,
	ListMusic,
	Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

type SearchFilter = 'all' | 'songs' | 'playlists' | 'albums' | 'artists' | 'users' | 'genres';
type SortOption = 'relevance' | 'popularity' | 'newest' | 'oldest';

const SearchPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const query = searchParams.get('q') || '';
	const { users } = useChatStore();
	const { addToFavorites, removeFromFavorites, checkFavoriteStatus } = useFavoritesStore();
	const { playAlbum } = usePlayerStore();
	
	const {
		query: searchQuery,
		setQuery,
		searchResults,
		suggestions,
		isSearching,
		isLoadingSuggestions,
		activeFilter,
		setActiveFilter,
		sortBy,
		setSortBy,
		showSuggestions,
		setShowSuggestions,
		performSearch,
		performRealtimeSearch,
		handleSuggestionClick,
		clearSearch,
		clearRecentSearches
	} = useSearch();

	// Update chat store users in search service for fallback
	useEffect(() => {
		setChatStoreUsers(users);
	}, [users]);

	const searchInputRef = useRef<HTMLInputElement>(null);

	// Function to handle album play
	const handlePlayAlbum = (album: any) => {
		if (album.songs && album.songs.length > 0) {
			playAlbum(album.songs);
		}
	};

	const filters: { id: SearchFilter; label: string; icon: React.ReactNode }[] = [
		{ id: 'all', label: 'All', icon: <Search className="w-4 h-4" /> },
		{ id: 'songs', label: 'Songs', icon: <Music className="w-4 h-4" /> },
		{ id: 'playlists', label: 'Playlists', icon: <ListMusic className="w-4 h-4" /> },
		{ id: 'albums', label: 'Albums', icon: <Disc3 className="w-4 h-4" /> },
		{ id: 'artists', label: 'Artists', icon: <Users className="w-4 h-4" /> },
		{ id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
		{ id: 'genres', label: 'Genres', icon: <Sparkles className="w-4 h-4" /> }
	];

	const sortOptions: { value: SortOption; label: string }[] = [
		{ value: 'relevance', label: 'Most Relevant' },
		{ value: 'popularity', label: 'Most Popular' },
		{ value: 'newest', label: 'Newest First' },
		{ value: 'oldest', label: 'Oldest First' }
	];

	// Update search input when query changes
	useEffect(() => {
		setQuery(query);
	}, [query, setQuery]);

	// Perform search when query changes
	useEffect(() => {
		if (query) {
			performSearch(query);
		}
	}, [query, performSearch]);

	// Auto-focus search input when page loads
	useEffect(() => {
		if (searchInputRef.current) {
			setTimeout(() => {
				searchInputRef.current?.focus();
			}, 100);
		}
	}, []);

	// Handle favorite toggle
	const handleFavoriteToggle = async (song: any) => {
		try {
			const isFavorited = await checkFavoriteStatus(song._id);
			
			if (isFavorited) {
				await removeFromFavorites(song._id);
			} else {
				await addToFavorites('song', song._id, song.title, song.artist, song.imageUrl, {
					audioUrl: song.audioUrl,
					duration: song.duration,
					genre: song.genre,
					albumId: song.albumId
				});
			}
		} catch (error) {
			console.error('Error toggling favorite:', error);
		}
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);
		setShowSuggestions(value.length > 0);
		
		// Update URL and perform real-time search
		if (value.trim()) {
			setSearchParams({ q: value.trim() });
			performRealtimeSearch(value.trim());
		} else {
			setShowSuggestions(false);
			// Clear search params but stay on search page
			setSearchParams({});
		}
	};

	const handleClearSearch = () => {
		clearSearch();
		// Clear search params but stay on search page
		setSearchParams({});
	};

	const handleFilterChange = (filter: SearchFilter) => {
		setActiveFilter(filter);
		if (query) {
			performSearch(query);
		}
	};

	const handleSortChange = (sort: SortOption) => {
		setSortBy(sort);
		if (query) {
			performSearch(query);
		}
	};

	const formatDuration = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`;
		} else if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K`;
		}
		return num.toString();
	};

	// Loading skeleton components
	const SongSkeleton = () => (
		<div className="flex items-center gap-4 p-3 rounded-lg">
			<Skeleton className="w-12 h-12 rounded" />
			<div className="flex-1 space-y-2">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-3 w-1/2" />
			</div>
			<Skeleton className="h-4 w-12" />
		</div>
	);

	const ArtistSkeleton = () => (
		<div className="flex flex-col items-center gap-3 min-w-[120px]">
			<Skeleton className="w-20 h-20 rounded-full" />
			<Skeleton className="h-4 w-16" />
		</div>
	);

	const AlbumSkeleton = () => (
		<div className="space-y-3">
			<Skeleton className="w-full aspect-square rounded-md" />
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-3 w-1/2" />
		</div>
	);

	if (!query) {
		return (
			<TooltipProvider>
				<main className="rounded-md overflow-hidden h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
					{/* Search Header */}
					<div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md z-10 border-b border-zinc-800">
						<div className="p-3 sm:p-4">
							<div className="relative max-w-lg mx-auto">
								<div className="relative bg-zinc-800 rounded-full border border-zinc-700 transition-all duration-300 ease-in-out focus-within:bg-zinc-700 focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/20">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400 transition-colors duration-200" />
									<Input
										ref={searchInputRef}
										type="text"
										value={searchQuery}
										onChange={handleSearchChange}
										placeholder="Search for songs, artists, albums..."
										className="pl-10 pr-10 bg-transparent border-0 text-white placeholder:text-zinc-400 focus:ring-0 focus:border-0 transition-all duration-200"
										onFocus={() => setShowSuggestions(searchQuery.length > 0)}
									/>
									{searchQuery && (
										<button 
											onClick={handleClearSearch}
											className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-zinc-600 rounded-full transition-all duration-200 hover:scale-110"
										>
											<X className="w-3 h-3 text-zinc-400 hover:text-white transition-colors duration-200" />
										</button>
									)}
								</div>
							</div>

							{/* Search Suggestions */}
							{showSuggestions && (
								<div className="mt-4 max-w-lg mx-auto">
									<SearchSuggestions
										suggestions={suggestions}
										isLoading={isLoadingSuggestions}
										onSuggestionClick={handleSuggestionClick}
										onClearRecent={clearRecentSearches}
										showClearButton={true}
									/>
								</div>
							)}
						</div>
					</div>

					{/* Empty State */}
					<div className="flex items-center justify-center h-full px-4">
						<div className="text-center">
							<Search className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-400 mx-auto mb-4" />
							<h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Search for music</h2>
							<p className="text-zinc-400 mb-6 text-sm sm:text-base">Find your favorite songs, artists, and albums</p>
							
							{/* Quick Search Categories */}
							<div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-md mx-auto">
								{['Pop', 'Rock', 'Hip-Hop', 'Electronic'].map((category) => (
									<Button
										key={category}
										variant="outline"
										onClick={() => handleSuggestionClick({ id: category, text: category, type: 'suggestion' })}
										className="bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-700 text-sm"
									>
										{category}
									</Button>
								))}
							</div>
						</div>
					</div>
				</main>
			</TooltipProvider>
		);
	}

	return (
		<TooltipProvider>
			<main className="rounded-md overflow-hidden h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
				{/* Search Header */}
				<div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md z-10 border-b border-zinc-800">
					{/* Search Bar */}
					<div className="p-3 sm:p-4">
						<div className="relative max-w-lg mx-auto">
							<div className="relative bg-zinc-800 rounded-full border border-zinc-700 transition-all duration-300 ease-in-out focus-within:bg-zinc-700 focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/20">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400 transition-colors duration-200" />
								<Input
									ref={searchInputRef}
									type="text"
									value={searchQuery}
									onChange={handleSearchChange}
									placeholder="Search for songs, artists, albums..."
									className="pl-10 pr-10 bg-transparent border-0 text-white placeholder:text-zinc-400 focus:ring-0 focus:border-0 transition-all duration-200"
									onFocus={() => setShowSuggestions(searchQuery.length > 0)}
								/>
								{searchQuery && (
									<button 
										onClick={handleClearSearch}
										className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-zinc-600 rounded-full transition-all duration-200 hover:scale-110"
									>
										<X className="w-3 h-3 text-zinc-400 hover:text-white transition-colors duration-200" />
									</button>
								)}
							</div>
						</div>

						{/* Search Suggestions */}
						{showSuggestions && (
							<div className="mt-4 max-w-lg mx-auto">
								<SearchSuggestions
									suggestions={suggestions}
									isLoading={isLoadingSuggestions}
									onSuggestionClick={handleSuggestionClick}
									onClearRecent={clearRecentSearches}
									showClearButton={true}
								/>
							</div>
						)}
					</div>

					{/* Filter and Sort Controls */}
					<div className="px-3 sm:px-4 pb-4 space-y-3">
						{/* Filter Buttons */}
						<div className="flex gap-2 overflow-x-auto scrollbar-hide">
							{filters.map((filter) => (
								<Tooltip key={filter.id}>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											onClick={() => handleFilterChange(filter.id)}
											className={cn(
												"px-3 sm:px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 text-sm",
												activeFilter === filter.id
													? "bg-white text-black hover:bg-gray-100"
													: "bg-zinc-800 text-white hover:bg-zinc-700"
											)}
										>
											{filter.icon}
											<span className="hidden sm:inline">{filter.label}</span>
											<span className="sm:hidden">{filter.label.split(' ')[0]}</span>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Filter by {filter.label.toLowerCase()}</p>
									</TooltipContent>
								</Tooltip>
							))}
						</div>

						{/* Sort Options */}
						<div className="flex items-center gap-2">
							<Filter className="w-4 h-4 text-zinc-400" />
							<select
								value={sortBy}
								onChange={(e) => handleSortChange(e.target.value as SortOption)}
								className="bg-zinc-800 border-zinc-700 text-white text-sm rounded-md px-3 py-1 focus:outline-none focus:border-white"
							>
								{sortOptions.map((option) => (
									<option key={option.value} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>

				{/* Search Results */}
				<ScrollArea className="h-[calc(100vh-220px)]">
					<div className="p-3 sm:p-4 md:p-6 space-y-6 sm:space-y-8">
						{/* Loading State */}
						{isSearching && (
							<div className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-bold text-white">Searching...</h2>
								<div className="space-y-2">
									{[1, 2, 3].map((i) => (
										<SongSkeleton key={i} />
									))}
								</div>
							</div>
						)}

						{/* Top Result */}
						{!isSearching && activeFilter === 'all' && searchResults.songs.length > 0 && (
							<div className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-bold text-white">Top result</h2>
								<Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-colors cursor-pointer max-w-md">
									<CardContent className="p-4 sm:p-6">
										<div className="relative mb-4">
											<img
												src={searchResults.songs[0]?.imageUrl || '/cover-images/1.jpg'}
												alt="Top result"
												className="w-full aspect-square rounded-lg object-cover"
											/>
											<Tooltip>
												<TooltipTrigger asChild>
													<button className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-400 p-2 sm:p-3 rounded-full transition-colors">
														<Play className="w-4 h-4 sm:w-5 sm:h-5 text-black fill-black" />
													</button>
												</TooltipTrigger>
												<TooltipContent>
													<p>Play song</p>
												</TooltipContent>
											</Tooltip>
										</div>
										<h3 className="text-lg sm:text-xl font-bold text-white mb-1">
											{searchResults.songs[0]?.title || 'Kotha Koiyo Na'}
										</h3>
										<p className="text-zinc-400 text-sm">
											Song • {searchResults.songs[0]?.artist || 'Popular Artists'}
										</p>
									</CardContent>
								</Card>
							</div>
						)}

						{/* Songs Section */}
						{!isSearching && (activeFilter === 'all' || activeFilter === 'songs') && searchResults.songs.length > 0 && (
							<div className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-bold text-white">Songs</h2>
								<div className="space-y-2">
									{searchResults.songs.map((song: any, index: number) => (
										<div
											key={song._id || index}
											className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg hover:bg-zinc-800/50 cursor-pointer group"
											onClick={() => {
												if (song.albumId) {
													navigate(`/album/${song.albumId}`);
												}
											}}
										>
											<img
												src={song.imageUrl || '/cover-images/1.jpg'}
												alt={song.title}
												className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover"
											/>
											<div className="flex-1 min-w-0">
												<h3 className="font-medium text-white truncate text-sm sm:text-base">{song.title}</h3>
												<p className="text-sm text-zinc-400 truncate">{song.artist}</p>
											</div>
											<div className="flex items-center gap-2 sm:gap-3">
												<Tooltip>
													<TooltipTrigger asChild>
														<button 
															className="p-1 sm:p-2 hover:bg-zinc-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
															onClick={(e) => {
																e.stopPropagation();
																handleFavoriteToggle(song);
															}}
														>
															<Heart className="w-4 h-4 text-white" />
														</button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Add to favorites</p>
													</TooltipContent>
												</Tooltip>
												<Tooltip>
													<TooltipTrigger asChild>
														<button 
															className="p-1 sm:p-2 hover:bg-zinc-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
															onClick={(e) => {
																e.stopPropagation();
																// Add play functionality here
															}}
														>
															<Play className="w-4 h-4 text-white" />
														</button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Play song</p>
													</TooltipContent>
												</Tooltip>
												<Tooltip>
													<TooltipTrigger asChild>
														<button 
															className="p-1 sm:p-2 hover:bg-zinc-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
															onClick={(e) => {
																e.stopPropagation();
																// Add more options functionality here
															}}
														>
															<MoreHorizontal className="w-4 h-4 text-white" />
														</button>
													</TooltipTrigger>
													<TooltipContent>
														<p>More options</p>
													</TooltipContent>
												</Tooltip>
												<span className="text-sm text-zinc-400">
													{formatDuration(song.duration || 346)}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Artists Section */}
						{!isSearching && (activeFilter === 'all' || activeFilter === 'artists') && searchResults.artists.length > 0 && (
							<div className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-bold text-white">Artists</h2>
								<div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
									{searchResults.artists.map((artist: any) => (
										<Card key={artist._id} className="bg-zinc-800/40 border-zinc-700 hover:bg-zinc-700/40 transition-all cursor-pointer min-w-[120px] sm:min-w-[140px]">
											<CardContent className="p-3 sm:p-4 text-center">
												<div className="relative mb-3">
													<Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-zinc-700 hover:border-white transition-colors mx-auto">
														<AvatarImage src={artist.imageUrl} alt={artist.name} />
														<AvatarFallback className="bg-zinc-800 text-white text-lg font-semibold">
															{artist.name[0]}
														</AvatarFallback>
													</Avatar>
													{artist.isVerified && (
														<div className="absolute -bottom-1 -right-1">
															<VerifiedBadge size="sm" />
														</div>
													)}
												</div>
												<h3 className="font-medium text-sm mb-1">{artist.name}</h3>
												<p className="text-xs text-zinc-400 mb-2">{artist.genre}</p>
												<Badge variant="secondary" className="text-xs">
													{formatNumber(artist.followers)} followers
												</Badge>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						)}

						{/* Users Section */}
						{!isSearching && (activeFilter === 'all' || activeFilter === 'users') && searchResults.users.length > 0 && (
							<div className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-bold text-white">Users</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
									{searchResults.users.map((user: any) => (
										<Card 
											key={user._id} 
											className="bg-zinc-800/40 border-zinc-700 hover:bg-zinc-700/40 transition-all cursor-pointer"
											onClick={() => {
												console.log("🔍 Clicking on user:", user);
												console.log("🔗 Navigating to:", `/profile/${user.clerkId}`);
												navigate(`/profile/${user.clerkId}`);
											}}
										>
											<CardContent className="p-3 sm:p-4">
												<div className="flex items-center gap-3">
													<div className="relative">
														<Avatar className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-zinc-700 hover:border-white transition-colors">
															<AvatarImage src={user.imageUrl} alt={user.fullName} />
															<AvatarFallback className="bg-zinc-800 text-white font-semibold">
																{user.fullName[0]}
															</AvatarFallback>
														</Avatar>
														{user.isVerified && (
															<div className="absolute -top-1 -right-1">
																<VerifiedBadge size="sm" />
															</div>
														)}
													</div>
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-1 mb-1">
															<h3 className="font-medium text-sm text-white truncate">
																{user.fullName}
															</h3>
															{user.isVerified && (
																<VerifiedBadge size="sm" />
															)}
														</div>
														{user.handle && (
															<p className="text-xs text-zinc-400 truncate">
																@{user.handle}
															</p>
														)}
														{user.isArtist && user.artistName && (
															<p className="text-xs text-emerald-400 truncate">
																{user.artistName}
															</p>
														)}
														{user.followers !== undefined && (
															<p className="text-xs text-zinc-500">
																{formatNumber(user.followers)} followers
															</p>
														)}
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						)}

						{/* Albums Section */}
						{!isSearching && (activeFilter === 'all' || activeFilter === 'albums') && searchResults.albums.length > 0 && (
							<div className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-bold text-white">Albums</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
									{searchResults.albums.map((album: any) => (
										<Card key={album._id} className="bg-zinc-800/40 border-zinc-700 hover:bg-zinc-700/40 transition-all group cursor-pointer">
											<CardContent className="p-2 sm:p-3">
												<div className="relative mb-3">
													<div className="aspect-square rounded-md shadow-lg overflow-hidden">
														<img
															src={album.imageUrl}
															alt={album.title}
															className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
														/>
													</div>
													<Tooltip>
														<TooltipTrigger asChild>
															<button className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-400 p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
																<Play className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-black" />
															</button>
														</TooltipTrigger>
														<TooltipContent>
															<p>Play album</p>
														</TooltipContent>
													</Tooltip>
												</div>
												<h3 className="font-medium mb-1 truncate text-sm">{album.title}</h3>
												<p className="text-xs text-zinc-400 truncate">{album.artist}</p>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						)}

						{/* Playlists Section */}
						{!isSearching && (activeFilter === 'all' || activeFilter === 'playlists') && searchResults.playlists.length > 0 && (
							<div className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-bold text-white">Playlists</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
									{searchResults.playlists.map((playlist: any) => (
										<Card key={playlist._id} className="bg-zinc-800/40 border-zinc-700 hover:bg-zinc-700/40 transition-all group cursor-pointer">
											<CardContent className="p-2 sm:p-3">
												<div className="relative mb-3">
													<div className="aspect-square rounded-md shadow-lg overflow-hidden">
														<img
															src={playlist.imageUrl}
															alt={playlist.name}
															className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
														/>
													</div>
													<Tooltip>
														<TooltipTrigger asChild>
															<button className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-400 p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
																<Play className="w-3 h-3 sm:w-4 sm:h-4 text-black fill-black" />
															</button>
														</TooltipTrigger>
														<TooltipContent>
															<p>Play playlist</p>
														</TooltipContent>
													</Tooltip>
												</div>
												<h3 className="font-medium mb-1 truncate text-sm">{playlist.name}</h3>
												<p className="text-xs text-zinc-400 truncate">
													Playlist • {playlist.creator} • {playlist.songCount} songs
												</p>
												<Badge variant="outline" className="text-xs mt-1">
													{formatNumber(playlist.followers)} followers
												</Badge>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						)}

						{/* Genres & Moods Section */}
						{!isSearching && (activeFilter === 'all' || activeFilter === 'genres') && searchResults.genres.length > 0 && (
							<div className="space-y-4">
								<h2 className="text-xl sm:text-2xl font-bold text-white">Genres & Moods</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
									{searchResults.genres.map((genre) => (
										<Card 
											key={genre.name} 
											className={cn(
												"bg-gradient-to-br cursor-pointer hover:scale-105 transition-transform",
												genre.color
											)}
										>
											<CardContent className="p-4 sm:p-6">
												<h3 className="text-base sm:text-lg font-bold text-white">{genre.name}</h3>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						)}

						{/* No Results */}
						{!isSearching && Object.values(searchResults).every((arr: any[]) => arr.length === 0) && (
							<div className="text-center py-8 sm:py-12 px-4">
								<Search className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-400 mx-auto mb-4" />
								<h3 className="text-lg sm:text-xl font-bold text-white mb-2">No results found for "{query}"</h3>
								<p className="text-zinc-400 mb-6 text-sm sm:text-base">Try searching for something else</p>
								
								{/* Suggested Searches */}
								<div className="max-w-md mx-auto">
									<h4 className="text-sm font-medium text-zinc-300 mb-3">Try these searches:</h4>
									<div className="flex flex-wrap gap-2 justify-center">
										{suggestions.slice(0, 4).map((suggestion) => (
											<Button
												key={suggestion.id}
												variant="outline"
												size="sm"
												onClick={() => handleSuggestionClick(suggestion)}
												className="bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-700 text-xs sm:text-sm"
											>
												{suggestion.text}
											</Button>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
				</ScrollArea>
			</main>
		</TooltipProvider>
	);
};

export default SearchPage;
