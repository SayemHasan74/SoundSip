import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import AdminDebugPanel from "./components/AdminDebugPanel";
import { Album, Music, Mic } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import ArtistsTabContent from "./components/ArtistsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminPage = () => {
	const { isAdmin, isLoading, checkAdminStatus } = useAuthStore();

	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

	useEffect(() => {
		checkAdminStatus();
		fetchAlbums();
		fetchSongs();
		fetchStats();
	}, [checkAdminStatus, fetchAlbums, fetchSongs, fetchStats]);

	if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

	return (
		<div className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100'>
			<ScrollArea className='h-[calc(100vh-80px)]'>
				<div className='p-4 sm:p-6 md:p-8 space-y-6 pb-20'>
					<Header />

					<AdminDebugPanel />
					<DashboardStats />

					<Tabs defaultValue='songs' className='space-y-4 md:space-y-6'>
						<TabsList className='p-1 bg-zinc-800/50 w-full sm:w-auto grid grid-cols-3 sm:flex'>
							<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700 flex-1 sm:flex-none'>
								<Music className='mr-2 size-4' />
								<span className="hidden sm:inline">Songs</span>
								<span className="sm:hidden">S</span>
							</TabsTrigger>
							<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700 flex-1 sm:flex-none'>
								<Album className='mr-2 size-4' />
								<span className="hidden sm:inline">Albums</span>
								<span className="sm:hidden">A</span>
							</TabsTrigger>
							<TabsTrigger value='artists' className='data-[state=active]:bg-zinc-700 flex-1 sm:flex-none'>
								<Mic className='mr-2 size-4' />
								<span className="hidden sm:inline">Artists</span>
								<span className="sm:hidden">Ar</span>
							</TabsTrigger>
						</TabsList>

						<TabsContent value='songs'>
							<SongsTabContent />
						</TabsContent>
						<TabsContent value='albums'>
							<AlbumsTabContent />
						</TabsContent>
						<TabsContent value='artists'>
							<ArtistsTabContent />
						</TabsContent>
					</Tabs>
				</div>
			</ScrollArea>
		</div>
	);
};
export default AdminPage;
