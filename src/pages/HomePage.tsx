import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Network, Camera, MessageSquare, Tractor, Heart, ChevronDown, ArrowRight, Play } from '@/components/ui/MaterialIcon';
import StatCounter from '@/components/ui/StatCounter';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { setPageSEO, organizationSchema, websiteSchema, localBusinessSchema, SITE_URL } from '@/lib/seo';

const ServiceIcon = ({ children, bgColor = '#f8e71c' }: { children: React.ReactNode; bgColor?: string }) => (
  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
    style={{ background: bgColor, border: '1px solid rgba(255,255,255,0.15)', color: '#0d1b2e', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
    {children}
  </div>
);

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: <Users size={22} fill="currentColor" />,
    title: 'Community Engagement',
    description:
      'We connect infrastructure projects with local communities, building relationships built on trust and transparency.',
    href: '/what-we-do',
    bgColor: '#fff100',
  },
  {
    icon: <Network size={22} />,
    title: 'Stakeholder Engagement',
    description:
      'Expert management of complex multi-stakeholder environments, navigating competing interests with skill.',
    href: '/what-we-do',
    bgColor: '#f8e71c',
  },
  {
    icon: <Camera size={22} fill="currentColor" />,
    title: 'Digital & Visual Storytelling',
    description:
      'Bringing complex infrastructure information to life through compelling visual content.',
    href: '/what-we-do',
    bgColor: '#f8e71c',
  },
  {
    icon: <MessageSquare size={22} fill="currentColor" />,
    title: 'Public Consultation',
    description:
      'Rigorous, inclusive consultation processes that exceed regulatory requirements.',
    href: '/what-we-do',
    bgColor: '#f8e71c',
  },
  {
    icon: <Tractor size={22} fill="currentColor" />,
    title: 'Agricultural Liaison',
    description:
      'Specialist engagement with landowners and farming communities across major linear schemes.',
    href: '/what-we-do',
    bgColor: '#f8e71c',
  },
  {
    icon: <Heart size={22} fill="currentColor" />,
    title: 'Social Value',
    description:
      'Maximising community benefit and social impact from infrastructure investment.',
    href: '/what-we-do',
    bgColor: '#f8e71c',
  },
];

const featuredWork = [
  {
    title: 'National Highways Concrete Roads Programme',
    client: 'Sisk / National Highways',
    slug: 'national-highways-concrete-roads',
    image:
      '/images/projects/22-road.jpg',
  },
  {
    title: 'Devon Bus Service Improvement Plan',
    client: 'Devon County Council',
    slug: 'devon-bus-simp',
    image:
      '/images/projects/devon.jpg',
  },
  {
    title: 'Lower Thames Crossing',
    client: 'CASCADE JV',
    slug: 'lower-thames-crossing',
    image:
      '/images/projects/lower-thames-crossing.jpg',
  },
];

type ClientLogo = {
  id: string;
  name: string;
  logo_url: string;
  order_index: number;
};

