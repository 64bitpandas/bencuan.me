import { useEffect, useState } from 'react';

interface Webmention {
  id: number;
  author: {
    name: string;
    photo?: string;
    url?: string;
  };
  published: string;
  content?: {
    text: string;
  };
  'wm-property': 'like-of' | 'repost-of' | 'mention-of' | 'in-reply-to';
  'wm-source': string;
  'wm-target': string;
}

interface SocialFeedState {
  mentions: Webmention[];
  isLoading: boolean;
  error: string | null;
}

export default function SocialFeed(): JSX.Element {
  const [state, setState] = useState<SocialFeedState>({
    mentions: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchWebmentions = async () => {
      try {
        // Replace with your webmention.io token
        const domain = window.location.hostname;
        const perPage = 50;
        const url = `https://webmention.io/api/mentions.jf2?domain=${domain}&per-page=${perPage}&sort-by=published`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch webmentions');
        }

        const data = await response.json();
        setState(prev => ({
          ...prev,
          mentions: data.children,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'An error occurred',
          isLoading: false,
        }));
      }
    };

    fetchWebmentions();
  }, []);

  if (state.isLoading) {
    return <div className="social-feed-loading">Loading social interactions...</div>;
  }

  if (state.error) {
    return <div className="social-feed-error">Error: {state.error}</div>;
  }

  return (
    <div className="social-feed">
      <h2>Social Interactions</h2>
      <div className="social-feed-list">
        {state.mentions.map(mention => (
          <article key={mention.id} className="social-feed-item">
            <header className="social-feed-item-header">
              <img
                src={mention.author.photo || '/default-avatar.png'}
                alt={mention.author.name}
                className="social-feed-avatar"
                width={48}
                height={48}
              />
              <div className="social-feed-meta">
                <a href={mention.author.url} target="_blank" rel="noopener noreferrer" className="social-feed-author">
                  {mention.author.name}
                </a>
                <time dateTime={mention.published}>{new Date(mention.published).toLocaleDateString()}</time>
              </div>
            </header>
            {mention.content?.text && <div className="social-feed-content">{mention.content.text}</div>}
            <footer className="social-feed-item-footer">
              <span className="social-feed-type">{mention['wm-property'].replace('-of', '')}</span>
              <a href={mention['wm-source']} target="_blank" rel="noopener noreferrer" className="social-feed-source">
                View original
              </a>
            </footer>
          </article>
        ))}
      </div>
      {state.mentions.length === 0 && <p className="social-feed-empty">No social interactions found</p>}
      <style>{`
        .social-feed {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1rem;
        }
        
        .social-feed-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .social-feed-item {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 1rem;
        }
        
        .social-feed-item-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }
        
        .social-feed-avatar {
          border-radius: 50%;
          object-fit: cover;
        }
        
        .social-feed-meta {
          display: flex;
          flex-direction: column;
        }
        
        .social-feed-author {
          font-weight: bold;
          text-decoration: none;
          color: inherit;
        }
        
        .social-feed-content {
          margin: 0.5rem 0;
          line-height: 1.5;
        }
        
        .social-feed-item-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #666;
        }
        
        .social-feed-source {
          color: inherit;
          text-decoration: none;
        }
        
        .social-feed-source:hover {
          text-decoration: underline;
        }
        
        .social-feed-loading,
        .social-feed-error,
        .social-feed-empty {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}
