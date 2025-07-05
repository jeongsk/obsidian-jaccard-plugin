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
		// Check if the content contains Korean text
		if (hasKorean(content)) {
			// Use Korean-specific keyword extraction
			return extractKoreanKeywords(content);
		}

		// For non-Korean text, use the English extraction logic
		return extractEnglishKeywords(content);
	}
}
 