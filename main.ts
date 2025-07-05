import { Plugin, WorkspaceLeaf, TFile, Notice } from 'obsidian';
import { JaccardSettings, JaccardSettingTab, DEFAULT_SETTINGS } from './src/settings';
import { IndexingService } from './src/indexing';
import { SimilarityCalculator } from './src/similarity';
import { SimilarNotesView, VIEW_TYPE_SIMILAR_NOTES } from './src/view';

export default class JaccardPlugin extends Plugin {
	settings!: JaccardSettings;
	indexingService!: IndexingService;
	similarityCalculator!: SimilarityCalculator;

	async onload() {
		await this.loadSettings();

		this.indexingService = new IndexingService(this.app.vault, this.app.metadataCache);
		this.similarityCalculator = new SimilarityCalculator(this.settings);

		this.registerView(
			VIEW_TYPE_SIMILAR_NOTES,
			(leaf) => new SimilarNotesView(leaf, this)
		);

		this.addRibbonIcon('dice', 'Similar Notes', () => {
			this.activateView();
		});

		this.addCommand({
			id: 'reindex',
			name: 'Reindex all notes',
			callback: async () => {
				new Notice('Reindexing all notes...');
				await this.indexingService.reindexAll();
				new Notice('Reindexing complete!');
				await this.updateSimilarNotes();
			}
		});

		this.addCommand({
			id: 'show-similar-notes',
			name: 'Show similar notes',
			callback: () => {
				this.activateView();
			}
		});

		this.addSettingTab(new JaccardSettingTab(this.app, this));

		this.app.workspace.onLayoutReady(async () => {
			await this.indexingService.reindexAll();
			this.activateView();
		});

		this.registerEvent(
			this.app.vault.on('modify', async (file) => {
				if (file instanceof TFile && file.extension === 'md') {
					await this.indexingService.updateIndex(file);
					await this.updateSimilarNotes();
				}
			})
		);

		this.registerEvent(
			this.app.vault.on('delete', async (file) => {
				if (file instanceof TFile && file.extension === 'md') {
					this.indexingService.removeFromIndex(file);
					await this.updateSimilarNotes();
				}
			})
		);

		this.registerEvent(
			this.app.workspace.on('active-leaf-change', async () => {
				await this.updateSimilarNotes();
			})
		);
	}

	onunload() {
		// Stop indexing if it's in progress
		this.indexingService.stopIndexing();
		
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_SIMILAR_NOTES);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.similarityCalculator.updateWeights(this.settings);
		await this.updateSimilarNotes();
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_SIMILAR_NOTES);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			if (leaf) {
				await leaf.setViewState({ type: VIEW_TYPE_SIMILAR_NOTES, active: true });
			}
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	async updateSimilarNotes() {
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile || activeFile.extension !== 'md') {
			return;
		}

		const similarNotes = await this.getSimilarNotes(activeFile);
		const view = this.app.workspace.getLeavesOfType(VIEW_TYPE_SIMILAR_NOTES)[0]?.view;
		
		if (view instanceof SimilarNotesView) {
			view.updateSimilarNotes(similarNotes, activeFile);
		}
	}

	async getSimilarNotes(file: TFile): Promise<Array<{ file: TFile; similarity: number; commonTags: number; commonLinks: number }>> {
		const allFiles = this.app.vault.getMarkdownFiles();
		const results: Array<{ file: TFile; similarity: number; commonTags: number; commonLinks: number }> = [];

		for (const compareFile of allFiles) {
			if (compareFile.path === file.path) continue;

			const result = await this.similarityCalculator.calculateSimilarity(
				file,
				compareFile,
				this.indexingService
			);

			if (result.similarity >= this.settings.minSimilarityThreshold) {
				results.push(result);
			}
		}

		results.sort((a, b) => b.similarity - a.similarity);
		return results.slice(0, this.settings.maxDisplayNotes);
	}
}