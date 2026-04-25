import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '@/context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

interface StatCounterProps {
  value: string;
  label: string;
}

const parseStatValue = (val: string): { num: number; suffix: string; prefix: string } => {
  const prefix = val.match(/^[^0-9]*/)?.[0] ?? '';
  const suffix = val.match(/[^0-9.]+$/)?.[0] ?? '';
  const numStr = val.replace(/[^0-9.]/g, '');
  const num = parseFloat(numStr) || 0;
  return { num, suffix, prefix };
};

export default function StatCounter({ value, label }: StatCounterProps) {
  const numRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { suffix, prefix } = parseStatValue(value);
  const { theme } = useTheme();

  useEffect(() => {
    const el = numRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const { num } = parseStatValue(value);
    let started = false;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 85%',
      onEnter: () => {
        if (started) return;
        started = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: num,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            const current = Math.round(obj.val * 10) / 10;
            const displayVal = Number.isInteger(current) ? current.toString() : current.toFixed(1);
            el.textContent = `${prefix}${displayVal}${suffix}`;
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [value, prefix, suffix]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-2 text-center">
      <span className="font-display font-bold text-5xl md:text-6xl leading-none stat-counter-value" style={{ color: theme === 'light' ? '#111111' : '#ffffff' }}>
        <span ref={numRef}>
          {prefix}0{suffix}
        </span>
      </span>
      <span className="text-sm md:text-base uppercase tracking-widest font-medium" style={{ color: theme === 'light' ? '#5a5a5a' : '#cccccc' }}>
        {label}
      </span>
    </div>
  );
}
