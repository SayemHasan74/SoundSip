import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
	onEmojiSelect: (emoji: string) => void;
	onClose?: () => void;
	className?: string;
}

const emojiCategories = {
	recent: {
		name: "Recent",
		emojis: ["😀", "😂", "❤️", "👍", "🔥", "😍", "😊", "👏"]
	},
	people: {
		name: "People",
		emojis: [
			"😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃",
			"😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜",
			"🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟",
			"😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠",
			"😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
			"🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧",
			"😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧",
			"😷", "🤒", "🤕"
		]
	},
	nature: {
		name: "Nature",
		emojis: [
			"🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮",
			"🐷", "🐽", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤",
			"🐣", "🐥", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛",
			"🦋", "🐌", "🐞", "🐜", "🦟", "🦗", "🕷️", "🕸️", "🦂", "🐢", "🐍", "🦎",
			"🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳",
			"🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🐘", "🦛", "🦏", "🐪",
			"🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐",
			"🦌", "🐕", "🐩", "🦮", "🐕‍🦺", "🐈", "🐓", "🦃", "🦚", "🦜", "🦢", "🦩"
		]
	},
	food: {
		name: "Food",
		emojis: [
			"🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑",
			"🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑",
			"🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨",
			"🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭",
			"🍔", "🍟", "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘",
			"🫕", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙",
			"🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁",
			"🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯"
		]
	},
	activity: {
		name: "Activity",
		emojis: [
			"⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓",
			"🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿",
			"🥊", "🥋", "🎽", "🛹", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️‍♀️",
			"🏋️", "🏋️‍♂️", "🤼‍♀️", "🤼", "🤼‍♂️", "🤸‍♀️", "🤸", "🤸‍♂️", "⛹️‍♀️", "⛹️",
			"⛹️‍♂️", "🤺", "🤾‍♀️", "🤾", "🤾‍♂️", "🏌️‍♀️", "🏌️", "🏌️‍♂️", "🏇", "🧘‍♀️",
			"🧘", "🧘‍♂️", "🏄‍♀️", "🏄", "🏄‍♂️", "🏊‍♀️", "🏊", "🏊‍♂️", "🤽‍♀️", "🤽",
			"🤽‍♂️", "🚣‍♀️", "🚣", "🚣‍♂️", "🧗‍♀️", "🧗", "🧗‍♂️", "🚵‍♀️", "🚵", "🚵‍♂️",
			"🚴‍♀️", "🚴", "🚴‍♂️", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🏵️", "🎗️"
		]
	},
	objects: {
		name: "Objects",
		emojis: [
			"⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽",
			"💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽️", "🎞️", "📞", "☎️",
			"📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️",
			"⌛", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸",
			"💵", "💴", "💶", "💷", "🪙", "💰", "💳", "💎", "⚖️", "🪜", "🧰", "🔧",
			"🔨", "⚒️", "🛠️", "⛏️", "🪓", "🪚", "🔩", "⚙️", "🪤", "🧱", "⛓️", "🧲",
			"🔫", "💣", "🧨", "🪓", "🔪", "🗡️", "⚔️", "🛡️", "🚬", "⚰️", "🪦", "⚱️"
		]
	},
	symbols: {
		name: "Symbols",
		emojis: [
			"❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕",
			"💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️",
			"✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊", "♋", "♌",
			"♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚛️", "🉑", "☢️", "☣️",
			"📴", "📳", "🈶", "🈚", "🈸", "🈺", "🈷️", "✴️", "🆚", "💮", "🉐", "㊙️",
			"㊗️", "🈴", "🈵", "🈹", "🈲", "🅰️", "🅱️", "🆎", "🆑", "🅾️", "🆘", "❌",
			"⭕", "🛑", "⛔", "📛", "🚫", "💯", "💢", "♨️", "🚷", "🚯", "🚳", "🚱"
		]
	}
};

const EmojiPicker = ({ onEmojiSelect, onClose, className }: EmojiPickerProps) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("recent");

	const filteredEmojis = useMemo(() => {
		if (!searchQuery.trim()) return emojiCategories;

		const filtered: typeof emojiCategories = {};
		Object.entries(emojiCategories).forEach(([key, category]) => {
			const matchingEmojis = category.emojis.filter(emoji => 
				// This is a simple search - in a real app you'd want emoji names/keywords
				emoji.includes(searchQuery) || category.name.toLowerCase().includes(searchQuery.toLowerCase())
			);
			if (matchingEmojis.length > 0) {
				filtered[key as keyof typeof emojiCategories] = {
					...category,
					emojis: matchingEmojis
				};
			}
		});
		return filtered;
	}, [searchQuery]);

	const handleEmojiClick = (emoji: string) => {
		onEmojiSelect(emoji);
		onClose?.();
	};

	return (
		<div className={cn(
			"bg-zinc-800 border border-zinc-600 rounded-lg shadow-xl",
			"w-80 h-96",
			className
		)}>
			{/* Search */}
			<div className="p-3 border-b border-zinc-700">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
					<Input
						placeholder="Search emojis..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 bg-zinc-700/50 border-zinc-600/50 text-white placeholder:text-zinc-400"
					/>
				</div>
			</div>

			{/* Emoji categories */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
				<TabsList className="grid grid-cols-6 bg-zinc-700/50 m-2">
					{Object.entries(emojiCategories).map(([key, category]) => (
						<TabsTrigger 
							key={key} 
							value={key}
							className="text-xs data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400"
						>
							{category.name}
						</TabsTrigger>
					))}
				</TabsList>

				<div className="flex-1 overflow-hidden">
					{Object.entries(filteredEmojis).map(([key, category]) => (
						<TabsContent key={key} value={key} className="h-full m-0 p-0">
							<ScrollArea className="h-full">
								<div className="p-3 grid grid-cols-8 gap-1">
									{category.emojis.map((emoji) => (
										<Button
											key={emoji}
											variant="ghost"
											size="sm"
											onClick={() => handleEmojiClick(emoji)}
											className="h-10 w-10 p-0 hover:bg-zinc-700/50 text-lg"
											title={emoji}
										>
											{emoji}
										</Button>
									))}
								</div>
							</ScrollArea>
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	);
};

export default EmojiPicker;
