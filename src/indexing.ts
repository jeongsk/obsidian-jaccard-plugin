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
		const BATCH_SIZE = 50;
		const DELAY_MS = 10;

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
			lastModified: file.stat.mtime,
		});

		// Save index with debouncing
		this.debouncedSave();
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
		const MAX_CONTENT_LENGTH = 5000;
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
					20
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
		const englishKeywords = extractEnglishKeywords(truncatedContent, 20);
		englishKeywords.forEach((keyword) => {
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
		setTimeout(async () => {
			const indexLoaded = await this.loadIndex();

			if (indexLoaded) {
				// Perform incremental update for changed files
				await this.updateChangedFiles();
			} else {
				// Full reindex if no valid index exists
				await this.reindexAll();
			}
		}, 100);
	}

	private async updateChangedFiles(): Promise<void> {
		const files = this.vault.getMarkdownFiles();
		const filesToUpdate: TFile[] = [];
		const filesToRemove: string[] = [];

		// Check for modified or new files
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

		// Update changed files
		if (filesToUpdate.length > 0) {
			console.log(`Updating ${filesToUpdate.length} changed files...`);
			const BATCH_SIZE = 50;

			for (let i = 0; i < filesToUpdate.length; i += BATCH_SIZE) {
				const batch = filesToUpdate.slice(i, i + BATCH_SIZE);
				await Promise.all(batch.map((file) => this.updateIndex(file)));

				if (this.onProgressCallback) {
					this.onProgressCallback(
						i + batch.length,
						filesToUpdate.length
					);
				}
			}

			// Save after updating
			await this.saveIndex();
		}

		console.log(
			`Index updated: ${filesToUpdate.length} files changed, ${filesToRemove.length} files removed`
		);
		if (this.onProgressCallback) {
			this.onProgressCallback(0, 0);
		}
	}

	getAllIndexedNotes(): NoteIndex[] {
		return Array.from(this.index.values());
	}

	cleanup(): void {
		// Clear any pending save timers
		if (this.saveDebounceTimer) {
			clearTimeout(this.saveDebounceTimer);
		}
	}
}
