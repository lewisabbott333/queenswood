import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle } from '@/components/ui/MaterialIcon';

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);
import { supabase } from '@/lib/supabase';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { setPageSEO, localBusinessSchema, SITE_URL, breadcrumbSchema } from '@/lib/seo';

type FormState = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

const initialForm: FormState = {
  name: '',
  email: '',
  company: '',
  subject: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setPageSEO({
      title: 'Contact Queenswood | Community Engagement Consultancy London | Get in Touch',
      description:
        'Get in touch with Queenswood Engagement — London\'s leading community and stakeholder engagement consultancy for infrastructure projects. Call, email, or fill in our contact form.',
      canonical: `${SITE_URL}/contact`,
      keywords: 'contact Queenswood, community engagement consultancy London, stakeholder engagement contact, infrastructure consultancy enquiry',
      structuredData: [localBusinessSchema, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Contact', url: '/contact' }])],
    });

    // Pre-fill subject from URL query param
    const params = new URLSearchParams(window.location.search);
    const subjectParam = params.get('subject');
    if (subjectParam) {
      setForm((prev) => ({ ...prev, subject: subjectParam }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const { error: sbError } = await supabase.from('enquiries').insert({
        name: form.name,
        email: form.email,
        company: form.company || null,
        subject: form.subject || null,
        message: form.message,
        read: false,
      });
      if (sbError) throw sbError;
      setSubmitted(true);
      setForm(initialForm);
    } catch {
      setError(
        'There was an error sending your message. Please try emailing us directly at hello@wearequeenswood.com.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-navy-950 pt-20">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Queenswood Engagement',
            address: {
              '@type': 'PostalAddress',
              streetAddress: '175-185 Grays Inn Road',
              addressLocality: 'London',
              postalCode: 'WC1X 8UE',
              addressCountry: 'GB',
            },
            telephone: '+44-20-8058-9563',
            email: 'hello@wearequeenswood.com',
            url: 'https://wearequeenswood.com',
          }),
        }}
      />

      {/* Hero */}
      <section className="section-container bg-navy-950 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-gold-500 text-xs uppercase tracking-[0.25em] font-medium mb-4">
            Communicators
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-cream leading-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            We're as committed to people as we are to construction, so we're a friendly bunch!
            Whether you're looking to discuss a project, explore our services, or just want to
            say hello — we'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="section-container bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            {/* Left: Contact details + map */}
            <ScrollReveal from="left">
              <div className="space-y-8">
                <div>
                  <SectionHeader
                    strapline="Find Us"
                    heading="Our Details"
                    align="left"
                  />
                </div>

                <div className="flex flex-col gap-5 mt-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg flex-shrink-0 icon-on-dark">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-cream text-sm font-medium mb-1">Office</p>
                      <address className="text-slate-400 text-sm not-italic leading-relaxed">
                        175-185 Grays Inn Road<br />
                        London WC1X 8UE
                      </address>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg flex-shrink-0 icon-on-dark">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-cream text-sm font-medium mb-1">Phone</p>
                      <a
                        href="tel:+442080589563"
                        className="text-slate-400 text-sm hover:text-gold-500 transition-colors"
                      >
                        +44 020 8058 9563
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg flex-shrink-0 icon-on-dark">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-cream text-sm font-medium mb-1">Email</p>
                      <a
                        href="mailto:hello@wearequeenswood.com"
                        className="text-slate-400 text-sm hover:text-gold-500 transition-colors"
                      >
                        hello@wearequeenswood.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div>
                  <p className="text-cream text-sm font-medium mb-4">Follow Us</p>
                  <div className="flex items-center gap-4">
                    {[
                      { icon: <LinkedInIcon />, href: 'https://linkedin.com/company/queenswood', label: 'LinkedIn' },
                      { icon: <TwitterIcon />, href: 'https://twitter.com/queenswood', label: 'Twitter / X' },
                      { icon: <InstagramIcon />, href: 'https://instagram.com/queenswood', label: 'Instagram' },
                      { icon: <FacebookIcon />, href: 'https://facebook.com/queenswood', label: 'Facebook' },
                      { icon: <TikTokIcon />, href: 'https://tiktok.com/@queenswood', label: 'TikTok' },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="p-2.5 rounded-lg transition-all duration-300 hover:scale-110 icon-on-dark"
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Map */}
                <div className="rounded-xl overflow-hidden border border-navy-800 h-[530px]">
                  <iframe
                    src="https://api.mapbox.com/styles/v1/banzan2/cln4qgm7k06q701pha9vb87l6.html?title=false&access_token=pk.eyJ1IjoiYmFuemFuMiIsImEiOiJja21xczYyeHEwMHkxMnByc3V6a3Z6cWUwIn0.gjIUP-36_vRrZvoJEKHMJQ&zoomwheel=true#16.68/51.525747/-0.11487"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Queenswood Engagement office location"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Contact form */}
            <ScrollReveal from="right">
              <div className="rounded-2xl p-10 md:p-12 flex flex-col h-full" style={{ backgroundColor: '#fff100' }}>
                {submitted ? (
                  <div className="flex flex-col items-center justify-center text-center gap-5 py-12 flex-1">
                    <div className="p-4 bg-black/10 rounded-full" style={{ color: '#1a1a1a' }}>
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="font-display text-2xl" style={{ color: '#1a1a1a' }}>Message Sent!</h3>
                    <p className="max-w-xs" style={{ color: '#3a3a3a' }}>
                      Thank you for getting in touch. We'll be in contact shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-sm font-semibold underline transition-opacity hover:opacity-70"
                      style={{ color: '#1a1a1a' }}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1" noValidate>
                    <h2 className="font-display text-2xl mb-2" style={{ color: '#1a1a1a' }}>Send us a message</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: '#3a3a3a' }}>
                          Name <span style={{ color: '#1a1a1a' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                          className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
                          style={{ background: 'rgba(0,0,0,0.08)', border: '1.5px solid rgba(0,0,0,0.15)', color: '#1a1a1a' }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: '#3a3a3a' }}>
                          Email <span style={{ color: '#1a1a1a' }}>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          required
                          className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
                          style={{ background: 'rgba(0,0,0,0.08)', border: '1.5px solid rgba(0,0,0,0.15)', color: '#1a1a1a' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: '#3a3a3a' }}>
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        placeholder="Your company (optional)"
                        className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
                        style={{ background: 'rgba(0,0,0,0.08)', border: '1.5px solid rgba(0,0,0,0.15)', color: '#1a1a1a' }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: '#3a3a3a' }}>
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors"
                        style={{ background: 'rgba(0,0,0,0.08)', border: '1.5px solid rgba(0,0,0,0.15)', color: '#1a1a1a' }}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-xs uppercase tracking-wider mb-2 font-semibold" style={{ color: '#3a3a3a' }}>
                        Message <span style={{ color: '#1a1a1a' }}>*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project or enquiry..."
                        required
                        rows={10}
                        className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
                        style={{ background: 'rgba(0,0,0,0.08)', border: '1.5px solid rgba(0,0,0,0.15)', color: '#1a1a1a' }}
                      />
                    </div>

                    {error && (
                      <p className="text-sm rounded-lg px-4 py-3" style={{ color: '#7f1d1d', background: 'rgba(0,0,0,0.1)' }}>
                        {error}
                      </p>
                    )}

                    <div className="mt-auto space-y-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 text-base font-semibold rounded-lg transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ background: '#1a1a1a', color: '#fff100' }}
                      >
                        {submitting ? 'Sending...' : 'Send Message'}
                      </button>

                      <p className="text-xs text-center" style={{ color: '#5a5a5a' }}>
                        We typically respond within one business day.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
