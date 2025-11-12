import { useState, useEffect, useRef } from 'react';
import { CoachPill } from './components/CoachPill';
import { LiveMicLine } from './components/LiveMicLine';
import { HistoryColumn } from './components/HistoryColumn';
import { SummaryLite } from './components/SummaryLite';
import { SessionSummary } from './components/SessionSummary';
import { StatusStrip } from './components/StatusStrip';
import { Sun, Moon } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

interface ScriptLine {
  speaker: 'alex' | 'you';
  text: string;
  cue?: string;
  feeling?: string;
}

const SCRIPT: ScriptLine[] = [
  { 
    speaker: 'you', 
    text: "hey! still good for dinner tonight?" 
  },
  { 
    speaker: 'alex', 
    text: "ugh honestly… today was brutal. had back-to-back meetings and my manager just dumped a deadline on me for monday." 
  },
  { 
    speaker: 'alex', 
    text: "i'm so wiped i can barely think straight." 
  },
  { 
    speaker: 'alex', 
    text: "i feel terrible but i might need to bail tonight.",
    cue: "Ask a simple confirmation: \"totally get it. want to keep it super chill or just reschedule?\"",
    feeling: "reading: overwhelmed"
  },
  { 
    speaker: 'you', 
    text: "totally get it—want to keep it chill or rain check?" 
  },
  { 
    speaker: 'alex', 
    text: "i don't know… i do want to see you." 
  },
  { 
    speaker: 'alex', 
    text: "i just can't do anything loud or crowded right now." 
  },
  { 
    speaker: 'alex', 
    text: "maybe something really low-key?" 
  },
  { 
    speaker: 'alex', 
    text: "but also don't want to be a downer if you were excited for tonight.",
    cue: "Suggest an easy alternative: \"what if we just grab tea and walk for a bit? totally low pressure\"",
    feeling: "reading: hesitant"
  },
  { 
    speaker: 'you', 
    text: "what if we just grab tea and walk for a bit? totally low pressure." 
  },
  { 
    speaker: 'alex', 
    text: "are you sure? that's not even what we planned." 
  },
  { 
    speaker: 'alex', 
    text: "i know you were looking forward to trying that new place." 
  },
  { 
    speaker: 'alex', 
    text: "i just… i don't want to disappoint you." 
  },
  { 
    speaker: 'alex', 
    text: "i feel like i've been flaking a lot lately and you've been so patient.",
    cue: "Reassure with clarity: \"honestly i just want to see you. we can do the restaurant anytime\"",
    feeling: "reading: guilty"
  },
  { 
    speaker: 'you', 
    text: "honestly i just want to see you. we can do the restaurant anytime." 
  },
  { 
    speaker: 'alex', 
    text: "that actually sounds perfect right now." 
  },
  { 
    speaker: 'alex', 
    text: "thank you for getting it." 
  },
  { 
    speaker: 'alex', 
    text: "okay so… 7pm by the park? the one near my place with the good bench?" 
  },
  { 
    speaker: 'alex', 
    text: "i'll grab us something warm to drink on the way.",
    cue: "Confirm the plan: \"perfect, 7pm at the park. see you there\"",
    feeling: "reading: aligned"
  },
  { 
    speaker: 'you', 
    text: "perfect, 7pm at the park. see you there." 
  },
];

