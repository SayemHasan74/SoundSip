import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	isShuffled: boolean;
	repeatMode: 'off' | 'one' | 'all';
	originalQueue: Song[];

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
	toggleShuffle: () => void;
	toggleRepeat: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	isShuffled: false,
	repeatMode: 'off',
	originalQueue: [],

	initializeQueue: (songs: Song[]) => {
		set({
			queue: songs,
			originalQueue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},

	playAlbum: (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;

		const song = songs[startIndex];

		const socket = useChatStore.getState().socket;
		if (socket.connected) {
			socket.emit("update_activity", {
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}
		set({
			queue: songs,
			originalQueue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
		});
	},

	setCurrentSong: (song: Song | null) => {
		if (!song) return;

		const socket = useChatStore.getState().socket;
		if (socket.connected) {
			socket.emit("update_activity", {
				activity: `Playing ${song.title} by ${song.artist}`,
			});
		}

		const songIndex = get().queue.findIndex((s) => s._id === song._id);
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
		});
	},

	togglePlay: () => {
		const currentState = get();
		const willStartPlaying = !currentState.isPlaying;
		const currentSong = currentState.currentSong;

		console.log('🎵 togglePlay called:', {
			currentIsPlaying: currentState.isPlaying,
			willStartPlaying,
			currentSong: currentSong?.title
		});

		const socket = useChatStore.getState().socket;
		if (socket.connected) {
			socket.emit("update_activity", {
				activity:
					willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
			});
		}

		set({
			isPlaying: willStartPlaying,
		});

		console.log('🎵 togglePlay - state updated to isPlaying:', willStartPlaying);
	},

	toggleShuffle: () => {
		const { isShuffled, originalQueue, currentSong } = get();
		const newShuffled = !isShuffled;
		
		if (newShuffled) {
			// Shuffle the queue
			const shuffledQueue = [...originalQueue].sort(() => Math.random() - 0.5);
			const currentSongIndex = shuffledQueue.findIndex(s => s._id === currentSong?._id);
			
			set({
				queue: shuffledQueue,
				isShuffled: true,
				currentIndex: currentSongIndex !== -1 ? currentSongIndex : 0,
			});
		} else {
			// Restore original order
			const currentSongIndex = originalQueue.findIndex(s => s._id === currentSong?._id);
			
			set({
				queue: originalQueue,
				isShuffled: false,
				currentIndex: currentSongIndex !== -1 ? currentSongIndex : 0,
			});
		}
	},

	toggleRepeat: () => {
		const currentState = get();
		const { repeatMode } = currentState;
		let newMode: 'off' | 'one' | 'all';
		
		console.log('🔁 Toggle Repeat - Current mode:', repeatMode);
		
		switch (repeatMode) {
			case 'off':
				newMode = 'all';
				break;
			case 'all':
				newMode = 'one';
				break;
			case 'one':
				newMode = 'off';
				break;
			default:
				newMode = 'off';
		}
		
		console.log('🔁 Toggle Repeat - New mode:', newMode);
		
		// Update state immediately with the new repeat mode
		set({
			...currentState,
			repeatMode: newMode
		});
	},

	playNext: () => {
		const { currentIndex, queue, repeatMode, isShuffled, originalQueue } = get();
		const nextIndex = currentIndex + 1;

		// if there is a next song to play, let's play it
		if (nextIndex < queue.length) {
			const nextSong = queue[nextIndex];

			const socket = useChatStore.getState().socket;
			if (socket.connected) {
				socket.emit("update_activity", {
					activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
				});
			}

			set({
				currentSong: nextSong,
				currentIndex: nextIndex,
				isPlaying: true,
			});
		} else {
			// Handle shuffle mode first - shuffle takes precedence over repeat
			if (isShuffled && originalQueue.length > 0) {
				// Generate new shuffled queue from original album
				const shuffledQueue = [...originalQueue].sort(() => Math.random() - 0.5);
				const firstSong = shuffledQueue[0];

				if (firstSong) {
					const socket = useChatStore.getState().socket;
					if (socket.connected) {
						socket.emit("update_activity", {
							activity: `Playing ${firstSong.title} by ${firstSong.artist}`,
						});
					}

					set({
						queue: shuffledQueue,
						currentSong: firstSong,
						currentIndex: 0,
						isPlaying: true,
					});
				} else {
					set({ isPlaying: false });
				}
			} else {
				// Handle repeat modes when shuffle is off
				if (repeatMode === 'all') {
					// Repeat all - start from beginning
					const firstSong = queue[0];
					if (firstSong) {
						const socket = useChatStore.getState().socket;
						if (socket.connected) {
							socket.emit("update_activity", {
								activity: `Playing ${firstSong.title} by ${firstSong.artist}`,
							});
						}
						set({
							currentSong: firstSong,
							currentIndex: 0,
							isPlaying: true,
						});
					} else {
						set({ isPlaying: false });
					}
				} else if (repeatMode === 'one') {
					// Repeat one - restart current song
					const currentSong = get().currentSong;
					if (currentSong) {
						set({ isPlaying: true });
					} else {
						set({ isPlaying: false });
					}
				} else {
					// No repeat - stop playing
					set({ isPlaying: false });

					const socket = useChatStore.getState().socket;
					if (socket.connected) {
						socket.emit("update_activity", {
							activity: `Idle`,
						});
					}
				}
			}
		}
	},
	playPrevious: () => {
		const { currentIndex, queue, repeatMode, isShuffled, originalQueue } = get();
		const prevIndex = currentIndex - 1;

		// theres a prev song
		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];

			const socket = useChatStore.getState().socket;
			if (socket.connected) {
				socket.emit("update_activity", {
					activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
				});
			}

			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});
		} else {
			// Handle shuffle mode first - shuffle takes precedence over repeat
			if (isShuffled && originalQueue.length > 0) {
				// Generate new shuffled queue from original album
				const shuffledQueue = [...originalQueue].sort(() => Math.random() - 0.5);
				const lastSong = shuffledQueue[shuffledQueue.length - 1];

				if (lastSong) {
					const socket = useChatStore.getState().socket;
					if (socket.connected) {
						socket.emit("update_activity", {
							activity: `Playing ${lastSong.title} by ${lastSong.artist}`,
						});
					}

					set({
						queue: shuffledQueue,
						currentSong: lastSong,
						currentIndex: shuffledQueue.length - 1,
						isPlaying: true,
					});
				} else {
					set({ isPlaying: false });
				}
			} else {
				// Handle repeat modes when going backwards and shuffle is off
				if (repeatMode === 'all') {
					// Repeat all - go to last song
					const lastSong = queue[queue.length - 1];
					if (lastSong) {
						const socket = useChatStore.getState().socket;
						if (socket.connected) {
							socket.emit("update_activity", {
								activity: `Playing ${lastSong.title} by ${lastSong.artist}`,
							});
						}
						set({
							currentSong: lastSong,
							currentIndex: queue.length - 1,
							isPlaying: true,
						});
					} else {
						set({ isPlaying: false });
					}
				} else if (repeatMode === 'one') {
					// Repeat one - restart current song
					const currentSong = get().currentSong;
					if (currentSong) {
						set({ isPlaying: true });
					} else {
						set({ isPlaying: false });
					}
				} else {
					// No repeat - stop playing
					set({ isPlaying: false });

					const socket = useChatStore.getState().socket;
					if (socket.connected) {
						socket.emit("update_activity", {
							activity: `Idle`,
						});
					}
				}
			}
		}
	},
}));
