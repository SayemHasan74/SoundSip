import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
	Search, 
	Clock, 
	TrendingUp, 
	Music, 
	X,
	History,
	Sparkles
} from 'lucide-react';
import { SearchSuggestion } from '@/lib/searchService';

interface SearchSuggestionsProps {
	suggestions: SearchSuggestion[];
	isLoading: boolean;
	onSuggestionClick: (suggestion: SearchSuggestion) => void;
	onClearRecent?: () => void;
	showClearButton?: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
	suggestions,
	isLoading,
	onSuggestionClick,
	onClearRecent,
	showClearButton = false
}) => {
	// Group suggestions by type
	const recentSearches = suggestions.filter(s => s.type === 'recent');
	const trendingSearches = suggestions.filter(s => s.type === 'trending');
	const genreSuggestions = suggestions.filter(s => s.type === 'suggestion');

	const getIcon = (icon?: string) => {
		switch (icon) {
			case 'Clock':
				return <Clock className="w-3 h-3" />;
			case 'TrendingUp':
				return <TrendingUp className="w-3 h-3" />;
			case 'Music':
				return <Music className="w-3 h-3" />;
			default:
				return <Search className="w-3 h-3" />;
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'recent':
				return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
			case 'trending':
				return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
			case 'suggestion':
				return 'bg-green-500/10 text-green-400 border-green-500/20';
			default:
				return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
		}
	};

	if (isLoading) {
		return (
			<Card className="bg-zinc-800/50 border-zinc-700">
				<CardHeader className="pb-3">
					<CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
						<Search className="w-4 h-4" />
						Search Suggestions
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="flex items-center gap-2 p-2">
							<Skeleton className="w-3 h-3 rounded" />
							<Skeleton className="h-4 flex-1" />
						</div>
					))}
				</CardContent>
			</Card>
		);
	}

	if (suggestions.length === 0) {
		return null;
	}

	return (
		<Card className="bg-zinc-800/50 border-zinc-700">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-sm text-zinc-400 flex items-center gap-2">
						<Search className="w-4 h-4" />
						Search Suggestions
					</CardTitle>
					{showClearButton && recentSearches.length > 0 && onClearRecent && (
						<Button
							variant="ghost"
							size="sm"
							onClick={onClearRecent}
							className="h-6 px-2 text-xs text-zinc-500 hover:text-zinc-300"
						>
							<X className="w-3 h-3 mr-1" />
							Clear
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Recent Searches */}
				{recentSearches.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-xs text-zinc-500">
							<History className="w-3 h-3" />
							Recent Searches
						</div>
						{recentSearches.map((suggestion) => (
							<button
								key={suggestion.id}
								onClick={() => onSuggestionClick(suggestion)}
								className="w-full text-left p-2 rounded-md hover:bg-zinc-700/50 transition-colors flex items-center gap-2 group"
							>
								{getIcon(suggestion.icon)}
								<span className="text-white group-hover:text-emerald-400 transition-colors">
									{suggestion.text}
								</span>
								<Badge 
									variant="outline" 
									className={`ml-auto text-xs ${getTypeColor(suggestion.type)}`}
								>
									Recent
								</Badge>
							</button>
						))}
					</div>
				)}

				{/* Trending Searches */}
				{trendingSearches.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-xs text-zinc-500">
							<TrendingUp className="w-3 h-3" />
							Trending
						</div>
						{trendingSearches.map((suggestion) => (
							<button
								key={suggestion.id}
								onClick={() => onSuggestionClick(suggestion)}
								className="w-full text-left p-2 rounded-md hover:bg-zinc-700/50 transition-colors flex items-center gap-2 group"
							>
								{getIcon(suggestion.icon)}
								<span className="text-white group-hover:text-emerald-400 transition-colors">
									{suggestion.text}
								</span>
								<Badge 
									variant="outline" 
									className={`ml-auto text-xs ${getTypeColor(suggestion.type)}`}
								>
									Trending
								</Badge>
							</button>
						))}
					</div>
				)}

				{/* Genre Suggestions */}
				{genreSuggestions.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-xs text-zinc-500">
							<Sparkles className="w-3 h-3" />
							Genres & Moods
						</div>
						<div className="flex flex-wrap gap-2">
							{genreSuggestions.map((suggestion) => (
								<Button
									key={suggestion.id}
									variant="outline"
									size="sm"
									onClick={() => onSuggestionClick(suggestion)}
									className="bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-700 hover:border-emerald-500 transition-colors"
								>
									{getIcon(suggestion.icon)}
									{suggestion.text}
								</Button>
							))}
						</div>
					</div>
				)}

				{/* Quick Search Categories */}
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-xs text-zinc-500">
						<Music className="w-3 h-3" />
						Quick Search
					</div>
					<div className="grid grid-cols-2 gap-2">
						{['Pop', 'Rock', 'Hip-Hop', 'Jazz'].map((category) => (
							<Button
								key={category}
								variant="outline"
								size="sm"
								onClick={() => onSuggestionClick({ 
									id: category, 
									text: category, 
									type: 'suggestion' 
								})}
								className="bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-700 hover:border-emerald-500 transition-colors"
							>
								{category}
							</Button>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default SearchSuggestions;
