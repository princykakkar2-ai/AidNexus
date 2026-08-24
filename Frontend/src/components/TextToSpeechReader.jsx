import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function TextToSpeechReader() {
  const {
    isSpeaking,
    speakText,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    settings,
    setSpeechRate
  } = useAccessibility();

  const [selectedText, setSelectedText] = useState('');
  const [showFloatingPlayer, setShowFloatingPlayer] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Detect text selection on the page
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection ? selection.toString().trim() : '';
      if (text.length > 3) {
        setSelectedText(text);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // Update floating player visibility when speech is active or text selected
  useEffect(() => {
    if (isSpeaking) {
      setShowFloatingPlayer(true);
    }
  }, [isSpeaking]);

  const handleReadSelection = () => {
    speakText(selectedText || '');
    setIsPaused(false);
  };

  const handleTogglePlayPause = () => {
    if (isPaused) {
      resumeSpeaking();
      setIsPaused(false);
    } else {
      pauseSpeaking();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    stopSpeaking();
    setIsPaused(false);
    setShowFloatingPlayer(false);
  };

  if (!showFloatingPlayer && !isSpeaking) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Audio Read Aloud Controls"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999998] bg-[#0B2545] text-white border-2 border-[#FF9933] shadow-2xl rounded-full px-5 py-2.5 flex items-center gap-4 a11y-panel-animate"
    >
      {/* Speaking Indicator */}
      <div className="flex items-center gap-2">
        <span className="flex h-3 w-3 relative">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9933] ${isSpeaking && !isPaused ? 'opacity-75' : 'opacity-0'}`}></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E65C00]"></span>
        </span>
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
          {isPaused ? 'Paused' : isSpeaking ? 'Reading Aloud...' : 'Screen Reader Ready'}
        </span>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          onClick={isSpeaking ? handleTogglePlayPause : handleReadSelection}
          className="bg-[#134074] hover:bg-[#FF9933] hover:text-[#0B2545] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          aria-label={isPaused ? 'Resume reading' : isSpeaking ? 'Pause reading' : 'Read selected text'}
          title={isPaused ? 'Resume' : isSpeaking ? 'Pause' : 'Read Selected'}
        >
          {isPaused ? '▶ Resume' : isSpeaking ? '⏸ Pause' : '▶ Read Text'}
        </button>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 text-[11px] font-bold bg-[#07172B] px-2 py-0.5 rounded-full border border-slate-700">
          <span className="text-slate-400">Speed:</span>
          {[0.8, 1.0, 1.2, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => setSpeechRate(rate)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                (settings.speechRate || 1.0) === rate
                  ? 'bg-[#E65C00] text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
              aria-label={`Set speech rate to ${rate} times speed`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Stop Button */}
        <button
          onClick={handleStop}
          className="bg-red-700 hover:bg-red-800 text-white w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Stop reading aloud and close audio bar"
          title="Stop reading"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
