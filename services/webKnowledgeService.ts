import {
  curateArticleCandidate,
  dedupeArticles,
  limitPerTopic,
} from './contentCuration';
import { KnowledgeArticle, KnowledgeBundle, KnowledgeTopic } from '../types';

const CONFIG_KEY = 'hasifriya_monitored_topics';
const CACHE_KEY = 'hasifriya_monitored_topics_cache';
const CACHE_TTL = 15 * 60 * 1000;
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json?rss_url=';
const CURATED_API_ROUTE = '/api/curated-content';

export const DEFAULT_TOPICS: KnowledgeTopic[] = [
  { id: 'topic-ai', label: 'בינה מלאכותית', query: 'artificial intelligence cybersecurity', category: 'בינה מלאכותית (AI)', maxItems: 6, enabled: true },
  { id: 'topic-cyber', label: 'איומי סייבר', query: 'cyber security threat campaign OR APT', category: 'אבטחת מכשירים', maxItems: 6, enabled: true },
  { id: 'topic-osint', label: 'OSINT וריגול', query: 'OSINT OR cyber espionage', category: 'הנדסה חברתית', maxItems: 5, enabled: true },
  { id: 'topic-geopolitics', label: 'טכנולוגיה וגיאופוליטיקה', query: 'cyber geopolitics iran china russia technology', category: 'אסטרטגיה ותכנון', maxItems: 5, enabled: true },
  { id: 'topic-incidents', label: 'פרשיות סייבר', query: 'data breach OR ransomware attack OR cyber incident', category: 'כללי', maxItems: 6, enabled: true },
  { id: 'topic-deepfake', label: 'התחזות ו-Deepfake', query: 'deepfake scam OR voice cloning fraud', category: 'הנדסה חברתית', maxItems: 5, enabled: true },
  { id: 'topic-cloud', label: 'ענן ו-SaaS', query: 'cloud security misconfiguration OR Microsoft 365 security OR Google Workspace security OR SaaS breach', category: 'ענן ו-SaaS', maxItems: 5, enabled: true },
  { id: 'topic-identity', label: 'זהויות והרשאות', query: 'identity security OR account takeover OR phishing resistant MFA OR credential abuse', category: 'זהויות והרשאות', maxItems: 5, enabled: true },
  { id: 'topic-vuln', label: 'חולשות ו-KEV', query: 'known exploited vulnerabilities OR zero day OR perimeter device vulnerability OR CVE exploitation', category: 'חולשות ו-KEV', maxItems: 5, enabled: true },
  { id: 'topic-insider', label: 'איומי פנים', query: 'insider threat OR employee data exfiltration OR privileged misuse', category: 'איומי פנים', maxItems: 4, enabled: true },
  { id: 'topic-mobile', label: 'איומי מובייל', query: 'mobile spyware OR iphone hack OR android spyware', category: 'אבטחת מכשירים', maxItems: 5, enabled: true },
];

interface KnowledgeCache {
  fetchedAt: number;
  data: KnowledgeBundle;
  topicSignature: string;
}

interface RssToJsonItem {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
  author?: string;
}

interface RssToJsonResponse {
  status?: string;
  items?: RssToJsonItem[];
}

function safelyParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function buildGoogleNewsRssUrl(query: string) {
  const params = new URLSearchParams({
    q: query,
    hl: 'en-US',
    gl: 'US',
    ceid: 'US:en',
  });

  return `https://news.google.com/rss/search?${params.toString()}`;
}

function buildTopicSignature(topics: KnowledgeTopic[]) {
  return topics
    .filter(topic => topic.enabled !== false)
    .map(topic => `${topic.id}:${topic.label}:${topic.query}:${topic.category}:${topic.maxItems}`)
    .sort()
    .join('|');
}

function getCache(topicSignature: string): KnowledgeCache | null {
  const cache = safelyParse<KnowledgeCache | null>(localStorage.getItem(CACHE_KEY), null);
  if (!cache) return null;
  if (Date.now() - cache.fetchedAt > CACHE_TTL) return null;
  if (cache.topicSignature !== topicSignature) return null;
  return cache;
}

function setCache(data: KnowledgeBundle, topicSignature: string) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      fetchedAt: Date.now(),
      data,
      topicSignature,
    } satisfies KnowledgeCache)
  );
}

export function clearCache() {
  localStorage.removeItem(CACHE_KEY);
}

export function getTopicsConfig(): KnowledgeTopic[] {
  const saved = safelyParse<KnowledgeTopic[] | null>(localStorage.getItem(CONFIG_KEY), null);
  if (!saved) return DEFAULT_TOPICS;
  return saved;
}

export function saveTopicsConfig(topics: KnowledgeTopic[]) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(topics));
  clearCache();
}

async function fetchKnowledgeFallback(topics: KnowledgeTopic[]): Promise<KnowledgeBundle> {
  const results = await Promise.all(
    topics.map(async topic => {
      const rssUrl = buildGoogleNewsRssUrl(topic.query);
      const endpoint = `${RSS_TO_JSON_API}${encodeURIComponent(rssUrl)}`;
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`RSS fetch failed for "${topic.label}"`);
      }

      const payload = (await response.json()) as RssToJsonResponse;
      const items = payload.items || [];

      return items
        .slice(0, topic.maxItems)
        .map((item, index) => {
          const summary = stripHtml(item.description || '');
          const title = stripHtml(item.title || topic.label);

          return curateArticleCandidate(
            {
              id: `${topic.id}-${index}-${item.pubDate || item.link || title}`,
              title,
              summary:
                summary && summary !== title
                  ? summary
                  : `עדכון מהרשת בנושא ${topic.label}. לחצו כדי לפתוח את המקור המלא.`,
              category: topic.category,
              source: stripHtml(item.author || 'Google News'),
              url: item.link || rssUrl,
              publishedAt: item.pubDate || new Date().toISOString(),
              topicId: topic.id,
              topicLabel: topic.label,
            },
            topics,
            topic
          );
        })
        .filter(Boolean) as KnowledgeArticle[];
    })
  );

  return {
    articles: limitPerTopic(dedupeArticles(results.flat()), 4),
    videos: [],
    refreshedAt: new Date().toISOString(),
    generator: 'client-fallback',
  };
}

export async function fetchKnowledgeBundle(
  forceRefresh = false,
  overrideTopics?: KnowledgeTopic[]
): Promise<KnowledgeBundle> {
  const topics = (overrideTopics || getTopicsConfig()).filter(topic => topic.enabled !== false);
  const topicSignature = buildTopicSignature(topics);

  if (!forceRefresh) {
    const cached = getCache(topicSignature);
    if (cached) return cached.data;
  }

  if (topics.length === 0) {
    return {
      articles: [],
      videos: [],
      refreshedAt: new Date().toISOString(),
      generator: 'client-fallback',
    };
  }

  try {
    const response = await fetch(CURATED_API_ROUTE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topics }),
    });

    if (!response.ok) {
      throw new Error(`Curated API failed with ${response.status}`);
    }

    const bundle = (await response.json()) as KnowledgeBundle;
    setCache(bundle, topicSignature);
    return bundle;
  } catch (error) {
    console.warn('Curated API unavailable, falling back to client RSS:', error);
    const fallback = await fetchKnowledgeFallback(topics);
    setCache(fallback, topicSignature);
    return fallback;
  }
}

export async function fetchKnowledgeUpdates(
  forceRefresh = false,
  overrideTopics?: KnowledgeTopic[]
): Promise<KnowledgeArticle[]> {
  const bundle = await fetchKnowledgeBundle(forceRefresh, overrideTopics);
  return bundle.articles;
}
