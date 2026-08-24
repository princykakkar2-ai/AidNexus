import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import './ReadSpeaker.css';

export default function ReadSpeakerWidget() {
  const { announce } = useAccessibility();

  // ReadSpeaker State
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [voiceName, setVoiceName] = useState('auto');
  const [showCaptions, setShowCaptions] = useState(false);
  const [hoverToListen, setHoverToListen] = useState(false);

  // Active Reading Queue & Highlighting
  const [sentences, setSentences] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeWord, setActiveWord] = useState('');
  const [highlightedText, setHighlightedText] = useState('');

  const utteranceRef = useRef(null);
  const highlightedNodeRef = useRef(null);

  // Available Voices
  const [availableVoices, setAvailableVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices.filter((v) => v.lang.startsWith('en')));
      }
    };

    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Helper to extract readable content on the page
  const extractPageSentences = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 3) {
      const selected = sel.toString().trim();
      return selected.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [selected];
    }

    // Collect headings, paragraphs, and cards from main view
    const elements = document.querySelectorAll(
      'h1, h2, h3, h4, p, [role="heading"], .card-gov h3, .card-gov p, .badge-gov'
    );
    const textList = [];

    elements.forEach((el) => {
      if (
        el.closest('#aidnexus-a11y-panel') ||
        el.closest('.rspkr-dock') ||
        el.closest('.rspkr-caption-modal') ||
        el.closest('nav') ||
        el.offsetParent === null
      ) {
        return;
      }
      const raw = el.innerText ? el.innerText.trim() : '';
      if (raw.length > 8 && !textList.includes(raw)) {
        textList.push(raw);
      }
    });

    const combined = textList.join('. ');
    const cleaned = combined.replace(/[^\w\s.,!?:;'\-]/gi, ' ').replace(/\s+/g, ' ').trim();
    const splitSentences = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleaned];
    return splitSentences.map((s) => s.trim()).filter((s) => s.length > 0);
  }, []);

  // Play a specific sentence
  const playSentenceAtIndex = useCallback(
    (index, sentenceList = sentences) => {
      if (!('speechSynthesis' in window)) {
        announce('ReadSpeaker TTS is not available on this browser');
        return;
      }

      if (index >= sentenceList.length) {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentIndex(0);
        setActiveWord('');
        setHighlightedText('');
        announce('ReadSpeaker finished reading');
        return;
      }

      window.speechSynthesis.cancel();

      const currentSentence = sentenceList[index];
      setCurrentIndex(index);
      setHighlightedText(currentSentence);

      const utterance = new SpeechSynthesisUtterance(currentSentence);
      utterance.rate = speed;
      utterance.volume = volume;

      // Select Best Voice
      if (availableVoices.length > 0) {
        if (voiceName !== 'auto') {
          const matched = availableVoices.find((v) => v.name === voiceName);
          if (matched) utterance.voice = matched;
        } else {
          const naturalVoice =
            availableVoices.find(
              (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('India'))
            ) || availableVoices[0];
          if (naturalVoice) utterance.voice = naturalVoice;
        }
      }

      // Track Word Boundaries for Synchronized Highlighting
      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          const word = currentSentence.substr(e.charIndex, e.charLength || 10).split(/\s+/)[0];
          setActiveWord(word);
        }
      };

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        playSentenceAtIndex(index + 1, sentenceList);
      };

      utterance.onerror = (e) => {
        console.warn('ReadSpeaker Utterance error:', e);
        playSentenceAtIndex(index + 1, sentenceList);
      };

      utteranceRef.current = utterance;
      window._rspkrUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [sentences, speed, volume, voiceName, availableVoices, announce]
  );

  // Start Reading
  const handleStartListening = (customText = null) => {
    let list = [];
    if (customText) {
      list = customText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [customText];
    } else {
      list = extractPageSentences();
    }

    if (list.length === 0) {
      announce('No readable text found');
      return;
    }

    setSentences(list);
    setIsOpen(true);
    playSentenceAtIndex(0, list);
    announce('ReadSpeaker WebReader started');
  };

  const handlePause = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      announce('ReadSpeaker paused');
    }
  };

  const handleResume = () => {
    if ('speechSynthesis' in window && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      announce('ReadSpeaker resumed');
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIndex(0);
    setActiveWord('');
    setHighlightedText('');
    announce('ReadSpeaker stopped');
  };

  const handlePrevious = () => {
    const nextIdx = Math.max(0, currentIndex - 1);
    playSentenceAtIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(sentences.length - 1, currentIndex + 1);
    playSentenceAtIndex(nextIdx);
  };

  // Hover-to-Listen Listener
  useEffect(() => {
    if (!hoverToListen) return;

    const handleMouseClick = (e) => {
      if (
        e.target.closest('#aidnexus-a11y-panel') ||
        e.target.closest('.rspkr-dock') ||
        e.target.closest('.rspkr-btn') ||
        e.target.closest('button')
      ) {
        return;
      }

      const text = e.target.innerText ? e.target.innerText.trim() : '';
      if (text && text.length > 5) {
        e.preventDefault();
        e.stopPropagation();
        handleStartListening(text);
      }
    };

    document.addEventListener('click', handleMouseClick, true);
    return () => document.removeEventListener('click', handleMouseClick, true);
  }, [hoverToListen]);

  // Simulate MP3 Generation / Download
  const handleDownloadAudio = () => {
    announce('Generating MP3 audio for offline listening...');
    const blob = new Blob([sentences.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AidNexus-ReadSpeaker-Transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    announce('Narration transcript downloaded successfully');
  };

  return (
    <>
      {/* =========================================================================
          1. READSPEAKER EXPANDED WEBREADER DOCK
          ========================================================================= */}
      {isOpen && (
        <div
          role="region"
          aria-label="ReadSpeaker Enterprise WebReader Toolbar"
          className="rspkr-dock"
        >
          {/* ReadSpeaker Logo & Branding */}
          <div className="flex items-center gap-2 pr-2 border-r border-slate-600 shrink-0">
            <div className="w-5 h-5 rounded-full bg-[#FF9933] flex items-center justify-center text-[#0B2545] font-black text-xs">
              🔊
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black tracking-wide text-white leading-none">
                Read<span className="text-[#FF9933]">Speaker</span>
              </span>
              <span className="text-[7.5px] uppercase font-bold text-slate-300 tracking-wider">
                Enterprise WebReader
              </span>
            </div>
          </div>

          {/* Core Player Controls: Prev, Play/Pause, Next, Stop */}
          <div className="flex items-center gap-1.5">
            {/* Prev Sentence */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex <= 0}
              className="p-1.5 hover:bg-slate-700 disabled:opacity-30 rounded text-slate-200 hover:text-white cursor-pointer transition-colors text-xs"
              title="Previous sentence"
              aria-label="Previous sentence"
            >
              ⏮
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={isPaused ? handleResume : isPlaying ? handlePause : () => handleStartListening()}
              className="bg-[#E65C00] hover:bg-[#C24E00] text-white px-3 py-1 rounded font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              aria-label={isPaused ? 'Resume ReadSpeaker' : isPlaying ? 'Pause ReadSpeaker' : 'Listen with ReadSpeaker'}
            >
              {isPaused ? '▶ Play' : isPlaying ? '⏸ Pause' : '▶ Listen'}
            </button>

            {/* Next Sentence */}
            <button
              onClick={handleNext}
              disabled={currentIndex >= sentences.length - 1}
              className="p-1.5 hover:bg-slate-700 disabled:opacity-30 rounded text-slate-200 hover:text-white cursor-pointer transition-colors text-xs"
              title="Next sentence"
              aria-label="Next sentence"
            >
              ⏭
            </button>

            {/* Stop Button */}
            <button
              onClick={handleStop}
              className="p-1.5 hover:bg-red-900/60 rounded text-red-400 hover:text-white cursor-pointer transition-colors text-xs"
              title="Stop listening"
              aria-label="Stop listening"
            >
              ⏹ Stop
            </button>
          </div>

          {/* Reading Progress Indicator */}
          {sentences.length > 0 && (
            <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-600 text-[10px] font-bold text-slate-300">
              <span className="font-mono bg-[#07172B] px-2 py-0.5 rounded border border-slate-700">
                {currentIndex + 1} / {sentences.length}
              </span>
            </div>
          )}

          {/* Speech Rate Controls */}
          <div className="hidden sm:flex items-center gap-1 bg-[#07172B] px-2 py-0.5 rounded border border-slate-700 text-[10px] font-bold">
            <span className="text-slate-400">Speed:</span>
            {[0.75, 1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSpeed(s);
                  if (isPlaying) playSentenceAtIndex(currentIndex);
                }}
                className={`px-1.5 py-0.2 rounded cursor-pointer ${
                  speed === s ? 'bg-[#E65C00] text-white font-extrabold' : 'text-slate-300 hover:text-white'
                }`}
                aria-label={`Set speed to ${s}x`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Secondary Tools: Captions, Hover Mode, Download MP3, Close */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-600">
            {/* Enlarged Text Captions */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                showCaptions ? 'bg-[#FF9933] text-[#0B2545]' : 'bg-[#134074] text-white hover:bg-slate-700'
              }`}
              title="Toggle Large Captions Window"
              aria-label="Toggle Large Captions Window"
            >
              <span>💬</span>
              <span className="hidden lg:inline">Captions</span>
            </button>

            {/* Click to Listen Toggle */}
            <button
              onClick={() => setHoverToListen(!hoverToListen)}
              className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1 ${
                hoverToListen ? 'bg-[#138808] text-white ring-1 ring-emerald-400' : 'bg-[#134074] text-white hover:bg-slate-700'
              }`}
              title="Click any card/paragraph on page to read aloud"
              aria-label="Toggle Point and Click to Listen"
            >
              <span>👆</span>
              <span className="hidden lg:inline">{hoverToListen ? 'Click-to-Read ON' : 'Point & Read'}</span>
            </button>

            {/* Download Audio */}
            <button
              onClick={handleDownloadAudio}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer transition-colors text-xs"
              title="Download narration transcript"
              aria-label="Download narration transcript"
            >
              📥
            </button>

            {/* Close Dock */}
            <button
              onClick={() => {
                handleStop();
                setIsOpen(false);
              }}
              className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white cursor-pointer transition-colors text-xs ml-1"
              title="Close ReadSpeaker WebReader"
              aria-label="Close ReadSpeaker WebReader"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. READSPEAKER ENLARGED TEXT CAPTIONS WINDOW
          ========================================================================= */}
      {showCaptions && isPlaying && highlightedText && (
        <div
          role="region"
          aria-label="ReadSpeaker Live Captions"
          className="rspkr-caption-modal a11y-panel-animate"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-600 text-xs font-black uppercase text-[#FF9933]">
            <div className="flex items-center gap-2">
              <span className="animate-pulse">🔊</span>
              <span>ReadSpeaker Live Narration</span>
            </div>
            <span className="text-[10px] font-mono text-slate-300">
              Sentence {currentIndex + 1} of {sentences.length}
            </span>
          </div>

          <div className="text-base sm:text-lg font-bold leading-relaxed text-white">
            {highlightedText.split(/\s+/).map((w, idx) => {
              const isMatch = activeWord && w.toLowerCase().includes(activeWord.toLowerCase().replace(/[^\w]/g, ''));
              return (
                <span
                  key={idx}
                  className={`inline-block mr-1.5 transition-all ${
                    isMatch ? 'bg-[#FF9933] text-[#0B2545] px-1.5 py-0.5 rounded font-black scale-105 shadow-sm' : 'text-slate-100'
                  }`}
                >
                  {w}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

// Government Standard ReadSpeaker Standalone Button Export
export function ReadSpeakerButton({ onTrigger }) {
  return (
    <button
      onClick={onTrigger}
      className="rspkr-btn"
      title="Listen to this page with ReadSpeaker Enterprise WebReader"
      aria-label="Listen to this page with ReadSpeaker"
    >
      <span className="text-sm">🔊</span>
      <span>Listen</span>
      <span className="rspkr-badge">ReadSpeaker</span>
    </button>
  );
}
