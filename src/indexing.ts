import { Vault, TFile, MetadataCache, Notice, Plugin } from "obsidian";
import { hasKorean, extractKoreanKeywords } from "./korean";
import { extractEnglishKeywords } from "./english";

export interface NoteIndex {
	path: string;
	tags: Set<string>;
	links: Set<string>;
	keywords: Set<string>;
	lastModified: number;
}

export interface SerializedNoteIndex {
	path: string;
	tags: string[];
	links: string[];
	keywords: string[];
	lastModified: number;
}

export interface SerializedIndex {
	version: number;
	lastUpdated: number;
	entries: SerializedNoteIndex[];
}

export class IndexingService {
	private vault: Vault;
	private metadataCache: MetadataCache;
	private plugin: Plugin;
	private index: Map<string, NoteIndex> = new Map();
	private isIndexing = false;
	private shouldStop = false;
	private onProgressCallback?: (progress: number, total: number) => void;
	private saveDebounceTimer?: NodeJS.Timeout;
	private readonly INDEX_VERSION = 1;
	private readonly SAVE_DELAY = 2000; // 2 seconds debounce
	private indexingQueue: TFile[] = [];
	private isProcessingQueue = false;

	constructor(vault: Vault, metadataCache: MetadataCache, plugin: Plugin) {
		this.vault = vault;
		this.metadataCache = metadataCache;
		this.plugin = plugin;
	}

	setProgressCallback(callback: (progress: number, total: number) => void) {
		this.onProgressCallback = callback;
	}

