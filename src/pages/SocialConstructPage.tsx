import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Mic, Heart, Building2, Target } from '@/components/ui/MaterialIcon';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { setPageSEO, SITE_URL, organizationSchema, breadcrumbSchema } from '@/lib/seo';
import { supabase } from '@/lib/supabase';

const ServiceIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
    style={{ background: '#fff100', border: '1px solid rgba(255,255,255,0.15)', color: '#0d1b2e', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
    {children}
  </div>
);

const tickerItems = [
  'BRAND AWARENESS',
  'ATTRACTING TALENT',
  'EDUCATION',
  'INCREASED DIVERSITY',
  'INDUSTRY THOUGHT LEADERSHIP',
  'EMPLOYER BRANDING',
];

const pillars = [
  {
    icon: <Target size={22} fill="currentColor" />,
    title: 'Career Awareness',
    description:
      "We're changing the narrative on how the younger generations view construction, showcasing the vast range of exciting, well-paid, and fulfilling careers the industry has to offer.",
  },
  {
    icon: <BookOpen size={22} fill="currentColor" />,
    title: 'Learn & Earn',
    description:
      'We help educate younger audiences on the diverse range of careers within construction — from engineering and project management to digital and sustainability roles.',
  },
  {
    icon: <Mic size={22} fill="currentColor" />,
    title: 'Real Talk',
    description:
      'By featuring interviews with construction executives and day-in-the-life experiences, we give young people an authentic, unfiltered view of what working in construction is really like.',
  },
  {
    icon: <Heart size={22} fill="currentColor" />,
    title: 'Increased Diversity',
    description:
      'Our content is designed to resonate with individuals from all backgrounds, ethnicities, and genders, helping construction shed outdated perceptions and attract diverse talent.',
  },
  {
    icon: <Building2 size={22} fill="currentColor" />,
    title: 'Construction Branding',
    description:
      'Construction companies will increase their visibility among younger demographics through association with Social Construct — a fresh, authentic voice the next generation trusts.',
  },
  {
    icon: <Users size={22} fill="currentColor" />,
    title: 'Attracting Talent',
    description:
      'Our engaging content directly targets young, diverse talent at the stage when they are making career decisions — creating a pipeline of motivated future professionals.',
  },
];

export default function SocialConstructPage() {
  const [presenterImage, setPresenterImage] = useState('');

  useEffect(() => {
    setPageSEO({
      title: 'Social Construct | Young People in Construction | Queenswood Initiative',
      description:
        'Social Construct is a Queenswood initiative raising awareness of opportunities for young people in the UK construction industry, through engaging content with presenter Alex Teniola.',
      canonical: `${SITE_URL}/social-construct`,
      keywords: 'Social Construct, young people in construction, construction careers UK, infrastructure careers, diverse talent construction, Alex Teniola',
      structuredData: [organizationSchema, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Social Construct', url: '/social-construct' }])],
    });

    supabase
      .from('settings')
      .select('value')
      .eq('key', 'social_construct_presenter_image')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setPresenterImage(data.value);
      });
  }, []);

  return (
    <div className="bg-navy-950 pt-20">
      {/* Hero */}
      <section className="section-container bg-navy-950 text-center relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500 rounded-full blur-[150px]" />
        </div>
        <ScrollReveal>
          <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-gold-600/10 border border-gold-600/30 text-gold-400 text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8 font-medium">
              A Queenswood Initiative
            </div>
            <div className="flex justify-center mb-12">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2F28115666c5234bdc96f3627fbdbd13d0?format=webp&width=800&height=1200"
                alt="Social Construct Logo"
                className="h-auto w-full"
                style={{ maxWidth: '380px' }}
              />
            </div>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              A new initiative aimed at raising awareness of the opportunities and benefits for young
              people joining the UK construction industry.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Ticker */}
      <section className="bg-gold-600 py-4 overflow-hidden">
        <div className="flex whitespace-nowrap">
          <div
            className="flex gap-8 flex-shrink-0 items-center"
            style={{ animation: 'tickerScroll 20s linear infinite' }}
          >
            {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="font-display text-sm uppercase tracking-[0.2em] font-bold px-4"
                style={{ color: '#000000' }}
              >
                {item} ·
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes tickerScroll {
            from { transform: translateX(0); }
            to { transform: translateX(-33.333%); }
          }
        `}</style>
      </section>

      {/* What is Social Construct */}
      <section className="py-16 md:py-24 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal from="left">
              <div className="space-y-6">
                <p className="text-gold-500 text-xs uppercase tracking-[0.2em] font-medium">
                  The Initiative
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-cream leading-tight">
                  Changing perceptions of the construction industry
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  Social Construct was born out of a genuine desire to reshape how young people
                  perceive the construction industry. Despite being one of the UK's largest
                  employers, construction struggles to attract diverse, young talent — often
                  suffering from outdated stereotypes and a lack of awareness of the incredible
                  variety of careers available.
                </p>
                <p className="text-slate-400 text-base leading-relaxed">
                  Through engaging social media content, authentic interviews, and real stories
                  from people working in construction, Social Construct aims to change that
                  narrative — reaching young people where they already are, in the formats they
                  already love.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal from="right">
              <div className="bg-navy-950 rounded-2xl p-8 border border-gold-600/20 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/5 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="w-full rounded-lg mb-8 flex-shrink-0">
                    {presenterImage ? (
                      <img
                        src={presenterImage}
                        alt="Alex Teniola"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2F2e344eb562894452a338e445595a8d88?format=webp&width=800&height=1200"
                        alt="Alex Teniola"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="text-gold-500 text-xs uppercase tracking-widest font-medium mb-3">
                    Meet the Presenter
                  </p>
                  <h3 className="font-display text-2xl text-cream mb-3">Alex Teniola</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Alex Teniola, a presenter and semi-professional footballer, aims to reshape
                    perceptions of the construction industry as co-founder of the Social Construct
                    campaign. He creates engaging content to attract diverse young talent to
                    rewarding construction careers, showcasing real stories and experiences to
                    empower the next generation both in sports and beyond.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    <span className="bg-navy-800 text-slate-300 text-xs px-3 py-1 rounded-full">
                      Presenter
                    </span>
                    <span className="bg-navy-800 text-slate-300 text-xs px-3 py-1 rounded-full">
                      Semi-Pro Footballer
                    </span>
                    <span className="bg-navy-800 text-slate-300 text-xs px-3 py-1 rounded-full">
                      Co-Founder
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Content pillars */}
      <section className="section-container bg-navy-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14">
            <SectionHeader
              strapline="Content Strategy"
              heading="Six Content Pillars"
              subtitle="Our content strategy is built around six key pillars that together create a comprehensive, effective campaign to attract young talent to construction."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, index) => (
              <ScrollReveal key={pillar.title} delay={index * 0.08}>
                <div className="card-hover group h-full flex flex-col gap-4">
                  <ServiceIcon>{pillar.icon}</ServiceIcon>
                  <h3 className="font-display text-xl text-cream">{pillar.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">
                    {pillar.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-24 bg-navy-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <p className="text-gold-500 text-xs uppercase tracking-widest font-medium mb-4">
              Where to Find Us
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-cream mb-8">
              Follow Social Construct
            </h2>
            <p className="text-slate-300 text-lg mb-16 leading-relaxed">
              Find us on TikTok and Instagram for engaging, authentic content about careers in
              the UK construction industry. Hit follow to stay updated with the latest videos,
              interviews, and stories.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
              <a
                href="https://tiktok.com/@socialconstruct"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-gold-600/30 hover:border-gold-600 hover:bg-gold-600/5 transition-all duration-300 group"
                aria-label="Follow on TikTok"
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2F40ba5980108749e2af5db6e5fb8557d1?format=webp&width=800&height=1200"
                  alt="TikTok"
                  className="h-32 w-auto group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-gold-500 font-semibold text-lg">TikTok</span>
              </a>
              <a
                href="https://instagram.com/socialconstruct"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-4 p-8 rounded-2xl border border-gold-600/30 hover:border-gold-600 hover:bg-gold-600/5 transition-all duration-300 group"
                aria-label="Follow on Instagram"
              >
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2F2ff446a1a2f24b2eaab3e1af40ad525e?format=webp&width=800&height=1200"
                  alt="Instagram"
                  className="h-32 w-auto group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-gold-500 font-semibold text-lg">Instagram</span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-24 bg-navy-950 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
              Partner with Social Construct
            </h2>
            <p className="text-slate-400 mb-8">
              Are you a construction company looking to boost your employer brand and attract
              young talent? Get in touch to discuss how Social Construct can help.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2 text-base px-10 py-4">
              Get Involved <ArrowRight size={18} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
