import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import PlayButton from "./PlayButton";
import { useFavoritesStore } from "@/stores/useFavoritesStore";
import { Play, Heart, Clock, ArrowRight, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddToPlaylistModal from "@/components/playlist/AddToPlaylistModal";

type SectionGridProps = {
	title: string;
	songs: Song[];
	isLoading: boolean;
};

const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
	const navigate = useNavigate();
	const { addToFavorites, removeFromFavorites, checkFavoriteStatus } = useFavoritesStore();
	const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
	const [selectedSong, setSelectedSong] = useState<Song | null>(null);
	
	if (isLoading) return <SectionGridSkeleton />;

	const handleSongClick = (song: Song) => {
		if (song.albumId) {
			navigate(`/album/${song.albumId}`);
		}
	};

	const handleFavoriteToggle = async (song: Song) => {
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

	const handleAddToPlaylist = (song: Song) => {
		setSelectedSong(song);
		setShowAddToPlaylistModal(true);
	};

	return (
		<div className='mb-6 md:mb-8'>
			<div className='flex items-center justify-between mb-3 md:mb-4'>
				<h2 className='text-lg sm:text-xl md:text-2xl font-bold text-white'>{title}</h2>
				<Button variant='link' className='text-emerald-400 hover:text-emerald-300'>
					Show all <ArrowRight className="ml-1 w-4 h-4" />
				</Button>
			</div>

			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4'>
				{songs.map((song) => (
					<HoverCard key={song._id}>
						<HoverCardTrigger asChild>
							<Card 
								className='bg-zinc-800/40 border-zinc-700 hover:bg-zinc-700/40 transition-all duration-300 group cursor-pointer hover:scale-105'
								onClick={() => handleSongClick(song)}
							>
								<CardContent className="p-3 md:p-4">
									<div className='relative mb-3 md:mb-4'>
										<div className='aspect-square rounded-md shadow-lg overflow-hidden bg-zinc-900'>
											<img
												src={song.imageUrl}
												alt={song.title}
												className='w-full h-full object-cover transition-transform duration-300 
												group-hover:scale-110'
											/>
											<div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
												<Play className="w-8 h-8 text-white" />
											</div>
										</div>
										<PlayButton song={song} />
									</div>
									<div className='space-y-1'>
										<h3 className='font-medium truncate text-sm md:text-base text-white group-hover:text-emerald-400 transition-colors'>
											{song.title}
										</h3>
										<p className='text-xs md:text-sm text-zinc-400 truncate'>{song.artist}</p>
										{song.duration && (
											<div className='flex items-center text-xs text-zinc-500'>
												<Clock className='w-3 h-3 mr-1' />
												{song.duration}
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</HoverCardTrigger>
						<HoverCardContent className="w-80 bg-zinc-800 border-zinc-700">
							<div className="flex justify-between space-x-4">
								<img
									src={song.imageUrl}
									alt={song.title}
									className="w-16 h-16 rounded-lg object-cover"
								/>
								<div className="space-y-1 flex-1">
									<h4 className="text-sm font-semibold text-white">{song.title}</h4>
									<p className="text-xs text-zinc-400">{song.artist}</p>
									{song.album && (
										<p className="text-xs text-zinc-500">{song.album}</p>
									)}
									{song.duration && (
										<div className="flex items-center text-xs text-zinc-500">
											<Clock className="w-3 h-3 mr-1" />
											{song.duration}
										</div>
									)}
								</div>
							</div>
							<div className="flex items-center justify-between pt-4">
								<Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
									<Play className="w-4 h-4 mr-2" />
									Play Now
								</Button>
								<div className="flex space-x-2">
									<Button 
										size="sm" 
										variant="outline" 
										className="border-zinc-600 text-zinc-400 hover:bg-zinc-700"
										onClick={(e) => {
											e.stopPropagation();
											handleFavoriteToggle(song);
										}}
									>
										<Heart className="w-4 h-4" />
									</Button>
									<Button 
										size="sm" 
										variant="outline" 
										className="border-zinc-600 text-zinc-400 hover:bg-zinc-700"
										onClick={(e) => {
											e.stopPropagation();
											handleAddToPlaylist(song);
										}}
									>
										<Plus className="w-4 h-4" />
									</Button>
								</div>
							</div>
						</HoverCardContent>
					</HoverCard>
				))}
			</div>

			{/* Add to Playlist Modal */}
			<AddToPlaylistModal
				isOpen={showAddToPlaylistModal}
				onClose={() => setShowAddToPlaylistModal(false)}
				song={selectedSong}
			/>
		</div>
	);
};

export default SectionGrid;
