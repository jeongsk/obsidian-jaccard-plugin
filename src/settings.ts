import { App, PluginSettingTab, Setting, SliderComponent } from 'obsidian';
import JaccardPlugin from '../main';

export interface JaccardSettings {
	tagWeight: number;
	linkWeight: number;
	keywordWeight: number;
	maxDisplayNotes: number;
	minSimilarityThreshold: number;
}

export const DEFAULT_SETTINGS: JaccardSettings = {
	tagWeight: 0.5,
	linkWeight: 0.3,
	keywordWeight: 0.2,
	maxDisplayNotes: 100,
	minSimilarityThreshold: 0.1
};

export class JaccardSettingTab extends PluginSettingTab {
	plugin: JaccardPlugin;

	constructor(app: App, plugin: JaccardPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Jaccard Plugin Settings' });

		new Setting(containerEl)
			.setName('Tag Weight')
			.setDesc('Weight for tags in similarity calculation (0-1)')
			.addSlider(slider => {
				const sliderComponent = slider as SliderComponent;
				sliderComponent
					.setLimits(0, 1, 0.05)
					.setValue(this.plugin.settings.tagWeight)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.tagWeight = value;
						this.normalizeWeights();
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('Link Weight')
			.setDesc('Weight for links in similarity calculation (0-1)')
			.addSlider(slider => {
				const sliderComponent = slider as SliderComponent;
				sliderComponent
					.setLimits(0, 1, 0.05)
					.setValue(this.plugin.settings.linkWeight)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.linkWeight = value;
						this.normalizeWeights();
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('Keyword Weight')
			.setDesc('Weight for keywords in similarity calculation (0-1)')
			.addSlider(slider => {
				const sliderComponent = slider as SliderComponent;
				sliderComponent
					.setLimits(0, 1, 0.05)
					.setValue(this.plugin.settings.keywordWeight)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.keywordWeight = value;
						this.normalizeWeights();
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('Maximum Display Notes')
			.setDesc('Maximum number of similar notes to display')
			.addText(text => text
				.setPlaceholder('100')
				.setValue(String(this.plugin.settings.maxDisplayNotes))
				.onChange(async (value) => {
					const num = parseInt(value);
					if (!isNaN(num) && num > 0) {
						this.plugin.settings.maxDisplayNotes = num;
						await this.plugin.saveSettings();
					}
				}));

		new Setting(containerEl)
			.setName('Minimum Similarity Threshold')
			.setDesc('Minimum similarity score to display a note (0-1)')
			.addSlider(slider => {
				const sliderComponent = slider as SliderComponent;
				sliderComponent
					.setLimits(0, 1, 0.05)
					.setValue(this.plugin.settings.minSimilarityThreshold)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.minSimilarityThreshold = value;
						await this.plugin.saveSettings();
					});
			});

		const infoEl = containerEl.createEl('div', { cls: 'setting-item-description' });
		infoEl.createEl('p', { 
			text: 'Note: Weights are normalized automatically. The actual weight is calculated as: individual weight / sum of all weights.' 
		});
	}

	private normalizeWeights(): void {
		const total = this.plugin.settings.tagWeight + 
			this.plugin.settings.linkWeight + 
			this.plugin.settings.keywordWeight;
		
		if (total === 0) {
			this.plugin.settings.tagWeight = 0.5;
			this.plugin.settings.linkWeight = 0.3;
			this.plugin.settings.keywordWeight = 0.2;
		}
	}
}