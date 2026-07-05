import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePlaylistStore } from '@/stores/usePlaylistStore';
import { toast } from 'react-hot-toast';

const PlaylistTest = () => {
	const [testResults, setTestResults] = useState<string[]>([]);
	const { playlists, getPlaylists, createPlaylist, addSongToPlaylist } = usePlaylistStore();

	const addLog = (message: string) => {
		setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
	};

	const testPlaylistFunctionality = async () => {
		setTestResults([]);
		addLog('Starting playlist functionality test...');

		try {
			// Test 1: Fetch playlists
			addLog('Test 1: Fetching playlists...');
			await getPlaylists();
			addLog(`✅ Found ${playlists.length} playlists`);

			// Test 2: Create a test playlist
			addLog('Test 2: Creating test playlist...');
			const testPlaylistName = `Test Playlist ${Date.now()}`;
			await createPlaylist(testPlaylistName, 'Test playlist for functionality testing');
			addLog('✅ Test playlist created successfully');

			// Test 3: Add a test song to the playlist
			addLog('Test 3: Adding test song to playlist...');
			const testSong = {
				_id: 'test-song-id',
				title: 'Test Song',
				artist: 'Test Artist',
				imageUrl: 'https://via.placeholder.com/150',
				audioUrl: 'https://example.com/test.mp3',
				duration: 180,
				genre: 'Test',
				albumId: 'test-album'
			};

			// Find the newly created playlist
			const newPlaylist = playlists.find(p => p.name === testPlaylistName);
			if (newPlaylist) {
				await addSongToPlaylist(newPlaylist._id, testSong);
				addLog('✅ Test song added to playlist successfully');
			} else {
				addLog('❌ Could not find newly created playlist');
			}

			addLog('🎉 All tests completed successfully!');
		} catch (error: any) {
			addLog(`❌ Test failed: ${error.message}`);
			console.error('Playlist test error:', error);
		}
	};

	return (
		<div className="p-4 bg-zinc-900 rounded-lg">
			<h3 className="text-white font-bold mb-4">Playlist Functionality Test</h3>
			<Button 
				onClick={testPlaylistFunctionality}
				className="mb-4 bg-blue-500 hover:bg-blue-600"
			>
				Run Playlist Test
			</Button>
			<div className="space-y-2 max-h-60 overflow-y-auto">
				{testResults.map((result, index) => (
					<div key={index} className="text-sm text-zinc-300 font-mono">
						{result}
					</div>
				))}
			</div>
		</div>
	);
};

export default PlaylistTest;

