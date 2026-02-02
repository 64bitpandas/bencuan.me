import { CheckCircle, CircleHalf, XCircle } from '@phosphor-icons/react';
import { Children, type ReactNode, cloneElement, isValidElement } from 'react';
import CollapsibleBox, { type CollapsibleBoxProps } from '../collapsible/CollapsibleBox';
import './rubric.scss';

// Process a string to replace checkbox markers with icons
function processTextWithMarkers(text: string, keyPrefix: string): ReactNode[] {
  const result: ReactNode[] = [];
  // Match [x], [/], or [ ] at the start of text (after MDX strips the "- ")
  const markerRegex = /^\[([x\/\s])\]\s*/;
  const match = text.match(markerRegex);

  if (match) {
    const markerType = match[1];
    const remainingText = text.slice(match[0].length);

    if (markerType === 'x') {
      result.push(<CheckCircle key={`${keyPrefix}-icon`} className="rubric-icon rubric-check" weight="fill" />);
    } else if (markerType === '/') {
      result.push(<CircleHalf key={`${keyPrefix}-icon`} className="rubric-icon rubric-half" weight="fill" />);
    } else {
      result.push(<XCircle key={`${keyPrefix}-icon`} className="rubric-icon rubric-x" weight="fill" />);
    }

    if (remainingText) {
      result.push(remainingText);
    }
    return result;
  }

  // Also check for inline markers like "- [x]" that might not be at the start
  if (text.includes('[x]') || text.includes('[/]') || text.includes('[ ]')) {
    const parts = text.split(/(\[[x\/\s]\])/g);
    return parts.map((part, i) => {
      if (part === '[x]') {
        return <CheckCircle key={`${keyPrefix}-${i}`} className="rubric-icon rubric-check" weight="fill" />;
      } else if (part === '[/]') {
        return <CircleHalf key={`${keyPrefix}-${i}`} className="rubric-icon rubric-half" weight="fill" />;
      } else if (part === '[ ]') {
        return <XCircle key={`${keyPrefix}-${i}`} className="rubric-icon rubric-x" weight="fill" />;
      }
      return part;
    });
  }

  return [text];
}

// Recursively process text nodes to replace rubric markers with icons
function processRubricContent(node: ReactNode, keyPrefix = 'rubric'): ReactNode {
  if (typeof node === 'string') {
    const processed = processTextWithMarkers(node, keyPrefix);
    return processed.length === 1 ? processed[0] : processed;
  }

  if (isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: ReactNode }>;
    const children = element.props.children;
    if (children) {
      const processedChildren = Children.map(children, (child, index) =>
        processRubricContent(child, `${keyPrefix}-${index}`),
      );
      // Clone element with processed children
      return cloneElement(element, {}, processedChildren);
    }
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => processRubricContent(child, `${keyPrefix}-${index}`));
  }

  return node;
}

export function RubricBox({ title, children }: CollapsibleBoxProps) {
  title ??= 'Rubric';
  const processedChildren = processRubricContent(children);

  return (
    <CollapsibleBox title={title} iconSrc="/img/listchecks.png" borderColor="#29282d" backgroundColor="#dce4f0">
      <div className="rubric-content">{processedChildren}</div>
    </CollapsibleBox>
  );
}

// Colors for vibecode boxes
const USER_PROMPT_BG = 'rgba(145, 183, 118, 0.125)'; // Green for user prompts (dino icon)
const AGENT_RESPONSE_BG = 'rgba(196, 174, 207, 0.25)'; // Purple for agent responses (anthropology color)

// EvalBox: Agent self-evaluation responses (purple)
export function EvalBox({ title, iconSrc, children }: CollapsibleBoxProps) {
  title ??= 'Rubric';
  return (
    <CollapsibleBox title={title} iconSrc={iconSrc} borderColor="#29282d" backgroundColor={AGENT_RESPONSE_BG}>
      {children}
    </CollapsibleBox>
  );
}

// PromptBox: User prompts with dino icon (green)
export function PromptBox({ title, iconSrc, children }: CollapsibleBoxProps) {
  return (
    <CollapsibleBox
      title={title}
      iconSrc={iconSrc ?? '/img/kevin2.png'}
      borderColor="#29282d"
      backgroundColor={USER_PROMPT_BG}
      maxHeight="500px"
    >
      {children}
    </CollapsibleBox>
  );
}
