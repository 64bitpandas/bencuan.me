import React from 'react';
import { Check, Copy } from '@phosphor-icons/react';

type Props = {
  value: string;
  ariaLabel: string;
};

export function CopyButton({ value, ariaLabel }: Props) {
  const [copied, setCopied] = React.useState(false);

  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={ariaLabel}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 900);
        } catch {
          // ignore
        }
      }}
    >
      {copied ? <Check size={18} weight="bold" /> : <Copy size={18} weight="regular" />}
    </button>
  );
}
