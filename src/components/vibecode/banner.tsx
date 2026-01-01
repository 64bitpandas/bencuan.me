import { useCallback, useEffect, useRef, useState } from 'react';
import './banner.scss';

interface Message {
  type: 'user' | 'agent';
  content: string;
  isTyping?: boolean;
}

interface ConversationStep {
  type: 'user' | 'agent';
  text: string;
  delay: number; // delay before starting to type
}

const CONVERSATION_SCRIPT: ConversationStep[] = [
  { type: 'user', text: 'Create a color palette website with an explorer page', delay: 500 },
  {
    type: 'agent',
    text: '⏺ Explore(Explore codebase structure)\n  ⎿  Done (33 tool uses · 39.9k tokens · 49s)',
    delay: 600,
  },
  {
    type: 'agent',
    text: '⏺ Fetch(https://catppuccin.com/palette/)\n  ⎿  Received 383.2KB (200 OK)',
    delay: 400,
  },
  {
    type: 'agent',
    text: '⏺ Read(src/color-books/_palettes.json)\n  ⎿  Read 11 lines',
    delay: 350,
  },
  { type: 'user', text: 'Add the Dracula theme colors too', delay: 1000 },
  {
    type: 'agent',
    text: '⏺ Fetch(https://draculatheme.com/contribute)\n  ⎿  Received 773.4KB (200 OK)',
    delay: 500,
  },
  {
    type: 'agent',
    text: '⏺ Write(src/components/color-app/ColorLayout.astro)\n  ⎿  Wrote 61 lines to ColorLayout.astro',
    delay: 450,
  },
  {
    type: 'agent',
    text: '⏺ Write(src/components/color-app/colorUtils.ts)\n  ⎿  Wrote 115 lines to colorUtils.ts',
    delay: 400,
  },
  { type: 'user', text: 'Now update the palettes JSON with the new colors', delay: 900 },
  {
    type: 'agent',
    text: '⏺ Write(src/color-books/_palettes.json)\n  ⎿  Added 61 lines, removed 5 lines\n     { "name": "catppuccin latte", ... }\n     { "name": "dracula", ... }',
    delay: 550,
  },
];

// Typing speed in ms per character
const USER_TYPING_SPEED = 45;
const AGENT_TYPING_SPEED = 12;

export default function VibeCodeBanner() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);
  const terminalContentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, []);

  // Reset and restart animation
  const resetAnimation = useCallback(() => {
    setMessages([]);
    setCurrentStepIndex(0);
    setDisplayedText('');
    setIsAnimating(true);
  }, []);

  // Main animation loop
  useEffect(() => {
    if (!isAnimating) return;
    if (currentStepIndex >= CONVERSATION_SCRIPT.length) {
      // Animation complete, wait and restart
      const resetTimer = setTimeout(resetAnimation, 3000);
      return () => clearTimeout(resetTimer);
    }

    const currentStep = CONVERSATION_SCRIPT[currentStepIndex];
    const typingSpeed = currentStep.type === 'user' ? USER_TYPING_SPEED : AGENT_TYPING_SPEED;

    // Delay before starting to type
    const delayTimer = setTimeout(() => {
      // Add a "typing" message
      setMessages(prev => [...prev, { type: currentStep.type, content: '', isTyping: true }]);

      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex < currentStep.text.length) {
          setDisplayedText(currentStep.text.slice(0, charIndex + 1));
          charIndex++;
          scrollToBottom();
        } else {
          clearInterval(typeInterval);
          // Finish typing - update the last message
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              type: currentStep.type,
              content: currentStep.text,
              isTyping: false,
            };
            return newMessages;
          });
          setDisplayedText('');
          setCurrentStepIndex(prev => prev + 1);
        }
      }, typingSpeed);

      return () => clearInterval(typeInterval);
    }, currentStep.delay);

    return () => clearTimeout(delayTimer);
  }, [currentStepIndex, isAnimating, scrollToBottom, resetAnimation]);

  // Update the typing message content
  useEffect(() => {
    if (displayedText && messages.length > 0) {
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[newMessages.length - 1]?.isTyping) {
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: displayedText,
          };
        }
        return newMessages;
      });
    }
  }, [displayedText]);

  return (
    <div className="vibecode-banner" ref={containerRef}>
      <div className="blur-overlay" />
      <div className="crt-overlay" />
      <div className="scanlines" />
      <div className="terminal-container">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="terminal-btn close" />
            <span className="terminal-btn minimize" />
            <span className="terminal-btn maximize" />
          </div>
          <div className="terminal-title">claude code</div>
        </div>
        <div className="terminal-content" ref={terminalContentRef}>
          <div className="messages-container">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <div className="message-prefix">{msg.type === 'user' ? '>' : '◆'}</div>
                <div className="message-content">
                  {msg.content}
                  {msg.isTyping && <span className="cursor">▌</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="banner-title">
        <h1 className="banner-pretitle">THE STATE OF</h1>
        <h1 className="banner-pretitle-2">VIBE CODING</h1>
        <p className="banner-subtitle">
          <span className="banner-author">by ben cuan</span>
          <span className="banner-date">december 30, 2025</span>
        </p>
      </div>
    </div>
  );
}
