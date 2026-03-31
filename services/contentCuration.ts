import { TOPIC_SHORTCUTS } from '../portalData';
import {
  ContentTrustLabel,
  ContentVerificationStatus,
  KnowledgeArticle,
  KnowledgeTopic,
  KnowledgeVideo,
} from '../types';

export interface RawContentCandidate {
  title: string;
  summary: string;
  url: string;
  source?: string;
  publishedAt?: string;
}

export interface CuratedArticleCandidate extends RawContentCandidate {
  id: string;
  topicId?: string;
  topicLabel?: string;
  category?: string;
}

export interface CuratedVideoCandidate extends RawContentCandidate {
  id: string;
  thumbnailUrl: string;
  embedUrl: string;
}

interface TopicProfile {
  id: string;
  label: string;
  category: string;
  worldId: string;
  query: string;
  keywords: string[];
}

const normalizeValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/["'`,.:;!?()[\]{}]/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value: string) =>
  normalizeValue(value)
    .split(' ')
    .map(token => token.trim())
    .filter(token => token.length > 1);

const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

const WORLD_ALIAS_FALLBACKS: Record<string, string[]> = {
  'topic-ai': ['ai', 'genai', 'llm', 'deepfake', 'voice cloning'],
  'topic-cyber': ['apt', 'espionage', 'malware', 'threat actor', 'campaign'],
  'topic-osint': ['osint', 'espionage', 'social engineering', 'persona'],
  'topic-geopolitics': ['iran', 'china', 'russia', 'state backed', 'nation state'],
  'topic-incidents': ['breach', 'incident', 'ransomware', 'hack', 'compromise', 'leak'],
  'topic-deepfake': ['deepfake', 'voice cloning', 'impersonation', 'synthetic media'],
  'topic-cloud': ['cloud', 'saas', 'm365', 'workspace', 'misconfiguration', 'tenant'],
  'topic-identity': ['identity', 'account takeover', 'credential', 'mfa', 'sso', 'entra'],
  'topic-vuln': ['cve', 'zero day', 'kev', 'exploit', 'patch', 'vulnerability'],
  'topic-insider': ['insider', 'employee', 'privileged misuse', 'exfiltration'],
  'topic-mobile': ['iphone', 'android', 'mobile spyware', 'pegasus', 'mobile'],
};

const INCIDENT_KEYWORDS = [
  'attack',
  'breach',
  'campaign',
  'compromise',
  'cve',
  'data leak',
  'data breach',
  'exploit',
  'hacked',
  'incident',
  'malware',
  'phishing',
  'ransomware',
  'scam',
  'spyware',
  'zero day',
];

const SOURCE_TRUST_RULES = [
  { pattern: 'cisa.gov', label: 'official' as const, score: 98 },
  { pattern: 'ic3.gov', label: 'official' as const, score: 98 },
  { pattern: 'justice.gov', label: 'official' as const, score: 97 },
  { pattern: 'hhs.gov', label: 'official' as const, score: 96 },
  { pattern: 'fbi.gov', label: 'official' as const, score: 97 },
  { pattern: 'msrc.microsoft.com', label: 'official' as const, score: 95 },
  { pattern: 'microsoft.com', label: 'official' as const, score: 90 },
  { pattern: 'security.googleblog.com', label: 'official' as const, score: 93 },
  { pattern: 'blog.google', label: 'official' as const, score: 90 },
  { pattern: 'cloud.google.com', label: 'official' as const, score: 88 },
  { pattern: 'mandiant.com', label: 'official' as const, score: 92 },
  { pattern: 'youtube.com', label: 'trusted' as const, score: 76 },
  { pattern: 'krebsonsecurity.com', label: 'trusted' as const, score: 86 },
  { pattern: 'bleepingcomputer.com', label: 'trusted' as const, score: 82 },
  { pattern: 'therecord.media', label: 'trusted' as const, score: 80 },
  { pattern: 'recordedfuture.com', label: 'trusted' as const, score: 80 },
  { pattern: 'thehackernews.com', label: 'established' as const, score: 70 },
  { pattern: 'darkreading.com', label: 'established' as const, score: 72 },
  { pattern: 'techcommunity.microsoft.com', label: 'established' as const, score: 74 },
];

const SOURCE_NAME_RULES = [
  { pattern: 'CISA', label: 'official' as const, score: 98 },
  { pattern: 'IC3', label: 'official' as const, score: 98 },
  { pattern: 'FBI', label: 'official' as const, score: 97 },
  { pattern: 'DOJ', label: 'official' as const, score: 96 },
  { pattern: 'Microsoft Security Response Center', label: 'official' as const, score: 95 },
  { pattern: 'Microsoft Security', label: 'official' as const, score: 91 },
  { pattern: 'Google Cloud', label: 'official' as const, score: 88 },
  { pattern: 'Google Security Blog', label: 'official' as const, score: 90 },
  { pattern: 'Mandiant', label: 'official' as const, score: 92 },
  { pattern: 'KrebsOnSecurity', label: 'trusted' as const, score: 86 },
  { pattern: 'BleepingComputer', label: 'trusted' as const, score: 82 },
  { pattern: 'The Record', label: 'trusted' as const, score: 80 },
];

const buildTopicProfiles = (topics: KnowledgeTopic[]): TopicProfile[] =>
  topics.map(topic => {
    const portalMatch = TOPIC_SHORTCUTS.find(shortcut => {
      const normalizedCandidates = unique([shortcut.label, ...shortcut.aliases, ...shortcut.categories]).map(normalizeValue);
      return normalizedCandidates.includes(normalizeValue(topic.label)) || normalizedCandidates.includes(normalizeValue(topic.category));
    });

    const keywords = unique([
      topic.label,
      topic.category,
      topic.query,
      ...(portalMatch?.aliases || []),
      ...(portalMatch?.categories || []),
      ...(WORLD_ALIAS_FALLBACKS[topic.id] || []),
    ]).flatMap(value => tokenize(value));

    return {
      id: topic.id,
      label: topic.label,
      category: topic.category,
      query: topic.query,
      worldId: portalMatch?.id || topic.id,
      keywords,
    };
  });

const extractDomain = (value: string) => {
  try {
    const hostname = new URL(value).hostname.toLowerCase();
    return hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

const pickTrustFromRule = (
  value: string,
  rules: Array<{ pattern: string; label: ContentTrustLabel; score: number }>
) => {
  const match = rules.find(rule => value.includes(rule.pattern.toLowerCase()));
  return match || null;
};

export const evaluateSourceTrust = (sourceName: string, url: string) => {
  const sourceDomain = extractDomain(url);
  const sourceValue = normalizeValue(sourceName);

  const domainMatch = sourceDomain ? pickTrustFromRule(sourceDomain, SOURCE_TRUST_RULES) : null;
  const sourceMatch = sourceValue ? pickTrustFromRule(sourceValue, SOURCE_NAME_RULES.map(rule => ({ ...rule, pattern: rule.pattern.toLowerCase() }))) : null;
  const strongest = [domainMatch, sourceMatch]
    .filter(Boolean)
    .sort((left, right) => (right?.score || 0) - (left?.score || 0))[0];

  const trustScore = strongest?.score || 45;
  const trustLabel = strongest?.label || 'unknown';
  const verificationStatus: ContentVerificationStatus =
    trustScore >= 90 ? 'verified' : trustScore >= 75 ? 'trusted' : 'review';

  return {
    sourceDomain,
    trustScore,
    trustLabel,
    verificationStatus,
  };
};

const scoreProfileFit = (candidateText: string, profile: TopicProfile) => {
  const haystack = normalizeValue(candidateText);
  let score = 0;
  const matchedKeywords: string[] = [];

  for (const keyword of profile.keywords) {
    if (!keyword || haystack.length === 0) continue;
    if (haystack.includes(keyword)) {
      matchedKeywords.push(keyword);
      score += keyword.length > 8 ? 8 : keyword.length > 4 ? 5 : 3;
    }
  }

  if (haystack.includes(normalizeValue(profile.label))) score += 16;
  if (haystack.includes(normalizeValue(profile.category))) score += 12;

  return {
    score,
    matchedKeywords: unique(matchedKeywords).slice(0, 10),
  };
};

const pickBestTopic = (candidateText: string, topics: KnowledgeTopic[]) => {
  const profiles = buildTopicProfiles(topics);
  const scored = profiles
    .map(profile => {
      const fit = scoreProfileFit(candidateText, profile);
      return { profile, ...fit };
    })
    .sort((left, right) => right.score - left.score);

  return scored[0] || null;
};

export const inferContentType = (candidateText: string) => {
  const normalized = normalizeValue(candidateText);
  return INCIDENT_KEYWORDS.some(keyword => normalized.includes(keyword)) ? 'incident' : 'article';
};

export const curateArticleCandidate = (
  candidate: CuratedArticleCandidate,
  topics: KnowledgeTopic[],
  hintedTopic?: KnowledgeTopic
): KnowledgeArticle | null => {
  const candidateText = `${candidate.title} ${candidate.summary} ${candidate.source || ''} ${candidate.category || ''}`;
  const bestTopic = hintedTopic
    ? {
        profile: buildTopicProfiles([hintedTopic])[0],
        ...scoreProfileFit(candidateText, buildTopicProfiles([hintedTopic])[0]),
      }
    : pickBestTopic(candidateText, topics);

  if (!bestTopic || bestTopic.score < 12) return null;

  const trust = evaluateSourceTrust(candidate.source || '', candidate.url);
  if (trust.trustScore < 70) return null;

  return {
    id: candidate.id,
    title: candidate.title,
    summary: candidate.summary,
    category: hintedTopic?.category || candidate.category || bestTopic.profile.category,
    source: candidate.source || trust.sourceDomain || 'Unknown source',
    url: candidate.url,
    publishedAt: candidate.publishedAt || new Date().toISOString(),
    topicId: hintedTopic?.id || bestTopic.profile.id,
    topicLabel: hintedTopic?.label || bestTopic.profile.label,
    contentType: inferContentType(candidateText),
    verificationStatus: trust.verificationStatus,
    trustLabel: trust.trustLabel,
    trustScore: trust.trustScore,
    fitScore: bestTopic.score,
    sourceDomain: trust.sourceDomain,
    matchedWorldId: bestTopic.profile.worldId,
    matchedKeywords: bestTopic.matchedKeywords,
  };
};

export const curateVideoCandidate = (
  candidate: CuratedVideoCandidate,
  topics: KnowledgeTopic[]
): KnowledgeVideo | null => {
  const candidateText = `${candidate.title} ${candidate.summary} ${candidate.source || ''}`;
  const bestTopic = pickBestTopic(candidateText, topics);
  if (!bestTopic || bestTopic.score < 10) return null;

  const trust = evaluateSourceTrust(candidate.source || '', candidate.url);
  if (trust.trustScore < 75) return null;

  return {
    id: candidate.id,
    title: candidate.title,
    summary: candidate.summary,
    category: bestTopic.profile.category,
    source: candidate.source || trust.sourceDomain || 'YouTube',
    url: candidate.url,
    embedUrl: candidate.embedUrl,
    thumbnailUrl: candidate.thumbnailUrl,
    publishedAt: candidate.publishedAt || new Date().toISOString(),
    topicId: bestTopic.profile.id,
    topicLabel: bestTopic.profile.label,
    verificationStatus: trust.verificationStatus,
    trustLabel: trust.trustLabel,
    trustScore: trust.trustScore,
    fitScore: bestTopic.score,
    sourceDomain: trust.sourceDomain,
    matchedWorldId: bestTopic.profile.worldId,
    matchedKeywords: bestTopic.matchedKeywords,
  };
};

export const dedupeArticles = (articles: KnowledgeArticle[]) =>
  Array.from(
    new Map(
      articles
        .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
        .map(article => [`${article.url}|${normalizeValue(article.title)}`, article])
    ).values()
  );

export const dedupeVideos = (videos: KnowledgeVideo[]) =>
  Array.from(
    new Map(
      videos
        .sort((left, right) => new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime())
        .map(video => [`${video.url}|${normalizeValue(video.title)}`, video])
    ).values()
  );

export const limitPerTopic = <T extends { topicId: string; publishedAt: string; trustScore?: number }>(
  items: T[],
  maxPerTopic: number
) => {
  const counters = new Map<string, number>();

  return items
    .sort((left, right) => {
      const trustDiff = (right.trustScore || 0) - (left.trustScore || 0);
      if (trustDiff !== 0) return trustDiff;
      return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
    })
    .filter(item => {
      const current = counters.get(item.topicId) || 0;
      if (current >= maxPerTopic) return false;
      counters.set(item.topicId, current + 1);
      return true;
    });
};
