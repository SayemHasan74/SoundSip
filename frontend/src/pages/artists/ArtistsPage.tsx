import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
	Mic, 
	Search, 
	Users, 
	Play, 
	Heart,
	Filter,
	Verified
} from 'lucide-react';
import { useArtistStore } from '@/stores/useArtistStore';
import { useFollowStore } from '@/stores/useFollowStore';

const ArtistsPage = () => {
	const navigate = useNavigate();
	const { artists, isLoading, getAllArtists, pagination } = useArtistStore();
	const { followArtist, unfollowArtist, checkFollowStatus } = useFollowStore();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedGenre, setSelectedGenre] = useState('');
	const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
	const [followStatuses, setFollowStatuses] = useState<Record<string, boolean>>({});

	const genres = ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Country', 'R&B', 'Reggae', 'Blues'];

	useEffect(() => {
		loadArtists();
	}, [selectedGenre, showVerifiedOnly]);

	useEffect(() => {
		// Check follow status for all artists
		if (artists.length > 0) {
			checkAllFollowStatuses();
		}
	}, [artists]);

	const loadArtists = async () => {
		await getAllArtists(
			selectedGenre || undefined,
			showVerifiedOnly || undefined,
			20,
			1
		);
	};

	const checkAllFollowStatuses = async () => {
		const statuses: Record<string, boolean> = {};
		for (const artist of artists) {
			try {
				statuses[artist._id] = await checkFollowStatus(artist._id);
		} catch {
			statuses[artist._id] = false;
		}
		}
		setFollowStatuses(statuses);
	};

	const handleFollow = async (artistId: string) => {
		try {
			const isFollowing = followStatuses[artistId];
			if (isFollowing) {
				await unfollowArtist(artistId);
				setFollowStatuses(prev => ({ ...prev, [artistId]: false }));
			} else {
				await followArtist(artistId);
				setFollowStatuses(prev => ({ ...prev, [artistId]: true }));
			}
		} catch (error) {
			console.error('Error toggling follow:', error);
		}
	};

	const handleArtistClick = (artist: any) => {
		// If it's a registered artist (has clerkId), go to profile page
		// Otherwise, go to artist page
		if (artist.clerkId) {
			navigate(`/profile/${artist.clerkId}`);
		} else {
			navigate(`/artist/${artist._id}`);
		}
	};

	const filteredArtists = artists.filter(artist =>
		artist.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
		artist.genre.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	};

	return (
		<div className="h-full bg-black text-white p-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold mb-2">Artists</h1>
					<p className="text-zinc-400">Discover and follow your favorite artists</p>
				</div>
				<Button 
					variant="outline" 
					className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
					onClick={() => navigate('/artist/signup')}
				>
					<Mic className="w-4 h-4 mr-2" />
					Join as Artist
				</Button>
			</div>

			{/* Search and Filters */}
			<div className="mb-8 space-y-4">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
					<Input
						placeholder="Search artists..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
					/>
				</div>

				<div className="flex flex-wrap gap-4">
					{/* Genre Filter */}
					<div className="flex items-center gap-2">
						<Filter className="w-4 h-4 text-zinc-400" />
						<select
							value={selectedGenre}
							onChange={(e) => setSelectedGenre(e.target.value)}
							className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white"
						>
							<option value="">All Genres</option>
							{genres.map(genre => (
								<option key={genre} value={genre}>{genre}</option>
							))}
						</select>
					</div>

					{/* Verified Filter */}
					<Button
						variant={showVerifiedOnly ? "default" : "outline"}
						size="sm"
						onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
						className={showVerifiedOnly ? "bg-emerald-600 hover:bg-emerald-700" : "border-zinc-600 text-zinc-300 hover:bg-zinc-800"}
					>
						<Verified className="w-4 h-4 mr-2" />
						Verified Only
					</Button>
				</div>
			</div>

			{/* Artists Grid */}
			<ScrollArea className="h-[calc(100vh-300px)]">
				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{Array.from({ length: 8 }).map((_, i) => (
							<Card key={i} className="bg-zinc-800/50 border-zinc-700 animate-pulse">
								<CardContent className="p-6">
									<div className="w-full h-48 bg-zinc-700 rounded-lg mb-4"></div>
									<div className="space-y-2">
										<div className="h-4 bg-zinc-700 rounded w-3/4"></div>
										<div className="h-3 bg-zinc-700 rounded w-1/2"></div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : filteredArtists.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredArtists.map((artist) => (
							<Card 
								key={artist._id} 
								className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer group"
								onClick={() => handleArtistClick(artist)}
							>
								<CardContent className="p-6">
									<div className="relative mb-4">
										<div className="aspect-square rounded-lg shadow-lg overflow-hidden bg-zinc-900">
											{artist.imageUrl ? (
												<img
													src={artist.imageUrl}
													alt={artist.artistName}
													className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
													onError={(e) => {
														// If image fails to load, hide it and show fallback
														e.currentTarget.style.display = 'none';
														const fallback = e.currentTarget.nextElementSibling as HTMLElement;
														if (fallback) fallback.style.display = 'flex';
													}}
												/>
											) : null}
											<div 
												className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500"
												style={{ display: artist.imageUrl ? 'none' : 'flex' }}
											>
												<Mic className="w-12 h-12 text-white" />
											</div>
											<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
												<Play className="w-8 h-8 text-white" />
											</div>
										</div>
									</div>
									
									<div className="space-y-3">
										<div className="flex items-center gap-2">
											<h3 className="font-medium truncate text-white group-hover:text-emerald-400 transition-colors">
												{artist.artistName}
											</h3>
											{artist.isVerified && (
												<Verified className="w-4 h-4 text-emerald-400" />
											)}
										</div>
										
										<Badge variant="secondary" className="bg-zinc-700 text-zinc-300">
											{artist.genre}
										</Badge>
										
										<div className="flex items-center justify-between text-sm text-zinc-400">
											{artist.isRegistered ? (
												<>
													<div className="flex items-center gap-1">
														<Users className="w-3 h-3" />
														{formatNumber(artist.followers)} followers
													</div>
													<div className="flex items-center gap-1">
														<Play className="w-3 h-3" />
														{formatNumber(artist.totalPlays)} plays
													</div>
												</>
											) : (
												<>
													<div className="flex items-center gap-1">
														<Mic className="w-3 h-3" />
														{artist.songCount || 0} songs
													</div>
													<div className="flex items-center gap-1">
														<Play className="w-3 h-3" />
														{artist.albumCount || 0} albums
													</div>
												</>
											)}
										</div>
										
										{artist.bio && (
											<p className="text-xs text-zinc-500 line-clamp-2">
												{artist.bio}
											</p>
										)}
										
										{artist.isRegistered ? (
											<Button
												size="sm"
												variant={followStatuses[artist._id] ? "default" : "outline"}
												className={`w-full ${
													followStatuses[artist._id] 
														? "bg-emerald-600 hover:bg-emerald-700" 
														: "border-zinc-600 text-zinc-300 hover:bg-zinc-700"
												}`}
												onClick={(e) => {
													e.stopPropagation();
													handleFollow(artist._id);
												}}
											>
												<Heart className={`w-4 h-4 mr-2 ${followStatuses[artist._id] ? 'fill-current' : ''}`} />
												{followStatuses[artist._id] ? 'Following' : 'Follow'}
											</Button>
										) : (
											<Button
												size="sm"
												variant="outline"
												className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700"
												onClick={(e) => {
													e.stopPropagation();
													// Could show a message about joining as artist
												}}
											>
												<Mic className="w-4 h-4 mr-2" />
												View Profile
											</Button>
										)}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<Mic className="w-16 h-16 text-zinc-500 mx-auto mb-4" />
						<p className="text-zinc-500 text-lg">No artists found</p>
						<p className="text-zinc-600 text-sm">
							{searchQuery ? 'Try adjusting your search terms' : 'Check back later for new artists'}
						</p>
					</div>
				)}
			</ScrollArea>

			{/* Pagination */}
			{pagination && pagination.totalPages > 1 && (
				<div className="flex items-center justify-center gap-4 mt-8">
					<Button
						variant="outline"
						disabled={!pagination.hasPrev}
						onClick={() => getAllArtists(selectedGenre, showVerifiedOnly, 20, pagination.currentPage - 1)}
						className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
					>
						Previous
					</Button>
					
					<span className="text-zinc-400">
						Page {pagination.currentPage} of {pagination.totalPages}
					</span>
					
					<Button
						variant="outline"
						disabled={!pagination.hasNext}
						onClick={() => getAllArtists(selectedGenre, showVerifiedOnly, 20, pagination.currentPage + 1)}
						className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
};

export default ArtistsPage;
