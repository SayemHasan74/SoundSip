import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Shuffle, Heart, Share2, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMusicStore } from '@/stores/useMusicStore';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { axiosInstance } from '@/lib/axios';

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
	// Create a temporary notification
	const notification = document.createElement('div');
	notification.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 ${
		type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
	}`;
	notification.textContent = message;
	document.body.appendChild(notification);
	setTimeout(() => {
		if (document.body.contains(notification)) {
			document.body.removeChild(notification);
		}
	}, 3000);
};

export const formatDuration = (minutes: number) => {
	if (!minutes || minutes <= 0) return "0:00";
	const mins = Math.floor(minutes);
	const secs = Math.round((minutes - mins) * 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const formatAlbumDuration = (totalMinutes: number) => {
	if (!totalMinutes || totalMinutes <= 0) return "0m";
	const hours = Math.floor(totalMinutes / 60);
	const minutes = Math.floor(totalMinutes % 60);
	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
};

const AlbumPage = () => {
	const { id } = useParams();
	const { fetchAlbumById, currentAlbum, isLoading, error, getLibraryAlbums } = useMusicStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
	const { addToFavorites, removeFromFavorites, checkFavoriteStatus } = useFavoritesStore();
	const [songFavoriteStatus, setSongFavoriteStatus] = useState<Record<string, boolean>>({});
	const [isAlbumInLibrary, setIsAlbumInLibrary] = useState(false);
	const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

	console.log("AlbumPage render:", { 
		id, 
		currentAlbum, 
		isLoading, 
		error,
		isAlbumInLibrary 
	});

	useEffect(() => {
		if (id) {
			fetchAlbumById(id);
			checkAlbumLibraryStatus(id);
		}
	}, [id, fetchAlbumById]);

	useEffect(() => {
		if (currentAlbum?.songs) {
			checkAllSongFavorites();
		}
	}, [currentAlbum]);

	const checkAllSongFavorites = async () => {
		if (!currentAlbum?.songs) return;
		
		const statuses: Record<string, boolean> = {};
		for (const song of currentAlbum.songs) {
			try {
				const isFavorited = await checkFavoriteStatus(song._id);
				statuses[song._id] = isFavorited;
			} catch (error) {
				console.error('Error checking favorite status for song:', song._id, error);
				statuses[song._id] = false;
			}
		}
		setSongFavoriteStatus(statuses);
	};

	const checkAlbumLibraryStatus = async (albumId: string) => {
		try {
			const response = await axiosInstance.get(`/albums/${albumId}/library`);
			setIsAlbumInLibrary(response.data.isInLibrary);
		} catch (error) {
			console.error('Error checking album library status:', error);
			setIsAlbumInLibrary(false);
		}
	};

	const handleAlbumLibraryToggle = async () => {
		if (!currentAlbum || isLoadingLibrary) return;
		
		setIsLoadingLibrary(true);
		try {
			if (isAlbumInLibrary) {
				await axiosInstance.delete(`/albums/${currentAlbum._id}/library`);
				setIsAlbumInLibrary(false);
				showNotification('Album removed from library');
			} else {
				await axiosInstance.post(`/albums/${currentAlbum._id}/library`);
				setIsAlbumInLibrary(true);
				showNotification('Album added to library!');
			}
			// Refresh library albums to update the library page
			await getLibraryAlbums();
		} catch (error: any) {
			console.error('Error toggling album library status:', error);
			showNotification(error.response?.data?.message || 'Failed to update library', 'error');
		} finally {
			setIsLoadingLibrary(false);
		}
	};

	const handleShufflePlay = () => {
		if (!currentAlbum?.songs || currentAlbum.songs.length === 0) {
			showNotification('No songs available to play', 'error');
			return;
		}
		
		// Create a shuffled copy of the songs
		const shuffledSongs = [...currentAlbum.songs].sort(() => Math.random() - 0.5);
		playAlbum(shuffledSongs);
		showNotification(`Playing ${currentAlbum.title} on shuffle`);
	};

	const handlePlayAlbum = () => {
		if (!currentAlbum?.songs || currentAlbum.songs.length === 0) {
			showNotification('No songs available to play', 'error');
			return;
		}

		// Check if we're already playing this album
		const isCurrentAlbum = currentSong && currentAlbum.songs.some(song => song._id === currentSong._id);
		
		if (isCurrentAlbum && isPlaying) {
			// If we're playing this album, toggle pause
			togglePlay();
		} else {
			// Start playing the album from the beginning
			playAlbum(currentAlbum.songs);
			showNotification(`Playing ${currentAlbum.title}`);
		}
	};

	const handlePlaySong = (index: number) => {
		if (!currentAlbum?.songs) return;
		
		// Start playing from the selected song
		const songsFromIndex = currentAlbum.songs.slice(index);
		playAlbum(songsFromIndex);
	};


	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: currentAlbum?.title,
				text: `Check out ${currentAlbum?.title} by ${currentAlbum?.artist}`,
				url: window.location.href,
			});
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href);
			// Create a temporary notification
			const notification = document.createElement('div');
			notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
			notification.textContent = 'Link copied to clipboard!';
			document.body.appendChild(notification);
			setTimeout(() => {
				document.body.removeChild(notification);
			}, 3000);
		}
	};

	const handleAddToPlaylist = () => {
		// TODO: Implement add to playlist functionality
		console.log("Add album to playlist:", currentAlbum?.title);
		showNotification(`Added ${currentAlbum?.title} to playlist!`);
	};

	const handleLikeAlbum = () => {
		// TODO: Implement like album functionality
		console.log("Like album:", currentAlbum?.title);
		showNotification(`Liked ${currentAlbum?.title}!`);
	};

	const handleSongLike = async (song: any) => {
		try {
			const isCurrentlyFavorited = songFavoriteStatus[song._id];
			
			if (isCurrentlyFavorited) {
				await removeFromFavorites(song._id);
				setSongFavoriteStatus(prev => ({ ...prev, [song._id]: false }));
				showNotification(`Removed ${song.title} from favorites`);
			} else {
				await addToFavorites('song', song._id, song.title, song.artist, song.imageUrl, {
					audioUrl: song.audioUrl,
					duration: song.duration,
					genre: song.genre,
					albumId: song.albumId
				});
				setSongFavoriteStatus(prev => ({ ...prev, [song._id]: true }));
				showNotification(`Added ${song.title} to favorites!`);
			}
		} catch (error) {
			console.error('Error toggling song favorite:', error);
			showNotification('Failed to update favorite status', 'error');
		}
	};

	// Show loading state
	if (isLoading) {
		return (
			<div className='h-full flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4'></div>
					<p className='text-zinc-400'>Loading album...</p>
				</div>
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className='h-full flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-red-400 text-lg mb-4'>Failed to load album</p>
					<p className='text-zinc-400 mb-4'>{error}</p>
					<Button 
						onClick={() => id && fetchAlbumById(id)}
						variant='outline'
						className='text-white border-white/20 hover:bg-white/10'
					>
						Try Again
					</Button>
				</div>
			</div>
		);
	}

	// Show empty state
	if (!currentAlbum) {
		return (
			<div className='h-full flex items-center justify-center'>
				<div className='text-center'>
					<p className='text-zinc-400 text-lg'>Album not found</p>
				</div>
			</div>
		);
	}

	return (
		<div className='h-full'>
			<ScrollArea className='h-full rounded-md'>
				{/* Main Content */}
				<div className='relative min-h-full'>
					{/* bg gradient */}
					<div
						className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none'
						aria-hidden='true'
					/>

					{/* Content */}
					<div className='relative z-10'>
						<div className='flex flex-col sm:flex-row p-4 sm:p-6 gap-4 sm:gap-6 pb-6 sm:pb-8'>
							<img
								src={currentAlbum?.imageUrl}
								alt={currentAlbum?.title}
								className='w-48 h-48 sm:w-[240px] sm:h-[240px] shadow-xl rounded mx-auto sm:mx-0'
							/>
							<div className='flex flex-col justify-end text-center sm:text-left'>
								<p className='text-sm font-medium'>Album</p>
								<h1 className='text-3xl sm:text-5xl md:text-7xl font-bold my-2 sm:my-4'>{currentAlbum?.title}</h1>
								<div className='flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-sm text-zinc-100'>
									<span className='font-medium text-white'>{currentAlbum?.artist}</span>
									<span className='hidden sm:inline'>•</span>
									<span>{currentAlbum?.songCount || currentAlbum?.songs.length} songs</span>
									<span className='hidden sm:inline'>•</span>
									<span>{currentAlbum?.releaseYear}</span>
									{currentAlbum?.totalDuration && (
										<>
											<span className='hidden sm:inline'>•</span>
											<span>{formatAlbumDuration(currentAlbum.totalDuration)}</span>
										</>
									)}
									{currentAlbum?.totalPlays && currentAlbum.totalPlays > 0 && (
										<>
											<span className='hidden sm:inline'>•</span>
											<span>{currentAlbum.totalPlays.toLocaleString()} plays</span>
										</>
									)}
								</div>
							</div>
						</div>

						{/* play button */}
						<div className='px-4 sm:px-6 pb-4 flex items-center justify-center sm:justify-start gap-4'>
							<Button
								onClick={handlePlayAlbum}
								size='icon'
								className='w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-500 hover:bg-green-400 
                hover:scale-105 transition-all'
							>
								{isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
									<Pause className='h-6 w-6 sm:h-7 sm:w-7 text-black' />
								) : (
									<Play className='h-6 w-6 sm:h-7 sm:w-7 text-black' />
								)}
							</Button>
							
							{/* Action buttons */}
							<div className='flex items-center gap-2 flex-wrap'>
								<Button
									onClick={() => {
										if (!currentAlbum?.songs || currentAlbum.songs.length === 0) {
											showNotification('No songs available to play', 'error');
											return;
										}
										
										// Create a shuffled copy of the songs
										const shuffledSongs = [...currentAlbum.songs].sort(() => Math.random() - 0.5);
										playAlbum(shuffledSongs);
										showNotification(`Playing ${currentAlbum.title} on shuffle`);
									}}
									variant='outline'
									size='sm'
									className='text-white border-white/20 hover:bg-white/10'
								>
									<Shuffle className='h-4 w-4 mr-2' />
									<span className='hidden sm:inline'>Shuffle</span>
								</Button>
								
								<Button
									onClick={handleAlbumLibraryToggle}
									disabled={isLoadingLibrary}
									variant='outline'
									size='sm'
									className='text-white border-white/20 hover:bg-white/10'
								>
									<Heart 
										className={`h-4 w-4 mr-2 ${isAlbumInLibrary ? 'fill-red-500 text-red-500' : ''}`} 
									/>
									<span className='hidden sm:inline'>
										{isLoadingLibrary ? 'Loading...' : (isAlbumInLibrary ? 'Remove from Library' : 'Add to Library')}
									</span>
								</Button>
								
								<Button
									onClick={handleShare}
									variant='outline'
									size='sm'
									className='text-white border-white/20 hover:bg-white/10'
								>
									<Share2 className='h-4 w-4 mr-2' />
									<span className='hidden sm:inline'>Share</span>
								</Button>
							</div>
						</div>

						{/* Table Section */}
						<div className='bg-black/20 backdrop-blur-sm'>
							{/* table header */}
							<div
								className='grid grid-cols-[16px_1fr_auto_auto_auto] sm:grid-cols-[16px_4fr_2fr_1fr_auto] gap-2 sm:gap-4 px-4 sm:px-10 py-2 text-xs sm:text-sm 
            text-zinc-400 border-b border-white/5'
							>
								<div>#</div>
								<div>Title</div>
								<div className='hidden sm:block'>Released Date</div>
								<div>
									<Clock className='h-3 w-3 sm:h-4 sm:w-4' />
								</div>
								<div></div>
							</div>

							{/* songs list */}
							<div className='px-2 sm:px-6'>
								<div className='space-y-1 sm:space-y-2 py-4'>
									{currentAlbum?.songs.map((song, index) => {
										const isCurrentSong = currentSong?._id === song._id;
										return (
											<div
												key={song._id}
												onClick={() => handlePlaySong(index)}
												className={`grid grid-cols-[16px_1fr_auto_auto_auto] sm:grid-cols-[16px_4fr_2fr_1fr_auto] gap-2 sm:gap-4 px-2 sm:px-4 py-2 text-xs sm:text-sm 
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
                      `}
											>
												<div className='flex items-center justify-center'>
													{isCurrentSong && isPlaying ? (
														<div className='size-3 sm:size-4 text-green-500'>♫</div>
													) : (
														<span className='group-hover:hidden'>{index + 1}</span>
													)}
													{!isCurrentSong && (
														<Play className='h-3 w-3 sm:h-4 sm:w-4 hidden group-hover:block' />
													)}
												</div>

												<div className='flex items-center gap-2 sm:gap-3'>
													<img src={song.imageUrl} alt={song.title} className='size-8 sm:size-10' />

													<div className='min-w-0 flex-1'>
														<div className={`font-medium text-white truncate`}>{song.title}</div>
														<div className='truncate'>{song.artist}</div>
													</div>
												</div>
												<div className='flex items-center hidden sm:flex'>
													{song.releaseDate ? 
														new Date(song.releaseDate).toLocaleDateString() : 
														new Date(song.createdAt).toLocaleDateString()
													}
												</div>
												<div className='flex items-center'>{formatDuration(song.duration)}</div>
												<div className='flex items-center justify-center'>
													<Button
														onClick={(e) => {
															e.stopPropagation();
															handleSongLike(song);
														}}
														variant='ghost'
														size='sm'
														className='p-1 h-auto text-zinc-400 hover:text-red-500 hover:bg-transparent'
													>
														<Heart 
															className={`h-4 w-4 ${songFavoriteStatus[song._id] ? 'fill-red-500 text-red-500' : ''}`} 
														/>
													</Button>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};
export default AlbumPage;
