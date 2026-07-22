import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	ArrowRight,
	BarChart3,
	Check,
	CheckCircle2,
	Facebook,
	Globe2,
	Headphones,
	Instagram,
	Mail,
	MessageCircle,
	Mic2,
	Music2,
	Play,
	Quote,
	ShieldCheck,
	Sparkles,
	Star,
	Twitter,
	Users,
	Youtube,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./LandingPage.css";

const artists = [
	{ name: "Nora Vale", genre: "Dream Pop", followers: "2.5M", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop&crop=face" },
	{ name: "Eli Rowan", genre: "Electronic", followers: "1.8M", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=600&fit=crop&crop=face" },
	{ name: "Maya Hart", genre: "R&B", followers: "3.2M", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop&crop=face" },
	{ name: "Theo James", genre: "Indie Rock", followers: "1.5M", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop&crop=face" },
];

const features = [
	{ icon: Play, title: "Unlimited listening", copy: "Stream every release, playlist, and new discovery without breaking your flow.", color: "emerald" },
	{ icon: Users, title: "Listen socially", copy: "Follow friends, share playlists, and see what your circle is playing in real time.", color: "blue" },
	{ icon: Sparkles, title: "Made for your taste", copy: "Find recommendations shaped by your listening history, likes, and favorite artists.", color: "cyan" },
];

const testimonials = [
	{ quote: "SoundSip changed how I discover music. Sharing a playlist with friends finally feels as natural as sending a message.", name: "Sarah Johnson", role: "Music enthusiast" },
	{ quote: "I found listeners who genuinely care about my work. The artist profile and analytics give every release a proper home.", name: "Alex Chen", role: "Verified artist" },
	{ quote: "The recommendations understand the mood I am after, and I keep finding artists I would never have searched for myself.", name: "Maria Rodriguez", role: "Playlist curator" },
];

const plans = [
	{ name: "Free", price: "$0", description: "Everything you need to start listening.", features: ["Unlimited streaming", "Social listening", "Create playlists", "Standard audio"], action: "Start free", route: "/sign-up" },
	{ name: "Premium", price: "$9.99", description: "A richer everyday listening experience.", features: ["Everything in Free", "High-quality audio", "Offline downloads", "Advanced recommendations", "Priority support"], action: "Start premium trial", route: "/sign-up", featured: true },
	{ name: "Artist", price: "$19.99", description: "Tools for publishing and growing your audience.", features: ["Everything in Premium", "Artist verification", "Audience analytics", "Direct fan messaging", "Revenue sharing"], action: "Join as an artist", route: "/artist/signup" },
];

const faqs = [
	["How much does SoundSip cost?", "SoundSip has a free tier with unlimited streaming and core social features. Premium is $9.99 per month, while the Artist plan is $19.99 per month."],
	["How do I become a verified artist?", "Create an Artist account, complete your profile, add your music and bio, then submit your verification details for review."],
	["Can I download music for offline listening?", "Yes. Premium and Artist members can save songs and playlists for offline listening from supported devices."],
	["How does social listening work?", "Follow friends to see their current listening activity, share playlists, chat privately, and follow artists for new-release updates."],
	["What audio quality is supported?", "Free listening uses standard quality, while Premium and Artist plans unlock high-quality 320 kbps streaming."],
];

const LandingPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [subscribed, setSubscribed] = useState(false);

	const subscribe = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!email.trim()) return;
		setSubscribed(true);
		setEmail("");
	};

	return (
		<div className="landing-page min-h-screen overflow-x-hidden bg-[#09090b] text-white">
			<header className="landing-nav">
				<a href="#top" className="landing-brand" aria-label="SoundSip home">
					<span className="landing-brand-mark"><Music2 aria-hidden="true" /></span>
					<span>SoundSip</span>
				</a>
				<nav className="hidden items-center gap-7 lg:flex" aria-label="Landing page">
					<a href="#discover">Discover</a>
					<a href="#artists">For artists</a>
					<a href="#pricing">Pricing</a>
					<a href="#faq">FAQ</a>
				</nav>
				<div className="flex items-center gap-2 sm:gap-3">
					<Button variant="ghost" onClick={() => navigate("/login")} className="hidden text-zinc-200 hover:bg-white/10 hover:text-white sm:inline-flex">Sign in</Button>
					<Button onClick={() => navigate("/artist/signup")} variant="outline" className="hidden border-blue-500/60 bg-transparent text-blue-200 hover:bg-blue-500/15 hover:text-white md:inline-flex"><Mic2 className="mr-2 size-4" />Artist signup</Button>
					<Button onClick={() => navigate("/sign-up")} className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400">Get started</Button>
				</div>
			</header>

			<main id="top">
				<section className="landing-hero" aria-labelledby="hero-title">
					<div className="landing-hero-copy">
						<p className="landing-kicker"><span /> Live playlists. Real friends. Fresh artists.</p>
						<h1 id="hero-title">Music that moves <span>with you.</span></h1>
						<p className="landing-lede">Stream songs, follow artists, build playlists, and share what you are listening to with friends in one social music space.</p>
						<div className="flex flex-col gap-3 sm:flex-row">
							<Button size="lg" onClick={() => navigate("/sign-up")} className="h-12 bg-emerald-500 px-6 font-bold text-zinc-950 hover:bg-emerald-400">Start listening free <ArrowRight className="ml-2 size-5" /></Button>
							<Button size="lg" variant="outline" onClick={() => navigate("/artist/signup")} className="h-12 border-zinc-600 bg-zinc-900/50 px-6 text-white hover:bg-zinc-800 hover:text-white"><Mic2 className="mr-2 size-5" />Become an artist</Button>
						</div>
						<div className="landing-mini-stats" aria-label="SoundSip highlights">
							<div><strong>10M+</strong><span>active listeners</span></div>
							<div><strong>50K+</strong><span>artists growing</span></div>
							<div><strong>24/7</strong><span>music everywhere</span></div>
						</div>
					</div>

					<div className="vinyl-stage" aria-label="Animated vinyl player">
						<div className="vinyl-player">
							<div className="vinyl-record"><span className="vinyl-label"><Music2 /></span></div>
							<div className="vinyl-pivot" />
							<div className="vinyl-arm"><span /></div>
							<span className="music-note note-one"><Music2 /></span>
							<span className="music-note note-two"><Music2 /></span>
							<span className="music-note note-three"><Music2 /></span>
							<span className="music-note note-four"><Music2 /></span>
							<div className="now-playing">
								<div><small>NOW SPINNING</small><strong>Discover Weekly</strong></div>
								<div className="equalizer" aria-hidden="true"><i /><i /><i /><i /></div>
							</div>
						</div>
					</div>
				</section>

				<div className="capability-strip">
					<span><Users /> Social listening</span><span><ShieldCheck /> Private chats</span><span><CheckCircle2 /> Artist verification</span><span><Sparkles /> Curated discovery</span>
				</div>

				<section id="discover" className="landing-section">
					<div className="section-heading"><p>YOUR SOUND, CONNECTED</p><h2>More than pressing play.</h2><span>SoundSip brings listening, discovery, and the people behind the music into one focused experience.</span></div>
					<div className="feature-grid">
						{features.map(({ icon: Icon, title, copy, color }) => <article key={title} className={`feature-item feature-${color}`}><span className="feature-icon"><Icon /></span><h3>{title}</h3><p>{copy}</p></article>)}
					</div>
				</section>

				<section className="landing-section artist-showcase">
					<div className="section-heading section-heading-left"><p>FRESH FINDS</p><h2>Artists worth turning up.</h2><span>Follow new voices, hear their latest work, and stay close to every release.</span></div>
					<div className="artist-grid">
						{artists.map((artist, index) => <article className="artist-card" key={artist.name}><div className="artist-image-wrap"><img src={artist.image} alt={artist.name} /><Button size="icon" aria-label={`Play ${artist.name}`} className="artist-play"><Play className="size-5 fill-current" /></Button></div><div><div className="flex items-center gap-2"><h3>{artist.name}</h3>{index < 3 && <CheckCircle2 className="size-4 text-blue-400" aria-label="Verified" />}</div><p>{artist.genre}</p><span>{artist.followers} followers</span></div></article>)}
					</div>
				</section>

				<section id="artists" className="artist-band">
					<div className="artist-band-inner">
						<div><p className="landing-kicker"><span /> Built for independent artists</p><h2>Give every release room to grow.</h2><p>Build a verified profile, upload your work, understand your audience, and connect directly with the listeners who care.</p><Button size="lg" onClick={() => navigate("/artist/signup")} className="mt-7 bg-blue-500 text-white hover:bg-blue-400"><Mic2 className="mr-2 size-5" />Start your artist journey <ArrowRight className="ml-2 size-5" /></Button></div>
						<div className="artist-benefits"><div><CheckCircle2 /><span><strong>Get verified</strong>Build trust with a professional artist identity.</span></div><div><BarChart3 /><span><strong>Know your audience</strong>Track growth and learn what listeners love.</span></div><div><MessageCircle /><span><strong>Reach your fans</strong>Share releases and keep the conversation going.</span></div></div>
					</div>
				</section>

				<section className="landing-section">
					<div className="section-heading"><p>COMMUNITY FAVORITES</p><h2>Made for music people.</h2><span>Listeners and artists use SoundSip to find their next favorite connection.</span></div>
					<div className="testimonial-grid">{testimonials.map((item) => <figure key={item.name}><Quote /><div className="stars" aria-label="5 out of 5 stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} />)}</div><blockquote>{item.quote}</blockquote><figcaption><strong>{item.name}</strong><span>{item.role}</span></figcaption></figure>)}</div>
				</section>

				<section id="pricing" className="landing-section pricing-section">
					<div className="section-heading"><p>SIMPLE PLANS</p><h2>Start free. Grow when you are ready.</h2><span>No hidden fees. Pick the listening experience that fits you.</span></div>
					<div className="pricing-grid">{plans.map((plan) => <article key={plan.name} className={plan.featured ? "price-card featured" : "price-card"}>{plan.featured && <span className="popular-label">MOST POPULAR</span>}<p className="plan-name">{plan.name}</p><div className="plan-price">{plan.price}<small>/month</small></div><p className="plan-description">{plan.description}</p><ul>{plan.features.map((feature) => <li key={feature}><Check />{feature}</li>)}</ul><Button onClick={() => navigate(plan.route)} className={plan.featured ? "w-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400" : "w-full bg-zinc-800 text-white hover:bg-zinc-700"}>{plan.action}</Button></article>)}</div>
				</section>

				<section className="mobile-band">
					<div className="mobile-band-copy"><p className="landing-kicker"><span /> MUSIC EVERYWHERE</p><h2>Your collection travels with you.</h2><p>Take playlists, social listening, and personalized discovery wherever the day goes.</p><div className="mobile-points"><span><Headphones /> Offline listening</span><span><Users /> Friends activity</span><span><Sparkles /> Personal recommendations</span></div><div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => navigate("/sign-up")} className="border-zinc-600 bg-zinc-900/60 text-white hover:bg-zinc-800 hover:text-white"><Globe2 className="mr-2 size-4" />Try the web app</Button></div></div>
					<div className="phone-shell" aria-label="SoundSip mobile app preview"><div className="phone-screen"><div className="phone-brand"><span className="landing-brand-mark"><Music2 /></span><strong>SoundSip</strong></div><p>Made for you</p>{artists.slice(0, 3).map((artist, i) => <div className="phone-track" key={artist.name}><img src={artist.image} alt="" /><span><strong>{["Afterglow", "City Static", "Quiet Hours"][i]}</strong><small>{artist.name}</small></span><Play /></div>)}</div></div>
				</section>

				<section id="faq" className="landing-section faq-section">
					<div className="section-heading"><p>GOOD TO KNOW</p><h2>Frequently asked questions.</h2><span>The essentials about listening and publishing on SoundSip.</span></div>
					<Accordion type="single" collapsible className="faq-list">{faqs.map(([question, answer], index) => <AccordionItem key={question} value={`faq-${index}`}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>)}</Accordion>
				</section>

				<section className="connect-section landing-section">
					<div className="section-heading"><p>SHARE THE MOMENT</p><h2>Connect everywhere.</h2><span>Bring your music identity to the platforms where your audience already lives.</span></div>
					<div className="social-row"><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="SoundSip on Instagram"><Instagram /></a><a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="SoundSip on Twitter"><Twitter /></a><a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="SoundSip on YouTube"><Youtube /></a><a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="SoundSip on Facebook"><Facebook /></a></div>
				</section>

				<section className="newsletter-band">
					<div><p className="landing-kicker"><span /> STAY IN THE LOOP</p><h2>Fresh releases, without the noise.</h2><p>New artists, product updates, and listening picks delivered thoughtfully.</p></div>
					<form onSubmit={subscribe}><label htmlFor="landing-email" className="sr-only">Email address</label><div className="newsletter-form"><Input id="landing-email" type="email" required value={email} onChange={(event) => { setEmail(event.target.value); setSubscribed(false); }} placeholder="you@example.com" className="h-12 border-zinc-700 bg-zinc-950/70 text-white placeholder:text-zinc-500" /><Button type="submit" className="h-12 bg-emerald-500 px-6 text-zinc-950 hover:bg-emerald-400"><Mail className="mr-2 size-4" />Subscribe</Button></div>{subscribed && <p className="subscription-success" role="status"><CheckCircle2 /> You are on the list.</p>}</form>
				</section>

				<section className="final-cta"><Music2 /><h2>Your next favorite song is waiting.</h2><p>Join listeners and artists building a more social way to hear music.</p><div><Button size="lg" onClick={() => navigate("/sign-up")} className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400">Create free account <ArrowRight className="ml-2 size-5" /></Button><Button size="lg" variant="ghost" onClick={() => navigate("/artist/signup")} className="text-blue-200 hover:bg-blue-500/10 hover:text-white">Join as artist</Button></div></section>
			</main>

			<footer className="landing-footer"><div className="landing-brand"><span className="landing-brand-mark"><Music2 /></span><span>SoundSip</span></div><p>Music feels better together.</p><nav aria-label="Footer"><a href="#discover">Discover</a><a href="#artists">Artists</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></nav><span>© {new Date().getFullYear()} SoundSip</span></footer>
		</div>
	);
};

export default LandingPage;
