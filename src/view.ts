import { ItemView, WorkspaceLeaf, TFile, MarkdownView } from "obsidian";
import JaccardPlugin from "../main";

export const VIEW_TYPE_SIMILAR_NOTES = "similar-notes-view";

export class SimilarNotesView extends ItemView {
	plugin: JaccardPlugin;
	private similarNotes: Array<{
		file: TFile;
		similarity: number;
		commonTags: number;
		commonLinks: number;
	}> = [];
	private currentFile: TFile | null = null;
	private currentHoveredLink: HTMLElement | null = null;
	private currentHoveredNote: TFile | null = null;
	private keydownListener: ((event: KeyboardEvent) => void) | null = null;

	constructor(leaf: WorkspaceLeaf, plugin: JaccardPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType() {
		return VIEW_TYPE_SIMILAR_NOTES;
	}

	getDisplayText() {
		return "Similar Notes";
	}

	getIcon() {
		return "dice";
	}

	async onOpen() {
		this.renderView();
		this.setupGlobalKeyListener();
	}

	async onClose() {
		// Clean up when view is closed
		this.cleanupGlobalKeyListener();
	}

	updateSimilarNotes(
		similarNotes: Array<{
			file: TFile;
			similarity: number;
			commonTags: number;
			commonLinks: number;
		}>,
		currentFile: TFile
	) {
		this.similarNotes = similarNotes;
		this.currentFile = currentFile;
		this.renderView();
	}

	private renderView() {
		const container = this.containerEl.children[1];
		container.empty();

		const headerEl = container.createEl("div", {
			cls: "jaccard-similar-notes-header",
		});
		headerEl.createEl("h4", {
			text: `Similar Notes (${this.similarNotes.length})`,
		});

		if (!this.currentFile) {
			container.createEl("div", {
				text: "Open a note to see similar notes",
				cls: "jaccard-similar-notes-empty",
			});
			return;
		}

		if (this.similarNotes.length === 0) {
			container.createEl("div", {
				text: "No similar notes found",
				cls: "jaccard-similar-notes-empty",
			});
			return;
		}

		const listEl = container.createEl("div", {
			cls: "jaccard-similar-notes-list",
		});

		for (const note of this.similarNotes) {
			const noteEl = listEl.createEl("div", {
				cls: "jaccard-similar-note-item",
			});

			const mainRow = noteEl.createEl("div", {
				cls: "jaccard-similar-note-main-row",
			});

			// Similarity score at the front
			const scoreEl = mainRow.createEl("div", {
				cls: "jaccard-similar-note-score",
			});
			scoreEl.createEl("span", {
				text: note.similarity.toFixed(2),
				cls: "jaccard-similarity-percentage",
			});

			// Title with truncation
			const titleEl = mainRow.createEl("div", {
				cls: "jaccard-similar-note-title",
			});
			const linkEl = titleEl.createEl("a", {
				text: note.file.basename,
				cls: "internal-link",
				title: note.file.basename, // Show full name on hover
				href: "#",
			});

		// Track hover state for modifier key preview
		linkEl.addEventListener("mouseover", (event) => {
			event.stopPropagation();
			this.currentHoveredLink = linkEl;
			this.currentHoveredNote = note.file;
			
			// If modifier key is already pressed, trigger preview immediately
			if (event.ctrlKey || event.metaKey) {
				this.triggerHoverPreview(event);
			}
		});

		linkEl.addEventListener("mouseout", () => {
			this.currentHoveredLink = null;
			this.currentHoveredNote = null;
		});

			// Add click handler to the entire note item for better UX
			noteEl.addEventListener("click", async (event) => {
				event.preventDefault();
				event.stopPropagation();
				// Use the main workspace leaf to open the file
				const leaf = this.app.workspace.getMostRecentLeaf();
				if (leaf) {
					await leaf.openFile(note.file);
				}
			});

			// Details on separate row
			const detailsEl = noteEl.createEl("div", {
				cls: "jaccard-similar-note-details",
			});
			if (note.commonTags > 0) {
				detailsEl.createEl("span", {
					text: `${note.commonTags} common tags`,
					cls: "jaccard-common-detail",
				});
			}
			if (note.commonLinks > 0) {
				detailsEl.createEl("span", {
					text: `${note.commonLinks} common links`,
					cls: "jaccard-common-detail",
				});
			}
		}
	}

	private setupGlobalKeyListener() {
		this.keydownListener = (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && this.currentHoveredLink && this.currentHoveredNote) {
				this.triggerHoverPreview(event);
			}
		};
		document.addEventListener("keydown", this.keydownListener);
	}

	private cleanupGlobalKeyListener() {
		if (this.keydownListener) {
			document.removeEventListener("keydown", this.keydownListener);
			this.keydownListener = null;
		}
	}

	private triggerHoverPreview(event: Event) {
		if (!this.currentHoveredLink || !this.currentHoveredNote) return;

		this.app.workspace.trigger("hover-link", {
			event: event,
			source: "jaccard-plugin",
			hoverParent: this.app.workspace.getActiveViewOfType(MarkdownView) || this,
			targetEl: this.currentHoveredLink,
			linktext: this.currentHoveredNote.path,
			sourcePath: this.currentFile?.path || '',
		});
	}
}
