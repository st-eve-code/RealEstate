'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import "./random.css";

interface RandomTextAnimationProps {
  children: ReactNode;
  className?: string; // Allows passing in Tailwind CSS classes like text-red-900
}

const RandomTextAnimation: React.FC<RandomTextAnimationProps> = ({ children, className = '' }) => {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const animateRandomly = () => {
      const element = textRef.current;
      if (!element) return;

      const randomX = Math.floor(Math.random() * 200) - 100;
      const randomY = Math.floor(Math.random() * 200) - 100;
      const randomScale = Math.random() * 0.5 + 0.8;
      const randomColor = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
      const randomDuration = Math.random() * 1.5 + 1;

      element.style.setProperty('--random-x', `${randomX}px`);
      element.style.setProperty('--random-y', `${randomY}px`);
      element.style.setProperty('--random-scale', String(randomScale));
      element.style.setProperty('--random-color', randomColor);
      element.style.setProperty('--animation-duration', `${randomDuration}s`);

      element.classList.remove('animate-random');
      void element.offsetWidth;
      element.classList.add('animate-random');
    };

    animateRandomly();
    const intervalId = setInterval(animateRandomly, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <span
      ref={textRef}
      className={`${className} animate-random`}
      style={{
        '--initial-color': 'rgb(127, 29, 29)',
        '--initial-transform': 'translate(0, 0) scale(1)',
        '--random-x': '0px',
        '--random-y': '0px',
        '--random-scale': '1',
        '--random-color': 'rgb(0, 0, 0)',
        '--animation-duration': '2s',
      } as React.CSSProperties & Record<string, string>} // Type assertion for custom properties
    >
      {children}
    </span>
  );
};

export default RandomTextAnimation;