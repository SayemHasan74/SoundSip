// Clear all cached data that might contain sample playlists
console.log('🧹 Clearing cached data...');

// Clear localStorage
try {
	localStorage.clear();
	console.log('✅ Cleared localStorage');
} catch (error) {
	console.error('❌ Error clearing localStorage:', error);
}

// Clear sessionStorage
try {
	sessionStorage.clear();
	console.log('✅ Cleared sessionStorage');
} catch (error) {
	console.error('❌ Error clearing sessionStorage:', error);
}

// Clear any Zustand store data
try {
	// Clear playlist store
	if (window.__PLAYLIST_STORE__) {
		window.__PLAYLIST_STORE__.setState({
			playlists: [],
			likedSongsPlaylist: null,
			isLoading: false,
			error: null
		});
		console.log('✅ Cleared playlist store');
	}
} catch (error) {
	console.error('❌ Error clearing store:', error);
}

console.log('🎉 Cache cleared! Refresh the page to see the clean library.');
