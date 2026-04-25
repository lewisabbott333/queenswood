import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasTouch = window.matchMedia('(pointer: coarse)').matches;
    if (hasTouch) {
      setIsTouch(true);
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: 'power2.out',
      });
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: 'power2.out',
      });
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    const onLinkEnter = () => {
      gsap.to(dot, { scale: 2.5, duration: 0.25, ease: 'power2.out' });
      gsap.to(ring, { scale: 1.6, opacity: 0.6, duration: 0.25, ease: 'power2.out' });
    };

    const onLinkLeave = () => {
      gsap.to(dot, { scale: 1, duration: 0.25, ease: 'power2.out' });
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select, label[for]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onLinkEnter);
      el.addEventListener('mouseleave', onLinkLeave);
    });

    const observer = new MutationObserver(() => {
      const freshInteractives = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
      freshInteractives.forEach((el) => {
        el.removeEventListener('mouseenter', onLinkEnter);
        el.removeEventListener('mouseleave', onLinkLeave);
        el.addEventListener('mouseenter', onLinkEnter);
        el.addEventListener('mouseleave', onLinkLeave);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onLinkEnter);
        el.removeEventListener('mouseleave', onLinkLeave);
      });
      observer.disconnect();
    };
  }, [visible]);

  if (isTouch) return null;

  return (
    <>
      {/* Gold dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: '#fff100',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 16px rgba(255, 241, 0, 0.7)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1.5px solid rgba(255, 241, 0, 0.75)',
          transform: 'translate(-50%, -50%)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      />
    </>
  );
};
