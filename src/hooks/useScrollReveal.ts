import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-init';

export const useScrollReveal = (options = {}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.from(ref.current, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 80%',
      },
      ...options,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [options]);

  return ref;
};

export const useStaggerReveal = (selector: string, stagger = 0.1) => {
  useEffect(() => {
    const elements = gsap.utils.toArray(selector) as HTMLElement[];

    elements.forEach((element, index) => {
      gsap.from(element, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: index * stagger,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [selector, stagger]);
};

export const useParallax = (selector: string, speed = 0.5) => {
  useEffect(() => {
    const elements = gsap.utils.toArray(selector) as HTMLElement[];

    elements.forEach((element) => {
      gsap.to(element, {
        y: () => (window.innerHeight * speed) / 2,
        scrollTrigger: {
          trigger: element,
          scrub: true,
          start: 'top bottom',
          end: 'bottom top',
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [selector, speed]);
};
