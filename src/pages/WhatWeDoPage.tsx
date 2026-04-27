import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from '@/components/ui/MaterialIcon';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { setPageSEO, SITE_URL, organizationSchema } from '@/lib/seo';

const services = [
  {
    title: 'Community Engagement',
    description:
      'We connect infrastructure projects with local communities, building relationships built on trust and transparency. Our team brings genuine care and local insight to every project, ensuring communities feel heard and respected throughout the development process. From public information events to door-to-door engagement, we craft approaches that resonate with real people.',
    image: 'https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2F2837ea8672e24da0abb3acc56f30bf30?format=webp&width=800&height=1200',
  },
  {
    title: 'Stakeholder Engagement',
    description:
      'Expert management of complex multi-stakeholder environments, navigating competing interests with skill and sensitivity. We map stakeholder landscapes, identify key influencers, and develop tailored communication strategies that build confidence and consensus. Our consultants are experienced in dealing with elected officials, local authorities, landowners, and campaign groups.',
    image: 'https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2F29e8645ab0814ea9804d7ee19637f550?format=webp&width=800&height=1200',
  },
  {
    title: 'Digital & Visual Storytelling',
    description:
      'Bringing complex infrastructure information to life through compelling visual content. We create animated explainer videos, interactive maps, digital engagement portals, CGI visualisations, and infographics that make technical information accessible to all audiences. Great visual communication reduces fear and builds understanding.',
    image: 'https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2F16e068a4086e4465a5f1ad3c75b30af8?format=webp&width=800&height=1200',
  },
  {
    title: 'Public Consultation',
    description:
      'Rigorous, inclusive consultation processes that exceed regulatory requirements. We design and deliver public consultation events, online surveys, accessible exhibitions, and statutory processes that ensure all voices are heard. Our consultation reports stand up to regulatory scrutiny and demonstrate genuine public engagement.',
    image: 'https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2F78b5bd8373b547d098815b39d7dfd5b9?format=webp&width=800&height=1200',
  },
  {
    title: 'Agricultural Liaison',
    description:
      'Specialist engagement with landowners and farming communities across major linear schemes. Our agricultural liaison officers understand the pressures on farming businesses and work sensitively to minimise disruption, facilitate access, and maintain productive relationships throughout construction and beyond.',
    image: 'https://cdn.builder.io/api/v1/image/assets%2Fea419fe473b04c6393d84a56c2da1348%2Ffa265bcbe95c480da8b530bcd9077e2c?format=webp&width=800&height=1200',
  },
  {
    title: 'Social Value',
    description:
      'Maximising community benefit and social impact from infrastructure investment. We develop Social Value Strategies, coordinate volunteering and skills programmes, monitor and report on social value outcomes, and help clients meet their social value commitments to funders, investors, and regulators.',
    image: '/images/services/service-6.jpg',
  },
];

const faqs = [
  {
    question: 'What is stakeholder engagement and why does it matter for infrastructure?',
    answer:
      'Stakeholder engagement is the process of identifying, communicating with, and involving those affected by or with an interest in an infrastructure project. It matters because infrastructure projects impact communities, businesses, and the environment. Effective engagement reduces opposition, builds consent, meets regulatory requirements, and delivers better project outcomes for everyone.',
  },
  {
    question: 'At what stage of a project should engagement begin?',
    answer:
      'The earlier, the better. Engagement should ideally begin at the project development and route option stages — before decisions are made. Early engagement allows affected communities to meaningfully influence design, reduces costly late-stage objections, and demonstrates a genuine commitment to collaboration. We recommend pre-application engagement as a minimum.',
  },
  {
    question: 'How do you measure the success of a community engagement programme?',
    answer:
      'We measure success through a combination of quantitative metrics (number of stakeholders reached, event attendance, survey response rates, consultation responses) and qualitative indicators (sentiment tracking, media coverage, level of community opposition or support, regulatory feedback). We provide regular reporting dashboards and end-of-project evaluation reports.',
  },
  {
    question: 'Can you work alongside existing project teams and other consultants?',
    answer:
      'Absolutely. We frequently embed our consultants within client project teams and work collaboratively with engineers, environmental consultants, PR agencies, and legal teams. We are flexible, adaptable professionals who understand construction project culture and can integrate seamlessly into complex project structures.',
  },
  {
    question: 'What makes Queenswood different from other engagement consultancies?',
    answer:
      'We work exclusively in the infrastructure sector — it is all we do. This gives us deep sector knowledge, established relationships with key stakeholders, and a genuine passion for the built environment. We are not a generalist communications agency; we are infrastructure engagement specialists with a track record on some of the UK\'s most complex programmes.',
  },
];

