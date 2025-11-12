import { motion } from "motion/react";
import { Mic } from "lucide-react";

interface LiveMicLineProps {
  currentSentence: string;
  speaker: "alex" | "you";
  isDark: boolean;
  revealPct: number;
  isSpeaking: boolean;
}

export function LiveMicLine({
  currentSentence,
  speaker,
  isDark,
  revealPct,
  isSpeaking,
}: LiveMicLineProps) {
  return (
    <div
      className="backdrop-blur-[14px] border shadow-lg"
      style={{
        width: "720px",
        minHeight: "56px",
        backgroundColor: isDark
          ? "var(--seoro-surface)"
          : "var(--seoro-surface)",
        borderColor: isDark
          ? "var(--seoro-surface-border)"
          : "var(--seoro-surface-border)",
        borderRadius: "var(--seoro-radius-lg)",
        padding: "12px 16px",
        boxShadow: isDark
          ? "0 10px 30px rgba(0, 0, 0, 0.25)"
          : "0 10px 30px rgba(0, 0, 0, 0.08)",
        position: "relative",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Mic Icon */}
        <div
          className="flex-shrink-0"
          style={{ marginTop: "8px" }}
        >
          <Mic
            size={16}
            style={{
              color: isSpeaking
                ? "var(--seoro-accent)"
                : "var(--seoro-text-tertiary)",
            }}
          />
        </div>

        {/* Text Content */}
        <div
          className="flex-1"
          style={{
            minHeight: "32px",
            paddingRight: "80px",
          }}
        >
          {currentSentence ? (
            <div
              style={{
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: 1.35,
                color: "var(--seoro-text-primary)",
              }}
            >
              <span
                style={{
                  color: "var(--seoro-text-secondary)",
                  marginRight: "8px",
                }}
              >
                {speaker === "you" ? "You:" : "Alex:"}
              </span>
              {currentSentence}
            </div>
          ) : (
            <div
              style={{
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: 1.35,
                color: "var(--seoro-text-tertiary)",
                opacity: 0.5,
              }}
            >
              Listening...
            </div>
          )}
        </div>

        {/* Latency Indicator */}
        <div
          className="flex items-center gap-2 flex-shrink-0"
          style={{ marginTop: "8px" }}
        >
          <motion.div
            animate={{
              scale: isSpeaking ? [1, 1.15, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: isSpeaking ? Infinity : 0,
              ease: "easeInOut",
            }}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: isSpeaking
                ? "var(--seoro-accent)"
                : "var(--seoro-text-tertiary)",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--seoro-text-tertiary)",
            }}
          >
            22 ms
          </span>
        </div>
      </div>
    </div>
  );
}