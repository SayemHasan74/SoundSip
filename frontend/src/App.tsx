import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { lazy, Suspense } from "react";

// Pages
const HomePage = lazy(() => import("./pages/home/HomePage"));
const ChatPage = lazy(() => import("./pages/chat/ChatPage"));
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));
const AlbumPage = lazy(() => import("./pages/album/AlbumPage"));
const SearchPage = lazy(() => import("./pages/search/SearchPage"));
const LibraryPage = lazy(() => import("./pages/library/LibraryPage"));
const LikedSongsPage = lazy(() => import("./pages/liked-songs/LikedSongsPage"));
const PlaylistPage = lazy(() => import("./pages/playlist/PlaylistPage"));
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
const ArtistsPage = lazy(() => import("./pages/artists/ArtistsPage"));

// Profile Pages
const UserProfilePage = lazy(() => import("./pages/profile/UserProfilePage"));
const EditProfilePage = lazy(() => import("./pages/profile/EditProfilePage"));

// Settings Page
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));

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
	return (
		<Router>
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
