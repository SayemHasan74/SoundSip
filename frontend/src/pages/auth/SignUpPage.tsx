import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Music } from "lucide-react";
import { Link } from "react-router-dom";

const SignUpPage = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const { signUp, isLoaded } = useSignUp();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		if (!isLoaded) {
			setError("Please wait while we load the sign-up form...");
			setIsLoading(false);
			return;
		}

		// Validate required fields
		if (!firstName.trim() || !lastName.trim()) {
			setError("First name and last name are required");
			setIsLoading(false);
			return;
		}

		try {
			// Start the sign-up process
			await signUp.create({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				emailAddress: email,
				password,
			});

			// Send verification email
			await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

			// Redirect to verification page
			console.log("Sign-up successful, redirecting to email verification");
			window.location.href = "/verify-email";
		} catch (err: any) {
			console.error("Sign-up error:", err);
			setError(err.errors?.[0]?.message || "Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleSignUp = async () => {
		try {
			await signUp?.authenticateWithRedirect({
				strategy: "oauth_google",
				redirectUrl: "/oauth-callback",
				redirectUrlComplete: "/oauth-callback"
			});
		} catch (error) {
			console.error("Google sign-up error:", error);
			setError("Failed to sign up with Google. Please try again.");
		}
	};

	if (!isLoaded) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
				<div className="text-center">
					<Loader2 className="size-8 animate-spin text-emerald-500 mx-auto mb-4" />
					<p className="text-zinc-400">Loading sign-up form...</p>
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
					<h1 className="text-3xl font-bold text-white mb-2">Join Amar Gaan</h1>
					<p className="text-zinc-400">Start your musical journey today</p>
				</div>

				{/* Sign Up Form */}
				<Card className="bg-zinc-800/50 border-zinc-700 shadow-2xl">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl text-white">Create Account</CardTitle>
						<CardDescription className="text-zinc-400">
							Sign up to start listening to your favorite music
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{/* First Name */}
							<Input
								type="text"
								placeholder="First Name"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								required
								className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-emerald-500"
							/>
							{/* Last Name */}
							<Input
								type="text"
								placeholder="Last Name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								required
								className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-emerald-500"
							/>
							{/* Email */}
							<Input
								type="email"
								placeholder="Email Address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-emerald-500"
							/>

							{/* Password */}
							<div className="relative">
								<Input
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									minLength={8}
									className="bg-zinc-700/50 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-emerald-500 pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
								>
									{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
								</button>
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
										Creating Account...
									</>
								) : (
									"Create Account"
								)}
							</Button>

							{/* Terms */}
							<p className="text-xs text-zinc-500 text-center">
								By signing up, you agree to our{" "}
								<Link to="/terms" className="text-emerald-400 hover:underline">
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link to="/privacy" className="text-emerald-400 hover:underline">
									Privacy Policy
								</Link>
							</p>
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

						{/* Google Sign Up Option */}
						<Button
							variant="outline"
							onClick={handleGoogleSignUp}
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
								<span className="px-2 bg-zinc-800 text-zinc-400">Already have an account?</span>
							</div>
						</div>

						{/* Login Link */}
						<Button
							variant="outline"
							onClick={() => window.location.href = "/login"}
							className="w-full border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-200"
						>
							Sign In
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default SignUpPage;
