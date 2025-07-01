import { ItemView, WorkspaceLeaf, TFile } from 'obsidian';
import JaccardPlugin from '../main';

export const VIEW_TYPE_SIMILAR_NOTES = 'similar-notes-view';

export class SimilarNotesView extends ItemView {
	plugin: JaccardPlugin;
	private similarNotes: Array<{ file: TFile; similarity: number; commonTags: number; commonLinks: number }> = [];
	private currentFile: TFile | null = null;

	constructor(leaf: WorkspaceLeaf, plugin: JaccardPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType() {
		return VIEW_TYPE_SIMILAR_NOTES;
	}

	getDisplayText() {
		return 'Similar Notes';
	}

	getIcon() {
		return 'dice';
	}

	async onOpen() {
		this.renderView();
	}

	async onClose() {
		// Clean up when view is closed
	}

	updateSimilarNotes(similarNotes: Array<{ file: TFile; similarity: number; commonTags: number; commonLinks: number }>, currentFile: TFile) {
		this.similarNotes = similarNotes;
		this.currentFile = currentFile;
		this.renderView();
	}

	private renderView() {
		const container = this.containerEl.children[1];
		container.empty();

		const headerEl = container.createEl('div', { cls: 'similar-notes-header' });
		headerEl.createEl('h4', { text: `Similar Notes (${this.similarNotes.length})` });

		if (!this.currentFile) {
			container.createEl('div', { 
				text: 'Open a note to see similar notes',
				cls: 'similar-notes-empty'
			});
			return;
		}

		if (this.similarNotes.length === 0) {
			container.createEl('div', { 
				text: 'No similar notes found',
				cls: 'similar-notes-empty'
			});
			return;
		}

		const listEl = container.createEl('div', { cls: 'similar-notes-list' });

		for (const note of this.similarNotes) {
			const noteEl = listEl.createEl('div', { cls: 'similar-note-item' });
			
			const titleEl = noteEl.createEl('div', { cls: 'similar-note-title' });
			const linkEl = titleEl.createEl('a', { 
				text: note.file.basename,
				cls: 'internal-link'
			});
			
			linkEl.addEventListener('click', (event) => {
				event.preventDefault();
				this.app.workspace.getLeaf().openFile(note.file);
			});

			const scoreEl = noteEl.createEl('div', { cls: 'similar-note-score' });
			scoreEl.createEl('span', { 
				text: `${Math.round(note.similarity * 100)}%`,
				cls: 'similarity-percentage'
			});

			const detailsEl = noteEl.createEl('div', { cls: 'similar-note-details' });
			if (note.commonTags > 0) {
				detailsEl.createEl('span', { 
					text: `${note.commonTags} common tags`,
					cls: 'common-detail'
				});
			}
			if (note.commonLinks > 0) {
				detailsEl.createEl('span', { 
					text: `${note.commonLinks} common links`,
					cls: 'common-detail'
				});
			}
		}

		this.addStyles();
	}

	private addStyles() {
		const styleEl = document.getElementById('jaccard-plugin-styles');
		if (styleEl) return;

		const style = document.createElement('style');
		style.id = 'jaccard-plugin-styles';
		style.textContent = `
			.similar-notes-header {
				padding: 10px;
				border-bottom: 1px solid var(--background-modifier-border);
			}

			.similar-notes-header h4 {
				margin: 0;
				font-size: 14px;
				font-weight: 600;
			}

			.similar-notes-empty {
				padding: 20px;
				text-align: center;
				color: var(--text-muted);
			}

			.similar-notes-list {
				padding: 10px;
			}

			.similar-note-item {
				padding: 10px;
				border-radius: 4px;
				margin-bottom: 8px;
				background-color: var(--background-secondary);
				cursor: pointer;
				transition: background-color 0.2s;
			}

			.similar-note-item:hover {
				background-color: var(--background-secondary-alt);
			}

			.similar-note-title {
				font-weight: 500;
				margin-bottom: 4px;
			}

			.similar-note-title .internal-link {
				text-decoration: none;
				color: var(--text-normal);
			}

			.similar-note-score {
				display: flex;
				align-items: center;
				margin-bottom: 4px;
			}

			.similarity-percentage {
				font-size: 14px;
				font-weight: 600;
				color: var(--text-accent);
			}

			.similar-note-details {
				font-size: 12px;
				color: var(--text-muted);
			}

			.common-detail {
				margin-right: 10px;
			}
		`;
		document.head.appendChild(style);
	}
}