export default function HomePage() {
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);
  const [heroBgImage, setHeroBgImage] = useState<string>('');
  const [clients, setClients] = useState<ClientLogo[]>([]);

  useEffect(() => {
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'hero_bg_image')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setHeroBgImage(data.value);
      });

    supabase
      .from('client_logos')
      .select('id, name, logo_url, order_index')
      .eq('active', true)
      .order('order_index', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setClients(data);
      });

  }, []);

  useEffect(() => {
    setPageSEO({
      title: 'Queenswood Engagement | Community & Stakeholder Engagement Consultancy UK',
      description:
        'Queenswood is a specialist community and stakeholder engagement consultancy working exclusively within the UK infrastructure sector — HS2, National Highways, Thames Water, Crossrail and more.',
      canonical: SITE_URL,
      ogType: 'website',
      keywords: 'community engagement consultancy UK, stakeholder engagement infrastructure, public consultation, HS2 community engagement, National Highways engagement, social value infrastructure',
      structuredData: [organizationSchema, websiteSchema, localBusinessSchema],
    });

    const tl = gsap.timeline({ delay: 0.2 });
    const lines = headlineRef.current?.querySelectorAll('.hero-line');
    if (lines) {
      tl.fromTo(
        lines,
        { opacity: 0, y: 60, skewY: 1.5 },
        { opacity: 1, y: 0, skewY: 0, duration: 1, stagger: 0.2, ease: 'power4.out' }
      );
    }
    if (underlineRef.current) {
      tl.fromTo(
        underlineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.3'
      );
    }
    if (subRef.current) {
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.4'
      );
    }
    if (ctasRef.current) {
      tl.fromTo(
        ctasRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' },
        '-=0.3'
      );
    }
  }, []);

  return (
    <div className="bg-navy-950">

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-navy-950">
        {heroBgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroBgImage})` }}
          />
        )}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div ref={headlineRef} className="mb-6 max-w-4xl">
            <h1 className="font-display font-bold" style={{ letterSpacing: '-0.025em', lineHeight: '1.05' }}>
              <span
                className="hero-line block text-5xl md:text-6xl lg:text-7xl xl:text-8xl opacity-0"
                style={{ color: '#ffffff', textShadow: '0 2px 24px rgba(0,0,0,0.7)', fontFamily: '__Inter_d65c78, sans-serif' }}
              >
                Community &amp; Stakeholder
              </span>
              <span
                className="hero-line block text-5xl md:text-6xl lg:text-7xl xl:text-8xl opacity-0 relative inline-block mt-2"
                style={{ color: '#ffffff', textShadow: '0 2px 24px rgba(0,0,0,0.7)', fontFamily: 'Inter, sans-serif' }}
              >
                Engagement Consultancy
                <span
                  ref={underlineRef}
                  className="absolute -bottom-3 left-0 rounded-full origin-left block"
                  style={{ transform: 'scaleX(0)', backgroundColor: '#fff100', height: '2px', width: '600px', lineHeight: '6px', alignSelf: 'stretch' }}
                />
              </span>
            </h1>
          </div>

          <p
            ref={subRef}
            className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10 opacity-0"
            style={{ color: '#e5e5e5', textShadow: '0 1px 12px rgba(0,0,0,0.8)' }}
          >
            We build trust and understanding between infrastructure projects and their
            stakeholders and communities.
          </p>

          <div ref={ctasRef} className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              to="/our-work"
              className="text-base px-10 py-4 rounded-lg font-semibold opacity-0 transition-all duration-300 active:scale-95 inline-block"
              style={{ backgroundColor: '#fff100', color: '#1a1a1a' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fff433')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff100')}
            >
              View Our Work
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 animate-bounce z-10">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown size={18} />
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-16 md:py-20 yellow-section" style={{ backgroundColor: '#fff100', borderTop: '1px solid rgba(255,241,0,0.3)', borderBottom: '1px solid rgba(255,241,0,0.3)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <StatCounter value="629k" label="Stakeholders Engaged" />
            <StatCounter value="10+" label="Active Projects" />
            <StatCounter value="2" label="Major Industry Awards" />
          </div>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section className="section-container bg-navy-950">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="mb-12 text-center">
            <SectionHeader
              strapline="Who We Are"
              heading="Queenswood in Action"
              subtitle="Watch how we work alongside infrastructure teams and communities to build lasting trust."
              align="center"
            />
          </div>

          <ScrollReveal>
            <div className="relative rounded-2xl overflow-hidden bg-navy-900 border border-navy-800 shadow-2xl shadow-black/50">
              <div className="aspect-video w-full">
                <iframe
                  src="https://streamable.com/e/g6vlpa"
                  title="Queenswood Engagement — who we are and how we work"
                  allow="fullscreen; autoplay"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                  style={{ border: 'none', display: 'block' }}
                />
              </div>
              <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-gold-600 rounded-tl-lg pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-gold-600 rounded-br-lg pointer-events-none" />
            </div>
          </ScrollReveal>

          <div className="mt-10 text-center">
            <Link
              to="/about-us"
              className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-500 font-semibold transition-colors text-sm"
            >
              <Play size={14} className="fill-current" />
              Learn more about Queenswood
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-container bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <SectionHeader
              strapline="Our Expertise"
              heading="What We Do"
              subtitle="A specialist community and stakeholder engagement consultancy working exclusively within the infrastructure sector."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ScrollReveal key={service.title} delay={index * 0.08}>
                <Link to={service.href} className="card-hover group h-full flex flex-col gap-4 block">
                  <ServiceIcon bgColor={service.bgColor}>{service.icon}</ServiceIcon>
                  <h3 className="font-display font-semibold text-xl text-white">{service.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1">{service.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-gold-600 text-xs font-semibold mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn more <ArrowRight size={12} />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/what-we-do" className="btn-secondary inline-flex items-center gap-2">
              Explore Our Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="section-container bg-navy-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <SectionHeader
              strapline="Case Studies"
              heading="Our Work"
              subtitle="From HS2 to Thames Water — exceptional engagement outcomes on the UK's most complex infrastructure programmes."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredWork.map((project, index) => (
              <ScrollReveal key={project.slug} delay={index * 0.1}>
                <Link
                  to={`/our-work/${project.slug}`}
                  className="group block relative overflow-hidden rounded-xl aspect-[4/3] bg-navy-800"
                >
                  <img
                    src={project.image}
                    alt={`${project.title} — Queenswood stakeholder engagement case study`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
                  <div className="photo-overlay absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-black/80 text-xs uppercase tracking-widest mb-1 font-semibold">
                      {project.client}
                    </p>
                    <h3 className="text-black font-display font-semibold text-lg leading-snug">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-black text-sm mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <span>View Case Study</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/our-work" className="btn-secondary inline-flex items-center gap-2">
              View All Projects <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section className="section-container bg-navy-900">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-16">
            <SectionHeader
              strapline="Recognition"
              heading="Award-Winning Engagement"
              align="center"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12" style={{ gap: '57px' }}>
            <ScrollReveal>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2F45793e580be94605afaa31ddef2989fc?format=webp&width=800&height=1200"
                alt="2023 Workforce CN Awards Winner"
                className="h-96 md:h-[480px] object-contain w-[576px] md:w-[672px]"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2Fe6d9a309ac0842fb985ad46c21d87ec1?format=webp&width=800&height=1200"
                alt="HS2 Inspiration Awards"
                className="h-96 md:h-[480px] object-contain w-[576px] md:w-[672px]"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2F99995b73e05d4f0d83c554f2099fc850?format=webp&width=800&height=1200"
                alt="Digital Construction Awards Winner Digital Consultancy of the year 2024"
                className="h-96 md:h-[480px] object-contain w-[576px] md:w-[672px]"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CLIENTS MARQUEE */}
      <section className="bg-navy-950 border-y border-navy-800 py-12 overflow-hidden">
        <p className="text-center text-slate-600 text-xs uppercase tracking-widest mb-8 font-semibold">
          Trusted by leading infrastructure organisations
        </p>
        <div className="overflow-hidden">
          <div className="flex items-center gap-12 w-max" style={{ animation: 'marquee 35s linear infinite' }}>
            {[0, 1].map((set) => (
              <div key={set} className="flex items-center gap-12 flex-shrink-0" aria-hidden={set === 1}>
                {clients.map((client, i) => (
                  client.logo_url ? (
                    <span
                      key={`${set}-img-${client.id}-${i}`}
                      className="flex-shrink-0 flex items-center justify-center h-10 px-3"
                    >
                      <img
                        src={client.logo_url}
                        alt={client.name}
                        className="max-h-10 max-w-[120px] w-auto h-auto object-contain"
                        style={{ display: 'block' }}
                      />
                    </span>
                  ) : (
                    <span
                      key={`${set}-txt-${client.id}-${i}`}
                      className="text-slate-500 font-display font-medium text-base tracking-wide px-2 flex-shrink-0"
                    >
                      {client.name}
                    </span>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* FOOTER CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-navy-900">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/3 w-80 h-80 rounded-full blur-[100px]"
            style={{ background: 'rgba(255,241,0,0.06)' }}
          />
          <div
            className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full blur-[80px]"
            style={{ background: 'rgba(255,241,0,0.04)' }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2
              className="font-display font-bold text-4xl md:text-5xl text-white mb-6 leading-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Ready to build trust with your communities?
            </h2>
            <p className="text-slate-500 text-lg mb-10">
              Let's talk about how Queenswood can help your infrastructure project succeed.
            </p>
            <Link
              to="/contact"
              className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4 font-semibold"
            >
              Get in Touch <ArrowRight size={18} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
