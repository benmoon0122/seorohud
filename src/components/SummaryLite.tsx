import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface SummaryLiteProps {
  isDark: boolean;
  bullets: string[];
  actions?: number;
  decisions?: number;
  followUps?: number;
}

export function SummaryLite({ 
  isDark, 
  bullets,
  actions = 0,
  decisions = 0,
  followUps = 0,
}: SummaryLiteProps) {
  return (
    <div
      className="backdrop-blur-[14px] border"
      style={{
        minWidth: '420px',
        maxWidth: '540px',
        backgroundColor: isDark ? 'var(--seoro-surface)' : 'var(--seoro-surface)',
        borderColor: isDark ? 'var(--seoro-surface-border)' : 'var(--seoro-surface-border)',
        borderRadius: 'var(--seoro-radius-lg)',
        padding: '16px 20px',
        boxShadow: isDark 
          ? '0 10px 30px rgba(0, 0, 0, 0.25)' 
          : '0 10px 30px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Title */}
      <h3 
        style={{
          fontSize: '20px',
          fontWeight: 600,
          lineHeight: 1.35,
          color: 'var(--seoro-text-primary)',
          marginBottom: '12px',
        }}
      >
        Summary
      </h3>

      {/* Bullets */}
      <div className="space-y-2 mb-3">
        {bullets.slice(0, 5).map((bullet, idx) => (
          <motion.div
            key={`${bullet}-${idx}`}
            layout
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: idx * 0.03,
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="flex items-start gap-2"
          >
            <div 
              style={{
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                backgroundColor: 'var(--seoro-accent)',
                marginTop: '10px',
                flexShrink: 0,
              }}
            />
            <span 
              style={{
                fontSize: '18px',
                fontWeight: 500,
                lineHeight: 1.35,
                color: 'var(--seoro-text-primary)',
                maxWidth: '42ch',
              }}
            >
              {bullet}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Chips Row */}
      {(actions > 0 || decisions > 0 || followUps > 0) && (
        <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--seoro-surface-border)' }}>
          {actions > 0 && (
            <div 
              className="flex items-center gap-1"
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--seoro-text-secondary)',
                backgroundColor: isDark ? '#1A1D22' : '#F5F7FA',
                padding: '3px 8px',
                borderRadius: 'var(--seoro-radius-sm)',
              }}
            >
              <span>Actions</span>
              <span style={{ opacity: 0.6 }}>({actions})</span>
            </div>
          )}
          {decisions > 0 && (
            <div 
              className="flex items-center gap-1"
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--seoro-text-secondary)',
                backgroundColor: isDark ? '#1A1D22' : '#F5F7FA',
                padding: '3px 8px',
                borderRadius: 'var(--seoro-radius-sm)',
              }}
            >
              <span>Decisions</span>
              <span style={{ opacity: 0.6 }}>({decisions})</span>
            </div>
          )}
          {followUps > 0 && (
            <div 
              className="flex items-center gap-1"
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--seoro-text-secondary)',
                backgroundColor: isDark ? '#1A1D22' : '#F5F7FA',
                padding: '3px 8px',
                borderRadius: 'var(--seoro-radius-sm)',
              }}
            >
              <span>Follow-ups</span>
              <span style={{ opacity: 0.6 }}>({followUps})</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
