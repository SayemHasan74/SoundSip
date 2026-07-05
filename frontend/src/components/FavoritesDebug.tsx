import { useFavoritesStore } from '@/stores/useFavoritesStore';
import { useAuth } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

const FavoritesDebug = () => {
	const { favorites, getFavorites, addToFavorites, removeFromFavorites, clearFavorites } = useFavoritesStore();
	const { userId } = useAuth();

	const handleTestAdd = async () => {
		await addToFavorites('song', 'test-song-123', 'Test Song', 'Test Artist', '', {
			audioUrl: 'test.mp3',
			duration: 180
		});
	};

	const handleTestRemove = async () => {
		await removeFromFavorites('test-song-123');
	};

	const handleRefresh = async () => {
		await getFavorites('song');
	};

	return (
		<div className="p-4 bg-zinc-800 rounded-lg m-4">
			<h3 className="text-white font-bold mb-2">Favorites Debug</h3>
			<div className="text-zinc-300 text-sm mb-4">
				<p>User ID: {userId}</p>
				<p>Favorites Count: {favorites.length}</p>
			</div>
			<div className="space-y-2">
				<Button onClick={handleTestAdd} size="sm" className="mr-2">
					Test Add
				</Button>
				<Button onClick={handleTestRemove} size="sm" className="mr-2">
					Test Remove
				</Button>
				<Button onClick={handleRefresh} size="sm" className="mr-2">
					Refresh
				</Button>
				<Button onClick={clearFavorites} size="sm">
					Clear
				</Button>
			</div>
			<div className="mt-4">
				<h4 className="text-white font-semibold mb-2">Current Favorites:</h4>
				<div className="text-zinc-300 text-xs max-h-32 overflow-y-auto">
					{favorites.map((fav, index) => (
						<div key={index} className="mb-1">
							{fav.title} - {fav.artist} ({fav.type})
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FavoritesDebug;
