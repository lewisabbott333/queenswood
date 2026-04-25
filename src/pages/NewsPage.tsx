import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User, Clock } from '@/components/ui/MaterialIcon';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/supabase';
import SectionHeader from '@/components/ui/SectionHeader';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { setPageSEO, SITE_URL, organizationSchema, breadcrumbSchema } from '@/lib/seo';

const categories = ['All', 'Insights', 'News', 'Case Studies'];

const defaultGradients = [
  'from-navy-800 to-navy-900',
  'from-gold-600/20 to-navy-900',
  'from-slate-700 to-navy-900',
];

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const estimateReadTime = (body: string) => {
  const words = body?.split(/\s+/).length ?? 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setPageSEO({
      title: 'News & Insights | Stakeholder Engagement Thought Leadership | Queenswood',
      description:
        'Thought leadership, industry insights, and news from Queenswood — the UK\'s leading community and stakeholder engagement consultancy for infrastructure projects.',
      canonical: `${SITE_URL}/news-and-insights`,
      keywords: 'stakeholder engagement insights, community engagement news, infrastructure thought leadership, public consultation blog',
      structuredData: [organizationSchema, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'News & Insights', url: '/news-and-insights' }])],
    });

    const fetchPosts = async () => {
      try {
        const { data } = await supabase
          .from('posts')
          .select('*')
          .order('published_at', { ascending: false });
        if (data) setPosts(data);
      } catch {
        // no-op
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filtered =
    activeCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="bg-navy-950 pt-20">
      {/* Hero */}
      <section className="section-container bg-navy-950 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-cream leading-tight mb-6">
            News &amp; Insights
          </h1>
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Thought leadership from the frontline of community and stakeholder engagement.
          </p>
        </div>
      </section>

      {/* Category filter + posts */}
      <section className="section-container bg-navy-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <SectionHeader strapline="Latest" heading="Articles & Updates" align="left" />
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gold-600 text-navy-950 border-gold-600'
                    : 'border-navy-700 text-slate-400 hover:border-gold-600 hover:text-gold-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-cream mb-4">No articles yet</p>
              <p className="text-slate-400">
                Our team is working on great content. Check back soon.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-cream mb-4">
                No articles in this category
              </p>
              <button
                onClick={() => setActiveCategory('All')}
                className="text-gold-500 text-sm hover:text-gold-400 transition-colors"
              >
                View all articles
              </button>
            </div>
          ) : (
            <>
              {/* Featured article */}
              {featured && (
                <ScrollReveal className="mb-12">
                  <Link
                    to={`/news-and-insights/${featured.slug}`}
                    className="group block bg-navy-800 rounded-2xl overflow-hidden border border-navy-700 hover:border-gold-600/40 transition-all duration-300"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div
                        className={`aspect-[16/9] lg:aspect-auto relative bg-gradient-to-br ${defaultGradients[0]}`}
                      >
                        {featured.hero_image ? (
                          <img
                            src={featured.hero_image}
                            alt={featured.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="eager"
                          />
                        ) : (
                          <div className="w-full h-full min-h-64 flex items-center justify-center">
                            <span className="text-gold-500/30 font-display text-6xl">Q</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy-800/50" />
                      </div>
                      <div className="p-8 md:p-10 flex flex-col justify-center gap-4">
                        <span className="text-gold-500 text-xs uppercase tracking-widest font-medium border border-gold-600/30 rounded-full px-3 py-1 w-fit">
                          {featured.category}
                        </span>
                        <h2 className="font-display text-2xl md:text-3xl text-cream leading-tight group-hover:text-gold-400 transition-colors">
                          {featured.title}
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                          {featured.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-slate-500 text-xs mt-2">
                          <span className="flex items-center gap-1.5">
                            <User size={12} />
                            {featured.author}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar size={12} />
                            {formatDate(featured.published_at)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} />
                            {estimateReadTime(featured.body)}
                          </span>
                        </div>
                        <span className="flex items-center gap-2 text-gold-500 text-sm font-medium mt-2 group-hover:gap-3 transition-all">
                          Read article <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              )}

              {/* Remaining articles grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post, index) => (
                    <ScrollReveal key={post.id} delay={index * 0.07}>
                      <Link
                        to={`/news-and-insights/${post.slug}`}
                        className="group block bg-navy-800 rounded-xl overflow-hidden border border-navy-700 hover:border-gold-600/40 transition-all duration-300 h-full flex flex-col"
                      >
                        <div
                          className={`aspect-[16/9] relative bg-gradient-to-br ${
                            defaultGradients[index % defaultGradients.length]
                          } flex-shrink-0`}
                        >
                          {post.hero_image ? (
                            <img
                              src={post.hero_image}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gold-500/30 font-display text-4xl">Q</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col gap-3 flex-1">
                          <span className="text-gold-500 text-xs uppercase tracking-widest font-medium">
                            {post.category}
                          </span>
                          <h3 className="font-display text-lg text-cream leading-snug group-hover:text-gold-400 transition-colors flex-1">
                            {post.title}
                          </h3>
                          <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-slate-500 text-xs mt-auto pt-3 border-t border-navy-700">
                            <span className="flex items-center gap-1">
                              <User size={11} />
                              {post.author}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              {formatDate(post.published_at)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy-950 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
              Want to hear more from us?
            </h2>
            <p className="text-slate-400 mb-8">
              Get in touch to discuss how our expertise could benefit your next project.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Contact Us <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