export default function App() {
  const [isDark, setIsDark] = useState(true);
  
  // Core state variables
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [revealPct, setRevealPct] = useState(0);
  const [currentSentence, setCurrentSentence] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState<'alex' | 'you'>('alex');
  
  // History slots (h1 = newest, h4 = oldest)
  const [h1, setH1] = useState('');
  const [h2, setH2] = useState('');
  const [h3, setH3] = useState('');
  const [h4, setH4] = useState('');
  
  // Summary and cues
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [summaryBullets, setSummaryBullets] = useState<string[]>([]);
  const [visibleCue, setVisibleCue] = useState<{ text: string; feeling: string } | null>(null);
  
  // Refs for animation control
  const timeoutsRef = useRef<number[]>([]);
  const runningRef = useRef(false);
  const revealIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    runningRef.current = true;
    runConversation();

    return () => {
      runningRef.current = false;
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
      if (revealIntervalRef.current) {
        clearInterval(revealIntervalRef.current);
      }
    };
  }, []);

  function wait(ms: number): Promise<void> {
    return new Promise<void>(resolve => {
      const id = window.setTimeout(resolve, ms);
      timeoutsRef.current.push(id);
    });
  }

  function startRevealAnimation() {
    setRevealPct(0);
    setIsSpeaking(true);
    
    if (revealIntervalRef.current) {
      clearInterval(revealIntervalRef.current);
    }
    
    // Increment reveal by 6-8% every 140ms
    revealIntervalRef.current = window.setInterval(() => {
      setRevealPct(prev => {
        if (prev >= 100) {
          if (revealIntervalRef.current) {
            clearInterval(revealIntervalRef.current);
            revealIntervalRef.current = null;
          }
          return 100;
        }
        return Math.min(100, prev + 7);
      });
    }, 140);
  }

  function stopRevealAnimation() {
    if (revealIntervalRef.current) {
      clearInterval(revealIntervalRef.current);
      revealIntervalRef.current = null;
    }
    setRevealPct(100);
    setIsSpeaking(false);
  }

  async function typeOutSentence(text: string, msPerChar: number): Promise<void> {
    const chars = [...text];
    let accumulated = '';
    
    for (let i = 0; i < chars.length; i++) {
      if (!runningRef.current) return;
      accumulated += chars[i];
      setCurrentSentence(accumulated);
      await wait(msPerChar);
    }
  }

  function commitSentenceToHistory(sentence: string) {
    // Shift history: h4←h3←h2←h1←new
    setH4(h3);
    setH3(h2);
    setH2(h1);
    setH1(sentence);
    
    // Update summary bullets based on accumulated history
    updateSummary([sentence, h1, h2, h3].filter(s => s));
  }

  function updateSummary(history: string[]) {
    const bullets: string[] = [];
    
    // Extract key points from history (simple extraction for demo)
    history.forEach((line, idx) => {
      if (line.toLowerCase().includes('tuesday') || line.toLowerCase().includes('7pm') || line.toLowerCase().includes('park')) {
        bullets.push('Plans confirmed: Tuesday at park, 7pm');
      }
      if (line.toLowerCase().includes('brutal') || line.toLowerCase().includes('wiped') || line.toLowerCase().includes('overwhelmed')) {
        bullets.push('Alex feeling overwhelmed from work');
      }
      if (line.toLowerCase().includes('bail') || line.toLowerCase().includes('reschedule')) {
        bullets.push('Discussed flexibility with plans');
      }
      if (line.toLowerCase().includes('tea') || line.toLowerCase().includes('walk') || line.toLowerCase().includes('low-key')) {
        bullets.push('Adjusted to low-key tea walk');
      }
      if (line.toLowerCase().includes('patient') || line.toLowerCase().includes('thank')) {
        bullets.push('Mutual appreciation expressed');
      }
    });
    
    // Deduplicate and limit to top 5
    const unique = Array.from(new Set(bullets));
    setSummaryBullets(unique.slice(0, 5));
  }

  async function runConversation() {
    while (runningRef.current) {
      // Reset state
      setH1('');
      setH2('');
      setH3('');
      setH4('');
      setCurrentSentence('');
      setRevealPct(0);
      setShowFullSummary(false);
      setVisibleCue(null);
      setSummaryBullets([]);

      for (let i = 0; i < SCRIPT.length; i++) {
        if (!runningRef.current) return;
        
        const line = SCRIPT[i];
        const { speaker, text, cue, feeling } = line;

        // Hide cue when YOU begin speaking
        if (speaker === 'you') {
          setVisibleCue(null);
        }

        // Start speaking new sentence
        setCurrentSpeaker(speaker);
        setCurrentSentence('');
        startRevealAnimation();

        // Type out the sentence
        await typeOutSentence(text, 40);

        // Ensure reveal finishes
        await wait(200);
        stopRevealAnimation();
        
        // Commit to history with shift animation
        commitSentenceToHistory(text);

        // Clear current sentence for next line
        await wait(150);
        setCurrentSentence('');
        setRevealPct(0);

        // If this line has a cue, show it
        if (cue) {
          await wait(400);
          setVisibleCue({ text: cue, feeling: feeling || '' });
          
          // Wait for cue to be displayed
          const cueTypingDuration = cue.length * 35;
          await wait(cueTypingDuration + 1000);
        }

        await wait(800);
      }

      // Show full summary at end
      await wait(800);
      setVisibleCue(null);
      setShowFullSummary(true);
      await wait(5000);

      // Loop pause before restart
      await wait(2000);
    }
  }

  // Calculate summary stats
  const actions = summaryBullets.filter(b => 
    b.toLowerCase().includes('confirm') || 
    b.toLowerCase().includes('send') ||
    b.toLowerCase().includes('adjust')
  ).length;
  
  const decisions = summaryBullets.filter(b => 
    b.toLowerCase().includes('decision') || 
    b.toLowerCase().includes('plans')
  ).length;
  
  const followUps = summaryBullets.filter(b => 
    b.toLowerCase().includes('follow') || 
    b.toLowerCase().includes('discuss')
  ).length;

  return (
    <div 
      className={`min-h-screen transition-colors duration-500 ease-out ${
        isDark ? 'bg-gray-900 dark' : 'bg-gray-50'
      }`}
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-6">
        <div>
          <h1 className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
            Seoro — AR-Glass HUD
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`} style={{ fontSize: '14px' }}>
            Side history, sentence capture, live summary
          </p>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className={`
            p-2 rounded-lg transition-all duration-300 ease-out
            ${isDark 
              ? 'bg-white/10 hover:bg-white/20 text-yellow-300 hover:scale-105' 
              : 'bg-black/5 hover:bg-black/10 text-gray-700 hover:scale-105'
            }
          `}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Main HUD Container */}
      <div className="flex items-center justify-center min-h-screen p-8 pt-32">
        <div className="relative">
          {/* Desktop Preview Frame - 1280×800 */}
          <div
            className="relative overflow-hidden rounded-2xl"
            style={{ 
              width: '1280px', 
              height: '800px',
              backgroundColor: 'transparent',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >

            {/* Safe HUD Region - 960×540 centered */}
            <div 
              className="absolute overflow-visible"
              style={{
                width: '960px',
                height: '540px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Status Strip - Top Right, moved higher */}
              <div className="absolute -top-16 right-0">
                <StatusStrip isDark={isDark} />
              </div>

              {/* Side Layout - History (left) + Summary (right) */}
              <div className="absolute top-6 left-6 flex gap-6">
                {/* History Column - Left */}
                {(h1 || h2 || h3 || h4) && (
                  <HistoryColumn
                    h1={h1}
                    h2={h2}
                    h3={h3}
                    h4={h4}
                    isDark={isDark}
                  />
                )}

                {/* Summary Lite - Right */}
                {summaryBullets.length > 0 && (
                  <SummaryLite
                    isDark={isDark}
                    bullets={summaryBullets}
                    actions={actions}
                    decisions={decisions}
                    followUps={followUps}
                  />
                )}
              </div>

              {/* Coach Pill - Right Lower Quadrant */}
              {visibleCue && !showFullSummary && (
                <div 
                  className="absolute"
                  style={{
                    right: '24px',
                    bottom: '120px',
                  }}
                >
                  <CoachPill
                    feeling={visibleCue.feeling}
                    cue={visibleCue.text}
                    isDark={isDark}
                    isVisible={true}
                    showCue={true}
                  />
                </div>
              )}

              {/* Full Session Summary - Center, positioned to avoid overlaps */}
              {showFullSummary && (
                <div 
                  className="absolute"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 50,
                  }}
                >
                  <SessionSummary
                    isVisible={showFullSummary}
                    isDark={isDark}
                    bullets={[
                      'Confirmed plans: Tuesday 7pm at the park',
                      'Alex feeling overwhelmed from brutal workday',
                      'Adjusted from restaurant to casual tea walk',
                      'Mutual appreciation and flexibility shown',
                      'Final details settled: meeting at park bench'
                    ]}
                    actionItems={2}
                    decisions={1}
                    followUps={1}
                  />
                </div>
              )}

              {/* Live Mic Line - Bottom Center */}
              <div 
                className="absolute bottom-6 left-1/2"
                style={{
                  transform: 'translateX(-50%)',
                }}
              >
                <LiveMicLine
                  currentSentence={currentSentence}
                  speaker={currentSpeaker}
                  isDark={isDark}
                  revealPct={revealPct}
                  isSpeaking={isSpeaking}
                />
              </div>
            </div>
          </div>

          {/* Frame Description */}
          <div className="text-center mt-6">
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontSize: '13px' }}>
              Non-scrollable history • Sentence capture • Always-visible summary
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="fixed bottom-6 right-6">
        <p 
          className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}
          style={{ fontSize: '11px' }}
        >
          AR-glass readable • Fixed 4-line history • Zero flicker
        </p>
      </div>
    </div>
  );
}
