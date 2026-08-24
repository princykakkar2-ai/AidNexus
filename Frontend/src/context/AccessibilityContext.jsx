import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'aidnexus_a11y_settings';

const DEFAULT_SETTINGS = {
  fontSize: 100, // percentage: 80, 90, 100, 110, 120, 130, 140, 150, 160
  contrastMode: 'normal', // 'normal' | 'high-contrast-dark' | 'high-contrast-yellow' | 'grayscale' | 'inverted'
  readingGuide: {
    enabled: false,
    height: 48, // pixels
    color: '#FF9933',
    maskOpacity: 0.45,
  },
  dyslexicFont: false,
  lineSpacing: 'normal', // 'normal' | 'relaxed' | 'loose'
  letterSpacing: 'normal', // 'normal' | 'wide' | 'wider'
  highlightLinks: false,
  largeCursor: false,
  pauseAnimations: false,
  speechRate: 1.0,
};

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  // Load saved state or default
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Could not read accessibility settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechUtteranceRef = useRef(null);

  // Announce helper for screen readers
  const announce = useCallback((message) => {
    setLiveAnnouncement(message);
  }, []);

  // Save to localStorage when settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save accessibility settings to localStorage', e);
    }
  }, [settings]);

  // Apply DOM modifications dynamically
  useEffect(() => {
    const root = document.documentElement;

    // 1. Font Size Rescaling
    root.style.fontSize = `${settings.fontSize}%`;
    root.style.setProperty('--a11y-font-scale', `${settings.fontSize / 100}`);

    // 2. Contrast Mode
    if (settings.contrastMode === 'normal') {
      root.removeAttribute('data-a11y-contrast');
    } else {
      root.setAttribute('data-a11y-contrast', settings.contrastMode);
    }

    // 3. Dyslexic Font
    if (settings.dyslexicFont) {
      root.setAttribute('data-a11y-dyslexic', 'true');
    } else {
      root.removeAttribute('data-a11y-dyslexic');
    }

    // 4. Line Spacing
    if (settings.lineSpacing !== 'normal') {
      root.setAttribute('data-a11y-line-spacing', settings.lineSpacing);
    } else {
      root.removeAttribute('data-a11y-line-spacing');
    }

    // 5. Letter Spacing
    if (settings.letterSpacing !== 'normal') {
      root.setAttribute('data-a11y-letter-spacing', settings.letterSpacing);
    } else {
      root.removeAttribute('data-a11y-letter-spacing');
    }

    // 6. Highlight Links
    if (settings.highlightLinks) {
      root.setAttribute('data-a11y-highlight-links', 'true');
    } else {
      root.removeAttribute('data-a11y-highlight-links');
    }

    // 7. Large Cursor
    if (settings.largeCursor) {
      root.setAttribute('data-a11y-large-cursor', 'true');
    } else {
      root.removeAttribute('data-a11y-large-cursor');
    }

    // 8. Reduced Motion / Pause Animations
    if (settings.pauseAnimations) {
      root.setAttribute('data-a11y-reduced-motion', 'true');
    } else {
      root.removeAttribute('data-a11y-reduced-motion');
    }
  }, [settings]);

  // Keyboard Shortcuts (Alt + A to toggle toolbar, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Alt + A (or Option + A on Mac)
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsToolbarOpen((prev) => {
          const next = !prev;
          announce(next ? 'Accessibility options panel opened' : 'Accessibility options panel closed');
          return next;
        });
      }

      // Check for Escape key when toolbar is open
      if (e.key === 'Escape' && isToolbarOpen) {
        e.preventDefault();
        setIsToolbarOpen(false);
        announce('Accessibility options panel closed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isToolbarOpen, announce]);

  // Specific Action Handlers
  const increaseFontSize = useCallback(() => {
    setSettings((prev) => {
      const nextSize = Math.min(160, prev.fontSize + 10);
      announce(`Text size increased to ${nextSize} percent`);
      return { ...prev, fontSize: nextSize };
    });
  }, [announce]);

  const decreaseFontSize = useCallback(() => {
    setSettings((prev) => {
      const nextSize = Math.max(80, prev.fontSize - 10);
      announce(`Text size decreased to ${nextSize} percent`);
      return { ...prev, fontSize: nextSize };
    });
  }, [announce]);

  const resetFontSize = useCallback(() => {
    setSettings((prev) => {
      announce('Text size reset to default 100 percent');
      return { ...prev, fontSize: 100 };
    });
  }, [announce]);

  const setFontSize = useCallback((val) => {
    const clamped = Math.max(80, Math.min(160, Number(val)));
    setSettings((prev) => {
      announce(`Text size set to ${clamped} percent`);
      return { ...prev, fontSize: clamped };
    });
  }, [announce]);

  const setContrastMode = useCallback((mode) => {
    setSettings((prev) => {
      const labelMap = {
        'normal': 'Standard contrast',
        'high-contrast-dark': 'High contrast dark mode',
        'high-contrast-yellow': 'High contrast yellow on black mode',
        'grayscale': 'Monochrome grayscale mode',
        'inverted': 'Inverted colors mode'
      };
      announce(`${labelMap[mode] || mode} activated`);
      return { ...prev, contrastMode: mode };
    });
  }, [announce]);

  const toggleReadingGuide = useCallback(() => {
    setSettings((prev) => {
      const nextState = !prev.readingGuide.enabled;
      announce(nextState ? 'Reading guide ruler activated' : 'Reading guide ruler deactivated');
      return {
        ...prev,
        readingGuide: {
          ...prev.readingGuide,
          enabled: nextState,
        },
      };
    });
  }, [announce]);

  const setReadingGuideConfig = useCallback((config) => {
    setSettings((prev) => ({
      ...prev,
      readingGuide: {
        ...prev.readingGuide,
        ...config,
      },
    }));
  }, []);

  const toggleDyslexicFont = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.dyslexicFont;
      announce(next ? 'Dyslexia friendly typography enabled' : 'Dyslexia friendly typography disabled');
      return { ...prev, dyslexicFont: next };
    });
  }, [announce]);

  const setLineSpacing = useCallback((val) => {
    setSettings((prev) => {
      announce(`Line spacing set to ${val}`);
      return { ...prev, lineSpacing: val };
    });
  }, [announce]);

  const setLetterSpacing = useCallback((val) => {
    setSettings((prev) => {
      announce(`Letter spacing set to ${val}`);
      return { ...prev, letterSpacing: val };
    });
  }, [announce]);

  const toggleHighlightLinks = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.highlightLinks;
      announce(next ? 'Link highlights enabled' : 'Link highlights disabled');
      return { ...prev, highlightLinks: next };
    });
  }, [announce]);

  const toggleLargeCursor = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.largeCursor;
      announce(next ? 'Large high-contrast cursor enabled' : 'Large cursor disabled');
      return { ...prev, largeCursor: next };
    });
  }, [announce]);

  const togglePauseAnimations = useCallback(() => {
    setSettings((prev) => {
      const next = !prev.pauseAnimations;
      announce(next ? 'Page animations paused' : 'Page animations resumed');
      return { ...prev, pauseAnimations: next };
    });
  }, [announce]);

  const setSpeechRate = useCallback((rate) => {
    setSettings((prev) => {
      announce(`Speech rate set to ${rate}x`);
      return { ...prev, speechRate: rate };
    });
  }, [announce]);

  // --------------------------------------------------------------------------
  // Web Speech API / High-Reliability Text-to-Speech Engine
  // --------------------------------------------------------------------------
  const [pointToSpeak, setPointToSpeak] = useState(false);

  // Helper to extract clean readable content from page
  const getReadablePageContent = useCallback(() => {
    // Check if user has selected any text first
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 3) {
      return selection.toString().trim();
    }

    // Otherwise, collect key headings, paragraphs, and cards
    const candidates = document.querySelectorAll(
      'h1, h2, h3, h4, p, [role="heading"], .card-gov h3, .card-gov p'
    );
    const content = [];

    candidates.forEach((el) => {
      // Exclude dialogs, navigation, footers, or hidden elements
      if (
        el.closest('#aidnexus-a11y-panel') ||
        el.closest('[role="dialog"]') ||
        el.closest('nav') ||
        el.offsetParent === null
      ) {
        return;
      }
      const txt = el.innerText ? el.innerText.trim() : '';
      if (txt.length > 10 && !content.includes(txt)) {
        content.push(txt);
      }
    });

    if (content.length > 0) {
      return content.slice(0, 15).join('. ');
    }

    const mainEl = document.querySelector('main') || document.querySelector('#root') || document.body;
    return mainEl ? mainEl.innerText.slice(0, 600) : '';
  }, []);

  const speakText = useCallback((text) => {
    if (!('speechSynthesis' in window)) {
      announce('Text to speech is not supported in this browser environment');
      return;
    }

    // Stop previous utterance
    window.speechSynthesis.cancel();
    if (window._speechInterval) {
      clearInterval(window._speechInterval);
      window._speechInterval = null;
    }

    let textToRead = text;
    if (!textToRead || textToRead.trim().length === 0) {
      textToRead = getReadablePageContent();
    }

    if (!textToRead || textToRead.trim().length === 0) {
      announce('No readable text content found on this page');
      return;
    }

    // Clean text: replace excessive whitespace & special symbols
    const cleaned = textToRead
      .replace(/[^\w\s.,!?:;'\-]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Split text into small sentence chunks (prevent Chrome 15-second speech synthesis cut-off)
    const sentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];
    const chunks = sentences.map(s => s.trim()).filter(s => s.length > 0);

    if (chunks.length === 0) {
      announce('No readable words detected');
      return;
    }

    let chunkIndex = 0;

    const playChunk = () => {
      if (chunkIndex >= chunks.length) {
        setIsSpeaking(false);
        if (window._speechInterval) {
          clearInterval(window._speechInterval);
          window._speechInterval = null;
        }
        return;
      }

      const chunkText = chunks[chunkIndex];
      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.rate = settings.speechRate || 1.0;
      utterance.pitch = 1.0;

      // Select natural English voice
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const selectedVoice =
          voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('India') || v.default)) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang || 'en-US';
        }
      } else {
        utterance.lang = 'en-US';
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        chunkIndex++;
        playChunk();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis chunk error:', e);
        chunkIndex++;
        playChunk();
      };

      // Keep utterance in memory to avoid garbage collection bug
      window._currentSpeechUtterance = utterance;
      speechUtteranceRef.current = utterance;

      window.speechSynthesis.speak(utterance);
    };

    // Chrome keep-alive heartbeat (resumes if Chrome pauses unexpectedly)
    window._speechInterval = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);

    playChunk();
    announce('Reading page content aloud');
  }, [settings.speechRate, getReadablePageContent, announce]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (window._speechInterval) {
      clearInterval(window._speechInterval);
      window._speechInterval = null;
    }
    setIsSpeaking(false);
    announce('Read aloud stopped');
  }, [announce]);

  const pauseSpeaking = useCallback(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      announce('Read aloud paused');
    }
  }, [announce]);

  const resumeSpeaking = useCallback(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      announce('Read aloud resumed');
    }
  }, [announce]);

  const togglePointToSpeak = useCallback(() => {
    setPointToSpeak((prev) => {
      const next = !prev;
      announce(next ? 'Interactive Click-to-Read mode enabled. Click any text to read.' : 'Click-to-Read mode disabled.');
      return next;
    });
  }, [announce]);

  // Interactive Click-to-Read Listener
  useEffect(() => {
    if (!pointToSpeak) return;

    const handleClick = (e) => {
      // Ignore clicks inside accessibility toolbar
      if (e.target.closest('#aidnexus-a11y-panel') || e.target.closest('[role="region"]')) {
        return;
      }

      const text = e.target.innerText ? e.target.innerText.trim() : '';
      if (text && text.length > 3) {
        e.preventDefault();
        speakText(text);
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pointToSpeak, speakText]);

  const resetAllSettings = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (window._speechInterval) {
      clearInterval(window._speechInterval);
      window._speechInterval = null;
    }
    setIsSpeaking(false);
    setPointToSpeak(false);
    setSettings(DEFAULT_SETTINGS);
    announce('All accessibility settings have been reset to default');
  }, [announce]);

  const value = {
    settings,
    isToolbarOpen,
    setIsToolbarOpen,
    openToolbar: () => setIsToolbarOpen(true),
    closeToolbar: () => setIsToolbarOpen(false),
    toggleToolbar: () => setIsToolbarOpen((prev) => !prev),
    
    // Actions
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    setFontSize,
    setContrastMode,
    toggleReadingGuide,
    setReadingGuideConfig,
    toggleDyslexicFont,
    setLineSpacing,
    setLetterSpacing,
    toggleHighlightLinks,
    toggleLargeCursor,
    togglePauseAnimations,
    setSpeechRate,
    
    // Speech
    speakText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    isSpeaking,
    pointToSpeak,
    togglePointToSpeak,
    
    // Announcer & Reset
    announce,
    resetAllSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {/* Live region for Screen Reader Announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {liveAnnouncement}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
