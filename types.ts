
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Slide {
  id: string;
  imageUrl: string;
}

export interface Presentation {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  driveUrl: string;
  isNew?: boolean;
  addedAt: string;
  author?: string;
  slides?: Slide[];
  quiz?: QuizQuestion[];
}

export interface KnowledgeTopic {
  id: string;
  label: string;
  query: string;
  category: string;
  maxItems: number;
  enabled?: boolean;
}

export type ContentVerificationStatus = 'verified' | 'trusted' | 'review';
export type ContentTrustLabel = 'official' | 'trusted' | 'established' | 'unknown';
export type KnowledgeContentType = 'article' | 'incident';

export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  url: string;
  publishedAt: string;
  topicId: string;
  topicLabel: string;
  contentType?: KnowledgeContentType;
  verificationStatus?: ContentVerificationStatus;
  trustLabel?: ContentTrustLabel;
  trustScore?: number;
  fitScore?: number;
  sourceDomain?: string;
  matchedWorldId?: string;
  matchedKeywords?: string[];
}

export interface KnowledgeVideo {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
  publishedAt: string;
  topicId: string;
  topicLabel: string;
  verificationStatus?: ContentVerificationStatus;
  trustLabel?: ContentTrustLabel;
  trustScore?: number;
  fitScore?: number;
  sourceDomain?: string;
  matchedWorldId?: string;
  matchedKeywords?: string[];
}

export interface KnowledgeBundle {
  articles: KnowledgeArticle[];
  videos: KnowledgeVideo[];
  refreshedAt: string;
  generator: 'api-curated' | 'client-fallback';
}

export interface ScenarioStep {
  id: string;
  context: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: 'mail' | 'phone' | 'usb' | 'shield' | 'wifi' | 'eye';
  steps: ScenarioStep[];
}

export interface User {
  name: string;
  avatar: string;
}
