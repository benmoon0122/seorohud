import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TypingIndicator } from './TypingIndicator';
import { TypewriterText } from './TypewriterText';

interface Message {
  text: string;
  isYou?: boolean;
}

interface ConversationMessagesProps {
  messages: Message[];
  isDark: boolean;
  frameKey: number;
  onComplete?: () => void;
  onMessageComplete?: (message: Message, index: number) => void;
  infiniteLoop?: boolean;
}

export function ConversationMessages({ messages, isDark, frameKey, onComplete, onMessageComplete, infiniteLoop = false }: ConversationMessagesProps) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingPerson, setTypingPerson] = useState<boolean | undefined>(undefined);
  const [currentlyTypingIndex, setCurrentlyTypingIndex] = useState<number>(-1);
  const currentIndexRef = useRef(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Reset when frame changes
    setVisibleMessages([]);
    setIsTyping(false);
    setCurrentlyTypingIndex(-1);
    currentIndexRef.current = 0;
    
    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    
    // Start the first message
    const startTimeout = setTimeout(() => {
      showNextMessage();
    }, 300);
    timeoutsRef.current.push(startTimeout);
    
    // Cleanup
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [frameKey]);

  const showNextMessage = () => {
    const index = currentIndexRef.current;
    
    if (index >= messages.length) {
      return;
    }
    
    const message = messages[index];
    
    // Show typing indicator
    setIsTyping(true);
    setTypingPerson(message.isYou);
    
    // Calculate typing delay based on message length
    const typingDelay = Math.min(1200, Math.max(600, message.text.length * 18));
    
    const timeout = setTimeout(() => {
      // Hide typing indicator and show message with typewriter effect
      setIsTyping(false);
      setVisibleMessages(prev => [...prev, message]);
      setCurrentlyTypingIndex(index);
    }, typingDelay);
    
    timeoutsRef.current.push(timeout);
  };

  const handleTypewriterComplete = () => {
    const completedIndex = currentIndexRef.current;
    const completedMessage = messages[completedIndex];
    
    setCurrentlyTypingIndex(-1);
    
    // Notify parent about message completion
    if (onMessageComplete) {
      onMessageComplete(completedMessage, completedIndex);
    }
    
    currentIndexRef.current++;
    
    if (currentIndexRef.current < messages.length) {
      // More messages to show
      const timeout = setTimeout(() => {
        showNextMessage();
      }, 400);
      timeoutsRef.current.push(timeout);
    } else {
      // Last message finished typing
      if (infiniteLoop) {
        // Loop back to the beginning after a delay
        const timeout = setTimeout(() => {
          currentIndexRef.current = 0;
          setVisibleMessages([]);
          showNextMessage();
        }, 2000);
        timeoutsRef.current.push(timeout);
      } else if (onComplete) {
        const timeout = setTimeout(onComplete, 600);
        timeoutsRef.current.push(timeout);
      }
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {visibleMessages.map((message, index) => (
          <div
            key={`${frameKey}-${index}`}
            className={message.isYou ? 'flex flex-col items-end' : 'flex flex-col items-start'}
          >
            <div 
              className={`mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}
            >
              {message.isYou ? 'You' : 'Alex'}
            </div>
            <div
              className={`
                px-4 py-3 rounded-lg max-w-[80%]
                ${isDark
                  ? 'bg-white/8 backdrop-blur-[24px] border border-white/10'
                  : 'bg-white/60 backdrop-blur-[24px] border border-black/5'
                }
              `}
              style={{
                boxShadow: isDark 
                  ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              {index === currentlyTypingIndex ? (
                <TypewriterText
                  text={message.text}
                  isDark={isDark}
                  onComplete={handleTypewriterComplete}
                />
              ) : (
                <span 
                  className={isDark ? 'text-gray-50' : 'text-gray-900'}
                  style={{ fontSize: '15px', lineHeight: '1.5' }}
                >
                  {message.text}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <TypingIndicator key="typing" isDark={isDark} isYou={typingPerson} />
        )}
      </AnimatePresence>
    </div>
  );
}
