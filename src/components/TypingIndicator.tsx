import { forwardRef } from 'react';
import { motion } from 'motion/react';

interface TypingIndicatorProps {
  isDark: boolean;
  isYou?: boolean;
}

export const TypingIndicator = forwardRef<HTMLDivElement, TypingIndicatorProps>(
  ({ isDark, isYou }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 12, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.94 }}
        transition={{ 
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1]
        }}
        className={isYou ? 'flex flex-col items-end' : 'flex flex-col items-start'}
      >
      <motion.div 
        className={`mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
        style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {isYou ? 'You' : 'Alex'}
      </motion.div>
      <motion.div
        className={`
          px-4 py-3 rounded-lg
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${isDark ? 'bg-gray-400' : 'bg-gray-500'}`}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.25,
                ease: [0.22, 1, 0.36, 1]
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
    );
  }
);

TypingIndicator.displayName = 'TypingIndicator';
