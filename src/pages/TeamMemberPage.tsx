import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Linkedin } from '@/components/ui/MaterialIcon';
import { supabase } from '@/lib/supabase';
import type { TeamMember } from '@/lib/supabase';
import { setPageSEO, SITE_URL, organizationSchema, breadcrumbSchema, personSchema, truncateBio } from '@/lib/seo';

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter((p) => !p.startsWith('('))
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

export default function TeamMemberPage() {
  const { slug } = useParams<{ slug: string }>();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('team_members')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data }) => {
        setMember(data);
        setLoading(false);
        if (data) {
          const desc = data.bio
            ? truncateBio(data.bio, 155)
            : `Meet ${data.name}, ${data.role} at Queenswood Engagement — specialist community and stakeholder engagement consultancy.`;
          setPageSEO({
            title: `${data.name} | ${data.role} | Queenswood Engagement`,
            description: desc,
            canonical: `${SITE_URL}/team/${slug}`,
            ogImage: data.image_url,
            keywords: `${data.name}, ${data.role}, Queenswood team, community engagement, stakeholder engagement`,
            structuredData: [
              organizationSchema,
              breadcrumbSchema([
                { name: 'Home', url: '/' },
                { name: 'About Us', url: '/about-us' },
                { name: data.name, url: `/team/${slug}` },
              ]),
              personSchema({
                name: data.name,
                role: data.role,
                bio: data.bio,
                imageUrl: data.image_url,
                linkedinUrl: data.linkedin_url,
                slug: slug!,
              }),
            ],
          });
        }
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center pt-20 gap-6 text-center px-6">
        <p className="text-slate-400 text-lg">Team member not found.</p>
        <Link to="/about-us" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to About Us
        </Link>
      </div>
    );
  }

  const hasPhoto = !!(member.image_url);
  const hasHover = !!(member.hover_image_url);

  return (
    <div className="bg-navy-950 min-h-screen pt-20">
      {/* Back nav */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-10 pb-4">
        <Link
          to="/about-us"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-gold-500 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Our Team
        </Link>
      </div>

      {/* Profile hero */}
      <section className="max-w-6xl mx-auto px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] lg:grid-cols-[400px_1fr] gap-10 lg:gap-16 items-start">
          {/* Photo */}
          <div
            className="relative rounded-2xl overflow-hidden border border-navy-800 shadow-2xl"
            style={{ aspectRatio: '3/4' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {hasPhoto ? (
              <>
                <img
                  src={member.image_url}
                  alt={member.name}
                  className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${
                    hovered && hasHover ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                {hasHover && (
                  <img
                    src={member.hover_image_url}
                    alt={member.name}
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500 ${
                      hovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950">
                <span className="font-display text-8xl text-gold-500/50 select-none">
                  {getInitials(member.name)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6 py-2">
            <div>
              <p className="text-gold-500 text-xs uppercase tracking-[0.2em] font-medium mb-3">
                {member.role}
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream leading-tight mb-6">
                {member.name}
              </h1>
              {member.linkedin_url && (
                <a
                  href={member.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-gold-500 transition-colors border border-navy-700 hover:border-gold-600/50 rounded-lg px-4 py-2.5"
                >
                  <Linkedin size={16} /> View on LinkedIn
                </a>
              )}
            </div>

            {member.bio ? (
              <div className="prose prose-invert max-w-none">
                {member.bio.split('\n').filter(Boolean).map((paragraph, i) => (
                  <p key={i} className="text-slate-300 text-base leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic text-sm">
                Bio coming soon.
              </p>
            )}

            <div className="pt-4 border-t border-navy-800">
              <Link to="/about-us" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cream transition-colors">
                <ArrowLeft size={14} /> Meet the rest of the team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
