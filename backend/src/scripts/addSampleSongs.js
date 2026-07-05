import { connectDB } from '../lib/db.js';
import { Song } from '../models/song.model.js';

const sampleSongs = [
	{
		title: "Bohemian Rhapsody",
		artist: "Queen",
		featuredArtist: "",
		album: "A Night at the Opera",
		duration: 5.55,
		genre: "Rock",
		mood: "Intense",
		releaseDate: "1975-10-31",
		imageUrl: "https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Queen",
		audioUrl: "https://example.com/bohemian-rhapsody.mp3"
	},
	{
		title: "Hotel California",
		artist: "Eagles",
		featuredArtist: "",
		album: "Hotel California",
		duration: 6.30,
		genre: "Rock",
		mood: "Dark",
		releaseDate: "1976-12-08",
		imageUrl: "https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=Eagles",
		audioUrl: "https://example.com/hotel-california.mp3"
	},
	{
		title: "Imagine",
		artist: "John Lennon",
		featuredArtist: "",
		album: "Imagine",
		duration: 3.03,
		genre: "Pop",
		mood: "Peaceful",
		releaseDate: "1971-10-11",
		imageUrl: "https://via.placeholder.com/300x300/45B7D1/FFFFFF?text=John+Lennon",
		audioUrl: "https://example.com/imagine.mp3"
	},
	{
		title: "Stairway to Heaven",
		artist: "Led Zeppelin",
		featuredArtist: "",
		album: "Led Zeppelin IV",
		duration: 8.02,
		genre: "Rock",
		mood: "Intense",
		releaseDate: "1971-11-08",
		imageUrl: "https://via.placeholder.com/300x300/96CEB4/FFFFFF?text=Led+Zeppelin",
		audioUrl: "https://example.com/stairway-to-heaven.mp3"
	},
	{
		title: "Billie Jean",
		artist: "Michael Jackson",
		featuredArtist: "",
		album: "Thriller",
		duration: 4.54,
		genre: "Pop",
		mood: "Energetic",
		releaseDate: "1983-01-02",
		imageUrl: "https://via.placeholder.com/300x300/FFEAA7/000000?text=Michael+Jackson",
		audioUrl: "https://example.com/billie-jean.mp3"
	},
	{
		title: "Like a Rolling Stone",
		artist: "Bob Dylan",
		featuredArtist: "",
		album: "Highway 61 Revisited",
		duration: 6.13,
		genre: "Folk",
		mood: "Reflective",
		releaseDate: "1965-07-20",
		imageUrl: "https://via.placeholder.com/300x300/DDA0DD/FFFFFF?text=Bob+Dylan",
		audioUrl: "https://example.com/like-a-rolling-stone.mp3"
	},
	{
		title: "Smells Like Teen Spirit",
		artist: "Nirvana",
		featuredArtist: "",
		album: "Nevermind",
		duration: 5.01,
		genre: "Alternative",
		mood: "Angry",
		releaseDate: "1991-09-10",
		imageUrl: "https://via.placeholder.com/300x300/98D8C8/FFFFFF?text=Nirvana",
		audioUrl: "https://example.com/smells-like-teen-spirit.mp3"
	},
	{
		title: "Yesterday",
		artist: "The Beatles",
		featuredArtist: "",
		album: "Help!",
		duration: 2.05,
		genre: "Pop",
		mood: "Melancholic",
		releaseDate: "1965-08-06",
		imageUrl: "https://via.placeholder.com/300x300/F7DC6F/000000?text=The+Beatles",
		audioUrl: "https://example.com/yesterday.mp3"
	},
	{
		title: "Good Vibrations",
		artist: "The Beach Boys",
		featuredArtist: "",
		album: "Smiley Smile",
		duration: 3.35,
		genre: "Pop",
		mood: "Happy",
		releaseDate: "1966-10-10",
		imageUrl: "https://via.placeholder.com/300x300/BB8FCE/FFFFFF?text=The+Beach+Boys",
		audioUrl: "https://example.com/good-vibrations.mp3"
	},
	{
		title: "Respect",
		artist: "Aretha Franklin",
		featuredArtist: "",
		album: "I Never Loved a Man the Way I Love You",
		duration: 2.27,
		genre: "R&B",
		mood: "Confident",
		releaseDate: "1967-04-16",
		imageUrl: "https://via.placeholder.com/300x300/85C1E9/FFFFFF?text=Aretha+Franklin",
		audioUrl: "https://example.com/respect.mp3"
	}
];

const addSampleSongs = async () => {
	try {
		console.log('🔄 Connecting to database...');
		await connectDB();
		
		console.log('🔄 Adding sample songs...');
		const results = [];
		
		for (const songData of sampleSongs) {
			try {
				// Check if song already exists
				const existingSong = await Song.findOne({ 
					title: songData.title, 
					artist: songData.artist 
				});
				
				if (existingSong) {
					console.log(`⚠️ Song already exists: ${songData.title} by ${songData.artist}`);
					continue;
				}
				
				const song = new Song(songData);
				await song.save();
				results.push(song);
				console.log(`✅ Added: ${songData.title} by ${songData.artist}`);
			} catch (error) {
				console.error(`❌ Error adding ${songData.title}:`, error.message);
			}
		}
		
		console.log(`🎉 Successfully added ${results.length} songs to database`);
		console.log('📊 Total songs in database:', await Song.countDocuments());
		
		process.exit(0);
	} catch (error) {
		console.error('❌ Error:', error);
		process.exit(1);
	}
};

addSampleSongs();