export default function WhatWeDoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setPageSEO({
      title: 'What We Do | Community & Stakeholder Engagement | Queenswood',
      description:
        'Queenswood delivers expert stakeholder engagement for UK infrastructure projects. Community engagement, public consultation, agricultural liaison, digital storytelling and more.',
      canonical: `${SITE_URL}/what-we-do`,
      keywords: 'community engagement services, stakeholder management, public consultation UK, agricultural liaison, digital engagement, social value infrastructure',
      structuredData: [organizationSchema],
    });
  }, []);

  return (
    <div className="bg-navy-950 pt-20">
      {/* Hero */}
      <section className="section-container bg-navy-950 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-gold-500 text-xs uppercase tracking-[0.25em] font-medium mb-4">
            Building Bridges
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-cream leading-tight mb-6">
            Expert Engagement Across the Built Environment
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Our experienced team of specialists pride themselves on knowledge, flexibility, and
            passion for the built environment. Respected within construction circles and the
            communities we work in, we know what it takes to build trust and understanding with
            local people and stakeholders.
          </p>
        </div>
      </section>

      {/* Service sections */}
      {services.map((service, index) => {
        const isEven = index % 2 === 0;
        return (
          <section
            key={service.title}
            className={`py-16 md:py-24 ${index % 2 === 0 ? 'bg-navy-950' : 'bg-navy-900'}`}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 items-center ${
                  !isEven ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Image */}
                <ScrollReveal
                  from={isEven ? 'left' : 'right'}
                  className={!isEven ? 'lg:col-start-2' : ''}
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-950/20 to-transparent" />
                  </div>
                </ScrollReveal>

                {/* Text */}
                <ScrollReveal
                  from={isEven ? 'right' : 'left'}
                  className={!isEven ? 'lg:col-start-1 lg:row-start-1' : ''}
                >
                  <div className="flex flex-col gap-5">
                    <span className="text-gold-500 text-xs uppercase tracking-[0.2em] font-medium">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl text-cream">{service.title}</h2>
                    <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                      {service.description}
                    </p>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 text-gold-500 text-sm font-medium hover:text-gold-400 transition-colors mt-2 w-fit"
                    >
                      Discuss this service <ArrowRight size={14} />
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* FAQ */}
      <section className="section-container bg-navy-950">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-14">
            <SectionHeader
              strapline="Questions"
              heading="Frequently Asked Questions"
            />
          </div>
          <div className="flex flex-col divide-y divide-navy-800">
            {faqs.map((faq, index) => (
              <div key={index} className="py-5">
                <button
                  className="flex items-start justify-between w-full text-left gap-4 group"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-display text-lg text-cream group-hover:text-gold-400 transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-gold-500 flex-shrink-0 mt-0.5 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96 pt-4' : 'max-h-0'
                  }`}
                >
                  <p className="text-slate-400 leading-relaxed text-base">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy-900 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
              See our work in action
            </h2>
            <p className="text-slate-400 mb-8">
              Explore our case studies to see how we've delivered exceptional engagement outcomes
              across the UK's most complex infrastructure programmes.
            </p>
            <Link to="/our-work" className="btn-primary inline-flex items-center gap-2">
              View Our Work <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
