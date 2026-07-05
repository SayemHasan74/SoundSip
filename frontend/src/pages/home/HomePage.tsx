import Topbar from "@/components/Topbar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import PopularArtists from "./components/PopularArtists";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { usePlaylistStore } from "@/stores/usePlaylistStore";
import { useArtistStore } from "@/stores/useArtistStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link } from "react-router-dom";
import { 
	Music, 
	Play, 
	Heart, 
	Clock, 
	Users, 
	Headphones, 
	Radio,
	Shuffle,
	Mic,
	ArrowRight,
	Calendar,
	Award,
	Disc3
} from "lucide-react";

const HomePage = () => {
	const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		fetchAlbums,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
		albums,
	} = useMusicStore();

	const { 
		playlists, 
		getPlaylists, 
		isLoading: playlistsLoading 
	} = usePlaylistStore();

	const { 
		artists, 
		getAllArtists, 
		isLoading: artistsLoading 
	} = useArtistStore();

	const { initializeQueue, playAlbum } = usePlayerStore();
	const [activeFilter, setActiveFilter] = useState('all');

	// Artists data from API

	// Empty featured playlists - will be populated from API
	const featuredPlaylists: any[] = [];

	// Empty recently played - will be populated from API
	const recentlyPlayed: any[] = [];

	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
		fetchAlbums();
		getPlaylists();
		getAllArtists();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, fetchAlbums, getPlaylists, getAllArtists]);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

	const filters = [
		{ id: 'all', label: 'All', icon: Music },
		{ id: 'music', label: 'Music', icon: Headphones },
		{ id: 'albums', label: 'Albums', icon: Disc3 },
		{ id: 'playlists', label: 'Playlists', icon: Radio },
		{ id: 'artists', label: 'Artists', icon: Mic },
		{ id: 'live', label: 'Live', icon: Users }
	];

	// Function to handle album play
	const handlePlayAlbum = (album: any) => {
		if (album.songs && album.songs.length > 0) {
			playAlbum(album.songs);
		}
	};

	// Function to render content based on active filter
	const renderContent = () => {
		switch (activeFilter) {
			case 'all':
				return (
					<div className='space-y-8'>
						{/* Featured Playlists Carousel - Only show if there are playlists */}
						{featuredPlaylists.length > 0 && (
							<div className='mb-8'>
								<div className='flex items-center justify-between mb-6'>
									<h2 className='text-xl md:text-2xl font-bold text-white'>Featured Playlists</h2>
									<Button variant='link' className='text-emerald-400 hover:text-emerald-300'>
										View all <ArrowRight className="ml-1 w-4 h-4" />
									</Button>
								</div>
								
								<Carousel
									opts={{
										align: "start",
										loop: true,
									}}
									className="w-full"
								>
									<CarouselContent className="-ml-2 md:-ml-4">
										{featuredPlaylists.map((playlist) => {
											const Icon = playlist.icon;
											return (
												<CarouselItem key={playlist.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
													<HoverCard>
														<HoverCardTrigger asChild>
															<Card className={`bg-gradient-to-br ${playlist.gradient} border-0 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
																<CardContent className="p-6">
																	<div className='flex items-center gap-3 mb-3'>
																		<Icon className='size-5 text-white/80' />
																		<Badge variant="secondary" className="bg-white/20 text-white border-0">
																			{playlist.type}
																		</Badge>
																	</div>
																	<h3 className='text-xl font-bold text-white mb-2'>{playlist.title}</h3>
																	<p className='text-white/80 text-sm mb-4'>{playlist.description}</p>
																	<div className='flex items-center justify-between'>
																		<span className='text-white/60 text-sm'>{playlist.songs} songs</span>
																		<Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
																			<Play className="w-4 h-4" />
																		</Button>
																	</div>
																</CardContent>
															</Card>
														</HoverCardTrigger>
														<HoverCardContent className="w-80 bg-zinc-800 border-zinc-700">
															<div className="space-y-3">
																<div className="flex items-center space-x-3">
																	<div className={`w-12 h-12 bg-gradient-to-br ${playlist.gradient} rounded-lg flex items-center justify-center`}>
																		<Icon className="w-6 h-6 text-white" />
																	</div>
																	<div>
																		<h4 className="text-sm font-semibold text-white">{playlist.title}</h4>
																		<p className="text-xs text-zinc-400">{playlist.description}</p>
																	</div>
																</div>
																<div className="flex items-center justify-between pt-2">
																	<Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
																		<Play className="w-4 h-4 mr-2" />
																		Play Now
																	</Button>
																	<Button size="sm" variant="outline" className="border-zinc-600 text-zinc-400 hover:bg-zinc-700">
																		<Heart className="w-4 h-4" />
																	</Button>
																</div>
															</div>
														</HoverCardContent>
													</HoverCard>
												</CarouselItem>
											);
										})}
									</CarouselContent>
									<CarouselPrevious className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700" />
									<CarouselNext className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700" />
								</Carousel>
							</div>
						)}

						{/* Recently Played - Only show if there are recent tracks */}
						{recentlyPlayed.length > 0 && (
							<div className='mb-8'>
								<div className='flex items-center justify-between mb-6'>
									<h2 className='text-xl md:text-2xl font-bold text-white'>Recently Played</h2>
									<Button variant='link' className='text-emerald-400 hover:text-emerald-300'>
										View all <ArrowRight className="ml-1 w-4 h-4" />
									</Button>
								</div>
								
								<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
									{recentlyPlayed.map((track) => (
										<Card key={track.id} className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer group">
											<CardContent className="p-4">
												<div className="flex items-center space-x-3">
													<div className="relative">
														<img
															src={track.imageUrl}
															alt={track.title}
															className="w-12 h-12 rounded-lg object-cover"
														/>
														<div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
															<Play className="w-5 h-5 text-white" />
														</div>
													</div>
													<div className="flex-1 min-w-0">
														<h3 className="text-sm font-medium text-white truncate">{track.title}</h3>
														<p className="text-xs text-zinc-400 truncate">{track.artist}</p>
														<div className="flex items-center text-xs text-zinc-500 mt-1">
															<Clock className="w-3 h-3 mr-1" />
															{track.playedAt}
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						)}

						{/* Content sections */}
						<div className='space-y-8'>
							<SectionGrid title='Popular Songs and Albums' songs={featuredSongs} isLoading={isLoading} />
							<PopularArtists artists={artists} isLoading={artistsLoading} />
							<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
							<SectionGrid title='Trending Now' songs={trendingSongs} isLoading={isLoading} />
						</div>

						{/* Quick Actions */}
						<div className='mt-12 mb-8'>
							<h2 className='text-xl md:text-2xl font-bold text-white mb-6'>Quick Actions</h2>
							<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
								<Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer group">
									<CardContent className="p-6 text-center">
										<div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-500/30 transition-colors">
											<Shuffle className="w-6 h-6 text-emerald-400" />
										</div>
										<h3 className="text-sm font-medium text-white">Shuffle Play</h3>
										<p className="text-xs text-zinc-400 mt-1">Random mix</p>
									</CardContent>
								</Card>
								
								<Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer group">
									<CardContent className="p-6 text-center">
										<div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/30 transition-colors">
											<Radio className="w-6 h-6 text-blue-400" />
										</div>
										<h3 className="text-sm font-medium text-white">Radio</h3>
										<p className="text-xs text-zinc-400 mt-1">Discover new music</p>
									</CardContent>
								</Card>
								
								<Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer group">
									<CardContent className="p-6 text-center">
										<div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-500/30 transition-colors">
											<Calendar className="w-6 h-6 text-purple-400" />
										</div>
										<h3 className="text-sm font-medium text-white">Events</h3>
										<p className="text-xs text-zinc-400 mt-1">Live concerts</p>
									</CardContent>
								</Card>
								
								<Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer group">
									<CardContent className="p-6 text-center">
										<div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-pink-500/30 transition-colors">
											<Award className="w-6 h-6 text-pink-400" />
										</div>
										<h3 className="text-sm font-medium text-white">Awards</h3>
										<p className="text-xs text-zinc-400 mt-1">Music awards</p>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				);

			case 'music':
				return (
					<div className='space-y-8'>
						<SectionGrid title='Popular Songs and Albums' songs={featuredSongs} isLoading={isLoading} />
						<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='Trending Now' songs={trendingSongs} isLoading={isLoading} />
					</div>
				);

			case 'albums':
				return (
					<div className='space-y-8'>
						{isLoading ? (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
								{Array.from({ length: 8 }).map((_, i) => (
									<Card key={i} className="bg-zinc-800/50 border-zinc-700 animate-pulse">
										<CardContent className="p-4">
											<div className="w-full h-48 bg-zinc-700 rounded-lg mb-4"></div>
											<div className="space-y-2">
												<div className="h-4 bg-zinc-700 rounded w-3/4"></div>
												<div className="h-3 bg-zinc-700 rounded w-1/2"></div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						) : albums.length > 0 ? (
							<>
								<div className='flex items-center justify-between mb-6'>
									<h2 className='text-xl md:text-2xl font-bold text-white'>Featured Albums</h2>
									<Button variant='link' className='text-emerald-400 hover:text-emerald-300'>
										View all <ArrowRight className="ml-1 w-4 h-4" />
									</Button>
								</div>
								<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
									{albums.map((album) => (
										<Link key={album._id} to={`/album/${album._id}`} className="block">
											<Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer group">
												<CardContent className="p-4">
													<div className="relative mb-4">
														<img
															src={album.imageUrl}
															alt={album.title}
															className="w-full aspect-square object-cover rounded-lg"
														/>
														<div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
															<Button
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																handlePlayAlbum(album);
															}}
															size="sm"
															className="bg-emerald-600 hover:bg-emerald-700 text-white"
														>
															<Play className="w-4 h-4" />
														</Button>
														</div>
													</div>
													<div>
														<h3 className="font-medium text-white truncate mb-1">{album.title}</h3>
														<p className="text-sm text-zinc-400 truncate">{album.artist}</p>
														{album.songs && (
															<p className="text-xs text-zinc-500 mt-1">{album.songs.length} songs</p>
														)}
													</div>
												</CardContent>
											</Card>
										</Link>
									))}
								</div>
							</>
						) : (
							<div className='text-center py-12'>
								<Disc3 className='w-16 h-16 text-zinc-500 mx-auto mb-4' />
								<p className='text-zinc-500 text-lg'>No albums available</p>
								<p className='text-zinc-600 text-sm'>Check back later for featured albums</p>
							</div>
						)}
					</div>
				);

			case 'playlists':
				return (
					<div className='space-y-8'>
						{playlistsLoading ? (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
								{Array.from({ length: 8 }).map((_, i) => (
									<Card key={i} className="bg-zinc-800/50 border-zinc-700 animate-pulse">
										<CardContent className="p-4">
											<div className="w-full h-48 bg-zinc-700 rounded-lg mb-4"></div>
											<div className="space-y-2">
												<div className="h-4 bg-zinc-700 rounded w-3/4"></div>
												<div className="h-3 bg-zinc-700 rounded w-1/2"></div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						) : playlists.length > 0 ? (
							<>
								<div className='flex items-center justify-between mb-6'>
									<h2 className='text-xl md:text-2xl font-bold text-white'>Your Playlists</h2>
									<Button variant='link' className='text-emerald-400 hover:text-emerald-300'>
										View all <ArrowRight className="ml-1 w-4 h-4" />
									</Button>
								</div>
								<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
									{playlists.map((playlist) => (
										<Link key={playlist._id} to={`/playlist/${playlist._id}`}>
											<Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer group">
												<CardContent className="p-4">
												<div className='relative mb-4'>
													<div className='aspect-square rounded-lg shadow-lg overflow-hidden bg-zinc-900'>
														{playlist.imageUrl ? (
															<img
																src={playlist.imageUrl}
																alt={playlist.name}
																className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
															/>
														) : (
															<div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-blue-500'>
																<Radio className='w-12 h-12 text-white' />
															</div>
														)}
														<div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
															<Play className="w-8 h-8 text-white" />
														</div>
													</div>
												</div>
												<div className='space-y-2'>
													<h3 className='font-medium truncate text-white group-hover:text-emerald-400 transition-colors'>
														{playlist.name}
													</h3>
													<p className='text-sm text-zinc-400 truncate'>
														{playlist.description || 'No description'}
													</p>
													<div className='flex items-center text-xs text-zinc-500'>
														<Radio className='w-3 h-3 mr-1' />
														{playlist.songCount} songs
													</div>
												</div>
											</CardContent>
										</Card>
									</Link>
								))}
								</div>
							</>
						) : (
							<div className='text-center py-12'>
								<Radio className='w-16 h-16 text-zinc-500 mx-auto mb-4' />
								<p className='text-zinc-500 text-lg'>No playlists available</p>
								<p className='text-zinc-600 text-sm'>Create your first playlist to get started</p>
							</div>
						)}
					</div>
				);

			case 'artists':
				return (
					<div className='space-y-8'>
						{artistsLoading ? (
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
								{Array.from({ length: 8 }).map((_, i) => (
									<Card key={i} className="bg-zinc-800/50 border-zinc-700 animate-pulse">
										<CardContent className="p-4">
											<div className="w-full h-48 bg-zinc-700 rounded-lg mb-4"></div>
											<div className="space-y-2">
												<div className="h-4 bg-zinc-700 rounded w-3/4"></div>
												<div className="h-3 bg-zinc-700 rounded w-1/2"></div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						) : artists.length > 0 ? (
							<>
								<div className='flex items-center justify-between mb-6'>
									<h2 className='text-xl md:text-2xl font-bold text-white'>Featured Artists</h2>
									<Link to="/artists">
										<Button variant='link' className='text-emerald-400 hover:text-emerald-300'>
											View all <ArrowRight className="ml-1 w-4 h-4" />
										</Button>
									</Link>
								</div>
								<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
									{artists.slice(0, 8).map((artist) => (
										<Link key={artist._id} to={artist.clerkId ? `/profile/${artist.clerkId}` : `/artist/${artist._id}`}>
											<Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer group">
												<CardContent className="p-4">
													<div className='relative mb-4'>
																											<div className='aspect-square rounded-lg shadow-lg overflow-hidden bg-zinc-900'>
														{artist.imageUrl ? (
															<img
																src={artist.imageUrl}
																alt={artist.artistName}
																className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
																onError={(e) => {
																	// If image fails to load, hide it and show fallback
																	e.currentTarget.style.display = 'none';
																	const fallback = e.currentTarget.nextElementSibling as HTMLElement;
																	if (fallback) fallback.style.display = 'flex';
																}}
															/>
														) : null}
														<div 
															className='w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500'
															style={{ display: artist.imageUrl ? 'none' : 'flex' }}
														>
															<Mic className='w-12 h-12 text-white' />
														</div>
															<div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
																<Play className="w-8 h-8 text-white" />
															</div>
														</div>
													</div>
													<div className='space-y-2'>
														<div className="flex items-center gap-2">
															<h3 className='font-medium truncate text-white group-hover:text-emerald-400 transition-colors'>
																{artist.artistName}
															</h3>
															{artist.isVerified && (
																<Badge variant="secondary" className="bg-emerald-600 text-white text-xs">
																	Verified
																</Badge>
															)}
														</div>
														<Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
															{artist.genre}
														</Badge>
														<div className='flex items-center text-xs text-zinc-500'>
															{artist.isRegistered ? (
																<>
																	<Users className='w-3 h-3 mr-1' />
																	{artist.followers} followers
																</>
															) : (
																<>
																	<Mic className='w-3 h-3 mr-1' />
																	{artist.songCount || 0} songs
																</>
															)}
														</div>
													</div>
												</CardContent>
											</Card>
										</Link>
									))}
								</div>
							</>
						) : (
							<div className='text-center py-12'>
								<Mic className='w-16 h-16 text-zinc-500 mx-auto mb-4' />
								<p className='text-zinc-500 text-lg'>No artists available</p>
								<p className='text-zinc-600 text-sm'>Check back later for featured artists</p>
							</div>
						)}
					</div>
				);

			case 'live':
				return (
					<div className='space-y-8'>
						<div className='text-center py-12'>
							<Users className='w-16 h-16 text-zinc-500 mx-auto mb-4' />
							<p className='text-zinc-500 text-lg'>Live content coming soon</p>
							<p className='text-zinc-600 text-sm'>Stay tuned for live concerts and events</p>
						</div>
					</div>
				);

			default:
				return (
					<div className='space-y-8'>
						<SectionGrid title='Popular Songs and Albums' songs={featuredSongs} isLoading={isLoading} />
						<PopularArtists artists={artists} isLoading={artistsLoading} />
						<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='Trending Now' songs={trendingSongs} isLoading={isLoading} />
					</div>
				);
		}
	};

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900'>
			<Topbar />
			<ScrollArea className='h-[calc(100vh-180px)]'>
				<div className='p-3 sm:p-4 md:p-6 lg:p-8'>
					{/* Welcome Section */}
					<div className='mb-6 sm:mb-8'>
						<h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2'>
							Good evening, Music Lover! 🎵
						</h1>
						<p className='text-zinc-400 text-sm sm:text-base'>
							Discover new music and continue where you left off
						</p>
					</div>

					{/* Filter buttons */}
					<div className='flex gap-2 sm:gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide'>
						{filters.map((filter) => {
							const Icon = filter.icon;
							return (
								<Button
									key={filter.id}
									variant={activeFilter === filter.id ? "default" : "outline"}
									className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-full transition-all text-sm ${
										activeFilter === filter.id 
											? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
											: 'bg-zinc-800/50 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'
									}`}
									onClick={() => setActiveFilter(filter.id)}
								>
									<Icon className="w-4 h-4 mr-2" />
									<span className="hidden sm:inline">{filter.label}</span>
									<span className="sm:hidden">{filter.label.split(' ')[0]}</span>
								</Button>
							);
						})}
					</div>

					{/* Render content based on active filter */}
					{renderContent()}
				</div>
			</ScrollArea>
		</main>
	);
};

export default HomePage;
