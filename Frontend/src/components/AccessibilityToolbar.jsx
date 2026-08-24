import React, { useRef, useEffect, useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import './Accessibility.css';

export default function AccessibilityToolbar() {
  const {
    settings,
    isToolbarOpen,
    toggleToolbar,
    closeToolbar,
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
    speakText,
    stopSpeaking,
    isSpeaking,
    pointToSpeak,
    togglePointToSpeak,
    resetAllSettings,
  } = useAccessibility();

  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'contrast' | 'reading' | 'audio'
  const panelRef = useRef(null);
  const triggerButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Focus Trap inside the dialog when opened
  useEffect(() => {
    if (isToolbarOpen) {
      // Focus on the panel or the close button when opened
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      const handleTabKey = (e) => {
        if (!panelRef.current || e.key !== 'Tab') return;

        const focusableElements = panelRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      window.addEventListener('keydown', handleTabKey);
      return () => window.removeEventListener('keydown', handleTabKey);
    } else {
      // Return focus to the trigger button when closed
      triggerButtonRef.current?.focus();
    }
  }, [isToolbarOpen]);

  // Read current page main text
  const handleReadPageContent = () => {
    const mainArea = document.querySelector('main') || document.querySelector('#root') || document.body;
    if (mainArea) {
      const text = mainArea.innerText.slice(0, 1000);
      speakText(text);
    }
  };

  // Read selected text
  const handleReadSelected = () => {
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : '';
    if (text) {
      speakText(text);
    } else {
      handleReadPageContent();
    }
  };

  // Quick Assist Presets
  const applyVisionPreset = () => {
    setFontSize(120);
    setContrastMode('high-contrast-dark');
    if (!settings.highlightLinks) toggleHighlightLinks();
    if (!settings.largeCursor) toggleLargeCursor();
  };

  const applyReadingPreset = () => {
    if (!settings.readingGuide.enabled) toggleReadingGuide();
    if (!settings.dyslexicFont) toggleDyslexicFont();
    setLineSpacing('relaxed');
    setLetterSpacing('wide');
  };

  return (
    <>
      {/* =========================================================================
          1. PERMANENT FLOATING ACCESSIBILITY TRIGGER BUTTON
          ========================================================================= */}
      <div
        className="fixed bottom-6 left-6 z-[999990] flex items-center gap-2"
        role="region"
        aria-label="Accessibility Widget Trigger"
      >
        <button
          ref={triggerButtonRef}
          onClick={toggleToolbar}
          aria-haspopup="dialog"
          aria-expanded={isToolbarOpen}
          aria-controls="aidnexus-a11y-panel"
          aria-label={isToolbarOpen ? "Close Accessibility Options" : "Open Accessibility Options (Keyboard shortcut: Alt + A)"}
          className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-[#0B2545] hover:bg-[#134074] text-white border-2 border-[#FF9933] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E65C00] focus-visible:ring-offset-2"
        >
          {/* Universal Accessibility Icon */}
          <svg
            className="w-7 h-7 fill-current text-white group-hover:text-[#FF9933] transition-colors"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
          </svg>

          {/* Glowing Status Ring if customized */}
          {(settings.fontSize !== 100 || settings.contrastMode !== 'normal' || settings.readingGuide.enabled || settings.dyslexicFont) && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 bg-[#E65C00] border-2 border-white rounded-full flex items-center justify-center text-[9px] font-black text-white"
              title="Custom accessibility preferences active"
            >
              ✓
            </span>
          )}

          {/* Floating Tooltip Hint on Hover */}
          <span
            role="tooltip"
            className="absolute left-full ml-3 px-2.5 py-1 bg-[#0B2545] text-white text-[11px] font-bold rounded shadow-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity border border-slate-600 hidden sm:block"
          >
            Accessibility <span className="text-[#FF9933] font-mono ml-1">Alt+A</span>
          </span>
        </button>
      </div>

      {/* =========================================================================
          2. ACCESSIBILITY MODAL / DIALOG PANEL
          ========================================================================= */}
      {isToolbarOpen && (
        <div
          className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-center sm:justify-start sm:pl-6 p-3 bg-black/40 backdrop-blur-xs transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeToolbar();
          }}
        >
          <div
            id="aidnexus-a11y-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-dialog-title"
            aria-describedby="a11y-dialog-desc"
            className="w-full max-w-lg bg-white border-2 border-[#0B2545] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden a11y-panel-animate text-[#0B2545]"
          >
            {/* Modal Header */}
            <div className="bg-[#0B2545] text-white px-5 py-4 flex items-center justify-between border-b-4 border-[#FF9933]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center text-[#0B2545] font-black text-lg">
                  ♿
                </div>
                <div>
                  <h2 id="a11y-dialog-title" className="text-base font-black tracking-wide uppercase">
                    Accessibility Menu
                  </h2>
                  <p id="a11y-dialog-desc" className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                    WCAG 2.1 AA Compliant Portal Tools
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block font-mono text-[10px] bg-[#134074] text-slate-200 px-2 py-0.5 rounded border border-slate-600">
                  Alt + A / Esc
                </span>
                <button
                  ref={closeButtonRef}
                  onClick={closeToolbar}
                  className="text-slate-300 hover:text-white hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center font-black text-lg cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
                  aria-label="Close Accessibility Settings Dialog (Escape)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div
              role="tablist"
              aria-label="Accessibility Categories"
              className="flex border-b border-slate-200 bg-slate-100 text-xs font-bold"
            >
              {[
                { id: 'text', label: '🔤 Text & Size', ariaLabel: 'Text Rescaling and Typography Tab' },
                { id: 'contrast', label: '🎨 Contrast', ariaLabel: 'Color and Contrast Themes Tab' },
                { id: 'reading', label: '📏 Guide & Aids', ariaLabel: 'Reading Guide Ruler and Visual Aids Tab' },
                { id: 'audio', label: '🔊 Read Aloud', ariaLabel: 'Speech and Audio Tab' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 px-2 text-center text-[11px] sm:text-xs uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-[#E65C00] border-[#E65C00] font-extrabold shadow-xs'
                      : 'text-slate-600 border-transparent hover:text-[#0B2545] hover:bg-slate-200'
                  }`}
                  aria-label={tab.ariaLabel}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Panels Body (Scrollable) */}
            <div className="p-5 overflow-y-auto a11y-custom-scrollbar flex-1 space-y-6">

              {/* =============================================================
                  TAB 1: TEXT RESCALING & TYPOGRAPHY
                  ============================================================= */}
              {activeTab === 'text' && (
                <div id="panel-text" role="tabpanel" aria-labelledby="tab-text" className="space-y-5">
                  {/* 1.1 Text Rescaling Controls */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#0B2545]">
                          Text Size Rescaling
                        </h3>
                        <p className="text-[11px] text-slate-600 font-semibold">
                          Scale font size across all government modules
                        </p>
                      </div>
                      <span className="font-mono text-xs font-extrabold bg-[#0B2545] text-white px-2.5 py-1 rounded">
                        {settings.fontSize}%
                      </span>
                    </div>

                    {/* Button Stepper: A- | 100% | A+ */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={decreaseFontSize}
                        disabled={settings.fontSize <= 80}
                        className="py-2 px-3 bg-white border-2 border-[#0B2545] hover:bg-slate-100 disabled:opacity-40 rounded font-black text-sm text-[#0B2545] cursor-pointer flex items-center justify-center gap-1 transition-all"
                        aria-label="Decrease Font Size (A minus)"
                      >
                        <span className="text-base font-bold">A-</span>
                        <span className="text-[10px] font-semibold text-slate-500">Smaller</span>
                      </button>

                      <button
                        onClick={resetFontSize}
                        className="py-2 px-3 bg-white border-2 border-slate-400 hover:bg-slate-100 rounded font-black text-sm text-[#0B2545] cursor-pointer flex items-center justify-center gap-1 transition-all"
                        aria-label="Reset Font Size to Default 100 percent"
                      >
                        <span className="text-base font-bold">A</span>
                        <span className="text-[10px] font-semibold text-slate-500">Reset</span>
                      </button>

                      <button
                        onClick={increaseFontSize}
                        disabled={settings.fontSize >= 160}
                        className="py-2 px-3 bg-white border-2 border-[#0B2545] hover:bg-slate-100 disabled:opacity-40 rounded font-black text-sm text-[#0B2545] cursor-pointer flex items-center justify-center gap-1 transition-all"
                        aria-label="Increase Font Size (A plus)"
                      >
                        <span className="text-base font-bold">A+</span>
                        <span className="text-[10px] font-semibold text-slate-500">Larger</span>
                      </button>
                    </div>

                    {/* Quick Percentage Presets */}
                    <div className="flex items-center justify-between gap-1 mt-3 pt-3 border-t border-slate-200">
                      {[90, 100, 115, 130, 150].map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`px-2 py-1 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                            settings.fontSize === size
                              ? 'bg-[#E65C00] text-white font-extrabold shadow-xs'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                          aria-label={`Set font size to ${size} percent`}
                        >
                          {size}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1.2 Dyslexia-Friendly Font */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#0B2545]">
                        Dyslexia-Friendly Font
                      </h3>
                      <p className="text-[11px] text-slate-600 font-semibold">
                        High legibility, weighted typography for easier reading
                      </p>
                    </div>
                    <button
                      onClick={toggleDyslexicFont}
                      role="switch"
                      aria-checked={settings.dyslexicFont}
                      aria-label="Toggle Dyslexia Friendly Font"
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        settings.dyslexicFont ? 'bg-[#E65C00]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.dyslexicFont ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 1.3 Line Spacing & Letter Spacing */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <label className="block text-[11px] font-extrabold uppercase text-[#0B2545] mb-1.5">
                        Line Spacing
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {['normal', 'relaxed', 'loose'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setLineSpacing(val)}
                            className={`py-1 text-[10px] font-bold rounded uppercase cursor-pointer ${
                              settings.lineSpacing === val
                                ? 'bg-[#0B2545] text-white'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                            aria-label={`Set line spacing to ${val}`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <label className="block text-[11px] font-extrabold uppercase text-[#0B2545] mb-1.5">
                        Letter Spacing
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {['normal', 'wide', 'wider'].map((val) => (
                          <button
                            key={val}
                            onClick={() => setLetterSpacing(val)}
                            className={`py-1 text-[10px] font-bold rounded uppercase cursor-pointer ${
                              settings.letterSpacing === val
                                ? 'bg-[#0B2545] text-white'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                            aria-label={`Set letter spacing to ${val}`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  TAB 2: CONTRAST & VISUAL THEMES
                  ============================================================= */}
              {activeTab === 'contrast' && (
                <div id="panel-contrast" role="tabpanel" aria-labelledby="tab-contrast" className="space-y-4">
                  <div>
                    <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#0B2545] mb-1">
                      Color Contrast Modes
                    </h3>
                    <p className="text-[11px] text-slate-600 font-semibold">
                      Select a visual theme tailored for maximum readability and eye comfort
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      {
                        id: 'normal',
                        title: 'Standard Contrast (Default)',
                        desc: 'Official Government Tricolor & Navy Palette',
                        badge: 'Default',
                        previewBg: 'bg-white',
                        previewText: 'text-[#0B2545]',
                        border: 'border-slate-300',
                      },
                      {
                        id: 'high-contrast-dark',
                        title: 'High Contrast Dark Mode',
                        desc: 'Deep dark background with luminous high-contrast text (WCAG AAA)',
                        badge: 'AAA Dark',
                        previewBg: 'bg-[#0D1117]',
                        previewText: 'text-[#58A6FF]',
                        border: 'border-slate-700',
                      },
                      {
                        id: 'high-contrast-yellow',
                        title: 'High Contrast Yellow on Black',
                        desc: 'Government portal high-visibility mode for visual impairments',
                        badge: 'High Visibility',
                        previewBg: 'bg-black',
                        previewText: 'text-yellow-400',
                        border: 'border-yellow-400',
                      },
                      {
                        id: 'grayscale',
                        title: 'Monochrome Grayscale',
                        desc: 'Removes all colors to eliminate chromatic distractions',
                        badge: 'Grayscale',
                        previewBg: 'bg-slate-200',
                        previewText: 'text-slate-900',
                        border: 'border-slate-400',
                      },
                      {
                        id: 'inverted',
                        title: 'Inverted Colors',
                        desc: 'Reverses page luminance while protecting image visibility',
                        badge: 'Invert',
                        previewBg: 'bg-slate-900',
                        previewText: 'text-white',
                        border: 'border-amber-500',
                      },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setContrastMode(mode.id)}
                        className={`p-3.5 rounded-lg border-2 text-left flex items-center justify-between cursor-pointer transition-all ${
                          settings.contrastMode === mode.id
                            ? 'border-[#E65C00] bg-amber-50/60 shadow-sm ring-2 ring-[#E65C00]/20'
                            : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
                        }`}
                        aria-pressed={settings.contrastMode === mode.id}
                        aria-label={`Activate ${mode.title}`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Visual Theme Color Preview Swatch */}
                          <div
                            className={`w-9 h-9 rounded-md border flex items-center justify-center font-bold text-xs shadow-inner shrink-0 ${mode.previewBg} ${mode.previewText} ${mode.border}`}
                          >
                            Aa
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#0B2545]">{mode.title}</div>
                            <div className="text-[10px] text-slate-500 font-semibold">{mode.desc}</div>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                            settings.contrastMode === mode.id
                              ? 'bg-[#E65C00] text-white border-[#E65C00]'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          {settings.contrastMode === mode.id ? 'Active ✓' : mode.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* =============================================================
                  TAB 3: READING GUIDE RULER & VISUAL AIDS
                  ============================================================= */}
              {activeTab === 'reading' && (
                <div id="panel-reading" role="tabpanel" aria-labelledby="tab-reading" className="space-y-4">
                  {/* 3.1 Reading Guide Ruler Feature */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#0B2545] flex items-center gap-1.5">
                          <span>📏</span> Reading Guide Ruler
                        </h3>
                        <p className="text-[11px] text-slate-600 font-semibold">
                          Horizontal focused ruler following cursor to track lines
                        </p>
                      </div>
                      <button
                        onClick={toggleReadingGuide}
                        role="switch"
                        aria-checked={settings.readingGuide.enabled}
                        aria-label="Toggle Reading Guide Ruler"
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          settings.readingGuide.enabled ? 'bg-[#E65C00]' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings.readingGuide.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Ruler Height & Color Settings when enabled */}
                    {settings.readingGuide.enabled && (
                      <div className="pt-3 border-t border-slate-200 space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                            Ruler Reading Height: {settings.readingGuide.height}px
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[36, 48, 64].map((h) => (
                              <button
                                key={h}
                                onClick={() => setReadingGuideConfig({ height: h })}
                                className={`py-1 text-[10px] font-bold rounded cursor-pointer ${
                                  settings.readingGuide.height === h
                                    ? 'bg-[#0B2545] text-white'
                                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                                }`}
                                aria-label={`Set reading guide height to ${h} pixels`}
                              >
                                {h === 36 ? 'Compact' : h === 48 ? 'Standard' : 'Spacious'} ({h}px)
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                            Guideline Accent Color
                          </label>
                          <div className="flex items-center gap-2">
                            {[
                              { color: '#FF9933', name: 'Saffron' },
                              { color: '#FFFF00', name: 'Yellow' },
                              { color: '#38BDF8', name: 'Cyan' },
                              { color: '#4ADE80', name: 'Green' },
                              { color: '#FFFFFF', name: 'White' },
                            ].map((c) => (
                              <button
                                key={c.color}
                                onClick={() => setReadingGuideConfig({ color: c.color })}
                                className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform ${
                                  settings.readingGuide.color === c.color ? 'scale-110 border-[#0B2545] ring-2 ring-[#E65C00]' : 'border-slate-300'
                                }`}
                                style={{ backgroundColor: c.color }}
                                aria-label={`Set guide color to ${c.name}`}
                                title={c.name}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3.2 Highlight Hyperlinks */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#0B2545]">
                        Highlight Links & Actions
                      </h3>
                      <p className="text-[11px] text-slate-600 font-semibold">
                        Add high-visibility underlines and badges to all links
                      </p>
                    </div>
                    <button
                      onClick={toggleHighlightLinks}
                      role="switch"
                      aria-checked={settings.highlightLinks}
                      aria-label="Toggle Link Highlights"
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        settings.highlightLinks ? 'bg-[#E65C00]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.highlightLinks ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 3.3 Large Cursor */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#0B2545]">
                        Large High-Contrast Cursor
                      </h3>
                      <p className="text-[11px] text-slate-600 font-semibold">
                        Enlarge mouse pointer with clear outline and pointer icons
                      </p>
                    </div>
                    <button
                      onClick={toggleLargeCursor}
                      role="switch"
                      aria-checked={settings.largeCursor}
                      aria-label="Toggle Large High Contrast Cursor"
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        settings.largeCursor ? 'bg-[#E65C00]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.largeCursor ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 3.4 Pause Animations */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#0B2545]">
                        Pause Animations (Reduced Motion)
                      </h3>
                      <p className="text-[11px] text-slate-600 font-semibold">
                        Stop all flashing graphics, transitions, and moving elements
                      </p>
                    </div>
                    <button
                      onClick={togglePauseAnimations}
                      role="switch"
                      aria-checked={settings.pauseAnimations}
                      aria-label="Toggle Pause Animations and Reduced Motion"
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        settings.pauseAnimations ? 'bg-[#E65C00]' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.pauseAnimations ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* =============================================================
                  TAB 4: AUDIO READ ALOUD & SPEECH SYNTHESIS
                  ============================================================= */}
              {activeTab === 'audio' && (
                <div id="panel-audio" role="tabpanel" aria-labelledby="tab-audio" className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#0B2545] flex items-center gap-1.5">
                          <span>🔊</span> ReadSpeaker Enterprise WebReader
                        </h3>
                        <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                          Cloud-grade text-to-speech for government & education portals with word-level highlighting
                        </p>
                      </div>
                      <span className="bg-[#E65C00] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                        Gov Edition
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                        <button
                          onClick={handleReadSelected}
                          className="p-3 bg-[#0B2545] hover:bg-[#134074] text-white rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                          aria-label="Read selected text on the page"
                        >
                          <span className="text-base">📑</span>
                          <span>Read Selection</span>
                          <span className="text-[9px] text-slate-300 font-normal">Highlight any text & click</span>
                        </button>

                        <button
                          onClick={handleReadPageContent}
                          className="p-3 bg-[#E65C00] hover:bg-[#C24E00] text-white rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors"
                          aria-label="Read full page overview aloud"
                        >
                          <span className="text-base">📢</span>
                          <span>Read Full Page</span>
                          <span className="text-[9px] text-amber-100 font-normal">Narrates page articles</span>
                        </button>
                      </div>

                      {/* Interactive Click-to-Read Toggle */}
                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-extrabold uppercase text-[#0B2545] flex items-center gap-1">
                            <span>👆</span> Interactive Click-to-Read
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">
                            Click any paragraph or card on the page to hear it read aloud
                          </p>
                        </div>
                        <button
                          onClick={togglePointToSpeak}
                          role="switch"
                          aria-checked={pointToSpeak}
                          aria-label="Toggle Interactive Click to Read"
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            pointToSpeak ? 'bg-[#E65C00]' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              pointToSpeak ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Active Playing Indicator & Stop button */}
                      {isSpeaking && (
                        <div className="bg-amber-100 border border-amber-300 p-2.5 rounded flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-bold text-[#0B2545]">
                            <span className="animate-pulse text-sm">🔊</span>
                            <span>Currently reading aloud...</span>
                          </div>
                          <button
                            onClick={stopSpeaking}
                            className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-2.5 py-1 rounded cursor-pointer transition-colors"
                            aria-label="Stop reading aloud"
                          >
                            Stop ✕
                          </button>
                        </div>
                      )}
                    </div>

                  {/* Preset Profiles */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wide text-[#0B2545]">
                      ⚡ Quick Accessibility Profiles
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={applyVisionPreset}
                        className="p-2.5 bg-white border border-slate-300 hover:border-[#0B2545] rounded text-left cursor-pointer transition-colors"
                        aria-label="Apply Low Vision Assist Preset"
                      >
                        <div className="text-xs font-bold text-[#0B2545]">👁️ Vision Assist</div>
                        <div className="text-[10px] text-slate-500 font-medium">Dark Mode + 120% + Large Cursor</div>
                      </button>

                      <button
                        onClick={applyReadingPreset}
                        className="p-2.5 bg-white border border-slate-300 hover:border-[#0B2545] rounded text-left cursor-pointer transition-colors"
                        aria-label="Apply Reading Focus Preset"
                      >
                        <div className="text-xs font-bold text-[#0B2545]">📖 Reading Focus</div>
                        <div className="text-[10px] text-slate-500 font-medium">Ruler + Dyslexia Font + Spacing</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer: Reset All & Status */}
            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={resetAllSettings}
                className="text-xs font-bold text-red-700 hover:text-red-900 flex items-center gap-1.5 cursor-pointer transition-colors"
                aria-label="Reset all accessibility preferences to default"
              >
                <span>🔄</span>
                <span>Reset All Settings</span>
              </button>

              <button
                onClick={closeToolbar}
                className="bg-[#0B2545] hover:bg-[#134074] text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
                aria-label="Save and Close Accessibility Menu"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
