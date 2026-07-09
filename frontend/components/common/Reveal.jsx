'use client';

import { useRef, useState, useEffect } from 'react';

/**
 * Reveal — scroll-triggered entrance animation wrapper.
 *
 * Fades + slides its children in when they scroll into view. Self-contained
 * (inline styles + IntersectionObserver), so it needs no Tailwind config or
 * global CSS. Honors prefers-reduced-motion by rendering fully visible.
 *
 * Usage:
 *   <Reveal><SomeSection /></Reveal>
 *   <Reveal delay={120} y={32}>...</Reveal>
 */
export default function Reveal({
  children,
  delay = 0,        // ms stagger
  y = 28,           // px it travels up from
  duration = 650,   // ms
  once = true,      // animate only the first time it enters
  className = '',
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced-motion users: skip the animation, show immediately.
    if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setShown(false);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${y}px)`,
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
