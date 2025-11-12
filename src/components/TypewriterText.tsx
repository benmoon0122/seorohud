import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface TypewriterTextProps {
  text: string;
  isDark?: boolean;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
  speed?: number;
}

export function TypewriterText({ 
  text, 
  isDark = false, 
  onComplete, 
  className,
  style,
  speed = 50
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    
    const intervalId = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, onComplete, speed]);

  return (
    <span 
      className={className || (isDark ? 'text-gray-50' : 'text-gray-900')}
      style={style || { fontSize: '15px', lineHeight: '1.5' }}
    >
      {displayedText}
      {displayedText.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          className={className || (isDark ? 'text-gray-50' : 'text-gray-900')}
        >
          |
        </motion.span>
      )}
    </span>
  );
}
