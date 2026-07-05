import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';

interface Artist {
	_id: string;
	clerkId: string | null;
	artistName: string;
	genre: string;
	bio: string;
	isVerified: boolean;
	imageUrl: string;
	followers: number;
	totalPlays: number;
	monthlyListeners: number;
	isRegistered: boolean;
	songCount?: number;
	albumCount?: number;
	createdAt?: string;
}

interface ArtistPagination {
	currentPage: number;
	totalPages: number;
	totalArtists: number;
	hasNext: boolean;
	hasPrev: boolean;
}

interface ArtistStore {
	// State
	artists: Artist[];
	pagination: ArtistPagination | null;
	isLoading: boolean;
	error: string | null;

	// Actions
	getAllArtists: (genre?: string, verified?: boolean, limit?: number, page?: number) => Promise<void>;
	getArtistProfile: (id: string) => Promise<Artist | null>;
	searchArtists: (query: string) => Promise<Artist[]>;
	clearArtists: () => void;
}

export const useArtistStore = create<ArtistStore>((set) => ({
	// Initial state
	artists: [],
	pagination: null,
	isLoading: false,
	error: null,

	// Get all artists
	getAllArtists: async (genre, verified, limit = 20, page = 1) => {
		try {
			set({ isLoading: true, error: null });
			
			const params = new URLSearchParams();
			if (genre) params.append('genre', genre);
			if (verified !== undefined) params.append('verified', verified.toString());
			if (limit) params.append('limit', limit.toString());
			if (page) params.append('page', page.toString());

			console.log('🎤 Fetching artists with params:', params.toString());
			const response = await axiosInstance.get(`/artists?${params}`);
			
			console.log('✅ Artists fetched successfully:', response.data);
			
			set({
				artists: response.data.artists,
				pagination: response.data.pagination,
				isLoading: false
			});
		} catch (error: any) {
			console.error('❌ Error fetching artists:', error);
			set({ 
				error: error.response?.data?.message || 'Failed to fetch artists',
				isLoading: false 
			});
		}
	},

	// Get artist profile by ID
	getArtistProfile: async (id) => {
		try {
			const response = await axiosInstance.get(`/artists/${id}`);
			return response.data.artist;
		} catch (error: any) {
			console.error('Error fetching artist profile:', error);
			return null;
		}
	},

	// Search artists
	searchArtists: async (query) => {
		try {
			const response = await axiosInstance.get(`/artists/search?q=${encodeURIComponent(query)}`);
			return response.data.artists;
		} catch (error: any) {
			console.error('Error searching artists:', error);
			return [];
		}
	},

	// Clear artists
	clearArtists: () => {
		set({
			artists: [],
			pagination: null,
			error: null,
			isLoading: false
		});
	}
}));
