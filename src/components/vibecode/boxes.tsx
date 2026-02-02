import { CheckCircle, CircleHalf, XCircle } from '@phosphor-icons/react';
import { Children, type ReactNode, isValidElement } from 'react';
import CollapsibleBox, { type CollapsibleBoxProps } from '../collapsible/CollapsibleBox';
import './rubric.scss';

// Recursively process text nodes to replace rubric markers with icons
function processRubricContent(node: ReactNode): ReactNode {
  if (typeof node === 'string') {
    // Replace checkbox markers in text
    if (node.includes('- [x]') || node.includes('- [/]') || node.includes('- [ ]')) {
      const parts = node.split(/(-\s*\[[x\/\s]\])/g);
      return parts.map((part, i) => {
        if (part.match(/-\s*\[x\]/)) {
          return <CheckCircle key={i} className="rubric-icon rubric-check" weight="fill" />;
        } else if (part.match(/-\s*\[\/\]/)) {
          return <CircleHalf key={i} className="rubric-icon rubric-half" weight="fill" />;
        } else if (part.match(/-\s*\[\s\]/)) {
          return <XCircle key={i} className="rubric-icon rubric-x" />;
        }
        // Remove completion date text
        return part.replace(/\s*\[completion::\s*[\d-]+\]/g, '');
      });
    }
    // Remove completion date from any text
    return node.replace(/\s*\[completion::\s*[\d-]+\]/g, '');
  }

  if (isValidElement(node)) {
    const element = node as React.ReactElement<{ children?: ReactNode }>;
    const children = element.props.children;
    if (children) {
      const processedChildren = Children.map(children, child => processRubricContent(child));
      // Clone with processed children - use type assertion for the cloneElement call
      return {
        ...element,
        props: {
          ...element.props,
          children: processedChildren,
        },
      };
    }
  }

  if (Array.isArray(node)) {
    return node.map(child => processRubricContent(child));
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
