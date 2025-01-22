import { faSpotify, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons';
import {
  faBlog,
  faBook,
  faCamera,
  faGlobe,
  faImage,
  faMusic,
  faNewspaper,
  faPen,
  faRss,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useRef, useState } from 'react';
import '../sass/doomscroll.scss';

interface Update {
  type: 'update';
  source: string;
  title: string;
  author: string;
  description: string;
  url: string;
  date: Date;
}

interface Recommendation {
  type: 'recommendation';
  category: 'youtube' | 'twitter' | 'website' | 'blog' | 'spotify' | 'book' | 'art' | 'photography' | 'substack';
  title: string;
  author: string;
  description: string;
  url: string;
}

type FeedItem = Update | Recommendation;

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const getIconForItem = (item: FeedItem) => {
  if (item.type === 'update') {
    return faRss;
  }
  switch (item.category) {
    case 'youtube':
      return faYoutube;
    case 'twitter':
      return faTwitter;
    case 'website':
      return faGlobe;
    case 'blog':
      return faPen;
    case 'spotify':
      return faSpotify;
    case 'book':
      return faBook;
    case 'art':
      return faImage;
    case 'photography':
      return faCamera;
    case 'substack':
      return faPen;
    default:
      return faNewspaper;
  }
};

export default function InfiniteFeed({ recommendations }: { recommendations: Recommendation[] }) {
  const [feedItems, setFeedItems] = useState<(FeedItem & { id: string })[]>([]);
  const [page, setPage] = useState(0);
  const [showUpdates, setShowUpdates] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  const shuffledRecommendations = useMemo(() => shuffleArray(recommendations), [recommendations]);

  const loadMoreItems = () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const ITEMS_PER_PAGE = 10;
    const startIdx = page * ITEMS_PER_PAGE;
    // const availableUpdates = showUpdates ? updates.slice(startIdx, startIdx + ITEMS_PER_PAGE) : [];

    let newItems: (FeedItem & { id: string })[] = [];

    // if (availableUpdates.length > 0) {
    //   // Add updates with interspersed recommendations
    //   availableUpdates.forEach(update => {
    //     newItems.push({ ...update, id: crypto.randomUUID() });

    //     // Add 1-3 random recommendations between updates
    //     if (showRecommendations) {
    //       const numRecommendations = Math.floor(Math.random() * 3) + 1;
    //       const recommendationsToAdd = shuffledRecommendations
    //         .slice(0, numRecommendations)
    //         .map(rec => ({ ...rec, id: crypto.randomUUID() }));
    //       newItems.push(...recommendationsToAdd);
    //     }
    //   });
    // } else if (showRecommendations) {
    // If no more updates, just add recommendations
    newItems = shuffleArray(shuffledRecommendations)
      .slice(0, ITEMS_PER_PAGE)
      .map(rec => ({ ...rec, id: crypto.randomUUID() }));
    // }

    if (newItems.length === 0) {
      setHasMore(false);
    } else {
      setFeedItems(prev => [...prev, ...newItems]);
      setPage(p => p + 1);
    }

    setLoading(false);
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    };

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMoreItems();
      }
    }, options);

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [page, showUpdates, showRecommendations]);

  useEffect(() => {
    setFeedItems([]);
    setPage(0);
    setHasMore(true);
    loadMoreItems();
  }, [showUpdates, showRecommendations]);

  return (
    <div className="infinite-feed">
      {/* <div className="controls">
        <label>
          <input type="checkbox" checked={showUpdates} onChange={e => setShowUpdates(e.target.checked)} />
          Show Updates
        </label>
        <label>
          <input
            type="checkbox"
            checked={showRecommendations}
            onChange={e => setShowRecommendations(e.target.checked)}
          />
          Show Recommendations
        </label>
      </div> */}

      <div className="feed-container">
        {feedItems.map(item => (
          <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className={`card ${item.type}`}>
            <div className="card-icon">
              <FontAwesomeIcon icon={getIconForItem(item)} />
            </div>
            <div className="card-content">
              <h3>{item.title}</h3>
              <p className="author">{item.author}</p>
              <p className="description">{item.description}</p>
              <p className="url">{new URL(item.url).hostname}</p>
            </div>
          </a>
        ))}
        <div ref={loadingRef} className="loading">
          {loading && <span>Loading...</span>}
          {!hasMore && <span>No more items to load</span>}
        </div>
      </div>
    </div>
  );
}
