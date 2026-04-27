import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Lightbulb, Handshake, Quote } from '@/components/ui/MaterialIcon';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { setPageSEO, SITE_URL, organizationSchema, breadcrumbSchema } from '@/lib/seo';
import { supabase } from '@/lib/supabase';
import type { TeamMember } from '@/lib/supabase';

const ServiceIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
    style={{ background: '#fff100', border: '1px solid rgba(255,255,255,0.15)', color: '#0d1b2e', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
    {children}
  </div>
);

const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter((part) => !part.startsWith('('))
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

const values = [
  {
    icon: <Users size={22} fill="currentColor" />,
    title: 'People First',
    description:
      'We genuinely care about communities and the people whose lives are touched by infrastructure. Every project starts and ends with people.',
  },
  {
    icon: <Lightbulb size={22} fill="currentColor" />,
    title: 'Expert Knowledge',
    description:
      'Our team brings deep sector expertise and genuine passion for the built environment. We stay at the forefront of industry best practice.',
  },
  {
    icon: <Handshake size={22} fill="currentColor" />,
    title: 'Trusted Partners',
    description:
      'We build long-term relationships with clients, communities, and stakeholders built on honesty, reliability, and results.',
  },
];


export default function AboutUsPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    setPageSEO({
      title: 'About Queenswood | Award-Winning Infrastructure Engagement Consultancy UK',
      description:
        'Meet the Queenswood team — award-winning community and stakeholder engagement specialists with a proven track record on HS2, National Highways, Crossrail, Thames Water and more.',
      canonical: `${SITE_URL}/about-us`,
      keywords: 'about Queenswood, Queenswood team, infrastructure engagement consultancy, award-winning engagement, community engagement specialists UK',
      structuredData: [organizationSchema, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'About Us', url: '/about-us' }])],
    });

    supabase
      .from('team_members')
      .select('*')
      .order('order_index', { ascending: true })
      .then(({ data }) => {
        if (data) setTeam(data);
      });
  }, []);

  return (
    <div className="bg-navy-950 pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.04]" style={{ background: '#fff100' }} />
        </div>
        <div className="section-container">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-gold-500 text-xs uppercase tracking-[0.25em] font-medium mb-4">
              Peace Keepers
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-cream leading-tight mb-8">
              Award-Winning Infrastructure Engagement Consultancy
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-12">
              We are Queenswood — a specialist community and stakeholder engagement consultancy
              working exclusively within the UK infrastructure sector. We build social licence to
              operate, earn trust in the built environment, and help major programmes succeed.
            </p>
          </div>

        </div>
      </section>

      {/* Mission */}
      <section className="py-20 md:py-32 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal from="left">
              <div className="space-y-6">
                <p className="text-gold-500 text-xs uppercase tracking-[0.2em] font-medium">
                  Our Mission
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-cream leading-tight">
                  Building trust between infrastructure and communities
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  With extensive experience spanning major UK projects including HS2, National
                  Highways, Crossrail, and Thames Water programmes, we bridge the gap between
                  infrastructure developers and the communities they impact.
                </p>
                <p className="text-slate-400 text-base leading-relaxed">
                  Our approach is rooted in genuine care for people and places. We don't just
                  tick boxes — we build real relationships, listen to real concerns, and help
                  projects earn the social licence to operate that makes the difference between
                  conflict and consent.
                </p>

                {/* Pull quote */}
                <div className="relative pl-6 border-l-2 mt-8" style={{ borderColor: '#2D2D2D' }}>
                  <Quote size={20} className="mb-2" style={{ color: '#2D2D2D' }} />
                  <p className="text-cream font-display text-lg italic leading-relaxed">
                    "We believe great engagement transforms infrastructure from something that happens
                    to communities, into something that happens with them."
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal from="right">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl p-6 border border-gold-600" style={{ backgroundColor: '#fff100' }}>
                    <p className="font-display text-4xl mb-2" style={{ color: '#2D2D2D' }}>629k+</p>
                    <p className="text-sm" style={{ color: '#2D2D2D' }}>Stakeholders engaged across all projects</p>
                  </div>
                  <div className="rounded-xl p-6 border border-gold-600" style={{ backgroundColor: '#fff100' }}>
                    <p className="font-display text-4xl mb-2" style={{ color: '#2D2D2D' }}>10+</p>
                    <p className="text-sm" style={{ color: '#2D2D2D' }}>Active infrastructure projects</p>
                  </div>
                  <div className="rounded-xl p-6 border border-gold-600" style={{ backgroundColor: '#fff100' }}>
                    <p className="font-display text-4xl mb-2" style={{ color: '#2D2D2D' }}>2</p>
                    <p className="text-sm" style={{ color: '#2D2D2D' }}>Major industry awards won</p>
                  </div>
                  <div className="rounded-xl p-6 border border-gold-600" style={{ backgroundColor: '#fff100' }}>
                    <p className="font-display text-4xl mb-2" style={{ color: '#2D2D2D' }}>100%</p>
                    <p className="text-sm" style={{ color: '#2D2D2D' }}>Infrastructure sector focus</p>
                  </div>
                </div>

                {/* Featured project image */}
                <div className="relative rounded-2xl overflow-hidden border border-navy-800 aspect-video">
                  <iframe
                    src="https://streamable.com/e/26ca2g"
                    title="Featured Project — SESRO Oxford Water Project"
                    allow="fullscreen; autoplay"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ border: 'none', display: 'block' }}
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-container bg-navy-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14">
            <SectionHeader
              strapline="The People"
              heading="Our Team"
              subtitle="Experienced, passionate specialists who bring knowledge and care to every project."
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
            {team.map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Our Story — two-col split with image */}
      <section className="py-20 md:py-28 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal from="right">
              <div className="relative">
                <div className="grid grid-cols-2 gap-3">
                  <img
                    src="/images/projects/m62-junctions.jpg"
                    alt="M62 junctions engagement"
                    className="rounded-xl border border-navy-800 w-full aspect-[3/4] object-cover"
                    loading="lazy"
                  />
                  <div className="flex flex-col gap-3 pt-6">
                    <img
                      src="/images/projects/land-prog.jpg"
                      alt="Land programme community liaison"
                      className="rounded-xl border border-navy-800 w-full aspect-square object-cover"
                      loading="lazy"
                    />
                    <div className="rounded-xl border border-gold-600/20 p-4 flex flex-col gap-1" style={{ backgroundColor: '#fff100' }}>
                      <p className="font-display text-3xl text-gold-500">15+</p>
                      <p className="text-slate-400 text-xs">Years of combined senior expertise</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal from="left">
              <div className="space-y-6">
                <p className="text-gold-500 text-xs uppercase tracking-[0.2em] font-medium">
                  Our Story
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-cream leading-tight">
                  Born from a passion for people and infrastructure
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  Queenswood was founded with a single purpose: to change the way infrastructure
                  projects relate to the communities they work in. Too often, engagement is treated
                  as a box-ticking exercise. We believed — and still believe — it can be something
                  genuinely transformative.
                </p>
                <p className="text-slate-400 text-base leading-relaxed">
                  Since our founding, we've worked on some of the UK's most complex and
                  high-profile programmes. From HS2 to the Lower Thames Crossing, from Thames Water
                  to Devon County Council — our team has consistently delivered engagement that
                  makes a real difference.
                </p>
                <Link to="/our-work" className="inline-flex items-center gap-2 text-gold-500 text-sm font-medium hover:text-gold-400 transition-colors mt-2">
                  See our work <ArrowRight size={14} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section-container bg-navy-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <SectionHeader
              strapline="Recognition"
              heading="Award-Winning Engagement"
              align="center"
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <ScrollReveal className="flex-1 flex items-center justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2F45793e580be94605afaa31ddef2989fc?format=webp&width=800&height=1200"
                alt="2023 Workforce CN Awards Winner"
                style={{ height: '200px', width: '100%', objectFit: 'contain' }}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1} className="flex-1 flex items-center justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2Fe6d9a309ac0842fb985ad46c21d87ec1?format=webp&width=800&height=1200"
                alt="HS2 Inspiration Awards"
                style={{ height: '200px', width: '100%', objectFit: 'contain' }}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2} className="flex-1 flex items-center justify-center">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2F99995b73e05d4f0d83c554f2099fc850?format=webp&width=800&height=1200"
                alt="Digital Construction Awards Winner Digital Consultancy of the year 2024"
                style={{ height: '200px', width: '100%', objectFit: 'contain' }}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-container bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14">
            <SectionHeader
              strapline="What Drives Us"
              heading="Our Values"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <ScrollReveal key={value.title} delay={index * 0.1}>
                <div className="card-hover group flex flex-col gap-4 h-full">
                  <ServiceIcon>{value.icon}</ServiceIcon>
                  <h3 className="font-display text-xl text-cream">{value.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-24 bg-navy-950 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
              Join the Queenswood Team
            </h2>
            <p className="text-slate-400 mb-8">
              We're always looking for passionate people who share our commitment to communities
              and the built environment.
            </p>
            <Link to="/careers" className="btn-primary inline-flex items-center gap-2">
              View Careers <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const [hovered, setHovered] = useState(false);
  const hasPhoto = !!(member.image_url);
  const hasHover = !!(member.hover_image_url);
  const hasProfile = !!(member.slug);

  const cardContent = (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy-800 bg-navy-900 hover:border-gold-600/50 transition-all duration-400 cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ animationDelay: `${index * 0.04}s` }}
    >
      {/* Photo area */}
      <div className="relative aspect-[3/4] bg-navy-800 overflow-hidden">
        {hasPhoto ? (
          <>
            <img
              src={member.image_url}
              alt={member.name}
              className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${
                hovered && hasHover ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
            />
            {hasHover && (
              <img
                src={member.hover_image_url}
                alt={member.name}
                className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${
                  hovered ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950">
            <span className="font-display text-5xl text-gold-500/60 select-none">
              {getInitials(member.name)}
            </span>
          </div>
        )}

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* View profile pill */}
        {hasProfile && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span className="bg-gold-600 text-black text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
              View Profile
            </span>
          </div>
        )}
      </div>

      {/* Name & role */}
      <div className="p-4 flex flex-col gap-1">
        <p className="text-cream text-sm font-semibold leading-tight">{member.name}</p>
        <p className="text-gold-500 text-xs">{member.role}</p>
      </div>
    </div>
  );

  if (hasProfile) {
    return (
      <ScrollReveal delay={index * 0.03}>
        <Link to={`/team/${member.slug}`} className="block">
          {cardContent}
        </Link>
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal delay={index * 0.03}>
      {cardContent}
    </ScrollReveal>
  );
}
