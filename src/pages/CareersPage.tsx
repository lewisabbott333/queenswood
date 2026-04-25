import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Globe, Clock, ArrowRight, MapPin } from '@/components/ui/MaterialIcon';
import { supabase } from '@/lib/supabase';
import type { JobPosting } from '@/lib/supabase';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { setPageSEO, jobPostingSchema, SITE_URL, organizationSchema, breadcrumbSchema } from '@/lib/seo';

const ServiceIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
    style={{ background: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', color: '#0d1b2e', boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
    {children}
  </div>
);

const checklist = [
  'Passionate about communities and the built environment',
  'A great communicator — written and verbal',
  'Adaptable and composed under pressure',
  'Detail-oriented with a keen eye for accuracy',
  'A collaborative team player',
  'Self-motivated and personally accountable',
];

const benefits = [
  {
    icon: <Globe size={22} fill="currentColor" />,
    title: 'High-Profile Projects',
    description:
      'Work on some of the UK\'s most significant and exciting infrastructure programmes — from HS2 to Thames Water.',
  },
  {
    icon: <Briefcase size={22} fill="currentColor" />,
    title: 'Make a Real Difference',
    description:
      'Your work will directly shape how communities experience infrastructure development. The impact is real and lasting.',
  },
  {
    icon: <Clock size={22} fill="currentColor" />,
    title: 'Flexible Working',
    description:
      'We understand that great work happens in many places. We offer flexible working arrangements that suit you and our clients.',
  },
];

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageSEO({
      title: 'Careers | Join Queenswood Engagement | Infrastructure Consultancy Jobs UK',
      description:
        'Join the Queenswood team — specialist community and stakeholder engagement consultants. We\'re always looking for passionate people who care about communities and infrastructure.',
      canonical: `${SITE_URL}/careers`,
      keywords: 'jobs at Queenswood, engagement consultancy jobs, infrastructure jobs UK, community engagement careers, stakeholder engagement roles',
      structuredData: [organizationSchema, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Careers', url: '/careers' }])],
    });

    const fetchJobs = async () => {
      try {
        const { data } = await supabase
          .from('job_postings')
          .select('*')
          .eq('active', true)
          .order('posted_at', { ascending: false });
        if (data) setJobs(data);
      } catch {
        // no-op
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-navy-950 pt-20">
      {/* Hero */}
      <section className="relative section-container overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 to-navy-950" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold-500 text-xs uppercase tracking-[0.25em] font-medium mb-4">
            Join Us
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-cream leading-tight mb-6">
            Looking for Doers
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            We're always looking out for dynamic people who are as passionate about building
            trust in communities as we are.
          </p>
        </div>
      </section>

      {/* "It takes a special type of person" */}
      <section className="py-16 md:py-24 bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal from="left">
              <div>
                <p className="text-gold-500 text-xs uppercase tracking-[0.2em] font-medium mb-4">
                  What We Look For
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-cream mb-6 leading-tight">
                  It takes a special type of person
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Queenswood consultants work on some of the UK's most high-profile and complex
                  infrastructure programmes. It's demanding, varied, and genuinely rewarding work.
                  Here's what we look for in our team.
                </p>
                <ul className="flex flex-col gap-3">
                  {checklist.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-slate-300 text-sm"
                      style={{ animation: `fadeSlideIn 0.5s ease ${index * 0.1}s both` }}
                    >
                      <span className="text-gold-500 flex-shrink-0 mt-0.5 text-lg leading-none">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal from="right">
              <div className="flex flex-col gap-5">
                {/* Photo */}
                <div className="relative rounded-2xl overflow-hidden border border-navy-800 aspect-[16/9]">
                  <img
                    src="/images/projects/old-street-junction-improv.jpg"
                    alt="Queenswood team at work on a major infrastructure project"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#fff100' }}>On site</p>
                    <p className="text-sm font-medium text-white" style={{ border: '1px solid white' }}>Old Street Junction Improvement</p>
                  </div>
                </div>

                {/* Quote */}
                <div className="bg-navy-950 rounded-2xl p-12 border border-navy-800">
                  <p className="text-gold-500 text-xs uppercase tracking-widest mb-4 font-medium">
                    Our Culture
                  </p>
                  <blockquote className="font-display text-xl md:text-2xl text-cream leading-relaxed italic">
                    "We believe that great engagement is an art form. It takes empathy, expertise,
                    and a genuine commitment to people over process."
                  </blockquote>
                  <p className="text-slate-500 text-sm mt-6">— Jack Day, Director</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-container bg-navy-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14">
            <SectionHeader
              strapline="Why Queenswood"
              heading="What We Offer"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <ScrollReveal key={benefit.title} delay={index * 0.1}>
                <div className="card-hover group flex flex-col gap-4 h-full">
                  <ServiceIcon>{benefit.icon}</ServiceIcon>
                  <h3 className="font-display text-xl text-cream">{benefit.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Current Opportunities — only shown when loading or jobs exist */}
      {(loading || jobs.length > 0) && (
        <section className="section-container bg-navy-900">
          <div className="max-w-4xl mx-auto px-6">
            <div className="mb-12">
              <SectionHeader
                strapline="Opportunities"
                heading="Current Vacancies"
                align="left"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {jobs.map((job) => {
                  const schema = jobPostingSchema({
                    title: job.title,
                    description: job.description,
                    location: job.location,
                    salary: job.salary,
                    url: `https://wearequeenswood.com/careers`,
                  });
                  return (
                    <ScrollReveal key={job.id}>
                      <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                      />
                      <div className="card hover:border-gold-600/50 transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-display text-xl text-cream mb-2">{job.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                              {job.department && (
                                <span className="flex items-center gap-1.5">
                                  <Briefcase size={13} className="text-gold-500" fill="currentColor" />
                                  {job.department}
                                </span>
                              )}
                              {job.location && (
                                <span className="flex items-center gap-1.5">
                                  <MapPin size={13} className="text-gold-500" fill="currentColor" />
                                  {job.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1.5">
                                <Clock size={13} className="text-gold-500" fill="currentColor" />
                                {job.type}
                              </span>
                            </div>
                            {job.salary && (
                              <p className="text-gold-500 text-sm mt-2">{job.salary}</p>
                            )}
                            <p className="text-slate-400 text-sm mt-3 leading-relaxed line-clamp-2">
                              {job.description}
                            </p>
                          </div>
                          <Link
                            to="/contact"
                            className="btn-primary text-sm px-6 py-2.5 flex-shrink-0 self-start"
                          >
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-24 bg-navy-950 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
              We want you
            </h2>
            <p className="text-slate-400 mb-8">
              Think you've got what it takes? We'd love to hear from you, even if there's no live
              role that matches your skills right now.
            </p>
            <a
              href="mailto:hello@wearequeenswood.com"
              className="btn-primary inline-flex items-center gap-2"
            >
              hello@wearequeenswood.com <ArrowRight size={16} />
            </a>
          </ScrollReveal>
        </div>
      </section>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
