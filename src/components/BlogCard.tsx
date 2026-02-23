import TopicBadge from './research-syllabus/TopicBadge';
import { ToDateString } from './blog';
import '../sass/blog.scss';

export interface BlogCardItem {
  title: string;
  description?: string;
  date: Date;
  slug: string;
  tags?: string;
  image?: string;
  navImage?: string;
}

interface BlogCardProps {
  item: BlogCardItem;
  showBadge?: boolean;
}

export default function BlogCard({ item, showBadge = true }: BlogCardProps) {
  const coverImage = item.navImage || item.image;
  const topics = item.tags
    ? item.tags.split(',').map(t => t.trim().toLowerCase())
    : ['foundations'];

  return (
    <a href={item.slug} className="blog-card">
      <div className="blog-card-image-wrapper">
        {coverImage && (
          <img src={`/img/${coverImage}`} alt="" className="blog-card-image" loading="lazy" />
        )}
      </div>
      <div className="blog-card-content">
        <h3 className="blog-card-title">{item.title}</h3>
        {item.description && <p className="blog-card-description">{item.description}</p>}
        <div className="blog-card-meta">
          <span className="blog-card-date">{ToDateString(item.date, true)}</span>
          {showBadge && <TopicBadge topics={topics} className="blog-card-badge" />}
        </div>
      </div>
    </a>
  );
}

