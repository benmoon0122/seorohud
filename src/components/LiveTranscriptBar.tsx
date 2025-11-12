import { motion } from 'motion/react';
import { Mic } from 'lucide-react';

interface LiveTranscriptBarProps {
  currentUtterance: string;
  speaker: 'alex' | 'you';
  isDark: boolean;
  revealPct: number;
  isSpeaking: boolean;
}

export function LiveTranscriptBar({ 
  currentUtterance, 
  speaker, 
  isDark, 
  revealPct,
  isSpeaking,
}: LiveTranscriptBarProps) {
  const fullText = currentUtterance;

  return (
    <div
      className="backdrop-blur-[14px] border shadow-lg overflow-hidden"
      style={{
        width: '720px',
        height: '56px',
        backgroundColor: isDark ? 'var(--seoro-surface)' : 'var(--seoro-surface)',
        borderColor: isDark ? 'var(--seoro-surface-border)' : 'var(--seoro-surface-border)',
        borderRadius: 'var(--seoro-radius-lg)',
        padding: '12px 16px',
        boxShadow: isDark 
          ? '0 10px 30px rgba(0, 0, 0, 0.25)' 
          : '0 10px 30px rgba(0, 0, 0, 0.08)',
        position: 'relative',
      }}
    >
      <div className="flex items-center gap-3 h-full">
        {/* Mic Icon */}
        <div className="flex-shrink-0">
          <Mic 
            size={16} 
            style={{ 
              color: isSpeaking ? 'var(--seoro-accent)' : (isDark ? 'var(--seoro-text-tertiary)' : 'var(--seoro-text-tertiary)')
            }} 
          />
        </div>

        {/* Double-Layer Text Container - Fixed width to prevent reflow */}
        <div 
          className="flex-1 relative overflow-hidden"
          style={{
            height: '32px',
            lineHeight: '32px',
          }}
        >
          {/* TextBase Layer - Dimmed, shows full text for continuity */}
          <div
            className="absolute inset-0 truncate"
            style={{
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '32px',
              color: 'var(--seoro-text-secondary)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: 'var(--seoro-text-tertiary)', marginRight: '8px' }}>
              {speaker === 'you' ? 'You:' : 'Alex:'}
            </span>
            {fullText}
          </div>

          {/* TextNew Layer - Bright, revealed by mask */}
          <div
            className="absolute inset-0"
            style={{
              overflow: 'hidden',
            }}
          >
            <motion.div
              animate={{ width: `${revealPct}%` }}
              transition={{
                duration: 0.2,
                ease: [0.22, 1, 0.36, 1]
              }}
              style={{
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <div
                className="truncate"
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '32px',
                  color: 'var(--seoro-text-primary)',
                  whiteSpace: 'nowrap',
                  width: '720px', // Fixed width to match container, prevents text shifting
                }}
              >
                <span style={{ color: 'var(--seoro-text-secondary)', marginRight: '8px' }}>
                  {speaker === 'you' ? 'You:' : 'Alex:'}
                </span>
                {fullText}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Latency Indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.div 
            animate={{
              scale: isSpeaking ? [1, 1.2, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: isSpeaking ? Infinity : 0,
              ease: 'easeInOut',
            }}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isSpeaking ? 'var(--seoro-accent)' : 'var(--seoro-text-tertiary)',
            }}
          />
          <span 
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--seoro-text-tertiary)',
            }}
          >
            22 ms
          </span>
        </div>
      </div>
    </div>
  );
}
