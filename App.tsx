import React, { Suspense, lazy, startTransition, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  Search,
  X,
  Lock,
  ShieldAlert,
  Mail,
  Phone,
  Usb,
  Wifi,
  ChevronLeft,
  Play,
  Smartphone,
  BookOpen,
  BrainCircuit,
} from 'lucide-react';
import { KnowledgeArticle, KnowledgeTopic, KnowledgeVideo, Presentation, Scenario } from './types';
import { DEFAULT_CATEGORIES, DEFAULT_SCENARIOS, INITIAL_PRESENTATIONS } from './constants';
import { isSupabaseConfigured } from './services/supabaseClient';
import * as svc from './services/presentationService';
import * as gdrive from './services/googleDriveService';
import * as webKnowledge from './services/webKnowledgeService';

import PortalNavbar from './components/PortalNavbar';
import TopicExplorer from './components/TopicExplorer';
import WorldScene, { resolveWorldSceneVariant } from './components/WorldScene';
import WorldSelector from './components/WorldSelector';
import { getWorldVisual } from './components/worldVisuals';
import { CYBER_CASES, SearchTopicShortcut, TOPIC_SHORTCUTS } from './portalData';

const VideoSection = lazy(() => import('./components/VideoSection'));
const MobileHardening = lazy(() => import('./components/MobileHardening'));
const CyberCases = lazy(() => import('./components/CyberCases'));
const SectionModal = lazy(() => import('./components/SectionModal'));
const PresentationModal = lazy(() => import('./components/PresentationModal'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const GlossaryModal = lazy(() => import('./components/GlossaryModal'));
const ScenarioPlayer = lazy(() => import('./components/ScenarioPlayer'));
const SupportShelf = lazy(() => import('./components/SupportShelf'));

const AUTH_KEY = 'hasifriya_auth';

type SectionKey = 'videos' | 'scenarios' | 'hardening' | 'cases' | null;

const getScenarioIcon = (iconName: string) => {
  const cls = 'w-6 h-6';

  switch (iconName) {
    case 'mail':
      return <Mail className={cls} />;
    case 'phone':
      return <Phone className={cls} />;
    case 'usb':
      return <Usb className={cls} />;
    case 'wifi':
      return <Wifi className={cls} />;
    default:
      return <ShieldAlert className={cls} />;
  }
};

import { ThemeKey, WorldTheme, WORLD_THEMES } from './components/themeData';

const getWorldThemeKey = (topicId: string, isWorldMode: boolean): ThemeKey => {
  // removed neutral fallback
  
  if (topicId === 'shortcut-cyber') return 'cyber';
  if (topicId === 'shortcut-phishing') return 'phishing';
  if (topicId === 'shortcut-social') return 'social';
  if (topicId === 'shortcut-identity') return 'identity';
  if (topicId === 'shortcut-deepfake') return 'deepfake';
  if (topicId === 'shortcut-cloud') return 'cloud';
  if (topicId === 'shortcut-vulnerabilities') return 'vulnerabilities';
  if (topicId === 'shortcut-insider') return 'insider';
  if (topicId === 'shortcut-ransomware') return 'ransomware';
  if (topicId === 'shortcut-mobile' || topicId === 'shortcut-mobile-incidents') return 'mobile';
  if (topicId === 'shortcut-supply') return 'supply';

  return 'neutral';
};

const normalizeSearchValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/["'`,.:;!?()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const createSearchTerms = (value: string) =>
  normalizeSearchValue(value)
    .split(' ')
    .map(term => term.trim())
    .filter(Boolean);

const matchesSearchValue = (value: string, terms: string[]) => {
  const normalized = normalizeSearchValue(value);
  return terms.some(term => normalized.includes(term));
};

const topicMatchesQuery = (topic: SearchTopicShortcut, query: string) => {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return false;

  return [topic.label, topic.description, ...topic.aliases, ...topic.categories].some(alias => {
    const normalizedAlias = normalizeSearchValue(alias);
    return normalizedAlias.includes(normalizedQuery) || normalizedQuery.includes(normalizedAlias);
  });
};

const matchesTopicShortcut = (value: string, topic: SearchTopicShortcut) =>
  matchesSearchValue(
    value,
    createSearchTerms([topic.label, topic.description, ...topic.aliases, ...topic.categories].join(' '))
  );

const normalizeTopicKey = (value: string) => normalizeSearchValue(value);

const mergeUniqueValues = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

const buildDriveMonitoringTopics = (
  driveTopics: gdrive.DriveTopicItem[],
  configuredTopics: KnowledgeTopic[]
): KnowledgeTopic[] => {
  const existingKeys = new Set(
    configuredTopics.flatMap(topic => [
      normalizeTopicKey(topic.label),
      normalizeTopicKey(topic.category),
    ])
  );

  return driveTopics
    .filter(topic => !existingKeys.has(normalizeTopicKey(topic.label)))
    .map(topic => ({
      id: `drive-monitor-${topic.id}`,
      label: topic.label,
      query: topic.query || topic.label,
      category: topic.category,
      maxItems: 4,
      enabled: true,
    }));
};

const buildPortalTopics = (
  baseTopics: SearchTopicShortcut[],
  driveTopics: gdrive.DriveTopicItem[]
): SearchTopicShortcut[] => {
  const merged = baseTopics.map(topic => ({
    ...topic,
    aliases: [...topic.aliases],
    categories: [...topic.categories],
    topicIds: [...topic.topicIds],
    presentationIds: [...(topic.presentationIds || [])],
    caseIds: [...(topic.caseIds || [])],
  }));

  driveTopics.forEach(driveTopic => {
    const driveTopicId = `drive-monitor-${driveTopic.id}`;
    const matchIndex = merged.findIndex(topic => {
      const candidates = [topic.label, ...topic.aliases, ...topic.categories];
      return candidates.some(candidate => {
        const normalizedCandidate = normalizeTopicKey(candidate);
        return (
          normalizedCandidate === normalizeTopicKey(driveTopic.label) ||
          normalizedCandidate === normalizeTopicKey(driveTopic.category)
        );
      });
    });

    if (matchIndex >= 0) {
      const current = merged[matchIndex];
      merged[matchIndex] = {
        ...current,
        aliases: mergeUniqueValues([...current.aliases, driveTopic.label, ...driveTopic.aliases]),
        categories: mergeUniqueValues([...current.categories, driveTopic.category]),
        topicIds: mergeUniqueValues([...current.topicIds, driveTopicId]),
      };
      return;
    }

    merged.push({
      id: `drive-topic-${driveTopic.folderId}`,
      label: driveTopic.label,
      description: driveTopic.description,
      aliases: mergeUniqueValues([driveTopic.label, ...driveTopic.aliases]),
      categories: [driveTopic.category],
      topicIds: [driveTopicId],
      tone: driveTopic.tone,
    });
  });

  return merged.map(topic => ({
    ...topic,
    aliases: mergeUniqueValues(topic.aliases),
    categories: mergeUniqueValues(topic.categories),
    topicIds: mergeUniqueValues(topic.topicIds),
  }));
};

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(() => sessionStorage.getItem(AUTH_KEY) === 'true');
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [libraryPresentations, setLibraryPresentations] =
    useState<Presentation[]>(INITIAL_PRESENTATIONS);
  const [drivePresentations, setDrivePresentations] = useState<Presentation[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [scenarios] = useState<Scenario[]>(DEFAULT_SCENARIOS);
  const [driveVideos, setDriveVideos] = useState<gdrive.DriveVideoItem[]>([]);
  const [driveImages, setDriveImages] = useState<gdrive.DriveImageItem[]>([]);
  const [driveTopics, setDriveTopics] = useState<gdrive.DriveTopicItem[]>([]);
  const [knowledgeArticles, setKnowledgeArticles] = useState<KnowledgeArticle[]>([]);
  const [knowledgeVideos, setKnowledgeVideos] = useState<KnowledgeVideo[]>([]);
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);
  const [knowledgeError, setKnowledgeError] = useState('');

  const [selectedPresentation, setSelectedPresentation] = useState<Presentation | null>(null);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSupportShelfOpen, setIsSupportShelfOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [activeTopicId, setActiveTopicId] = useState(TOPIC_SHORTCUTS[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [openSection, setOpenSection] = useState<SectionKey>(null);
  const [sectionFocusTopicId, setSectionFocusTopicId] = useState<string | null>(null);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const [isWorldMode, setIsWorldMode] = useState(false);

  const presentations = useMemo(() => {
    const driveIds = new Set(drivePresentations.map(item => item.id));

    return [
      ...drivePresentations,
      ...libraryPresentations.filter(item => !driveIds.has(item.id)),
    ];
  }, [drivePresentations, libraryPresentations]);

  const portalTopics = useMemo(() => buildPortalTopics(TOPIC_SHORTCUTS, driveTopics), [driveTopics]);

  const availableCategories = useMemo(() => {
    const merged = new Set(
      [
        ...categories,
        ...presentations.map(item => item.category),
        ...driveVideos.map(item => item.category),
        ...driveImages.map(item => item.category),
        ...driveTopics.map(item => item.category),
        ...knowledgeArticles.map(item => item.category),
        ...knowledgeVideos.map(item => item.category),
      ].filter(Boolean)
    );

    return ['הכל', ...Array.from(merged)];
  }, [categories, presentations, driveImages, driveTopics, driveVideos, knowledgeArticles, knowledgeVideos]);

  const matchedSearchTopics = useMemo(() => {
    const query = deferredSearchQuery.trim();
    if (!query) return [];

    return portalTopics.filter(topic => topicMatchesQuery(topic, query));
  }, [deferredSearchQuery, portalTopics]);

  const sectionFocusTopic = useMemo(
    () => portalTopics.find(topic => topic.id === sectionFocusTopicId) || null,
    [portalTopics, sectionFocusTopicId]
  );
  const activePortalTopic = useMemo(
    () => portalTopics.find(topic => topic.id === activeTopicId) || portalTopics[0] || null,
    [activeTopicId, portalTopics]
  );
  const activeThemeKey = useMemo(
    () => getWorldThemeKey(activeTopicId, isWorldMode),
    [activeTopicId, isWorldMode]
  );
  const currentTheme = useMemo(() => WORLD_THEMES[activeThemeKey], [activeThemeKey]);
  const activeWorldScene = useMemo(
    () => resolveWorldSceneVariant(activeTopicId, isWorldMode),
    [activeTopicId, isWorldMode]
  );
  const activeTopicImages = useMemo(() => {
    if (!activePortalTopic) return [];

    return driveImages
      .filter(item => {
        if (activePortalTopic.categories.includes(item.category)) return true;

        return matchesTopicShortcut(
          `${item.title} ${item.category} ${item.folderPath || ''}`,
          activePortalTopic
        );
      })
      .slice(0, 3);
  }, [activePortalTopic, driveImages]);
  const activeWorldMetrics = useMemo(() => {
    if (!activePortalTopic) {
      return [];
    }

    const presentationCount = presentations.filter(item => {
      if (activePortalTopic.presentationIds?.includes(item.id)) return true;
      if (activePortalTopic.categories.includes(item.category)) return true;

      return matchesTopicShortcut(`${item.title} ${item.description} ${item.category}`, activePortalTopic);
    }).length;

    const articleCount = knowledgeArticles.filter(item => {
      if (activePortalTopic.topicIds.includes(item.topicId)) return true;
      if (activePortalTopic.categories.includes(item.category)) return true;

      return matchesTopicShortcut(
        `${item.title} ${item.summary} ${item.category} ${item.topicLabel}`,
        activePortalTopic
      );
    }).length;

    const caseCount = CYBER_CASES.filter(item => {
      if (activePortalTopic.caseIds?.includes(item.id)) return true;
      if (activePortalTopic.categories.includes(item.category)) return true;

      return matchesTopicShortcut(
        `${item.title} ${item.summary} ${item.category} ${item.tags.join(' ')} ${item.hook}`,
        activePortalTopic
      );
    }).length;

    const mediaCount =
      driveVideos.filter(item => {
        if (activePortalTopic.categories.includes(item.category)) return true;
        return matchesTopicShortcut(`${item.title} ${item.category} ${item.folderPath || ''}`, activePortalTopic);
      }).length +
      knowledgeVideos.filter(item => {
        if (activePortalTopic.categories.includes(item.category)) return true;
        return matchesTopicShortcut(`${item.title} ${item.summary} ${item.category}`, activePortalTopic);
      }).length +
      activeTopicImages.length;

    return [
      { label: 'חומרים', value: presentationCount },
      { label: 'כתבות', value: articleCount },
      { label: 'אירועים', value: caseCount },
      { label: 'מדיה', value: mediaCount },
    ];
  }, [activePortalTopic, activeTopicImages.length, driveVideos, knowledgeArticles, knowledgeVideos, presentations]);

  const expandedSearchTerms = useMemo(() => {
    const query = deferredSearchQuery.trim();
    if (!query) return [];

    const terms = new Set<string>(createSearchTerms(query));

    matchedSearchTopics.forEach(topic => {
      [topic.label, topic.description, ...topic.aliases, ...topic.categories].forEach(value => {
        createSearchTerms(value).forEach(term => terms.add(term));
      });
    });

    return Array.from(terms);
  }, [deferredSearchQuery, matchedSearchTopics]);

  useEffect(() => {
    if (matchedSearchTopics.length === 0) return;

    setActiveTopicId(current =>
      matchedSearchTopics.some(topic => topic.id === current) ? current : matchedSearchTopics[0].id
    );
  }, [matchedSearchTopics]);

  useEffect(() => {
    if (portalTopics.length === 0) return;

    setActiveTopicId(current =>
      portalTopics.some(topic => topic.id === current) ? current : portalTopics[0].id
    );
  }, [portalTopics]);

  useEffect(() => {
    document.body.style.background = currentTheme.mode === 'dark' ? '#020617' : '#F8FAFC';
    document.body.style.color = currentTheme.mode === 'dark' ? '#E2E8F0' : '#0F172A';
    return () => {
      document.body.style.background = '#F8FAFC';
      document.body.style.color = '#0F172A';
    };
  }, [currentTheme]);

  const reloadExternalSources = useCallback(async (forceRefresh = false) => {
    let syncedDriveTopics: gdrive.DriveTopicItem[] = [];

    if (gdrive.isConfigured()) {
      try {
        if (forceRefresh) gdrive.clearCache();
        const driveResult = await gdrive.fetchFromDrive();
        setDrivePresentations(driveResult.presentations);
        setDriveVideos(driveResult.videos);
        setDriveImages(driveResult.images);
        setDriveTopics(driveResult.topics);
        syncedDriveTopics = driveResult.topics;
      } catch {
        setDrivePresentations([]);
        setDriveVideos([]);
        setDriveImages([]);
        setDriveTopics([]);
      }
    } else {
      setDrivePresentations([]);
      setDriveVideos([]);
      setDriveImages([]);
      setDriveTopics([]);
    }

    const configuredTopics = webKnowledge.getTopicsConfig();
    const autoTopics = buildDriveMonitoringTopics(syncedDriveTopics, configuredTopics);
    const topics = [...configuredTopics, ...autoTopics];
    if (topics.every(topic => topic.enabled === false)) {
      setKnowledgeArticles([]);
      setKnowledgeVideos([]);
      setKnowledgeError('');
      setKnowledgeLoading(false);
      return;
    }

    setKnowledgeLoading(true);
    setKnowledgeError('');

    try {
      const bundle = await webKnowledge.fetchKnowledgeBundle(forceRefresh, topics);
      setKnowledgeArticles(bundle.articles);
      setKnowledgeVideos(bundle.videos);
    } catch (error) {
      console.error(error);
      setKnowledgeArticles([]);
      setKnowledgeVideos([]);
      setKnowledgeError('לא הצלחתי למשוך כרגע עדכונים מהרשת. אפשר לנסות שוב ברענון.');
    } finally {
      setKnowledgeLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const [storedPresentations, storedCategories] = await Promise.all([
        svc.fetchPresentations(),
        svc.fetchCategories(),
      ]);

      setLibraryPresentations(storedPresentations);
      setCategories(storedCategories);
      await reloadExternalSources();
    })();
  }, [reloadExternalSources]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      svc.syncToLocal(libraryPresentations, categories);
    }
  }, [libraryPresentations, categories]);

  const filteredPresentations = useMemo(() => {
    let list = presentations;

    if (selectedCategory !== 'הכל') {
      list = list.filter(item => item.category === selectedCategory);
    }

    if (expandedSearchTerms.length > 0) {
      list = list.filter(item => {
        const haystack = `${item.title} ${item.description} ${item.category}`;

        if (matchesSearchValue(haystack, expandedSearchTerms)) {
          return true;
        }

        return matchedSearchTopics.some(topic => {
          if (topic.presentationIds?.includes(item.id)) return true;
          return topic.categories.includes(item.category);
        });
      });
    }

    return list;
  }, [expandedSearchTerms, matchedSearchTopics, presentations, selectedCategory]);

  const filteredKnowledgeArticles = useMemo(() => {
    let list = knowledgeArticles;

    if (selectedCategory !== 'הכל') {
      list = list.filter(item => item.category === selectedCategory);
    }

    if (expandedSearchTerms.length > 0) {
      list = list.filter(item => {
        const haystack = `${item.title} ${item.summary} ${item.category} ${item.source} ${item.topicLabel}`;

        if (matchesSearchValue(haystack, expandedSearchTerms)) {
          return true;
        }

        return matchedSearchTopics.some(topic => {
          if (topic.topicIds.includes(item.topicId)) return true;
          return topic.categories.includes(item.category);
        });
      });
    }

    return list;
  }, [expandedSearchTerms, knowledgeArticles, matchedSearchTopics, selectedCategory]);

  const filteredCyberCases = useMemo(() => {
    let list = CYBER_CASES;

    if (selectedCategory !== 'הכל') {
      list = list.filter(item => item.category === selectedCategory);
    }

    if (expandedSearchTerms.length > 0) {
      list = list.filter(item => {
        const haystack = `${item.title} ${item.summary} ${item.category} ${item.tags.join(' ')} ${item.hook}`;

        if (matchesSearchValue(haystack, expandedSearchTerms)) {
          return true;
        }

        return matchedSearchTopics.some(topic => {
          if (topic.caseIds?.includes(item.id)) return true;
          return matchesSearchValue(item.category, createSearchTerms(topic.categories.join(' ')));
        });
      });
    }

    return list;
  }, [expandedSearchTerms, matchedSearchTopics, selectedCategory]);

  const focusedCyberCases = useMemo(() => {
    if (!sectionFocusTopic) return filteredCyberCases;

    return filteredCyberCases.filter(item => {
      if (sectionFocusTopic.caseIds?.includes(item.id)) return true;
      if (sectionFocusTopic.categories.includes(item.category)) return true;

      return matchesTopicShortcut(
        `${item.title} ${item.summary} ${item.category} ${item.tags.join(' ')} ${item.hook}`,
        sectionFocusTopic
      );
    });
  }, [filteredCyberCases, sectionFocusTopic]);

  const addPresentation = useCallback((presentation: Presentation) => {
    setLibraryPresentations(prev => [presentation, ...prev]);
    svc.addPresentation(presentation);
  }, []);

  const removePresentation = useCallback((id: string) => {
    setLibraryPresentations(prev => prev.filter(item => item.id !== id));
    svc.removePresentation(id);
  }, []);

  const updatePresentation = useCallback((presentation: Presentation) => {
    setLibraryPresentations(prev =>
      prev.map(item => (item.id === presentation.id ? presentation : item))
    );
    svc.updatePresentation(presentation);
  }, []);

  const addCategory = useCallback((category: string) => {
    setCategories(prev => (prev.includes(category) ? prev : [...prev, category]));
    svc.addCategory(category);
  }, []);

  const removeCategory = useCallback((category: string) => {
    setCategories(prev => (prev.length <= 1 ? prev : prev.filter(item => item !== category)));
    svc.removeCategory(category);
  }, []);

  const openPortalSection = useCallback((section: Exclude<SectionKey, null>, focusTopicId?: string) => {
    setSectionFocusTopicId(focusTopicId || null);
    setOpenSection(section);
  }, []);

  const closePortalSection = useCallback(() => {
    setOpenSection(null);
    setSectionFocusTopicId(null);
  }, []);

  const applySearchTopic = useCallback((topic: SearchTopicShortcut) => {
    setActiveTopicId(topic.id);
    setIsWorldMode(true);
    setSelectedCategory('הכל');
    setSearchQuery(topic.label);
    setIsSearchOpen(true);
    document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectTopic = useCallback((topicId: string) => {
    setActiveTopicId(topicId);
    setIsWorldMode(true);
    requestAnimationFrame(() => {
      document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const handleLogoClick = useCallback(() => {
    setIsWorldMode(false);
    setIsSearchOpen(false);
    setIsSupportShelfOpen(false);
    closePortalSection();
    scrollToTop();
  }, [closePortalSection, scrollToTop]);

  const clearSearchAndFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('הכל');
  }, []);

  const handleAuth = (event: React.FormEvent) => {
    event.preventDefault();

    if (authCode === '9090') {
      setIsAuthorized(true);
      sessionStorage.setItem(AUTH_KEY, 'true');
      setAuthError(false);
      return;
    }

    setAuthError(true);
    setAuthCode('');
  };

  if (!isAuthorized) {
    return (
      <div
        className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-black font-sans" dir="rtl">
        {/* Massive 3D Global Space Background */}
        <div className="absolute inset-0">
          <img src="/worlds/global-bg.png" className="absolute inset-0 w-full h-full object-cover opacity-60 animate-[pulse_10s_ease-in-out_infinite]" alt="Global Hub" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)]" />
        </div>
        <div className="w-full max-w-md relative z-10 animate-[slide-up_1s_ease-out_forwards]">
          <div className="rounded-[2.5rem] p-6 sm:p-10 bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_100px_rgba(56,189,248,0.15)] relative overflow-hidden transition-all hover:border-cyan-400/30">
            <div className="absolute top-0 left-1/4 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse" />
            <div className="mb-10 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="80" height="80" rx="20" fill="#EFF6FF" />
                  <path
                    d="M40 12L16 22V42C16 55.3 26.7 67.6 40 71C53.3 67.6 64 55.3 64 42V22L40 12Z"
                    fill="#2563EB"
                    fillOpacity="0.15"
                  />
                  <path
                    d="M40 16L19 25.2V42C19 53.8 28.4 64.8 40 67.8C51.6 64.8 61 53.8 61 42V25.2L40 16Z"
                    stroke="#2563EB"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M31 41L37 47L50 34"
                    stroke="#2563EB"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-[0.1em] sm:tracking-[0.2em] mb-3 text-white drop-shadow-[0_0_20px_#fff]">מאגרון</h1>
              <p className="text-cyan-200/60 font-mono tracking-widest text-sm uppercase mb-4">Global Intelligence Hub</p>
              <div className="inline-block px-4 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-950/40">
                <span className="text-cyan-300 text-xs tracking-widest animate-pulse">הזן קוד פריצה (9090) כדי להמשיך</span>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  className={`w-full bg-black/60 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 pr-10 sm:pr-12 text-center text-2xl sm:text-3xl font-mono text-cyan-100 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all tracking-[0.5em] placeholder:text-cyan-900/50 shadow-inner ${authError ? 'border-rose-400' : ''}`}
                  placeholder="••••"
                  value={authCode}
                  onChange={event => {
                    setAuthCode(event.target.value);
                    setAuthError(false);
                  }}
                  autoFocus
                  maxLength={6}
                />
              </div>

              {authError && (
                <p className="text-rose-400 text-sm font-mono tracking-widest font-bold text-center animate-fade-in bg-rose-950/40 py-2 rounded-xl border border-rose-500/20">
                  קוד שגוי, נסו שנית
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              >
                כניסה
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (!isWorldMode) {
    return (
      <>
        <WorldSelector
          onSelectWorld={handleSelectTopic}
          onAdminClick={() => setIsAdminOpen(true)}
        />

        <Suspense fallback={null}>
          {isAdminOpen && (
            <AdminPanel
              categories={availableCategories.filter(category => category !== 'הכל')}
              presentations={libraryPresentations}
              onAddCategory={addCategory}
              onRemoveCategory={removeCategory}
              onAdd={addPresentation}
              onRemove={removePresentation}
              onUpdate={updatePresentation}
              onSourcesRefresh={() => reloadExternalSources(true)}
              onClose={() => setIsAdminOpen(false)}
            />
          )}
        </Suspense>
      </>
    );
  }

  return (
    <div className={`relative min-h-screen overflow-x-clip ${currentTheme.shell}`} dir="rtl" data-world={activePortalTopic?.id || 'neutral'}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 ${currentTheme.ambientBase}`} />
        <div className={`absolute inset-0 opacity-80 ${currentTheme.ambientMesh}`} />
        <div className={`absolute inset-0 opacity-50 ${currentTheme.ambientPattern}`} />
        <div className={`absolute -top-24 right-[3%] h-[26rem] w-[26rem] rounded-full blur-[110px] ${currentTheme.ambientAuraA}`} />
        <div className={`absolute top-[28rem] left-[-6rem] h-[24rem] w-[24rem] rounded-full blur-[120px] ${currentTheme.ambientAuraB}`} />
        <div className={`absolute bottom-[-5rem] right-[28%] h-[22rem] w-[22rem] rounded-full blur-[110px] ${currentTheme.ambientAuraC}`} />
        <div className={`absolute inset-x-0 top-0 h-[30rem] ${currentTheme.shellBody}`} />
      </div>

      <div className="relative z-10">
      <PortalNavbar
        onLogoClick={handleLogoClick}
        onSearchClick={() => startTransition(() => setIsSearchOpen(prev => !prev))}
        onCasesClick={() => openPortalSection('cases')}
        onSupportClick={() => setIsSupportShelfOpen(true)}
        onAdminClick={() => setIsAdminOpen(true)}
        onTopicsClick={() => {
          setIsSearchOpen(false);
          document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' });
        }}
        themeMode={currentTheme.mode}
        themeKey={activeThemeKey}
        worldLabel={activePortalTopic?.shortLabel || activePortalTopic?.label}
        isWorldMode={isWorldMode}
      />

      {isSearchOpen && (
        <div className={`sticky top-16 z-40 animate-fade-in ${currentTheme.searchWrap}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="relative max-w-2xl mx-auto">
              <Search className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${currentTheme.mode === 'dark' ? 'text-white/35' : 'text-gray-400'}`} />
              <input
                autoFocus
                className={`w-full pr-12 pl-10 py-3.5 rounded-2xl text-base focus:outline-none transition-all ${currentTheme.searchInput}`}
                placeholder="חיפוש בכל המאגרון: עולמות, חומרים, פרשיות, עדכונים ותיקיות Drive..."
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${currentTheme.mode === 'dark' ? 'text-white/45 hover:text-white/80' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="max-w-2xl mx-auto mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-400">נסו גם:</span>
              {portalTopics.slice(0, 10).map(topic => (
                <button
                  key={topic.id}
                  onClick={() => applySearchTopic(topic)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${currentTheme.chip}`}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          IMMERSIVE WORLD HERO — WorldScene fills the entire section
          ═══════════════════════════════════════════════════════ */}
      {false && <LibraryHero
        theme={currentTheme}
        topics={portalTopics}
        activeTopic={activePortalTopic}
        sceneVariant={activeWorldScene}
        previewImageUrl={activeTopicImages[0]?.thumbnailUrl}
        onSelectTopic={handleSelectTopic}
      />}

      <section className="relative overflow-hidden" style={{ minHeight: isWorldMode ? '34vh' : '44vh' }}>

        {/* Full-bleed WorldScene background */}
        <WorldScene variant={isWorldMode ? activeWorldScene : 'neutral'} mode="hero" className="absolute inset-0 w-full h-full opacity-65" />
        

        {/* Layered overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/55 pointer-events-none" />
        {currentTheme.heroPattern && <div className={`absolute inset-0 pointer-events-none opacity-40 ${currentTheme.heroPattern}`} />}

        {/* Ambient glow orbs */}
        <div className={`absolute top-0 right-0 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none opacity-25 ${currentTheme.heroGlowA}`} />
        <div className={`absolute bottom-0 left-0 w-[500px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-20 ${currentTheme.heroGlowB}`} />

        {/* Content — bottom-anchored, full-width */}
        <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-5xl flex-col justify-end px-4 pb-6 pt-16 sm:px-8 sm:pb-8 sm:pt-20">

          {/* Top row: change-world button */}
          {isWorldMode && (
            <div className="mb-6 flex items-center justify-end sm:mb-8">
              <button
                onClick={() => setIsWorldMode(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all backdrop-blur-sm"
                style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.65)' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(0,0,0,0.7)'; el.style.color = '#fff'; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(0,0,0,0.45)'; el.style.color = 'rgba(255,255,255,0.65)'; }}
              >
                <BookOpen className="w-4 h-4" />
                חזרה לעולמות
              </button>
            </div>
          )}

          {/* World title — BIG and atmospheric */}
          <div className="animate-slide-up max-w-3xl">
            <h1 className="mb-4 text-3xl font-black leading-none text-white sm:text-5xl lg:text-6xl">
              {isWorldMode ? activePortalTopic?.label || currentTheme.title : 'בחרו את העולם שמעניין אתכם'}
            </h1>
            {(isWorldMode ? activePortalTopic?.description : 'ספריית תוכן אחת עם עולמות ברורים. בוחרים עולם ונכנסים ישר למצגות, כתבות, סרטונים ואירועי אמת שמתאימים לו.') && (
              <p className="mb-4 max-w-2xl text-sm leading-7 text-white/76 sm:text-base">
                {isWorldMode ? activePortalTopic?.description : 'ספריית תוכן אחת עם עולמות ברורים. בוחרים עולם ונכנסים ישר למצגות, כתבות, סרטונים ואירועי אמת שמתאימים לו.'}
              </p>
            )}
            {isWorldMode && (
              <div className="mb-5 flex flex-wrap gap-2">
                {activePortalTopic?.categories.slice(0, 3).map(category => (
                  <span
                    key={category}
                    className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-black text-white/78 backdrop-blur-md"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' })}
                className={`inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-bold transition-all hover:-translate-y-0.5 ${currentTheme.primaryButton}`}
              >
                <BookOpen className="w-5 h-5" />
                {isWorldMode ? 'פתח את התוכן' : 'בחר עולם'}
              </button>
            </div>
          </div>

          {false && (isWorldMode ? (
            <div className="animate-slide-up max-w-4xl">
              <h1 className="mb-5 text-5xl font-black leading-none text-white sm:text-7xl lg:text-8xl">
                {activePortalTopic?.label || currentTheme.title}
              </h1>
              <div className="mb-8 flex flex-wrap gap-2">
                {activePortalTopic?.categories.slice(0, 4).map(category => (
                  <span
                    key={category}
                    className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs font-black text-white/78 backdrop-blur-md"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-bold transition-all hover:-translate-y-0.5 ${currentTheme.primaryButton}`}
                >
                  <BookOpen className="w-5 h-5" />
                  פתח את התוכן
                </button>
                <button
                  onClick={() => openPortalSection('cases', activeTopicId)}
                  className={`inline-flex items-center gap-2 rounded-2xl px-6 py-4 font-bold transition-all ${currentTheme.secondaryButton}`}
                >
                  <BrainCircuit className="w-5 h-5" />
                  אירועי אמת
                </button>
              </div>
            </div>
          ) : (
            <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(340px,0.95fr)] lg:gap-10">
              <div className="animate-slide-up">
              <p className="text-xs font-black tracking-[0.45em] text-white/30 uppercase mb-4">MAAGARON · מאגרון</p>
              <h1 className="text-4xl sm:text-7xl font-black text-white tracking-tight mb-5 leading-[1.1]">
                כל מה שצריך
                <br />
                <span className="gradient-text">במקום אחד</span>
              </h1>
              <p className="text-slate-300 text-base sm:text-xl max-w-2xl leading-relaxed mb-8 font-medium">
                בוחרים קטגוריה אחת ונכנסים ישר לתוכן, כתבות, אירועי אמת וסרטונים שמתאימים לה.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => document.getElementById('topics')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`inline-flex items-center gap-2 font-bold py-4 px-8 rounded-2xl transition-all hover:-translate-y-0.5 ${currentTheme.primaryButton}`}
                >
                  <BookOpen className="w-5 h-5" />
                  פתחו קטגוריות
                </button>
                <button
                  onClick={() => setIsSupportShelfOpen(true)}
                  className={`inline-flex items-center gap-2 font-bold py-4 px-6 rounded-2xl transition-all ${currentTheme.secondaryButton}`}
                >
                  <BookOpen className="w-5 h-5" />
                  מדף עזר
                </button>
              </div>
              </div>

              <div className="animate-slide-up [animation-delay:120ms]">
                <div className="relative h-[20rem] overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 shadow-[0_30px_100px_rgba(0,0,0,0.38)] sm:h-[24rem]">
                  <WorldScene variant="neutral" mode="hero" className="absolute inset-0 opacity-45" />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3 backdrop-blur-md">
                        <p className="text-[11px] font-black tracking-[0.22em] text-white/40">עולמות</p>
                        <p className="mt-1 text-2xl font-black text-white">{portalTopics.length}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3 backdrop-blur-md">
                        <p className="text-[11px] font-black tracking-[0.22em] text-white/40">עדכונים</p>
                        <p className="mt-1 text-2xl font-black text-white">{knowledgeArticles.length}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-3 backdrop-blur-md">
                        <p className="text-[11px] font-black tracking-[0.22em] text-white/40">מדיה</p>
                        <p className="mt-1 text-2xl font-black text-white">{driveVideos.length + driveImages.length + knowledgeVideos.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <TopicExplorer
        topics={portalTopics}
        activeTopicId={activeTopicId}
        searchQuery={deferredSearchQuery}
        presentations={filteredPresentations}
        articles={filteredKnowledgeArticles}
        driveVideos={driveVideos}
        webVideos={knowledgeVideos}
        driveImages={driveImages}
        themeKey={activeThemeKey}
        isWorldMode={isWorldMode}
        onSelectTopic={handleSelectTopic}
        onOpenPresentation={setSelectedPresentation}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenSection={(section, focusTopicId) => openPortalSection(section, focusTopicId)}
      />

      <footer className={`py-8 text-center ${currentTheme.footer}`}>
        <p className={`text-xs font-medium ${currentTheme.mode === 'dark' ? 'text-white/42' : 'text-gray-400'}`}>
          מאגרון · מאגר ידע פנימי, פרשיות עדכניות ועדכוני רשת שמתעדכנים לאורך היום
        </p>
      </footer>

      <Suspense fallback={null}>

      <SectionModal
        isOpen={isSupportShelfOpen}
        onClose={() => setIsSupportShelfOpen(false)}
        themeKey={activeThemeKey}
        sceneVariant={activeWorldScene}
        title="מדף עזר"
        subtitle="מילון מושגים, הקשחת מובייל וסימולציות. תכנים משלימים שלא חיים כקטגוריה נפרדת."
      >
        <SupportShelf
          onOpen={action => {
            setIsSupportShelfOpen(false);

            window.setTimeout(() => {
              if (action === 'glossary') {
                setIsGlossaryOpen(true);
                return;
              }

              openPortalSection(action === 'hardening' ? 'hardening' : 'scenarios');
            }, 140);
          }}
        />
      </SectionModal>

      <SectionModal
        isOpen={openSection === 'videos'}
        onClose={closePortalSection}
        themeKey={activeThemeKey}
        sceneVariant={activeWorldScene}
        title={sectionFocusTopic ? `סרטונים ומדיה - ${sectionFocusTopic.label}` : 'ספריית וידאו'}
        subtitle={sectionFocusTopic ? `כל הווידאו הרלוונטי לעולם ${sectionFocusTopic.label}, כולל YouTube, Google Drive ומקורות רשת.` : 'סרטונים נבחרים בנושאי סייבר, פישינג ואבטחת מידע'}
      >
        <VideoSection modal driveVideos={driveVideos} webVideos={knowledgeVideos} focusTopic={sectionFocusTopic} />
      </SectionModal>

      <SectionModal
        isOpen={openSection === 'scenarios'}
        onClose={closePortalSection}
        themeKey={activeThemeKey}
        sceneVariant={activeWorldScene}
        title="מרכז סימולציות"
        subtitle="תרגלו תרחישי אמת ובדקו את עצמכם"
      >
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {scenarios.map(scenario => (
              <div
                key={scenario.id}
                onClick={() => {
                  closePortalSection();
                  setTimeout(() => setActiveScenario(scenario), 200);
                }}
                className={`group rounded-3xl p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl flex flex-col ${
                  currentTheme.mode === 'dark'
                    ? 'bg-white/5 border border-white/10 hover:border-white/20'
                    : 'bg-white border border-gray-200 hover:border-primary/30'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  currentTheme.mode === 'dark'
                    ? 'bg-white/5 border border-white/10 text-white/70 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20'
                    : 'bg-gray-100 border border-gray-200 text-gray-500 group-hover:bg-primary group-hover:text-white group-hover:border-primary'
                }`}>
                  {getScenarioIcon(scenario.icon)}
                </div>
                <h3 className={`text-lg font-bold mb-3 transition-colors leading-snug ${
                  currentTheme.mode === 'dark'
                    ? 'text-white group-hover:text-white'
                    : 'text-gray-900 group-hover:text-primary'
                }`}>
                  {scenario.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-6 flex-grow font-medium ${
                  currentTheme.mode === 'dark' ? 'text-white/58' : 'text-gray-500'
                }`}>
                  {scenario.description}
                </p>
                <div className={`flex items-center text-sm font-bold ${
                  currentTheme.mode === 'dark' ? 'text-white/82' : 'text-primary'
                }`}>
                  <span>התחל סימולציה</span>
                  <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionModal>

      <SectionModal
        isOpen={openSection === 'hardening'}
        onClose={closePortalSection}
        themeKey={activeThemeKey}
        sceneVariant={activeWorldScene}
        title="אבטחת טלפון נייד"
        subtitle="10 צעדים להגבהת חומות המכשיר שלך - iOS ואנדרואיד"
      >
        <MobileHardening modal />
      </SectionModal>

      <SectionModal
        isOpen={openSection === 'cases'}
        onClose={closePortalSection}
        themeKey={activeThemeKey}
        sceneVariant={activeWorldScene}
        title={
          sectionFocusTopic
            ? `פרשיות ולקחים בנושא ${sectionFocusTopic.label}`
            : 'פרשיות עדכניות ולקחים מהשטח'
        }
        subtitle={
          sectionFocusTopic
            ? `אירועי אמת שקשורים ל-${sectionFocusTopic.label}, כדי שיהיה קל לעבור מעדכון ללקח ולחומר רלוונטי.`
            : 'ריכוז של אירועי אמת עדכניים עם לקחים פרקטיים לעובדים וארגונים.'
        }
        maxWidth="max-w-6xl"
      >
        <CyberCases modal cases={focusedCyberCases} />
      </SectionModal>

      <PresentationModal
        presentation={selectedPresentation}
        onClose={() => setSelectedPresentation(null)}
        themeKey={activeThemeKey}
        sceneVariant={activeWorldScene}
      />

      {isGlossaryOpen && <GlossaryModal onClose={() => setIsGlossaryOpen(false)} />}

      {isAdminOpen && (
        <AdminPanel
          categories={availableCategories.filter(category => category !== 'הכל')}
          presentations={libraryPresentations}
          onAddCategory={addCategory}
          onRemoveCategory={removeCategory}
          onAdd={addPresentation}
          onRemove={removePresentation}
          onUpdate={updatePresentation}
          onSourcesRefresh={() => reloadExternalSources(true)}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {activeScenario && (
        <ScenarioPlayer scenario={activeScenario} onClose={() => setActiveScenario(null)} />
      )}

      </Suspense>
      </div>
    </div>
  );
};

export default App;
