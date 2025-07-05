// English stopwords list
export const ENGLISH_STOPWORDS = new Set([
	'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'as', 'are',
	'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does',
	'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must',
	'shall', 'to', 'of', 'in', 'for', 'with', 'by', 'from', 'about',
	'into', 'through', 'during', 'before', 'after', 'above', 'below',
	'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further',
	'then', 'once', 'that', 'this', 'these', 'those', 'i', 'you', 'he',
	'she', 'it', 'we', 'they', 'them', 'their', 'what', 'which', 'who',
	'when', 'where', 'why', 'how', 'all', 'both', 'each', 'few', 'more',
	'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
	'same', 'so', 'than', 'too', 'very', 'can', 'just', 'but'
]);

/**
 * Extracts keywords from English text
 */
export function extractEnglishKeywords(text: string, limit = 20): string[] {
	const words = text
		.toLowerCase()
		.replace(/[#[\]]/g, '')
		.replace(/[^\w\s]/g, ' ')
		.split(/\s+/)
		.filter(word => word.length > 3 && !ENGLISH_STOPWORDS.has(word));

	const wordCount = new Map<string, number>();
	for (const word of words) {
		wordCount.set(word, (wordCount.get(word) || 0) + 1);
	}

	return Array.from(wordCount.entries())
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit)
		.map(([word]) => word);
}
