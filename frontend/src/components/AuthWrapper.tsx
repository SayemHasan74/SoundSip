import { useAuth } from "@clerk/clerk-react";
import { useLocation, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";

interface AuthWrapperProps {
	children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
	const { isSignedIn, isLoaded } = useAuth();
	const location = useLocation();

	// List of public routes that don't require authentication
	const publicRoutes = [
		"/landing",
		"/sign-up",
		"/login",
		"/verify-email",
		"/forgot-password",
		"/auth-callback",
		"/oauth-callback",
		"/sso-callback",
		"/artist/signup",
		"/artist/verification"
	];

	// Show loading spinner while checking authentication
	if (!isLoaded) {
		return (
			<div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
				<div className="text-center">
					<Loader className="size-12 text-emerald-500 animate-spin mx-auto mb-4" />
					<p className="text-zinc-400">Loading authentication...</p>
				</div>
			</div>
		);
	}

	// If user is signed in and trying to access auth pages, redirect to home
	if (isSignedIn && (location.pathname === "/login" || location.pathname === "/sign-up" || location.pathname === "/verify-email" || location.pathname === "/forgot-password")) {
		return <Navigate to="/" replace />;
	}

	// If user is signed in and trying to access landing page, redirect to home
	if (isSignedIn && location.pathname === "/landing") {
		return <Navigate to="/" replace />;
	}

	// If user is not signed in and trying to access a protected route, redirect to landing
	if (!isSignedIn && !publicRoutes.includes(location.pathname)) {
		return <Navigate to="/landing" replace />;
	}

	// For all other cases, render the children
	return <>{children}</>;
};

export default AuthWrapper;
