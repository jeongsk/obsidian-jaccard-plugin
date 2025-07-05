import { Vault, TFile, MetadataCache } from 'obsidian';
import { hasKorean, extractKoreanKeywords } from './korean';
import { extractEnglishKeywords } from './english';

export interface NoteIndex {
	path: string;
	tags: Set<string>;
	links: Set<string>;
	keywords: Set<string>;
	lastModified: number;
}

export class IndexingService {
	private vault: Vault;
	private metadataCache: MetadataCache;
	private index: Map<string, NoteIndex> = new Map();

	constructor(vault: Vault, metadataCache: MetadataCache) {
		this.vault = vault;
		this.metadataCache = metadataCache;
	}

	async reindexAll(): Promise<void> {
		this.index.clear();
		const files = this.vault.getMarkdownFiles();

		for (const file of files) {
			await this.updateIndex(file);
		}
	}

	async updateIndex(file: TFile): Promise<void> {
		const content = await this.vault.cachedRead(file);
		const metadata = this.metadataCache.getFileCache(file);

		const tags = new Set<string>();
		const links = new Set<string>();
		const keywords = new Set<string>();

		if (metadata?.tags) {
			for (const tag of metadata.tags) {
				tags.add(tag.tag);
			}
		}

		if (metadata?.links) {
			for (const link of metadata.links) {
				links.add(link.link);
			}
		}

		const extractedKeywords = this.extractKeywords(content);
		for (const keyword of extractedKeywords) {
			keywords.add(keyword);
		}

		this.index.set(file.path, {
			path: file.path,
			tags,
			links,
			keywords,
			lastModified: file.stat.mtime
		});
	}

	removeFromIndex(file: TFile): void {
		this.index.delete(file.path);
	}

	getIndex(file: TFile): NoteIndex | undefined {
		return this.index.get(file.path);
	}

	private extractKeywords(content: string): string[] {
		const allKeywords = new Map<string, number>();
		
		// Extract Korean keywords if Korean text exists
		if (hasKorean(content)) {
			const koreanKeywords = extractKoreanKeywords(content, 20);
			koreanKeywords.forEach(keyword => {
				allKeywords.set(keyword, (allKeywords.get(keyword) || 0) + 1);
			});
		}
		
		// Extract English keywords
		const englishKeywords = extractEnglishKeywords(content, 20);
		englishKeywords.forEach(keyword => {
			// Skip if it's a Korean word (to avoid duplicates)
			if (!hasKorean(keyword)) {
				allKeywords.set(keyword, (allKeywords.get(keyword) || 0) + 1);
			}
		});
		
		// Sort by frequency and return top keywords
		return Array.from(allKeywords.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 20)
			.map(([word]) => word);
	}
}
 