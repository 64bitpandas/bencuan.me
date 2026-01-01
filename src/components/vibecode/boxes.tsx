import CollapsibleBox, { type CollapsibleBoxProps } from '../collapsible/CollapsibleBox';

export function RubricBox({ title, children }: CollapsibleBoxProps) {
  title ??= 'Rubric';
  return (
    <CollapsibleBox title={title} iconSrc="/img/listchecks.png" borderColor="#29282d" backgroundColor="#1b68f620">
      {children}
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
