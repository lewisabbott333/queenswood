import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@/components/ui/MaterialIcon';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { setPageSEO, SITE_URL, organizationSchema, breadcrumbSchema } from '@/lib/seo';

export type CaseStudyCard = {
  title: string;
  client: string;
  sector: string;
  slug: string;
  image: string;
};

export const caseStudies: CaseStudyCard[] = [
  {
    title: 'National Highways Concrete Roads Programme',
    client: 'Sisk / National Highways',
    sector: 'Transport',
    slug: 'national-highways-concrete-roads',
    image: '/images/projects/22-road.jpg',
  },
  {
    title: 'High Speed 2 Phase 1',
    client: 'SCS JV, Align JV and EKFB JV',
    sector: 'Transport',
    slug: 'hs2-phase-1',
    image: '/images/projects/hs1.jpg',
  },
  {
    title: 'High Speed 2 Phase 2b',
    client: 'Bechtel',
    sector: 'Transport',
    slug: 'hs2-phase-2b',
    image: '/images/projects/new21-road.jpg',
  },
  {
    title: 'Old Street Roundabout',
    client: 'Morgan Sindall / Transport for London',
    sector: 'Transport',
    slug: 'old-street-roundabout',
    image: '/images/projects/old-street-junction-improv.jpg',
  },
  {
    title: 'M621 Junctions 1-7',
    client: 'Keltbray / National Highways',
    sector: 'Transport',
    slug: 'm621-junctions',
    image: '/images/projects/m62-junctions.jpg',
  },
  {
    title: 'Devon Bus Service Improvement Plan',
    client: 'Devon County Council',
    sector: 'Transport',
    slug: 'devon-bus-bsip',
    image: '/images/projects/devon.jpg',
  },
  {
    title: 'Crossrail 2',
    client: 'Transport for London',
    sector: 'Transport',
    slug: 'crossrail-2',
    image: '/images/projects/crossrail.jpg',
  },
  {
    title: 'Thames Water Strategic Resource Options',
    client: 'Strategic Resource Options',
    sector: 'Water',
    slug: 'thames-water-strategic-resource-options',
    image: '/images/projects/sesro-cgi.jpg',
  },
  {
    title: 'High Speed 2 Phase 2a',
    client: 'Balfour Beatty',
    sector: 'Transport',
    slug: 'hs2-phase-2a',
    image: '/images/projects/land-prog.jpg',
  },
  {
    title: 'Lower Thames Crossing',
    client: 'CASCADE JV',
    sector: 'Transport',
    slug: 'lower-thames-crossing',
    image: '/images/projects/lower-thames-crossing.jpg',
  },
];

const sectors = ['All', 'Transport', 'Water'];

export default function OurWorkPage() {
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    setPageSEO({
      title: 'Infrastructure Engagement Case Studies | HS2, National Highways, Thames Water | Queenswood',
      description:
        'Explore our community and stakeholder engagement case studies across major UK infrastructure — HS2 Phase 1 & 2, Lower Thames Crossing, Thames Water SESRO, National Highways and more.',
      canonical: `${SITE_URL}/our-work`,
      keywords: 'engagement case studies, infrastructure projects, HS2 engagement, National Highways, Thames Water, Crossrail stakeholder, community engagement portfolio',
      structuredData: [organizationSchema, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Our Work', url: '/our-work' }])],
    });
  }, []);

  const filtered =
    activeFilter === 'All'
      ? caseStudies
      : caseStudies.filter((cs) => cs.sector === activeFilter);

  return (
    <div className="bg-navy-950 pt-20">
      {/* Hero */}
      <section className="section-container bg-navy-950 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-gold-500 text-xs uppercase tracking-[0.25em] font-medium mb-4">
            Road Smoothers
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-cream leading-tight mb-6">
            Infrastructure Engagement Case Studies
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            From major national programmes like HS2 and the Lower Thames Crossing to water
            infrastructure and local transport schemes, Queenswood has a proven track record of
            delivering award-winning community and stakeholder engagement on the UK's most
            complex and sensitive infrastructure projects — including DCO, National Highways,
            and Thames Water programmes.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="section-container bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <SectionHeader
              strapline="Case Studies"
              heading="Projects We've Delivered"
              align="left"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-3 mb-12">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setActiveFilter(sector)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                  activeFilter === sector
                    ? 'bg-gold-600 text-navy-950 border-gold-600'
                    : 'border-navy-700 text-slate-400 hover:border-gold-600 hover:text-gold-500'
                }`}
              >
                {sector}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, index) => (
              <ScrollReveal key={project.slug} delay={index * 0.05}>
                <Link
                  to={`/our-work/${project.slug}`}
                  className="group block relative overflow-hidden rounded-xl aspect-[4/3] bg-navy-800"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs px-3 py-1 rounded-full uppercase tracking-widest font-medium" style={{ backgroundColor: '#fff100', color: '#1a1a1a' }}>
                      {project.sector}
                    </span>
                  </div>
                  <div className="photo-overlay absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-black/80 text-xs uppercase tracking-wide mb-1">
                      {project.client}
                    </p>
                    <h3 className="text-black font-display text-base leading-snug">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-black text-sm mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      <span>View Case Study</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy-950 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
              Looking for an experienced community engagement consultancy?
            </h2>
            <p className="text-slate-400 mb-8">
              Whether you're preparing a DCO application, managing a National Highways scheme, or
              building trust with communities on a water infrastructure project — Queenswood can
              make the difference. Tell us about your programme.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Get in Touch <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
