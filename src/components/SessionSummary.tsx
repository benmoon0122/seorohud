import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Calendar, MessageSquare } from 'lucide-react';

interface SessionSummaryProps {
  isVisible: boolean;
  isDark: boolean;
  bullets: string[];
  actionItems?: number;
  decisions?: number;
  followUps?: number;
}

export function SessionSummary({ 
  isVisible, 
  isDark, 
  bullets,
  actionItems = 0,
  decisions = 0,
  followUps = 0,
}: SessionSummaryProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ 
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="backdrop-blur-[14px] border shadow-lg"
          style={{
            width: '640px',
            backgroundColor: isDark ? 'var(--seoro-surface)' : 'var(--seoro-surface)',
            borderColor: isDark ? 'var(--seoro-surface-border)' : 'var(--seoro-surface-border)',
            borderRadius: 'var(--seoro-radius-lg)',
            padding: '20px 24px',
            boxShadow: isDark 
              ? '0 10px 30px rgba(0, 0, 0, 0.25)' 
              : '0 10px 30px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Title */}
          <h3 
            style={{
              fontSize: '18px',
              fontWeight: 600,
              lineHeight: 1.35,
              color: 'var(--seoro-text-primary)',
              marginBottom: '16px',
            }}
          >
            Conversation Summary
          </h3>

          {/* Bullets */}
          <div className="space-y-3 mb-4">
            {bullets.map((bullet, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: idx * 0.05,
                  duration: 0.2,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="flex items-start gap-2"
              >
                <CheckCircle2 
                  size={16} 
                  style={{ 
                    color: 'var(--seoro-accent)',
                    marginTop: '2px',
                    flexShrink: 0,
                  }} 
                />
                <span 
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    lineHeight: 1.35,
                    color: 'var(--seoro-text-primary)',
                  }}
                >
                  {bullet}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Chips Row */}
          {(actionItems > 0 || decisions > 0 || followUps > 0) && (
            <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--seoro-surface-border)' }}>
              {actionItems > 0 && (
                <div 
                  className="flex items-center gap-1.5"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--seoro-text-secondary)',
                    backgroundColor: isDark ? '#1A1D22' : '#F5F7FA',
                    padding: '4px 10px',
                    borderRadius: 'var(--seoro-radius-sm)',
                  }}
                >
                  <CheckCircle2 size={12} />
                  <span>Action Items ({actionItems})</span>
                </div>
              )}
              {decisions > 0 && (
                <div 
                  className="flex items-center gap-1.5"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--seoro-text-secondary)',
                    backgroundColor: isDark ? '#1A1D22' : '#F5F7FA',
                    padding: '4px 10px',
                    borderRadius: 'var(--seoro-radius-sm)',
                  }}
                >
                  <Calendar size={12} />
                  <span>Decisions ({decisions})</span>
                </div>
              )}
              {followUps > 0 && (
                <div 
                  className="flex items-center gap-1.5"
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--seoro-text-secondary)',
                    backgroundColor: isDark ? '#1A1D22' : '#F5F7FA',
                    padding: '4px 10px',
                    borderRadius: 'var(--seoro-radius-sm)',
                  }}
                >
                  <MessageSquare size={12} />
                  <span>Follow-ups ({followUps})</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
