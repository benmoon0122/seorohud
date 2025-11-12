import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { TypewriterText } from './TypewriterText';

interface CoachPillProps {
  feeling: string;
  cue: string;
  isDark: boolean;
  isVisible?: boolean;
  showCue?: boolean;
}

export function CoachPill({ feeling, cue, isDark, isVisible = true, showCue = false }: CoachPillProps) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ 
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1]
          }}
          className="backdrop-blur-[14px] border shadow-lg"
          style={{
            backgroundColor: isDark ? 'var(--seoro-surface)' : 'var(--seoro-surface)',
            borderColor: isDark ? 'var(--seoro-surface-border)' : 'var(--seoro-surface-border)',
            borderRadius: 'var(--seoro-radius-lg)',
            padding: '16px 20px',
            minWidth: '320px',
            maxWidth: '480px',
            boxShadow: isDark 
              ? '0 10px 30px rgba(0, 0, 0, 0.25)' 
              : '0 10px 30px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className="flex items-start gap-3">
            {/* Emotion Glyph */}
            <div className="flex-shrink-0 mt-0.5">
              <Heart 
                size={20} 
                style={{ 
                  color: 'var(--seoro-accent)',
                  strokeWidth: 1.5
                }} 
              />
            </div>

            {/* Content Stack */}
            <div className="flex-1 space-y-2">
              {/* Feeling Tag */}
              <motion.div
                key={feeling}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.2,
                  ease: [0.22, 1, 0.36, 1]
                }}
                style={{
                  display: 'inline-block',
                  backgroundColor: isDark ? '#1A1D22' : '#F5F7FA',
                  color: isDark ? 'var(--seoro-text-secondary)' : 'var(--seoro-text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  lineHeight: 1.35,
                  padding: '4px 10px',
                  borderRadius: 'var(--seoro-radius-sm)',
                }}
              >
                {feeling}
              </motion.div>

              {/* Cue Text - Two-stage reveal */}
              <AnimatePresence mode="wait">
                {showCue && (
                  <motion.div
                    key={cue}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ 
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <TypewriterText
                      text={cue}
                      style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        lineHeight: 1.35,
                        color: isDark ? 'var(--seoro-text-primary)' : 'var(--seoro-text-primary)',
                      }}
                      speed={35}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
