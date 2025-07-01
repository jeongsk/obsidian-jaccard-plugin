import { TFile } from 'obsidian';
import { IndexingService } from './indexing';
import { JaccardSettings } from './settings';

export class SimilarityCalculator {
	private settings: JaccardSettings;

	constructor(settings: JaccardSettings) {
		this.settings = settings;
	}

	updateWeights(settings: JaccardSettings): void {
		this.settings = settings;
	}

	async calculateSimilarity(
		fileA: TFile,
		fileB: TFile,
		indexingService: IndexingService
	): Promise<{ file: TFile; similarity: number; commonTags: number; commonLinks: number }> {
		const indexA = indexingService.getIndex(fileA);
		const indexB = indexingService.getIndex(fileB);

		if (!indexA || !indexB) {
			return { file: fileB, similarity: 0, commonTags: 0, commonLinks: 0 };
		}

		const tagScore = this.settings.tagWeight * this.calculateJaccardIndex(indexA.tags, indexB.tags);
		const linkScore = this.settings.linkWeight * this.calculateJaccardIndex(indexA.links, indexB.links);
		const keywordScore = this.settings.keywordWeight * this.calculateJaccardIndex(indexA.keywords, indexB.keywords);

		const totalWeight = this.settings.tagWeight + this.settings.linkWeight + this.settings.keywordWeight;
		const similarity = (tagScore + linkScore + keywordScore) / totalWeight;

		const commonTags = this.getIntersectionSize(indexA.tags, indexB.tags);
		const commonLinks = this.getIntersectionSize(indexA.links, indexB.links);

		return {
			file: fileB,
			similarity,
			commonTags,
			commonLinks
		};
	}

	private calculateJaccardIndex(setA: Set<string>, setB: Set<string>): number {
		if (setA.size === 0 && setB.size === 0) {
			return 0;
		}

		const intersection = new Set([...setA].filter(x => setB.has(x)));
		const union = new Set([...setA, ...setB]);

		return intersection.size / union.size;
	}

	private getIntersectionSize(setA: Set<string>, setB: Set<string>): number {
		return [...setA].filter(x => setB.has(x)).length;
	}
}