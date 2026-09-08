export interface ConfidenceScores {
  categoryConfidence: number;
  materialConfidence: number;
  craftTypeConfidence: number;
}

export interface VisionAnalysisData {
  detectedTitle: string;
  category: string;
  craftType: string;
  primaryMaterial: string;
  visualAttributes: string[];
  suggestedTags: string[];
  confidenceScores: ConfidenceScores;
}

export interface CatalogAttribute {
  attributeNameEn: string;
  attributeNameHi: string;
  attributeValueEn: string;
  attributeValueHi: string;
}

export interface CatalogGenerationData {
  titleEnglish: string;
  titleHindi: string;
  descriptionEnglish: string;
  descriptionHindi: string;
  tagsEnglish: string[];
  tagsHindi: string[];
  keyAttributes: CatalogAttribute[];
}

export interface PricingSuggestionData {
  baseCost: number;
  suggestedMarkupPercent: number;
  suggestedMinPrice: number;
  suggestedMaxPrice: number;
  recommendedPrice: number;
  reasoningEnglish: string;
  reasoningHindi: string;
  basis: "cost_assisted_ai_estimate";
}

export interface CraftStoryData {
  storyEnglish: string;
  storyHindi: string;
  traditionalProcess: string;
  generationalLineage: string;
}
