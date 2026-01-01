import { CaretDown } from '@phosphor-icons/react';
import { type ReactNode, useState } from 'react';
import './collapsible.scss';

export interface CollapsibleBoxProps {
  title: string;
  iconSrc?: string;
  defaultExpanded?: boolean;
  children: ReactNode;
  borderColor?: string;
  backgroundColor?: string;
  rounded?: boolean;
  maxHeight?: string;
}

export default function CollapsibleBox({
  title,
  iconSrc,
  defaultExpanded,
  rounded,
  backgroundColor,
  borderColor,
  maxHeight,
  children,
}: CollapsibleBoxProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`collapsible-box ${isExpanded ? 'expanded' : 'collapsed'} ${rounded ? 'rounded' : ''}`}
      style={{ borderColor, backgroundColor }}
    >
      <button className="collapsible-header" onClick={() => setIsExpanded(!isExpanded)} aria-expanded={isExpanded}>
        <CaretDown className="collapsible-caret" weight="fill" />
        {iconSrc && <img className="collapsible-icon" src={iconSrc} />}
        <span className="collapsible-title">{title.toLowerCase()}</span>
      </button>
      <div className="collapsible-content" style={{ maxHeight }}>
        {children}
      </div>
    </div>
  );
}

export function OptionalReadingBox({ title, children }: CollapsibleBoxProps) {
  return (
    <CollapsibleBox title={title} rounded={true} defaultExpanded={true} borderColor="#297638" backgroundColor="#f4eee8">
      {children}
    </CollapsibleBox>
  );
}
