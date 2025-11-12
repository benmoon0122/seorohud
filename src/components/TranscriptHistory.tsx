import { motion, AnimatePresence } from 'motion/react';

interface HistoryLine {
  timestamp: string;
  text: string;
  speaker: 'alex' | 'you';
}

interface TranscriptHistoryProps {
  lines: HistoryLine[];
  isDark: boolean;
}

export function TranscriptHistory({ lines, isDark }: TranscriptHistoryProps) {
  if (lines.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="backdrop-blur-[14px] border overflow-y-auto"
      style={{
        width: '720px',
        maxHeight: '160px',
        backgroundColor: isDark ? 'var(--seoro-surface)' : 'var(--seoro-surface)',
        borderColor: isDark ? 'var(--seoro-surface-border)' : 'var(--seoro-surface-border)',
        borderRadius: 'var(--seoro-radius-lg)',
        padding: '12px 16px',
        boxShadow: isDark 
          ? '0 10px 30px rgba(0, 0, 0, 0.25)' 
          : '0 10px 30px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div className="space-y-3">
        <AnimatePresence>
          {lines.map((line, idx) => (
            <motion.div
              key={`${line.timestamp}-${idx}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-3"
            >
              <span 
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'var(--seoro-text-tertiary)',
                  flexShrink: 0,
                }}
              >
                {line.timestamp}
              </span>
              <span 
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: 1.35,
                  color: 'var(--seoro-text-primary)',
                }}
              >
                <span style={{ color: 'var(--seoro-text-secondary)', marginRight: '8px' }}>
                  {line.speaker === 'you' ? 'You:' : 'Alex:'}
                </span>
                {line.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
