import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Music, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const { signIn, isLoaded } = useSignIn();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		if (!isLoaded) {
			setError("Please wait while we load the sign-in form...");
			setIsLoading(false);
			return;
		}

		try {
			// Attempt to sign in
			const result = await signIn.create({
				identifier: email,
				password,
			});

			if (result.status === "complete") {
				// Sign in successful, redirect to home
				console.log("Sign-in successful, redirecting to home");
				window.location.href = "/";
			} else {
				// Handle multi-factor authentication or other statuses
				console.log("Sign-in status:", result.status);
				setError("Please complete the sign-in process.");
			}
		} catch (err: any) {
			console.error("Sign-in error:", err);
			setError(err.errors?.[0]?.message || "Invalid email or password. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			await signIn?.authenticateWithRedirect({
				strategy: "oauth_google",
				redirectUrl: "/oauth-callback",
				redirectUrlComplete: "/oauth-callback"
			});
		} catch (error) {
			console.error("Google sign-in error:", error);
			setError("Failed to sign in with Google. Please try again.");
		}
	};

	if (!isLoaded) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
				<div className="text-center">
					<Loader2 className="size-8 animate-spin text-emerald-500 mx-auto mb-4" />
					<p className="text-zinc-400">Loading sign-in form...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo and Title */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full mb-4">
						<Music className="size-8 text-white" />
					</div>
					<h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
					<p className="text-zinc-400">Sign in to continue your musical journey</p>
				</div>

				{/* Login Form */}
				<Card className="bg-zinc-800/50 border-zinc-700 shadow-2xl">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl text-white">Sign In</CardTitle>
						<CardDescription className="text-zinc-400">
							Enter your credentials to access your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* Email */}
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-4" />
								<Input
									type="email"
									placeholder="Email Address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-emerald-500 pl-10"
								/>
							</div>

							{/* Password */}
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 size-4" />
								<Input
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-emerald-500 pl-10 pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
								>
									{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
								</button>
							</div>

							{/* Forgot Password */}
							<div className="text-right">
								<Link
									to="/forgot-password"
									className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
								>
									Forgot your password?
								</Link>
							</div>

							{/* Error Message */}
							{error && (
								<div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-md p-3">
									{error}
								</div>
							)}

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-semibold rounded-lg transition-all duration-200"
							>
								{isLoading ? (
									<>
										<Loader2 className="size-5 animate-spin mr-2" />
										Signing In...
									</>
								) : (
									"Sign In"
								)}
							</Button>

							{/* Remember Me */}
							<div className="flex items-center justify-between">
								<label className="flex items-center space-x-2 cursor-pointer">
									<input
										type="checkbox"
										className="rounded border-zinc-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-800"
									/>
									<span className="text-sm text-zinc-400">Remember me</span>
								</label>
							</div>
						</form>

						{/* Divider */}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-zinc-600" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-zinc-800 text-zinc-400">Or continue with</span>
							</div>
						</div>

						{/* Google Sign In Option */}
						<Button
							variant="outline"
							onClick={handleGoogleSignIn}
							className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-200"
						>
							<svg className="size-4 mr-2" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="currentColor"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="currentColor"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="currentColor"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Continue with Google
						</Button>

						{/* Divider */}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-zinc-600" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 bg-zinc-400">Don't have an account?</span>
							</div>
						</div>

						{/* Sign Up Link */}
						<Button
							variant="outline"
							onClick={() => window.location.href = "/sign-up"}
							className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-200"
						>
							Create Account
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default LoginPage;
