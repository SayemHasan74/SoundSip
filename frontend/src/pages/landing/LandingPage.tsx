import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Music, Play, Users, Headphones, ArrowRight, Mic, Star, CheckCircle, Heart, MessageCircle, TrendingUp, Award, Mail, Quote, User, Clock, Globe, Instagram, Twitter, Youtube, Facebook } from "lucide-react";

const LandingPage = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
			{/* Navigation */}
			<nav className="flex items-center justify-between p-6 md:p-8">
				<div className="flex items-center space-x-2">
					<div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
						<Music className="size-6 text-white" />
					</div>
					<span className="text-2xl font-bold text-white">Amar Gaan</span>
				</div>
				<div className="flex items-center space-x-4">
					<Button
						variant="outline"
						onClick={() => navigate("/artist/signup")}
						className="border-blue-600 text-blue-300 hover:bg-blue-700 hover:text-white"
					>
						<Mic className="size-4 mr-2" />
						Artist Signup
					</Button>
					<Button
						variant="outline"
						onClick={() => navigate("/login")}
						className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
					>
						Sign In
					</Button>
					<Button
						onClick={() => navigate("/sign-up")}
						className="bg-emerald-600 hover:bg-emerald-700 text-white"
					>
						Get Started
					</Button>
				</div>
			</nav>

			{/* Hero Section */}
			<div className="text-center px-6 md:px-8 py-20 md:py-32">
				<h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
					Your Music,{" "}
					<span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
						Your Way
					</span>
				</h1>
				<p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-3xl mx-auto">
					Discover, stream, and share your favorite music with friends. Join the ultimate social music experience.
				</p>
				<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
					<Button
						onClick={() => navigate("/sign-up")}
						size="lg"
						className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-4 rounded-full"
					>
						Start Listening Free
						<ArrowRight className="ml-2 size-5" />
					</Button>
					<Button
						onClick={() => navigate("/artist/signup")}
						size="lg"
						className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-full"
					>
						<Mic className="mr-2 size-5" />
						Become an Artist
					</Button>
					<Button
						variant="outline"
						onClick={() => navigate("/login")}
						size="lg"
						className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white text-lg px-8 py-4 rounded-full"
					>
						Already have an account?
					</Button>
				</div>
			</div>

			{/* Statistics Section */}
			<div className="px-6 md:px-8 py-16 bg-gradient-to-r from-emerald-900/20 to-blue-900/20">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">10M+</div>
							<div className="text-zinc-400">Active Listeners</div>
						</div>
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">50K+</div>
							<div className="text-zinc-400">Verified Artists</div>
						</div>
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">100M+</div>
							<div className="text-zinc-400">Songs Streamed</div>
						</div>
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-pink-400 mb-2">24/7</div>
							<div className="text-zinc-400">Music Available</div>
						</div>
					</div>
				</div>
			</div>

			{/* Featured Artists Carousel */}
			<div className="px-6 md:px-8 py-20">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Featured Artists
						</h2>
						<p className="text-xl text-zinc-300 max-w-2xl mx-auto">
							Discover amazing talent and trending artists on Amar Gaan
						</p>
					</div>
					
					<Carousel
						opts={{
							align: "start",
							loop: true,
						}}
						className="w-full"
					>
						<CarouselContent className="-ml-2 md:-ml-4">
							{[
								{
									name: "Featured Artist 1",
									genre: "Pop",
									followers: "2.5M",
									image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
									verified: true,
									latest: "Latest Release"
								},
								{
									name: "Featured Artist 2",
									genre: "Electronic",
									followers: "1.8M",
									image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
									verified: true,
									latest: "New Track"
								},
								{
									name: "Featured Artist 3",
									genre: "R&B",
									followers: "3.2M",
									image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
									verified: true,
									latest: "Fresh Sound"
								},
								{
									name: "Featured Artist 4",
									genre: "Rock",
									followers: "1.5M",
									image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
									verified: false,
									latest: "Rock Anthem"
								},
								{
									name: "Featured Artist 5",
									genre: "Folk",
									followers: "890K",
									image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
									verified: false,
									latest: "Folk Tale"
								}
							].map((artist, index) => (
								<CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
									<HoverCard>
										<HoverCardTrigger asChild>
											<Card className="bg-zinc-800/50 border-zinc-700 cursor-pointer transition-all duration-300 hover:bg-zinc-700/50 hover:border-zinc-600 hover:scale-105">
												<CardContent className="p-6">
													<div className="flex flex-col items-center text-center space-y-4">
														<Avatar className="w-20 h-20">
															<AvatarImage src={artist.image} alt={artist.name} />
															<AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white text-xl font-bold">
																{artist.name.split(' ').map(n => n[0]).join('')}
															</AvatarFallback>
														</Avatar>
														<div className="space-y-2">
															<div className="flex items-center justify-center space-x-2">
																<h3 className="text-lg font-semibold text-white">{artist.name}</h3>
																{artist.verified && (
																	<Badge className="bg-blue-500 text-white text-xs">
																		<CheckCircle className="w-3 h-3 mr-1" />
																		Verified
																	</Badge>
																)}
															</div>
															<p className="text-zinc-400 text-sm">{artist.genre}</p>
															<p className="text-emerald-400 text-sm font-medium">{artist.followers} followers</p>
														</div>
													</div>
												</CardContent>
											</Card>
										</HoverCardTrigger>
										<HoverCardContent className="w-80 bg-zinc-800 border-zinc-700">
											<div className="flex justify-between space-x-4">
												<Avatar className="w-16 h-16">
													<AvatarImage src={artist.image} alt={artist.name} />
													<AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white">
														{artist.name.split(' ').map(n => n[0]).join('')}
													</AvatarFallback>
												</Avatar>
												<div className="space-y-1">
													<h4 className="text-sm font-semibold text-white">{artist.name}</h4>
													<p className="text-xs text-zinc-400">{artist.genre} • {artist.followers} followers</p>
													<div className="flex items-center pt-2">
														<Badge variant="outline" className="text-xs border-emerald-500 text-emerald-400">
															Latest: {artist.latest}
														</Badge>
													</div>
												</div>
											</div>
											<div className="flex items-center justify-between pt-4">
												<Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
													<Heart className="w-4 h-4 mr-2" />
													Follow
												</Button>
												<div className="flex space-x-2">
													<Button size="sm" variant="outline" className="border-zinc-600 text-zinc-400 hover:bg-zinc-700">
														<Play className="w-4 h-4" />
													</Button>
													<Button size="sm" variant="outline" className="border-zinc-600 text-zinc-400 hover:bg-zinc-700">
														<MessageCircle className="w-4 h-4" />
													</Button>
												</div>
											</div>
										</HoverCardContent>
									</HoverCard>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700" />
						<CarouselNext className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700" />
					</Carousel>
				</div>
			</div>

			{/* Artist Section */}
			<div className="px-6 md:px-8 py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
							<Mic className="size-10 text-blue-400" />
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							For Artists & Musicians
						</h2>
						<p className="text-xl text-zinc-300 max-w-2xl mx-auto">
							Share your music with the world, get verified, and build your fanbase on Amar Gaan
						</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
						<div className="text-center p-6 bg-zinc-800/50 rounded-xl">
							<div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<CheckCircle className="size-8 text-blue-400" />
							</div>
							<h3 className="text-xl font-semibold text-white mb-3">Get Verified</h3>
							<p className="text-zinc-400">
								Earn the blue verification badge and build trust with your audience
							</p>
						</div>
						<div className="text-center p-6 bg-zinc-800/50 rounded-xl">
							<div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<Users className="size-8 text-purple-400" />
							</div>
							<h3 className="text-xl font-semibold text-white mb-3">Grow Your Fanbase</h3>
							<p className="text-zinc-400">
								Connect with listeners, share your story, and expand your reach
							</p>
						</div>
						<div className="text-center p-6 bg-zinc-800/50 rounded-xl">
							<div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<Star className="size-8 text-emerald-400" />
							</div>
							<h3 className="text-xl font-semibold text-white mb-3">Professional Profile</h3>
							<p className="text-zinc-400">
								Showcase your music, bio, and social media in a professional profile
							</p>
						</div>
					</div>

					<div className="text-center">
						<Button
							onClick={() => navigate("/artist/signup")}
							size="lg"
							className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-10 py-6 rounded-full"
						>
							<Mic className="mr-2 size-6" />
							Start Your Artist Journey
							<ArrowRight className="ml-2 size-6" />
						</Button>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<div className="px-6 md:px-8 py-20">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
						Why Choose Amar Gaan?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center p-6">
							<div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<Play className="size-8 text-emerald-400" />
							</div>
							<h3 className="text-xl font-semibold text-white mb-3">Unlimited Music</h3>
							<p className="text-zinc-400">
								Access millions of songs from your favorite artists. Stream high-quality music anytime, anywhere.
							</p>
						</div>
						<div className="text-center p-6">
							<div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<Users className="size-8 text-blue-400" />
							</div>
							<h3 className="text-xl font-semibold text-white mb-3">Social Experience</h3>
							<p className="text-zinc-400">
								See what your friends are listening to, share playlists, and discover new music together.
							</p>
						</div>
						<div className="text-center p-6">
							<div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<Headphones className="size-8 text-purple-400" />
							</div>
							<h3 className="text-xl font-semibold text-white mb-3">Personalized</h3>
							<p className="text-zinc-400">
								Get personalized recommendations based on your listening history and preferences.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Testimonials Section */}
			<div className="px-6 md:px-8 py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							What Our Users Say
						</h2>
						<p className="text-xl text-zinc-300 max-w-2xl mx-auto">
							Join thousands of satisfied music lovers and artists who have found their perfect platform
						</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<Card className="bg-zinc-800/50 border-zinc-700">
							<CardHeader>
								<div className="flex items-center space-x-2">
									<Quote className="size-5 text-purple-400" />
									<div className="flex space-x-1">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className="size-4 text-yellow-400 fill-current" />
										))}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-zinc-300 mb-4">
									"Amar Gaan has completely transformed how I discover music. The social features make it so much fun to share and explore new artists with friends."
								</p>
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
										<User className="size-5 text-white" />
									</div>
									<div>
										<div className="text-white font-semibold">Sarah Johnson</div>
										<div className="text-zinc-400 text-sm">Music Enthusiast</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-zinc-800/50 border-zinc-700">
							<CardHeader>
								<div className="flex items-center space-x-2">
									<Quote className="size-5 text-blue-400" />
									<div className="flex space-x-1">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className="size-4 text-yellow-400 fill-current" />
										))}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-zinc-300 mb-4">
									"As an independent artist, Amar Gaan has given me the platform I needed to reach new audiences. The verification process was smooth and professional."
								</p>
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
										<Mic className="size-5 text-white" />
									</div>
									<div>
										<div className="text-white font-semibold">Alex Chen</div>
										<div className="text-zinc-400 text-sm">Verified Artist</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-zinc-800/50 border-zinc-700">
							<CardHeader>
								<div className="flex items-center space-x-2">
									<Quote className="size-5 text-emerald-400" />
									<div className="flex space-x-1">
										{[...Array(5)].map((_, i) => (
											<Star key={i} className="size-4 text-yellow-400 fill-current" />
										))}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-zinc-300 mb-4">
									"The personalized recommendations are spot-on! I've discovered so many amazing artists I never would have found otherwise."
								</p>
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
										<Heart className="size-5 text-white" />
									</div>
									<div>
										<div className="text-white font-semibold">Maria Rodriguez</div>
										<div className="text-zinc-400 text-sm">Playlist Creator</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Pricing Section */}
			<div className="px-6 md:px-8 py-20">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Choose Your Plan
						</h2>
						<p className="text-xl text-zinc-300 max-w-2xl mx-auto">
							Start free and upgrade when you're ready. No hidden fees, cancel anytime.
						</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<Card className="bg-zinc-800/50 border-zinc-700 relative">
							<CardHeader className="text-center">
								<Badge variant="secondary" className="mb-4">Free</Badge>
								<CardTitle className="text-white text-3xl">$0</CardTitle>
								<CardDescription className="text-zinc-400">Perfect for getting started</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Unlimited music streaming</span>
									</div>
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Basic social features</span>
									</div>
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Create playlists</span>
									</div>
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Standard audio quality</span>
									</div>
								</div>
								<Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white">
									Get Started Free
								</Button>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-emerald-900/50 to-blue-900/50 border-emerald-500 relative">
							<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
								<Badge className="bg-emerald-500 text-white">Most Popular</Badge>
							</div>
							<CardHeader className="text-center">
								<CardTitle className="text-white text-3xl">$9.99</CardTitle>
								<CardDescription className="text-zinc-300">Premium experience</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Everything in Free</span>
									</div>
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">High-quality audio</span>
									</div>
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Offline downloads</span>
									</div>
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Advanced analytics</span>
									</div>
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Priority support</span>
									</div>
								</div>
								<Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
									Start Premium Trial
								</Button>
							</CardContent>
						</Card>

						<Card className="bg-zinc-800/50 border-zinc-700 relative">
							<CardHeader className="text-center">
								<Badge variant="outline" className="mb-4 border-blue-500 text-blue-400">Artist</Badge>
								<CardTitle className="text-white text-3xl">$19.99</CardTitle>
								<CardDescription className="text-zinc-400">For professional artists</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Everything in Premium</span>
									</div>
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Artist verification</span>
									</div>
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Advanced analytics</span>
									</div>
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Direct fan messaging</span>
									</div>
									<div className="flex items-center space-x-2">
										<CheckCircle className="size-4 text-emerald-400" />
										<span className="text-zinc-300">Revenue sharing</span>
									</div>
								</div>
								<Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
									<Mic className="mr-2 size-4" />
									Become an Artist
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="px-6 md:px-8 py-20 bg-gradient-to-r from-zinc-900/50 to-zinc-800/50">
				<div className="max-w-4xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Frequently Asked Questions
						</h2>
						<p className="text-xl text-zinc-300 max-w-2xl mx-auto">
							Everything you need to know about Amar Gaan
						</p>
					</div>
					
					<Accordion type="single" collapsible className="space-y-4">
						<AccordionItem value="item-1" className="bg-zinc-800/50 border-zinc-700 rounded-lg px-6">
							<AccordionTrigger className="text-white hover:text-emerald-400">
								How much does Amar Gaan cost?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-300">
								Amar Gaan offers a free tier with unlimited music streaming and basic features. We also offer Premium ($9.99/month) and Artist ($19.99/month) plans with additional features like high-quality audio, offline downloads, and advanced analytics.
							</AccordionContent>
						</AccordionItem>
						
						<AccordionItem value="item-2" className="bg-zinc-800/50 border-zinc-700 rounded-lg px-6">
							<AccordionTrigger className="text-white hover:text-emerald-400">
								How do I become a verified artist?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-300">
								To become a verified artist, sign up for an Artist account, complete your profile with your music and bio, and submit verification documents. Our team will review your application and grant verification to legitimate artists.
							</AccordionContent>
						</AccordionItem>
						
						<AccordionItem value="item-3" className="bg-zinc-800/50 border-zinc-700 rounded-lg px-6">
							<AccordionTrigger className="text-white hover:text-emerald-400">
								Can I download music for offline listening?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-300">
								Yes! Premium and Artist subscribers can download songs and playlists for offline listening. Simply tap the download button next to any song or playlist to save it to your device.
							</AccordionContent>
						</AccordionItem>
						
						<AccordionItem value="item-4" className="bg-zinc-800/50 border-zinc-700 rounded-lg px-6">
							<AccordionTrigger className="text-white hover:text-emerald-400">
								How does the social music experience work?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-300">
								Connect with friends to see what they're listening to in real-time, share playlists, and discover new music together. You can also follow your favorite artists and get notified when they release new music.
							</AccordionContent>
						</AccordionItem>
						
						<AccordionItem value="item-5" className="bg-zinc-800/50 border-zinc-700 rounded-lg px-6">
							<AccordionTrigger className="text-white hover:text-emerald-400">
								What audio quality do you support?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-300">
								Free users get standard quality (128kbps), while Premium and Artist subscribers enjoy high-quality audio (320kbps) for the best listening experience possible.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>

			{/* Social Media Integration */}
			<div className="px-6 md:px-8 py-20">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
							Connect Everywhere
						</h2>
						<p className="text-xl text-zinc-300 max-w-2xl mx-auto">
							Follow your favorite artists and share your music across all your favorite platforms
						</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300">
							<CardContent className="p-6 text-center">
								<div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<Instagram className="size-8 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-white mb-2">Instagram</h3>
								<p className="text-zinc-400 mb-4">Share your music moments and connect with fans</p>
								<Button variant="outline" className="border-pink-500 text-pink-400 hover:bg-pink-500 hover:text-white">
									Connect Instagram
								</Button>
							</CardContent>
						</Card>
						
						<Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300">
							<CardContent className="p-6 text-center">
								<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<Twitter className="size-8 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-white mb-2">Twitter</h3>
								<p className="text-zinc-400 mb-4">Share updates and engage with your audience</p>
								<Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
									Connect Twitter
								</Button>
							</CardContent>
						</Card>
						
						<Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300">
							<CardContent className="p-6 text-center">
								<div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<Youtube className="size-8 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-white mb-2">YouTube</h3>
								<p className="text-zinc-400 mb-4">Share music videos and behind-the-scenes content</p>
								<Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
									Connect YouTube
								</Button>
							</CardContent>
						</Card>
						
						<Card className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300">
							<CardContent className="p-6 text-center">
								<div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
									<Facebook className="size-8 text-white" />
								</div>
								<h3 className="text-xl font-semibold text-white mb-2">Facebook</h3>
								<p className="text-zinc-400 mb-4">Connect with friends and share your music journey</p>
								<Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white">
									Connect Facebook
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Newsletter Section */}
			<div className="px-6 md:px-8 py-20 bg-gradient-to-r from-emerald-900/20 to-blue-900/20">
				<div className="max-w-4xl mx-auto text-center">
					<div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
						<Mail className="size-10 text-emerald-400" />
					</div>
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Stay in the Loop
					</h2>
					<p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
						Get the latest updates on new features, artist releases, and exclusive content delivered to your inbox.
					</p>
					
					<Card className="bg-zinc-800/50 border-zinc-700 max-w-md mx-auto">
						<CardContent className="pt-6">
							<div className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email" className="text-white">Email Address</Label>
									<Input 
										id="email" 
										type="email" 
										placeholder="Enter your email" 
										className="bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400"
									/>
								</div>
								<Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
									<Mail className="mr-2 size-4" />
									Subscribe to Newsletter
								</Button>
								<p className="text-xs text-zinc-400">
									We respect your privacy. Unsubscribe at any time.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Mobile App Showcase */}
			<div className="px-6 md:px-8 py-20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div className="space-y-6">
							<h2 className="text-3xl md:text-4xl font-bold text-white">
								Take Your Music Everywhere
							</h2>
							<p className="text-xl text-zinc-300">
								Download the Amar Gaan mobile app and enjoy your favorite music on the go. Available for iOS and Android devices.
							</p>
							
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
										<Headphones className="size-6 text-emerald-400" />
									</div>
									<div>
										<h3 className="text-white font-semibold">Offline Listening</h3>
										<p className="text-zinc-400 text-sm">Download your favorite songs and listen without internet</p>
									</div>
								</div>
								
								<div className="flex items-center space-x-3">
									<div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
										<Users className="size-6 text-blue-400" />
									</div>
									<div>
										<h3 className="text-white font-semibold">Social Features</h3>
										<p className="text-zinc-400 text-sm">See what friends are listening to and share your music</p>
									</div>
								</div>
								
								<div className="flex items-center space-x-3">
									<div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
										<Star className="size-6 text-purple-400" />
									</div>
									<div>
										<h3 className="text-white font-semibold">Personalized Experience</h3>
										<p className="text-zinc-400 text-sm">Get recommendations based on your listening history</p>
									</div>
								</div>
							</div>
							
							<div className="flex flex-col sm:flex-row gap-4">
								<Button className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600">
									<Globe className="mr-2 size-5" />
									Download for iOS
								</Button>
								<Button className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600">
									<Globe className="mr-2 size-5" />
									Download for Android
								</Button>
							</div>
						</div>
						
						<div className="relative">
							<div className="relative mx-auto w-80 h-96 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl border border-zinc-700 shadow-2xl">
								{/* Mock phone screen */}
								<div className="absolute inset-4 bg-gradient-to-br from-emerald-900/50 to-blue-900/50 rounded-2xl p-6">
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
													<Music className="size-5 text-white" />
												</div>
												<span className="text-white font-bold">Amar Gaan</span>
											</div>
											<div className="w-6 h-6 bg-emerald-500 rounded-full"></div>
										</div>
										
										<div className="space-y-3">
											<div className="bg-zinc-800/50 rounded-lg p-3">
												<div className="flex items-center space-x-3">
													<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
													<div className="flex-1">
														<div className="text-white text-sm font-medium">Latest Release</div>
														<div className="text-zinc-400 text-xs">Featured Artist 1</div>
													</div>
													<Play className="size-5 text-emerald-400" />
												</div>
											</div>
											
											<div className="bg-zinc-800/50 rounded-lg p-3">
												<div className="flex items-center space-x-3">
													<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg"></div>
													<div className="flex-1">
														<div className="text-white text-sm font-medium">New Track</div>
														<div className="text-zinc-400 text-xs">Featured Artist 2</div>
													</div>
													<Play className="size-5 text-emerald-400" />
												</div>
											</div>
											
											<div className="bg-zinc-800/50 rounded-lg p-3">
												<div className="flex items-center space-x-3">
													<div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg"></div>
													<div className="flex-1">
														<div className="text-white text-sm font-medium">Fresh Sound</div>
														<div className="text-zinc-400 text-xs">Featured Artist 3</div>
													</div>
													<Play className="size-5 text-emerald-400" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="px-6 md:px-8 py-20">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
						Ready to Start Your Musical Journey?
					</h2>
					<p className="text-xl text-zinc-400 mb-8">
						Join thousands of music lovers who are already discovering new sounds every day.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button
							onClick={() => navigate("/sign-up")}
							size="lg"
							className="bg-emerald-600 hover:bg-emerald-700 text-white text-xl px-10 py-6 rounded-full"
						>
							Create Free Account
							<ArrowRight className="ml-2 size-6" />
						</Button>
						<Button
							onClick={() => navigate("/artist/signup")}
							variant="outline"
							size="lg"
							className="border-blue-600 text-blue-300 hover:bg-blue-700 hover:text-white text-xl px-10 py-6 rounded-full"
						>
							<Mic className="mr-2 size-6" />
							Join as Artist
						</Button>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="border-t border-zinc-800 px-6 md:px-8 py-8">
				<div className="max-w-6xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
									<Music className="size-5 text-white" />
								</div>
								<span className="text-lg font-bold text-white">Amar Gaan</span>
							</div>
							<p className="text-zinc-400 text-sm">
								Your ultimate social music platform for discovering, streaming, and sharing music with friends.
							</p>
						</div>
						
						<div className="space-y-4">
							<h3 className="text-white font-semibold">For Listeners</h3>
							<ul className="space-y-2 text-sm text-zinc-400">
								<li><a href="#" className="hover:text-white transition-colors">Discover Music</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Create Playlists</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Follow Friends</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Premium Features</a></li>
							</ul>
						</div>
						
						<div className="space-y-4">
							<h3 className="text-white font-semibold">For Artists</h3>
							<ul className="space-y-2 text-sm text-zinc-400">
								<li><a href="#" className="hover:text-white transition-colors">Artist Signup</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Get Verified</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Upload Music</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
							</ul>
						</div>
						
						<div className="space-y-4">
							<h3 className="text-white font-semibold">Support</h3>
							<ul className="space-y-2 text-sm text-zinc-400">
								<li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
								<li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
							</ul>
						</div>
					</div>
					
					<Separator className="bg-zinc-700 mb-8" />
					
					<div className="flex flex-col md:flex-row items-center justify-between">
						<div className="text-zinc-400 text-sm mb-4 md:mb-0">
							© 2024 Amar Gaan. All rights reserved.
						</div>
						<div className="flex items-center space-x-4 text-sm text-zinc-400">
							<span>Made with ❤️ for music lovers</span>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default LandingPage;
