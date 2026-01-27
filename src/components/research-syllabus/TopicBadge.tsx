import { Bridge, Campfire, Cpu, GameController, Heartbeat, MusicNote, Park } from '@phosphor-icons/react';
import './research-syllabus.scss';

// Topic color mapping based on Figma design
export const TOPIC_COLORS: Record<string, string> = {
  foundations: '#d9d9d9', // gray
  engineering: '#9ab4d3', // blue
  spaces: '#a1b5a6', // green
  anthropology: '#c4aecf', // purple
  health: '#fa969d', // pink/red
  music: '#fbd897', // yellow
  play: '#edd0de', // light pink
};

// Topic icon mapping
const TOPIC_ICONS: Record<string, React.ComponentType<any>> = {
  foundations: Bridge,
  engineering: Cpu,
  spaces: Park,
  anthropology: Campfire,
  health: Heartbeat,
  music: MusicNote,
  play: GameController,
};

interface TopicBadgeProps {
  topics: string | string[];
  className?: string;
}

export default function TopicBadge({ topics, className = '' }: TopicBadgeProps) {
  const topicList = Array.isArray(topics) ? topics : [topics];
  const isBridged = topicList.length > 1;

  // Generate gradient for bridged badges
  const getBackground = () => {
    if (!isBridged) {
      return TOPIC_COLORS[topicList[0]] || TOPIC_COLORS.foundations;
    }

    const colors = topicList.map(t => TOPIC_COLORS[t] || TOPIC_COLORS.foundations);
    const stops = colors.map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`);
    return `linear-gradient(90deg, ${stops.join(', ')})`;
  };

  // Get the appropriate icon for a topic
  const getIcon = (topic: string) => {
    const IconComponent = TOPIC_ICONS[topic] || Bridge;
    return <IconComponent weight="duotone" className="topic-badge-icon" />;
  };

  return (
    <div
      className={`topic-badge ${isBridged ? 'topic-badge-bridged' : ''} ${className}`}
      style={{ background: getBackground() }}
    >
      {topicList.map((topic, index) => (
        <span key={topic} className="topic-badge-item">
          {index === 0 && getIcon(topic)}
          <span className="topic-badge-label">{topic}</span>
          {isBridged && index < topicList.length - 1 && <Bridge weight="regular" className="topic-badge-bridge" />}
        </span>
      ))}
    </div>
  );
}
