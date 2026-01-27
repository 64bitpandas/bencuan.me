import { CaretDown, BookOpenText } from '@phosphor-icons/react';
import { type ReactNode, useState } from 'react';
import './research-syllabus.scss';

interface BigQuestionsBoxProps {
  children: ReactNode;
}

/**
 * Big Questions box - always expanded, not collapsible
 * Pink background (#edd0de) with black border
 */
export function BigQuestionsBox({ children }: BigQuestionsBoxProps) {
  return (
    <div className="big-questions-box">
      <div className="big-questions-header">
        <span className="big-questions-title">THE BIG QUESTIONS</span>
      </div>
      <div className="big-questions-content">{children}</div>
    </div>
  );
}

interface ReadingListBoxProps {
  children: ReactNode;
  defaultExpanded?: boolean;
}

/**
 * Reading List box - collapsible and collapsed by default
 * Light blue background (rgba(27, 102, 246, 0.1)) with black border
 */
export function ReadingListBox({ children, defaultExpanded = false }: ReadingListBoxProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`reading-list-box ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button
        className="reading-list-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <CaretDown className="reading-list-caret" weight="fill" />
        <BookOpenText className="reading-list-icon" weight="bold" />
        <span className="reading-list-title">reading list</span>
      </button>
      <div className="reading-list-content">{children}</div>
    </div>
  );
}

interface SectionWrapperProps {
  children: ReactNode;
  variant?: 'default' | 'preamble' | 'dark';
  className?: string;
}

/**
 * Section wrapper for applying background colors to major sections
 */
export function SectionWrapper({ children, variant = 'default', className = '' }: SectionWrapperProps) {
  return (
    <div className={`research-section research-section-${variant} ${className}`}>
      {children}
    </div>
  );
}