	async reindexAll(): Promise<void> {
		if (this.isIndexing) {
			console.log("Indexing already in progress");
			return;
		}

		this.isIndexing = true;
		this.shouldStop = false;
		this.index.clear();
		const files = this.vault.getMarkdownFiles();
		const BATCH_SIZE = 10; // Reduced batch size for better responsiveness
		const DELAY_MS = 50; // Increased delay for better UI responsiveness

		console.log(`Starting indexing of ${files.length} files...`);

		try {
			for (let i = 0; i < files.length; i += BATCH_SIZE) {
				// Check if we should stop
				if (this.shouldStop) {
					console.log("Indexing stopped by user");
					break;
				}

				const batch = files.slice(i, i + BATCH_SIZE);

				// Process batch in parallel
				await Promise.all(
					batch.map((file) => {
						if (!this.shouldStop) {
							return this.updateIndex(file);
						}
					})
				);

				// Progress update
				const progress = Math.min(i + BATCH_SIZE, files.length);
				console.log(
					`Indexed ${progress}/${files.length} files (${Math.round(
						(progress / files.length) * 100
					)}%)`
				);

				// Call progress callback if set
				if (this.onProgressCallback) {
					this.onProgressCallback(progress, files.length);
				}

				// Small delay to prevent UI freezing
				if (i + BATCH_SIZE < files.length && !this.shouldStop) {
					await new Promise((resolve) =>
						setTimeout(resolve, DELAY_MS)
					);
				}
			}

			if (!this.shouldStop) {
				console.log("Indexing complete!");
				new Notice("Indexing complete!");
				// Save index after full reindexing
				await this.saveIndex();
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

		// Defer keyword extraction for better performance
		// Only extract keywords when actually needed (when calculating similarity)
		this.index.set(file.path, {
			path: file.path,
			tags,
			links,
			keywords, // Empty for now
			lastModified: file.stat.mtime,
		});

		// Add to queue for background keyword extraction
		this.addToKeywordExtractionQueue(file);

		// Save index with debouncing
		this.debouncedSave();
	}

	private addToKeywordExtractionQueue(file: TFile): void {
		this.indexingQueue.push(file);
		if (!this.isProcessingQueue) {
			this.processKeywordExtractionQueue();
		}
	}

	private async processKeywordExtractionQueue(): Promise<void> {
		if (this.isProcessingQueue) return;
		this.isProcessingQueue = true;

		while (this.indexingQueue.length > 0) {
			const file = this.indexingQueue.shift();
			if (!file) continue;

			const indexEntry = this.index.get(file.path);
			if (!indexEntry || indexEntry.keywords.size > 0) continue;

			try {
				const content = await this.vault.cachedRead(file);
				const extractedKeywords = this.extractKeywords(content);
				
				indexEntry.keywords.clear();
				for (const keyword of extractedKeywords) {
					indexEntry.keywords.add(keyword);
				}
			} catch (error) {
				console.error(`Failed to extract keywords for ${file.path}:`, error);
			}

			// Small delay between extractions
			await new Promise(resolve => setTimeout(resolve, 10));
		}

		this.isProcessingQueue = false;
		// Save after processing queue
		this.debouncedSave();
	}

	async extractKeywordsForFile(file: TFile): Promise<Set<string>> {
		const indexEntry = this.index.get(file.path);
		
		if (indexEntry && indexEntry.keywords.size > 0) {
			return indexEntry.keywords;
		}

		// Extract keywords on-demand if not already extracted
		try {
			const content = await this.vault.cachedRead(file);
			const extractedKeywords = this.extractKeywords(content);
			const keywordsSet = new Set(extractedKeywords);

			if (indexEntry) {
				indexEntry.keywords = keywordsSet;
			}

			return keywordsSet;
		} catch (error) {
			console.error(`Failed to extract keywords for ${file.path}:`, error);
			return new Set();
		}
	}

	removeFromIndex(fileOrPath: TFile | string): void {
		const path =
			typeof fileOrPath === "string" ? fileOrPath : fileOrPath.path;
		this.index.delete(path);
		// Save index with debouncing
		this.debouncedSave();
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
		const MAX_CONTENT_LENGTH = 3000; // Reduced from 5000
		const truncatedContent =
			content.length > MAX_CONTENT_LENGTH
				? content.substring(0, MAX_CONTENT_LENGTH)
				: content;

		const allKeywords = new Map<string, number>();

		// Extract Korean keywords if Korean text exists
		if (hasKorean(truncatedContent)) {
			try {
				const koreanKeywords = extractKoreanKeywords(
					truncatedContent,
					15 // Reduced from 20
				);
				koreanKeywords.forEach((keyword) => {
					allKeywords.set(
						keyword,
						(allKeywords.get(keyword) || 0) + 1
					);
				});
			} catch (error) {
				console.warn(
					"Korean keyword extraction failed, using fallback"
				);
			}
		}

		// Extract English keywords
		const englishKeywords = extractEnglishKeywords(truncatedContent, 15); // Reduced from 20
		englishKeywords.forEach((keyword) => {
			// Skip if it's a Korean word (to avoid duplicates)
			if (!hasKorean(keyword)) {
				allKeywords.set(keyword, (allKeywords.get(keyword) || 0) + 1);
			}
		});

		// Sort by frequency and return top keywords
		return Array.from(allKeywords.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 15) // Reduced from 20
			.map(([word]) => word);
	}

	private noteIndexToSerialized(noteIndex: NoteIndex): SerializedNoteIndex {
		return {
			path: noteIndex.path,
			tags: Array.from(noteIndex.tags),
			links: Array.from(noteIndex.links),
			keywords: Array.from(noteIndex.keywords),
			lastModified: noteIndex.lastModified,
		};
	}

	private serializedToNoteIndex(serialized: SerializedNoteIndex): NoteIndex {
		return {
			path: serialized.path,
			tags: new Set(serialized.tags),
			links: new Set(serialized.links),
			keywords: new Set(serialized.keywords),
			lastModified: serialized.lastModified,
		};
	}

	async saveIndex(): Promise<void> {
		try {
			const serialized: SerializedIndex = {
				version: this.INDEX_VERSION,
				lastUpdated: Date.now(),
				entries: Array.from(this.index.values()).map((noteIndex) =>
					this.noteIndexToSerialized(noteIndex)
				),
			};

			// Save to a separate file for index data
			const indexPath = `${this.plugin.manifest.dir}/index.json`;
			await this.vault.adapter.write(
				indexPath,
				JSON.stringify(serialized, null, 2)
			);
			console.log(
				`Index saved with ${serialized.entries.length} entries`
			);
		} catch (error) {
			console.error("Failed to save index:", error);
			new Notice("Failed to save index");
		}
	}

	private debouncedSave(): void {
		if (this.saveDebounceTimer) {
			clearTimeout(this.saveDebounceTimer);
		}

		this.saveDebounceTimer = setTimeout(() => {
			this.saveIndex();
		}, this.SAVE_DELAY);
	}

	async loadIndex(): Promise<boolean> {
		try {
			// Load from a separate file for index data
			const indexPath = `${this.plugin.manifest.dir}/index.json`;

			if (!(await this.vault.adapter.exists(indexPath))) {
				console.log("No index file found");
				return false;
			}

			const data = await this.vault.adapter.read(indexPath);
			const saved = JSON.parse(data) as SerializedIndex;

			if (!saved || saved.version !== this.INDEX_VERSION) {
				console.log("No valid index found or version mismatch");
				return false;
			}

			this.index.clear();
			for (const entry of saved.entries) {
				this.index.set(entry.path, this.serializedToNoteIndex(entry));
			}

			console.log(`Index loaded with ${saved.entries.length} entries`);
			return true;
		} catch (error) {
			console.error("Failed to load index:", error);
			return false;
		}
	}

	async initializeIndex(): Promise<void> {
		// Delay initialization to not block UI
		setTimeout(async () => {
			const indexLoaded = await this.loadIndex();

			if (indexLoaded) {
				// Only update metadata (tags/links) initially, defer keyword extraction
				await this.quickMetadataUpdate();
			} else {
				// Show notice and let user manually trigger full reindex
				new Notice("No index found. Use 'Reindex all notes' command to build index.");
			}
		}, 1000); // Increased delay from 100ms to 1s
	}

	private async quickMetadataUpdate(): Promise<void> {
		const files = this.vault.getMarkdownFiles();
		const filesToUpdate: TFile[] = [];
		const filesToRemove: string[] = [];

		// Check for modified or new files (metadata only)
		for (const file of files) {
			const indexEntry = this.index.get(file.path);
			if (!indexEntry || file.stat.mtime > indexEntry.lastModified) {
				filesToUpdate.push(file);
			}
		}

		// Check for deleted files
		const currentFilePaths = new Set(files.map((f) => f.path));
		for (const path of this.index.keys()) {
			if (!currentFilePaths.has(path)) {
				filesToRemove.push(path);
			}
		}

		// Remove deleted files
		for (const path of filesToRemove) {
			this.index.delete(path);
		}

		// Quick update for changed files (tags/links only)
		if (filesToUpdate.length > 0) {
			console.log(`Quick updating ${filesToUpdate.length} changed files...`);
			
			for (const file of filesToUpdate) {
				const metadata = this.metadataCache.getFileCache(file);
				const indexEntry = this.index.get(file.path) || {
					path: file.path,
					tags: new Set<string>(),
					links: new Set<string>(),
					keywords: new Set<string>(),
					lastModified: file.stat.mtime,
				};

				// Update only tags and links
				indexEntry.tags.clear();
				indexEntry.links.clear();

				if (metadata?.tags) {
					for (const tag of metadata.tags) {
						indexEntry.tags.add(tag.tag);
					}
				}

				if (metadata?.links) {
					for (const link of metadata.links) {
						indexEntry.links.add(link.link);
					}
				}

				indexEntry.lastModified = file.stat.mtime;
				this.index.set(file.path, indexEntry);

				// Add to keyword extraction queue for background processing
				this.addToKeywordExtractionQueue(file);
			}

			// Start background keyword extraction
			this.processKeywordExtractionQueue();
		}

		console.log(
			`Quick update complete: ${filesToUpdate.length} files updated, ${filesToRemove.length} files removed`
		);
	}

	getAllIndexedNotes(): NoteIndex[] {
		return Array.from(this.index.values());
	}

	cleanup(): void {
		// Clear any pending save timers
		if (this.saveDebounceTimer) {
			clearTimeout(this.saveDebounceTimer);
		}
		// Clear indexing queue
		this.indexingQueue = [];
		this.isProcessingQueue = false;
	}
}
