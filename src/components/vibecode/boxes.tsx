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

export function EvalBox({ title, iconSrc, children }: CollapsibleBoxProps) {
  title ??= 'Rubric';
  return (
    <CollapsibleBox title={title} iconSrc={iconSrc} borderColor="#29282d" backgroundColor="#f4eee8">
      {children}
    </CollapsibleBox>
  );
}

export function PromptBox({ title, children }: CollapsibleBoxProps) {
  return (
    <CollapsibleBox
      title={title}
      iconSrc="/img/kevin2.png"
      borderColor="#29282d"
      backgroundColor="#91B77620"
      maxHeight="500px"
    >
      {children}
    </CollapsibleBox>
  );
}
