import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

export default function ReadingGuide() {
  const { settings, toggleReadingGuide } = useAccessibility();
  const { enabled, height = 48, color = '#FF9933', maskOpacity = 0.45 } = settings.readingGuide;

  const [mouseY, setMouseY] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    const handleMouseMove = (e) => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      animFrameRef.current = requestAnimationFrame(() => {
        setMouseY(e.clientY);
        setIsVisible(true);
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [enabled]);

  if (!enabled || mouseY === null || !isVisible) {
    return null;
  }

  const halfHeight = height / 2;
  const topMaskHeight = Math.max(0, mouseY - halfHeight);
  const apertureTop = topMaskHeight;
  const bottomMaskTop = mouseY + halfHeight;

  return (
    <div
      className="a11y-reading-guide-wrapper"
      role="presentation"
      aria-hidden="true"
    >
      {/* Top Mask */}
      <div
        className="a11y-reading-guide-mask-top"
        style={{
          height: `${topMaskHeight}px`,
          backgroundColor: `rgba(0, 0, 0, ${maskOpacity})`,
        }}
      />

      {/* Focused Reading Aperture */}
      <div
        className="a11y-reading-guide-aperture"
        style={{
          top: `${apertureTop}px`,
          height: `${height}px`,
          borderColor: color,
          boxShadow: `0 0 12px ${color}66`,
          backgroundColor: `${color}15`,
        }}
      >
        {/* Subtle center line marker */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '12px',
            right: '12px',
            height: '1px',
            background: `dashed 1px ${color}88`,
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Bottom Mask */}
      <div
        className="a11y-reading-guide-mask-bottom"
        style={{
          top: `${bottomMaskTop}px`,
          backgroundColor: `rgba(0, 0, 0, ${maskOpacity})`,
        }}
      />

      {/* Quick Dismiss Button (Floating bottom right for convenience) */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '80px',
          zIndex: 999995,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={toggleReadingGuide}
          className="bg-[#0B2545] hover:bg-[#134074] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-amber-400 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
          aria-label="Turn off Reading Guide Ruler"
          title="Turn off Reading Guide Ruler"
        >
          <span>📏</span>
          <span>Ruler On</span>
          <span className="bg-amber-500 text-black text-[9px] px-1.5 py-0.2 rounded-full font-black ml-1">✕</span>
        </button>
      </div>
    </div>
  );
}
