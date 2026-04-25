import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { X, Menu, Sun, Moon } from '@/components/ui/MaterialIcon';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';

const navLinks = [
  { label: 'What We Do', href: '/what-we-do' },
  { label: 'Our Work', href: '/our-work' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Careers', href: '/careers' },
  { label: 'Engagement Shop', href: '/shop' },
  { label: 'News & Insights', href: '/news-and-insights' },
  { label: 'Social Construct', href: '/social-construct' },
  { label: 'Contact', href: '/contact' },
];

function ThemeToggle({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const { theme, toggleTheme } = useTheme();
  const isSmall = size === 'sm';

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 flex-shrink-0"
      style={{
        width: isSmall ? '48px' : '52px',
        height: isSmall ? '26px' : '28px',
        backgroundColor: theme === 'dark' ? '#3d3c3d' : '#d6d3d1',
        border: '1px solid var(--color-bg-border)',
      }}
    >
      <span
        className="absolute top-0.5 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm"
        style={{
          width: isSmall ? '22px' : '24px',
          height: isSmall ? '22px' : '24px',
          left: theme === 'dark' ? '2px' : isSmall ? 'calc(100% - 24px)' : 'calc(100% - 26px)',
          backgroundColor: theme === 'dark' ? '#fff100' : '#1c1917',
          color: theme === 'dark' ? '#1a1a1a' : '#f5f5f4',
        }}
      >
        {theme === 'dark' ? <Moon size={isSmall ? 11 : 12} /> : <Sun size={isSmall ? 11 : 12} />}
      </span>
    </button>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navColors, setNavColors] = useState({ bg: '', text: '', accent: '' });
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLLIElement[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    supabase
      .from('settings')
      .select('key, value')
      .in('key', ['nav_bg_color', 'nav_text_color', 'nav_accent_color', 'seo_google_site_verification'])
      .then(({ data }) => {
        if (!data) return;
        const map: Record<string, string> = {};
        data.forEach((s) => { map[s.key] = s.value; });
        setNavColors({
          bg: map['nav_bg_color'] || '',
          text: map['nav_text_color'] || '',
          accent: map['nav_accent_color'] || '',
        });
        if (map['seo_google_site_verification']) {
          let meta = document.querySelector('meta[name="google-site-verification"]') as HTMLMetaElement | null;
          if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'google-site-verification';
            document.head.appendChild(meta);
          }
          meta.content = map['seo_google_site_verification'];
        }
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      gsap.set(overlay, { display: 'flex' });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(
        linksRef.current.filter(Boolean),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, delay: 0.15, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = '';
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
        },
      });
    }
  }, [mobileOpen]);

  const setLinkRef = (el: HTMLLIElement | null, index: number) => {
    if (el) linksRef.current[index] = el;
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={
          scrolled || theme === 'light'
            ? {
                backgroundColor: navColors.bg || '#0a0c12',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
              }
            : {
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
              }
        }
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/images/logo-horizontal.svg"
                alt="Queenswood Engagement"
                className="h-7 w-auto transition-all duration-300"
                style={{ filter: 'brightness(0) invert(1)' }}
                loading="eager"
              />
            </Link>

            <ul className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 group`}
                      style={{
                        color: isActive
                          ? (navColors.accent || '#fff100')
                          : (navColors.text || '#ffffff'),
                        textShadow: theme === 'dark' ? '0 1px 8px rgba(0,0,0,0.6)' : 'none',
                      }}
                    >
                      {link.label}
                      <span
                        className="absolute bottom-0 left-3 right-3 h-0.5 transition-transform duration-300 origin-left"
                        style={{
                          backgroundColor: navColors.accent || 'var(--color-gold-500, #fff100)',
                          transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                        }}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <button
                className="xl:hidden p-2 hover:text-gold-500 transition-colors"
                style={{ color: '#ffffff', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.6))' }}
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu size={26} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100] flex-col items-center justify-center hidden"
        style={{ backgroundColor: 'var(--color-mobile-overlay)' }}
      >
        <button
          className="absolute top-6 right-6 p-2 hover:text-gold-500 transition-colors"
          style={{ color: 'var(--color-text-primary)' }}
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
        >
          <X size={30} />
        </button>

        <div className="mb-10">
          <img
            src="/images/logo-horizontal.svg"
            alt="Queenswood Engagement"
            className="h-8 w-auto transition-all duration-300"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>

        <ul className="flex flex-col items-center gap-6 text-center">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.href;
            return (
              <li key={link.href} ref={(el) => setLinkRef(el, index)}>
                <Link
                  to={link.href}
                  className={`text-2xl md:text-3xl font-display transition-colors duration-300 ${
                    isActive ? 'text-gold-500' : 'hover:text-gold-400'
                  }`}
                  style={{ color: isActive ? undefined : 'var(--color-text-primary)' }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex items-center gap-3">
          <span
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-faint)' }}
          >
            {theme === 'dark' ? 'Dark' : 'Light'} mode
          </span>
          <ThemeToggle size="sm" />
        </div>

        <div className="mt-6 text-sm" style={{ color: 'var(--color-text-faint)' }}>
          hello@wearequeenswood.com
        </div>
      </div>
    </>
  );
}
