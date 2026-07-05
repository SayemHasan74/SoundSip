import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Bell, Users, Settings, Search, X, TrendingUp, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMusicStore } from "@/stores/useMusicStore";

import { useProfileStore } from "@/stores/useProfileStore";
import MobileNav from "./MobileNav";
import { useState, useEffect, useMemo } from "react";
import { axiosInstance } from "@/lib/axios";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface SearchSuggestion {
	id: string;
	text: string;
	type: 'recent' | 'trending' | 'suggestion';
}

const Topbar = () => {
	const { isAdmin } = useAuthStore();
	const { searchSongs, albums } = useMusicStore();

	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const [showMobileSearch, setShowMobileSearch] = useState(false);
	const [searchResults, setSearchResults] = useState<{
		songs: any[];
		artists: any[];
		albums: any[];
		playlists: any[];
	}>({
		songs: [],
		artists: [],
		albums: [],
		playlists: []
	});
	console.log({ isAdmin });

	// Search suggestions - empty for now, will be populated from API
	const searchSuggestions: SearchSuggestion[] = useMemo(() => [], []);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchInput(value);
		setShowSuggestions(value.length > 0);
		
		// Perform search as you type
		if (value.trim()) {
			performSearch(value.trim());
		} else {
			setShowSuggestions(false);
					setSearchResults({
			songs: [],
			artists: [],
			albums: [],
			playlists: []
		});
		}
	};

	const handleClearSearch = () => {
		setSearchInput('');
		setShowSuggestions(false);
		setSearchResults({
			songs: [],
			artists: [],
			albums: [],
			playlists: []
		});
	};

	const handleSuggestionClick = (suggestion: SearchSuggestion) => {
		setSearchInput(suggestion.text);
		performSearch(suggestion.text);
		setShowSuggestions(false);
	};



	const performSearch = async (searchQuery: string) => {
		setIsSearching(true);
		try {
			// Search for songs
			const songResults = await searchSongs(searchQuery);
			
			// Search for artists using API
			let artistResults: any[] = [];
			try {
				const artistResponse = await axiosInstance.get(`/artists/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
				artistResults = artistResponse.data?.artists || [];
			} catch (error) {
				console.error('Error searching artists:', error);
			}

			// Search for albums using client-side filtering
			const albumResults = albums.filter(album => 
				album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				album.artist.toLowerCase().includes(searchQuery.toLowerCase())
			);

			// Search for playlists using API
			let playlistResults: any[] = [];
			try {
				const playlistResponse = await axiosInstance.get(`/playlists/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
				playlistResults = playlistResponse.data?.playlists || [];
			} catch (error) {
				console.error('Error searching playlists:', error);
			}

			setSearchResults({
				songs: songResults || [],
				artists: artistResults,
				albums: albumResults,
				playlists: playlistResults
			});
		} catch (error) {
			console.error('Search error:', error);
		} finally {
			setIsSearching(false);
		}
	};

	const handleMobileSearchSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchInput.trim()) {
			navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
			setShowMobileSearch(false);
			setSearchInput('');
		}
	};

	return (
		<>
			<div
				className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10 border-b border-zinc-800'
			>
			{/* Left side */}
			<div className='flex items-center gap-4 flex-1'>
				<div className='flex gap-2 items-center'>
					<MobileNav />
				</div>
				
				{/* Mobile Search Button */}
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setShowMobileSearch(true)}
					className="md:hidden"
				>
					<Search className="h-5 w-5" />
				</Button>
				
				{/* Desktop Search Bar */}
				<div className='hidden md:flex relative flex-1 max-w-sm'>
					<div className='flex items-center bg-zinc-800 rounded-full px-3 py-1.5 w-full transition-all duration-300 ease-in-out hover:bg-zinc-700 focus-within:bg-zinc-700 focus-within:ring-2 focus-within:ring-white/20'>
						<Search className='size-4 text-zinc-400 mr-2 transition-colors duration-200' />
						<Input
							type="text"
							value={searchInput}
							onChange={handleSearchChange}
							placeholder="Search for songs, artists, albums, playlists..."
							className='bg-transparent border-0 text-white placeholder:text-zinc-400 focus:ring-0 focus:border-0 flex-1 text-sm transition-all duration-200'
						/>
						{searchInput && (
							<button 
								onClick={handleClearSearch}
								className='p-1 hover:bg-zinc-600 rounded-full transition-all duration-200 hover:scale-110'
							>
								<X className='w-3 h-3 text-zinc-400 hover:text-white transition-colors duration-200' />
							</button>
						)}
					</div>

					{/* Search Suggestions */}
					{showSuggestions && (
						<div className="absolute top-full left-0 right-0 mt-2 z-50">
							<Card className="bg-zinc-800/95 border-zinc-700 backdrop-blur-md">
								<CardHeader className="pb-3">
									<CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
										<TrendingUp className="w-4 h-4" />
										Trending Searches
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									{searchSuggestions.map((suggestion) => (
										<button
											key={suggestion.id}
											onClick={() => handleSuggestionClick(suggestion)}
											className="w-full text-left p-2 rounded-md hover:bg-zinc-700/50 transition-colors flex items-center gap-2"
										>
											<Search className="w-3 h-3 text-zinc-400" />
											<span className="text-white">{suggestion.text}</span>
											{suggestion.type === 'trending' && (
												<Badge variant="secondary" className="ml-auto text-xs">
													Trending
												</Badge>
											)}
										</button>
									))}
								</CardContent>
							</Card>
						</div>
					)}

					{/* Search Results Dropdown */}
					{searchInput && (searchResults.songs.length > 0 || searchResults.artists.length > 0 || searchResults.albums.length > 0 || searchResults.playlists.length > 0) && (
						<div className="absolute top-full left-0 right-0 mt-2 z-50">
							<Card className="bg-zinc-800/95 border-zinc-700 backdrop-blur-md max-h-96 overflow-y-auto">
								<CardContent className="p-4">
									{/* Loading State */}
									{isSearching && (
										<div className="text-center py-4">
											<div className="text-white text-sm">Searching...</div>
										</div>
									)}

									{/* Search Results */}
									{!isSearching && (
										<div className="space-y-4">
											{/* Songs */}
											{searchResults.songs.length > 0 && (
												<div className="space-y-2">
													<h3 className="text-sm font-semibold text-zinc-300">Songs</h3>
													<div className="space-y-2">
														{searchResults.songs.slice(0, 3).map((song) => (
															<div 
																key={song._id} 
																className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-700/50 transition-colors cursor-pointer"
																onClick={() => {
																	if (song.albumId) {
																		navigate(`/album/${song.albumId}`);
																	}
																}}
															>
																<img src={song.imageUrl} alt={song.title} className="w-10 h-10 rounded object-cover" />
																<div className="flex-1 min-w-0">
																	<h4 className="text-white font-medium text-sm truncate">{song.title}</h4>
																	<p className="text-zinc-400 text-xs truncate">{song.artist}</p>
																</div>
															</div>
														))}
													</div>
												</div>
											)}

											{/* Artists */}
											{searchResults.artists.length > 0 && (
												<div className="space-y-2">
													<h3 className="text-sm font-semibold text-zinc-300">Artists</h3>
													<div className="space-y-2">
														{searchResults.artists.slice(0, 3).map((artist) => (
															<div key={artist._id} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-700/50 transition-colors cursor-pointer">
																<img src={artist.imageUrl} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
																<div className="flex-1 min-w-0">
																	<h4 className="text-white font-medium text-sm truncate">{artist.name}</h4>
																	<p className="text-zinc-400 text-xs truncate">{artist.genre}</p>
																</div>
															</div>
														))}
													</div>
												</div>
											)}

											{/* Albums */}
											{searchResults.albums.length > 0 && (
												<div className="space-y-2">
													<h3 className="text-sm font-semibold text-zinc-300">Albums</h3>
													<div className="space-y-2">
														{searchResults.albums.slice(0, 3).map((album) => (
															<div 
																key={album._id} 
																className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-700/50 transition-colors cursor-pointer"
																onClick={() => navigate(`/album/${album._id}`)}
															>
																<img src={album.imageUrl} alt={album.title} className="w-10 h-10 rounded object-cover" />
																<div className="flex-1 min-w-0">
																	<h4 className="text-white font-medium text-sm truncate">{album.title}</h4>
																	<p className="text-zinc-400 text-xs truncate">{album.artist}</p>
																</div>
															</div>
														))}
													</div>
												</div>
											)}

											{/* Playlists */}
											{searchResults.playlists.length > 0 && (
												<div className="space-y-2">
													<h3 className="text-sm font-semibold text-zinc-300">Playlists</h3>
													<div className="space-y-2">
														{searchResults.playlists.slice(0, 3).map((playlist) => (
															<div key={playlist._id} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-700/50 transition-colors cursor-pointer">
																<img src={playlist.imageUrl} alt={playlist.name} className="w-10 h-10 rounded object-cover" />
																<div className="flex-1 min-w-0">
																	<h4 className="text-white font-medium text-sm truncate">{playlist.name}</h4>
																	<p className="text-zinc-400 text-xs truncate">{playlist.creator}</p>
																</div>
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					)}
				</div>
			</div>

			{/* Right side - Buttons and User */}
			<div className='flex items-center gap-2 sm:gap-4'>
				{/* Notification, Friends, and Settings buttons - HIDDEN FOR NOW */}
				{/* <button className='p-2 hover:bg-zinc-800 rounded-full transition-colors'>
					<Bell className='size-5 text-zinc-300' />
				</button>
				<button className='p-2 hover:bg-zinc-700 rounded-full transition-colors'>
					<Users className='size-5 text-zinc-300' />
				</button>
				
				<Link to="/settings" className='p-2 hover:bg-zinc-800 rounded-full transition-colors'>
					<Settings className='size-5 text-zinc-300' />
				</Link> */}

				{isAdmin && (
					<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }), "hidden sm:flex")}>
						<LayoutDashboardIcon className='size-4 mr-2' />
						<span className="hidden lg:inline">Admin Dashboard</span>
						<span className="lg:hidden">Admin</span>
					</Link>
				)}

				<SignedOut>
					<SignInOAuthButtons />
				</SignedOut>

				<UserButton />
			</div>
		</div>

		{/* Mobile Search Sheet */}
		<Sheet open={showMobileSearch} onOpenChange={setShowMobileSearch}>
			<SheetContent side="top" className="h-auto bg-zinc-900 border-zinc-800">
				<div className="p-4">
					<form onSubmit={handleMobileSearchSubmit} className="space-y-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
							<Input
								type="text"
								value={searchInput}
								onChange={handleSearchChange}
								placeholder="Search for songs, artists, albums, playlists..."
								className="pl-10 pr-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-white/20"
								autoFocus
							/>
							{searchInput && (
								<button 
									type="button"
									onClick={handleClearSearch}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-zinc-600 rounded-full"
								>
									<X className="w-3 h-3 text-zinc-400 hover:text-white" />
								</button>
							)}
						</div>
						<Button type="submit" className="w-full" disabled={!searchInput.trim()}>
							Search
						</Button>
					</form>
				</div>
			</SheetContent>
		</Sheet>
		</>
	);
};
export default Topbar;
