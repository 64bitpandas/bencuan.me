import { Copy, Check } from '@phosphor-icons/react';
import { useState } from 'react';

interface CopyButtonProps {
    code: string;
}

export default function CopyButton({ code }: CopyButtonProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };
    
    return (
        <button className="copy-btn" onClick={handleCopy} aria-label={`Copy ${code}`} title="Copy to clipboard">
            {isCopied ? <Check size={18} weight="bold" /> : <Copy size={18} weight="bold" />}
        </button>
    );
}
