import BlogCard, { type BlogCardItem } from './BlogCard';
import '../sass/blog.scss';

interface BlogCardGridProps {
  items: BlogCardItem[];
  showBadges?: boolean;
}

export default function BlogCardGrid({ items, showBadges = true }: BlogCardGridProps) {
  const sortedItems = [...items].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="blog-card-grid">
      {sortedItems.map(item => (
        <BlogCard key={item.slug} item={item} showBadge={showBadges} />
      ))}
    </div>
  );
}

