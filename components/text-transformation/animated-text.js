// components/typewriter-text.js
import React, { useState, useEffect } from 'react';

export function AnimatedText({ text, className = "", speed = 100 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <p className={className}>
      <span>{displayedText}</span>
      <span className="animate-pulse">|</span>
    </p>
  );
}