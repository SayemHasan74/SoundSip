import { useEffect } from 'react';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { usePlaylistStore } from '@/stores/usePlaylistStore';
import { favoritesEvents } from '@/lib/favoritesEvents';

export const useFavoritesSync = () => {
	const { getFavorites } = useFavoritesStore();
	const { getLikedSongsPlaylist } = usePlaylistStore();

	useEffect(() => {
		// Load initial data
		void Promise.all([getFavorites(), getLikedSongsPlaylist()]);
	}, [getFavorites, getLikedSongsPlaylist]);

	// Listen for favorites change events
	useEffect(() => {
		const unsubscribe = favoritesEvents.subscribe(() => {
			void Promise.all([getLikedSongsPlaylist(), getFavorites()]);
		});

		return unsubscribe;
	}, [getLikedSongsPlaylist, getFavorites]);

	// Removed periodic refresh to prevent sidebar flashing
	// The event-based synchronization above should be sufficient for keeping data in sync
};
