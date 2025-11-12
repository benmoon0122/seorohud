import { motion } from 'motion/react';

interface HistoryColumnProps {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  isDark: boolean;
}

export function HistoryColumn({ h1, h2, h3, h4, isDark }: HistoryColumnProps) {
  const rows = [
    { text: h1, key: 'h1' },
    { text: h2, key: 'h2' },
    { text: h3, key: 'h3' },
    { text: h4, key: 'h4' },
  ];

  function getTimestamp(offset: number): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - offset);
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  return (
    <div
      className="backdrop-blur-[14px] border"
      style={{
        width: '360px',
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
        {rows.map((row, idx) => (
          <motion.div
            key={row.key}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: row.text ? 1 : 0, y: 0 }}
            transition={{ 
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="flex items-start gap-3"
            style={{
              minHeight: row.text ? 'auto' : '0px',
            }}
          >
            {row.text && (
              <>
                <span 
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--seoro-text-tertiary)',
                    flexShrink: 0,
                  }}
                >
                  {getTimestamp(3 - idx)}
                </span>
                <span 
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    lineHeight: 1.35,
                    color: 'var(--seoro-text-primary)',
                    maxWidth: '40ch',
                  }}
                >
                  {row.text}
                </span>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
