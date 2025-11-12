import { Wifi, Zap, Activity } from 'lucide-react';

interface StatusStripProps {
  isDark: boolean;
}

export function StatusStrip({ isDark }: StatusStripProps) {
  return (
    <div 
      className="flex items-center gap-3 backdrop-blur-[14px] border rounded-lg"
      style={{
        fontSize: '12px',
        fontWeight: 500,
        color: isDark ? 'var(--seoro-text-secondary)' : '#1F2937',
        backgroundColor: isDark ? 'rgba(17, 19, 24, 0.6)' : 'rgba(255, 255, 255, 0.7)',
        borderColor: isDark ? 'var(--seoro-surface-border)' : 'rgba(0, 0, 0, 0.08)',
        padding: '8px 12px',
        boxShadow: isDark 
          ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
          : '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="flex items-center gap-1.5">
        <Wifi size={12} style={{ color: isDark ? 'var(--seoro-text-secondary)' : '#374151' }} />
        <span>LTE</span>
      </div>
      <span style={{ opacity: 0.3 }}>•</span>
      <div className="flex items-center gap-1.5">
        <Activity size={12} style={{ color: isDark ? 'var(--seoro-text-secondary)' : '#374151' }} />
        <span>22 ms</span>
      </div>
      <span style={{ opacity: 0.3 }}>•</span>
      <span>60 fps</span>
      <span style={{ opacity: 0.3 }}>•</span>
      <div className="flex items-center gap-1.5">
        <Zap size={12} style={{ color: isDark ? 'var(--seoro-text-secondary)' : '#374151' }} />
        <span>78%</span>
      </div>
    </div>
  );
}
