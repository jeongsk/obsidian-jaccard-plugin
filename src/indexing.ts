import { Vault, TFile, MetadataCache, Notice } from 'obsidian';
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
	private isIndexing = false;
	private shouldStop = false;
	private onProgressCallback?: (progress: number, total: number) => void;

	constructor(vault: Vault, metadataCache: MetadataCache) {
		this.vault = vault;
		this.metadataCache = metadataCache;
	}

	setProgressCallback(callback: (progress: number, total: number) => void) {
		this.onProgressCallback = callback;
	}

	async reindexAll(): Promise<void> {
		if (this.isIndexing) {
			console.log('Indexing already in progress');
			return;
		}

		this.isIndexing = true;
		this.shouldStop = false;
		this.index.clear();
		const files = this.vault.getMarkdownFiles();
		const BATCH_SIZE = 50;
		const DELAY_MS = 10;

		console.log(`Starting indexing of ${files.length} files...`);

		try {
			for (let i = 0; i < files.length; i += BATCH_SIZE) {
				// Check if we should stop
				if (this.shouldStop) {
					console.log('Indexing stopped by user');
					break;
				}

				const batch = files.slice(i, i + BATCH_SIZE);
				
				// Process batch in parallel
				await Promise.all(batch.map(file => {
					if (!this.shouldStop) {
						return this.updateIndex(file);
					}
				}));
				
				// Progress update
				const progress = Math.min(i + BATCH_SIZE, files.length);
				console.log(`Indexed ${progress}/${files.length} files (${Math.round(progress / files.length * 100)}%)`);
				
				// Call progress callback if set
				if (this.onProgressCallback) {
					this.onProgressCallback(progress, files.length);
				}
				
				// Small delay to prevent UI freezing
				if (i + BATCH_SIZE < files.length && !this.shouldStop) {
					await new Promise(resolve => setTimeout(resolve, DELAY_MS));
				}
			}
			
			if (!this.shouldStop) {
				console.log('Indexing complete!');
				new Notice('Indexing complete!');
			}
		} finally {
			this.isIndexing = false;
			// Clear progress
			if (this.onProgressCallback) {
				this.onProgressCallback(0, 0);
			}
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

	stopIndexing(): void {
		this.shouldStop = true;
	}

	isCurrentlyIndexing(): boolean {
		return this.isIndexing;
	}

	private extractKeywords(content: string): string[] {
		// Limit content length to prevent performance issues
		const MAX_CONTENT_LENGTH = 5000;
		const truncatedContent = content.length > MAX_CONTENT_LENGTH 
			? content.substring(0, MAX_CONTENT_LENGTH) 
			: content;
		
		const allKeywords = new Map<string, number>();
		
		// Extract Korean keywords if Korean text exists
		if (hasKorean(truncatedContent)) {
			try {
				const koreanKeywords = extractKoreanKeywords(truncatedContent, 20);
				koreanKeywords.forEach(keyword => {
					allKeywords.set(keyword, (allKeywords.get(keyword) || 0) + 1);
				});
			} catch (error) {
				console.warn('Korean keyword extraction failed, using fallback');
			}
		}
		
		// Extract English keywords
		const englishKeywords = extractEnglishKeywords(truncatedContent, 20);
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
 