import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const createScrollReveal = (selector: string, options = {}) => {
  const elements = gsap.utils.toArray(selector) as HTMLElement[];

  elements.forEach((element, index) => {
    gsap.from(element, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: index * 0.1,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        markers: false,
      },
      ...options,
    });
  });
};

export const createParallax = (selector: string, speed = 0.5) => {
  const elements = gsap.utils.toArray(selector) as HTMLElement[];

  elements.forEach((element) => {
    gsap.to(element, {
      y: () => (gsap.getProperty(window, 'innerHeight') as number) * speed,
      scrollTrigger: {
        trigger: element,
        scrub: true,
        markers: false,
      },
    });
  });
};

export const createStaggerReveal = (parent: string, child: string, stagger = 0.1) => {
  gsap.from(`${parent} ${child}`, {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger,
    scrollTrigger: {
      trigger: parent,
      start: 'top 80%',
      markers: false,
    },
  });
};
