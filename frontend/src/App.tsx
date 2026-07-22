import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

// Pages
const loadHomePage = () => import("./pages/home/HomePage");
const loadChatPage = () => import("./pages/chat/ChatPage");
const loadAdminPage = () => import("./pages/admin/AdminPage");
const loadAlbumPage = () => import("./pages/album/AlbumPage");
const loadSearchPage = () => import("./pages/search/SearchPage");
const loadLibraryPage = () => import("./pages/library/LibraryPage");
const loadLikedSongsPage = () => import("./pages/liked-songs/LikedSongsPage");
const loadPlaylistPage = () => import("./pages/playlist/PlaylistPage");
const loadArtistsPage = () => import("./pages/artists/ArtistsPage");
const loadUserProfilePage = () => import("./pages/profile/UserProfilePage");
const loadEditProfilePage = () => import("./pages/profile/EditProfilePage");
const loadSettingsPage = () => import("./pages/settings/SettingsPage");

const HomePage = lazy(loadHomePage);
const ChatPage = lazy(loadChatPage);
const AdminPage = lazy(loadAdminPage);
const AlbumPage = lazy(loadAlbumPage);
const SearchPage = lazy(loadSearchPage);
const LibraryPage = lazy(loadLibraryPage);
const LikedSongsPage = lazy(loadLikedSongsPage);
const PlaylistPage = lazy(loadPlaylistPage);
const NotFoundPage = lazy(() => import("./pages/404/NotFoundPage"));

// Auth Pages
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const VerifyEmailPage = lazy(() => import("./pages/auth/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"));
const OAuthCallbackPage = lazy(() => import("./pages/auth/OAuthCallbackPage"));

// Artist Pages
const ArtistSignupPage = lazy(() => import("./pages/artist/ArtistSignupPage"));
const ArtistVerificationPage = lazy(() => import("./pages/artist/ArtistVerificationPage"));
const ArtistProfilePage = lazy(() => import("./pages/artist/ArtistProfilePage"));
const ArtistsPage = lazy(loadArtistsPage);

// Profile Pages
const UserProfilePage = lazy(loadUserProfilePage);
const EditProfilePage = lazy(loadEditProfilePage);

// Settings Page
const SettingsPage = lazy(loadSettingsPage);

// Landing Page
const LandingPage = lazy(() => import("./pages/landing/LandingPage"));

// Layout
import MainLayout from "./layout/MainLayout";
import AuthWrapper from "./components/AuthWrapper";

const RouteLoader = () => (
	<div className="min-h-screen bg-black text-zinc-400 flex items-center justify-center">
		Loading...
	</div>
);

function App() {
	const { isSignedIn } = useAuth();

	useEffect(() => {
		if (!isSignedIn) return;

		const preloadCommonPages = () => {
			void Promise.allSettled([
				loadHomePage(),
				loadSearchPage(),
				loadChatPage(),
				loadLibraryPage(),
				loadLikedSongsPage(),
				loadAlbumPage(),
				loadPlaylistPage(),
				loadArtistsPage(),
				loadUserProfilePage(),
			]);
		};

		const idleWindow = window as Window & {
			requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
			cancelIdleCallback?: (id: number) => void;
		};

		if (idleWindow.requestIdleCallback) {
			const idleId = idleWindow.requestIdleCallback(preloadCommonPages, { timeout: 1500 });
			return () => idleWindow.cancelIdleCallback?.(idleId);
		}

		const timerId = window.setTimeout(preloadCommonPages, 400);
		return () => window.clearTimeout(timerId);
	}, [isSignedIn]);

	return (
		<Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
			<AuthWrapper>
				<Suspense fallback={<RouteLoader />}>
					<Routes>
						{/* Public Routes */}
						<Route path="/landing" element={<LandingPage />} />
						<Route path="/sign-up" element={<SignUpPage />} />
						<Route path="/login" element={<LoginPage />} />
						<Route path="/verify-email" element={<VerifyEmailPage />} />
						<Route path="/forgot-password" element={<ForgotPasswordPage />} />
						<Route path="/oauth-callback" element={<OAuthCallbackPage />} />

						{/* Artist Routes */}
						<Route path="/artist/signup" element={<ArtistSignupPage />} />
						<Route path="/artist/verification" element={<ArtistVerificationPage />} />
						<Route path="/artist/:id" element={<ArtistProfilePage />} />

						{/* Protected Routes */}
						<Route path="/" element={<MainLayout />}>
							<Route index element={<HomePage />} />
							<Route path="chat" element={<ChatPage />} />
							<Route path="admin" element={<AdminPage />} />
							<Route path="album/:id" element={<AlbumPage />} />
							<Route path="search" element={<SearchPage />} />
							<Route path="library" element={<LibraryPage />} />
							<Route path="liked-songs" element={<LikedSongsPage />} />
							<Route path="playlist/:id" element={<PlaylistPage />} />
							<Route path="artists" element={<ArtistsPage />} />
							<Route path="profile/:id" element={<UserProfilePage />} />
							<Route path="profile/edit" element={<EditProfilePage />} />
							<Route path="settings" element={<SettingsPage />} />
						</Route>

						{/* Catch All */}
						<Route path="*" element={<NotFoundPage />} />
					</Routes>
				</Suspense>
			</AuthWrapper>
			<Toaster />
		</Router>
	);
}

export default App;
