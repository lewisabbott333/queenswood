import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Users, Clock, Building2 } from '@/components/ui/MaterialIcon';
import { supabase } from '@/lib/supabase';
import type { CaseStudy } from '@/lib/supabase';
import { setPageSEO, breadcrumbSchema, articleSchema, caseStudySchema, SITE_URL } from '@/lib/seo';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { caseStudies } from '@/pages/OurWorkPage';

const staticData: Record<string, Partial<CaseStudy> & { stats: { events: string; stakeholders: string; duration: string }; image: string; sector: string; client: string }> = {
  'national-highways-concrete-roads': {
    title: 'National Highways Concrete Roads Programme',
    client: 'Sisk / National Highways',
    sector: 'Transport',
    image: '/images/projects/22-road.jpg',
    summary: 'Delivering comprehensive community and stakeholder engagement for the National Highways Concrete Roads resurfacing programme across multiple sites in England.',
    body: 'Queenswood was appointed to deliver the community and stakeholder engagement programme for the National Highways Concrete Roads Programme — a major investment in the strategic road network. Working across multiple sites simultaneously, our team developed and implemented a comprehensive engagement strategy that kept communities informed, minimised disruption concerns, and built confidence in National Highways\' approach to managing the works.\n\nOur work included developing bespoke communication materials for each work site, managing a dedicated stakeholder helpline, coordinating with local authorities and elected representatives, and producing regular newsletter updates for affected residents and businesses.\n\nThe programme required sensitivity and adaptability as work schedules changed, and our team consistently delivered timely, accurate communications that reflected the project\'s commitment to transparency.',
    stats: { events: '24', stakeholders: '45,000+', duration: '18 months' },
  },
  'hs2-phase-1': {
    title: 'High Speed 2 Phase 1',
    client: 'SCS JV, Align JV and EKFB JV',
    sector: 'Transport',
    image: '/images/projects/hs1.jpg',
    summary: 'Providing embedded community and stakeholder engagement resource across three major HS2 Phase 1 joint ventures, covering the full route from London to Birmingham.',
    body: 'Queenswood provided extensive embedded community engagement resource across the HS2 Phase 1 main works contracts — SCS JV, Align JV, and EKFB JV. This was one of our largest and most complex commissions, requiring expert consultants embedded within joint venture teams across the entire Phase 1 route.\n\nOur consultants managed the day-to-day community interface, responding to concerns, facilitating information events, managing the community helpline, and coordinating with HS2 Ltd\'s own engagement team. We were instrumental in producing engagement plans, chairing community forums, and managing the complex relationships with parish councils, residents\' groups, and individual landowners.\n\nThe HS2 Phase 1 engagement programme won the HS2 Inspiration Award 2022 for Outstanding Community & Stakeholder Engagement.',
    stats: { events: '180+', stakeholders: '200,000+', duration: '4 years' },
  },
  'hs2-phase-2b': {
    title: 'High Speed 2 Phase 2b',
    client: 'Bechtel',
    sector: 'Transport',
    image: '/images/projects/new21-road.jpg',
    summary: 'Supporting Bechtel with stakeholder engagement during the Phase 2b development phase, from Crewe to Manchester and Birmingham to Leeds.',
    body: 'Queenswood supported Bechtel during the HS2 Phase 2b early development stage, providing specialist stakeholder engagement consultancy. Our team developed a comprehensive stakeholder engagement strategy for the Phase 2b route, covering the complex landscape of communities along the proposed route from Crewe to Manchester and the West Midlands to Leeds.\n\nWe conducted stakeholder mapping exercises, developed engagement frameworks, and advised on best practice approaches for managing the highly sensitive community interface on this controversial but nationally significant project. Our work helped Bechtel demonstrate a robust approach to community relations during the development phase.',
    stats: { events: '35', stakeholders: '80,000+', duration: '12 months' },
  },
  'old-street-roundabout': {
    title: 'Old Street Roundabout',
    client: 'Morgan Sindall / Transport for London',
    sector: 'Transport',
    image: '/images/projects/old-street-junction-improv.jpg',
    summary: 'Managing community and stakeholder engagement for the major transformation of Old Street Roundabout in the heart of London\'s tech city.',
    body: 'Old Street Roundabout — the symbolic heart of London\'s Silicon Roundabout tech hub — underwent a major transformation. Queenswood delivered the community and stakeholder engagement programme for Morgan Sindall and Transport for London throughout the construction phase.\n\nWorking in one of London\'s most densely populated and commercially active areas required exceptional sensitivity. Our team maintained daily dialogue with adjacent businesses, residents, and community organisations, managing concerns about noise, dust, access disruption, and construction impacts on local trade.\n\nWe produced regular stakeholder newsletters, managed public facing communication channels, coordinated with local ward councillors and the City of London, and ran community information sessions to keep stakeholders informed of programme changes.',
    stats: { events: '28', stakeholders: '15,000+', duration: '24 months' },
  },
  'm621-junctions': {
    title: 'M621 Junctions 1-7',
    client: 'Keltbray / National Highways',
    sector: 'Transport',
    image: '/images/projects/m62-junctions.jpg',
    summary: 'Community engagement for the M621 smart motorway improvement scheme across junctions 1-7 in West Yorkshire.',
    body: 'Queenswood provided community and stakeholder engagement services for the M621 Junctions 1-7 improvement scheme in West Yorkshire, working alongside Keltbray for National Highways. The M621 is one of the UK\'s busiest urban motorways, serving as a key route around Leeds city centre.\n\nOur engagement programme covered residential and business communities adjacent to the motorway, local authorities, elected representatives across multiple constituencies, and specialist interest groups. We developed location-specific communication plans for each junction area, reflecting the different communities and concerns at each location.',
    stats: { events: '18', stakeholders: '25,000+', duration: '20 months' },
  },
  'devon-bus-bsip': {
    title: 'Devon Bus Service Improvement Plan',
    client: 'Devon County Council',
    sector: 'Transport',
    image: '/images/projects/devon.jpg',
    summary: 'Delivering public engagement and consultation for Devon County Council\'s Bus Service Improvement Plan, helping shape the future of public transport across the county.',
    body: 'Queenswood was commissioned by Devon County Council to deliver public engagement for its Bus Service Improvement Plan (BSIP) — a government-funded programme to improve local bus services across the county.\n\nWith Devon being one of England\'s largest and most rural counties, reaching diverse communities — from urban Exeter to remote rural villages — required a creative, multi-channel approach. Our team designed and delivered a public engagement programme that captured the views of thousands of Devon residents on local bus services.\n\nWe created digital engagement tools, online surveys, in-person pop-up events in market towns and village halls, and accessible materials for older and digitally-excluded communities. The insights gathered directly informed the Council\'s BSIP submission to government.',
    stats: { events: '42', stakeholders: '12,000+', duration: '8 months' },
  },
  'crossrail-2': {
    title: 'Crossrail 2',
    client: 'Transport for London',
    sector: 'Transport',
    image: '/images/projects/crossrail.jpg',
    summary: 'Supporting Transport for London with stakeholder engagement during the Crossrail 2 development and public consultation phase.',
    body: 'Queenswood supported Transport for London during the development phase of Crossrail 2 — the proposed new rail line running through London from Surrey to Hertfordshire. We provided specialist stakeholder engagement resource to support TfL\'s public consultation and development consent order preparation.\n\nOur team managed relationships with affected businesses and property owners along the proposed route, coordinated stakeholder briefings for local authorities and MPs, and supported the production of public consultation materials. We also provided insight into best practice engagement approaches based on lessons learned from HS2 and other major schemes.',
    stats: { events: '56', stakeholders: '60,000+', duration: '18 months' },
  },
  'thames-water-strategic-resource-options': {
    title: 'Thames Water Strategic Resource Options',
    client: 'Strategic Resource Options',
    sector: 'Water',
    image: '/images/projects/sesro-cgi.jpg',
    summary: 'Delivering stakeholder engagement for the strategic water resource options programme, engaging communities on proposed new reservoirs and water transfer schemes.',
    body: 'Queenswood was engaged to support the Strategic Resource Options (SRO) programme — a major initiative to secure water resources for the South East of England over the coming decades. The programme explores options including a new reservoir at Abingdon, water recycling schemes, and transfers.\n\nOur team developed and implemented a comprehensive stakeholder engagement programme, engaging with communities along potential route corridors, landowners, environmental organisations, local authorities, and national bodies. The work involved significant agricultural liaison as proposed routes passed through predominantly rural areas.\n\nWe supported the statutory consultation process and helped demonstrate genuine public engagement to Ofwat and the Planning Inspectorate.',
    stats: { events: '38', stakeholders: '30,000+', duration: '30 months' },
  },
  'hs2-phase-2a': {
    title: 'High Speed 2 Phase 2a',
    client: 'Balfour Beatty',
    sector: 'Transport',
    image: '/images/projects/land-prog.jpg',
    summary: 'Providing agricultural liaison and community engagement services for Balfour Beatty on HS2 Phase 2a, from the West Midlands to Crewe.',
    body: 'Queenswood provided specialist agricultural liaison and community engagement services to Balfour Beatty on HS2 Phase 2a — the extension of HS2 from the West Midlands to Crewe. This section of the route passes through substantial areas of agricultural land and rural communities in Staffordshire and Cheshire.\n\nOur agricultural liaison officers worked directly with farming businesses affected by the route corridor, managing issues including access routes, compensation claims, drainage impacts, and the management of construction traffic. We built trusted relationships with farming families who were understandably anxious about the impact on their livelihoods.\n\nAlongside the agricultural work, we managed the broader community engagement programme, engaging with village communities, parish councils, and individual residents along the route.',
    stats: { events: '62', stakeholders: '40,000+', duration: '36 months' },
  },
  'lower-thames-crossing': {
    title: 'Lower Thames Crossing',
    client: 'CASCADE JV',
    sector: 'Transport',
    image: '/images/projects/lower-thames-crossing.jpg',
    summary: 'Supporting CASCADE JV with community and stakeholder engagement for the Lower Thames Crossing — one of the UK\'s biggest road infrastructure projects.',
    body: 'The Lower Thames Crossing is one of the most ambitious road projects in UK history — a new crossing of the River Thames east of London, designed to relieve pressure on the existing Dartford Crossing. Queenswood supported CASCADE JV\'s engagement programme during the development consent order application process.\n\nThe project crosses communities in Essex and Kent, including rural villages, suburban areas, and environmentally sensitive landscapes. Our team developed and delivered targeted engagement programmes for communities along both the Essex and Kent approaches, managing complex relationships with a wide range of stakeholders from parish councils to major logistics businesses.\n\nWe produced accessible information materials, managed public information events, supported the DCO consultation process, and helped CASCADE demonstrate a genuine commitment to community engagement to the Planning Inspectorate.',
    stats: { events: '45', stakeholders: '55,000+', duration: '24 months' },
  },
};

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);

  const staticItem = slug ? staticData[slug] : null;
  const relatedProjects = caseStudies.filter((cs) => cs.slug !== slug).slice(0, 3);

  useEffect(() => {
    if (!slug) return;

    const fetchCaseStudy = async () => {
      try {
        const { data } = await supabase
          .from('case_studies')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();
        if (data) setCaseStudy(data);
      } catch {
        // fallback to static data
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
  }, [slug]);

  useEffect(() => {
    const title = caseStudy?.title ?? staticItem?.title ?? 'Case Study';
    const description = caseStudy?.summary ?? staticItem?.summary ?? '';
    const image = caseStudy?.hero_image ?? staticItem?.image;

    setPageSEO({
      title: `${title} | Queenswood Engagement`,
      description,
      canonical: `${SITE_URL}/our-work/${slug}`,
      ogImage: image,
      ogType: 'article',
      keywords: `${title}, case study, community engagement, stakeholder engagement, infrastructure project UK`,
      structuredData: [
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Our Work', url: '/our-work' },
          { name: title, url: `/our-work/${slug}` },
        ]),
        caseStudySchema({
          headline: `${title} | Queenswood Engagement`,
          description,
          image,
          client: caseStudy?.client ?? staticItem?.client ?? '',
          url: `/our-work/${slug}`,
          datePublished: caseStudy?.published_at ?? new Date().toISOString(),
        }),
      ],
    });

    if (title && description) {
      const ldScript = document.querySelector('script[id="article-ld"]') as HTMLScriptElement | null;
      const script = ldScript ?? document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'article-ld';
      script.textContent = JSON.stringify(
        articleSchema({
          headline: title,
          description,
          image,
          datePublished: caseStudy?.published_at ?? new Date().toISOString(),
          url: `https://wearequeenswood.com/our-work/${slug}`,
        })
      );
      if (!ldScript) document.head.appendChild(script);
    }
  }, [caseStudy, staticItem, slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const title = caseStudy?.title ?? staticItem?.title ?? 'Case Study';
  const client = caseStudy?.client ?? staticItem?.client ?? '';
  const sector = caseStudy?.sector ?? staticItem?.sector ?? '';
  const heroImage = caseStudy?.hero_image ?? staticItem?.image ?? '';
  const summary = caseStudy?.summary ?? staticItem?.summary ?? '';
  const body = caseStudy?.body ?? staticItem?.body ?? '';
  const stats = staticItem?.stats ?? { events: '—', stakeholders: '—', duration: '—' };

  type BodyBlock = { type: 'h1' | 'h2'; text: string } | { type: 'ul'; items: string[] } | { type: 'image'; src: string; alt: string } | { type: 'p'; text: string };
  const bodyParagraphs: BodyBlock[] = [];
  const _lines = body.split('\n');
  let _i = 0;
  while (_i < _lines.length) {
    const _line = _lines[_i].trim();
    if (!_line) { _i++; continue; }
    if (_line.startsWith('# ')) { bodyParagraphs.push({ type: 'h1', text: _line.replace(/^# /, '') }); _i++; continue; }
    if (_line.startsWith('## ')) { bodyParagraphs.push({ type: 'h2', text: _line.replace(/^## /, '') }); _i++; continue; }
    const _img = _line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (_img) { bodyParagraphs.push({ type: 'image', alt: _img[1] || '', src: _img[2] }); _i++; continue; }
    if (_line.startsWith('- ')) {
      const items: string[] = [];
      while (_i < _lines.length && _lines[_i].trim().startsWith('- ')) { items.push(_lines[_i].trim().replace(/^- /, '')); _i++; }
      bodyParagraphs.push({ type: 'ul', items }); continue;
    }
    const pLines: string[] = [];
    while (_i < _lines.length && _lines[_i].trim() && !_lines[_i].trim().startsWith('# ') && !_lines[_i].trim().startsWith('## ') && !_lines[_i].trim().startsWith('- ') && !_lines[_i].trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/)) { pLines.push(_lines[_i].trim()); _i++; }
    if (pLines.length) bodyParagraphs.push({ type: 'p', text: pLines.join(' ') });
  }

  return (
    <div className="bg-navy-950 pt-20">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <img
          src={heroImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-12 w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link to="/" className="hover:text-gold-500 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/our-work" className="hover:text-gold-500 transition-colors">
              Our Work
            </Link>
            <span>/</span>
            <span className="text-cream">{title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-gold-600/20 text-gold-400 text-xs px-3 py-1 rounded-full uppercase tracking-widest border border-gold-600/30">
              {sector}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream max-w-3xl leading-tight">
            {title}
          </h1>
          <p className="text-gold-400 text-sm mt-3 flex items-center gap-2">
            <Building2 size={14} />
            {client}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy-900 border-y border-navy-800 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-navy-700">
            <div className="flex flex-col items-center text-center px-6">
              <Users size={20} className="text-gold-500 mb-2" />
              <span className="font-display text-2xl md:text-3xl text-gold-400">{stats.stakeholders}</span>
              <span className="text-slate-500 text-xs uppercase tracking-widest mt-1">Stakeholders Reached</span>
            </div>
            <div className="flex flex-col items-center text-center px-6">
              <Calendar size={20} className="text-gold-500 mb-2" />
              <span className="font-display text-2xl md:text-3xl text-gold-400">{stats.events}</span>
              <span className="text-slate-500 text-xs uppercase tracking-widest mt-1">Engagement Events</span>
            </div>
            <div className="flex flex-col items-center text-center px-6">
              <Clock size={20} className="text-gold-500 mb-2" />
              <span className="font-display text-2xl md:text-3xl text-gold-400">{stats.duration}</span>
              <span className="text-slate-500 text-xs uppercase tracking-widest mt-1">Project Duration</span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section-container bg-navy-950">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 font-display italic">
              {summary}
            </p>
          </ScrollReveal>
          <div className="flex flex-col gap-6">
            {bodyParagraphs.map((block, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                {block.type === 'h1' && (
                  <h2 className="font-display text-2xl md:text-3xl text-cream mt-6">{block.text}</h2>
                )}
                {block.type === 'h2' && (
                  <h3 className="font-display text-xl text-cream mt-4">{block.text}</h3>
                )}
                {block.type === 'image' && (
                  <figure className="my-4">
                    <img src={block.src} alt={block.alt} className="w-full rounded-xl border border-navy-800 object-cover max-h-96" loading="lazy" />
                    {block.alt && <figcaption className="text-slate-500 text-xs text-center mt-2">{block.alt}</figcaption>}
                  </figure>
                )}
                {block.type === 'ul' && (
                  <ul className="flex flex-col gap-2 pl-4">
                    {block.items.map((item, j) => (
                      <li key={j} className="text-slate-400 text-base leading-relaxed flex items-start gap-2">
                        <span className="text-gold-500 mt-1.5 flex-shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {block.type === 'p' && (
                  <p className="text-slate-400 text-base leading-relaxed">{block.text}</p>
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Related projects */}
      <section className="section-container bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl text-cream mb-10">Related Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((project, index) => (
              <ScrollReveal key={project.slug} delay={index * 0.1}>
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
                  <div className="photo-overlay absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-black/80 text-xs mb-1">{project.client}</p>
                    <h3 className="text-black font-display text-sm leading-snug">{project.title}</h3>
                    <div className="flex items-center gap-2 text-black text-xs mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <span>View</span>
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-10">
            <Link
              to="/our-work"
              className="inline-flex items-center gap-2 text-gold-500 text-sm hover:text-gold-400 transition-colors"
            >
              <ArrowLeft size={14} /> Back to All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
