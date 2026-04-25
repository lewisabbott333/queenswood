import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, User, Clock, Tag } from '@/components/ui/MaterialIcon';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/supabase';
import { setPageSEO, breadcrumbSchema, articleSchema, SITE_URL } from '@/lib/seo';
import ScrollReveal from '@/components/ui/ScrollReveal';

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

type BodyBlock =
  | { type: 'h1'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'image'; src: string; alt: string }
  | { type: 'p'; text: string };

const renderBody = (body: string): BodyBlock[] => {
  const blocks: BodyBlock[] = [];
  const lines = body.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    if (line.startsWith('# ')) { blocks.push({ type: 'h1', text: line.replace(/^# /, '') }); i++; continue; }
    if (line.startsWith('## ')) { blocks.push({ type: 'h2', text: line.replace(/^## /, '') }); i++; continue; }
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) { blocks.push({ type: 'image', alt: imgMatch[1] || 'Article image', src: imgMatch[2] }); i++; continue; }
    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().replace(/^- /, ''));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('# ') && !lines[i].trim().startsWith('## ') && !lines[i].trim().startsWith('- ') && !lines[i].trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/)) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length) blocks.push({ type: 'p', text: paraLines.join(' ') });
  }
  return blocks;
};

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const { data } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .maybeSingle();

        if (data) {
          setPost(data);

          const { data: relatedData } = await supabase
            .from('posts')
            .select('*')
            .neq('slug', slug)
            .eq('category', data.category)
            .limit(3);

          if (relatedData && relatedData.length > 0) {
            setRelated(relatedData);
          } else {
            const { data: fallback } = await supabase
              .from('posts')
              .select('*')
              .neq('slug', slug)
              .limit(3);
            if (fallback) setRelated(fallback);
          }
        }
      } catch {
        // no-op
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    const articleUrl = `/news-and-insights/${post.slug}`;
    setPageSEO({
      title: post.meta_title || `${post.title} | Queenswood Engagement`,
      description: post.meta_description || post.excerpt,
      canonical: `${SITE_URL}${articleUrl}`,
      ogImage: post.hero_image || undefined,
      ogType: 'article',
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      author: post.author || 'Queenswood Engagement',
      keywords: `${post.category}, community engagement, stakeholder engagement, infrastructure, ${post.title}`,
      structuredData: [
        articleSchema({
          headline: post.title,
          description: post.meta_description || post.excerpt,
          image: post.hero_image || undefined,
          datePublished: post.published_at,
          dateModified: post.updated_at || post.published_at,
          author: post.author,
          url: articleUrl,
          category: post.category,
        }),
        breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'News & Insights', url: '/news-and-insights' },
          { name: post.title, url: articleUrl },
        ]),
      ],
    });
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-navy-950 pt-20 flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="font-display text-3xl text-cream">Article Not Found</h1>
        <p className="text-slate-400">
          This article doesn't exist or may have been removed.
        </p>
        <Link to="/news-and-insights" className="btn-primary">
          Back to News & Insights
        </Link>
      </div>
    );
  }

  const paragraphs = renderBody(post.body ?? '');

  return (
    <div className="bg-navy-950 pt-20">
      {/* Hero */}
      <section className="relative">
        {post.hero_image && (
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img
              src={post.hero_image}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
          </div>
        )}
        <div className={`max-w-4xl mx-auto px-6 lg:px-8 ${post.hero_image ? '-mt-24 relative z-10' : 'pt-16'}`}>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-slate-400 text-sm mb-6">
            <Link to="/" className="hover:text-gold-500 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/news-and-insights" className="hover:text-gold-500 transition-colors">
              News & Insights
            </Link>
            <span>/</span>
            <span className="text-cream line-clamp-1">{post.title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-5">
            <span className="bg-gold-600/20 text-gold-400 text-xs px-3 py-1 rounded-full uppercase tracking-widest border border-gold-600/30 flex items-center gap-1.5">
              <Tag size={10} />
              {post.category}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-5 text-slate-400 text-sm pb-8 border-b border-navy-800">
            <span className="flex items-center gap-2">
              <User size={14} className="text-gold-500" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={14} className="text-gold-500" />
              {formatDate(post.published_at)}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="text-gold-500" />
              {estimateReadTime(post.body)}
            </span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 font-display italic">
            {post.excerpt}
          </p>

          <div className="flex flex-col gap-6 prose-content">
            {paragraphs.map((block, i) => {
              if (block.type === 'h1') {
                return (
                  <h2 key={i} className="font-display text-2xl md:text-3xl text-cream mt-6">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === 'h2') {
                return (
                  <h3 key={i} className="font-display text-xl text-cream mt-4">
                    {block.text}
                  </h3>
                );
              }
              if (block.type === 'ul') {
                return (
                  <ul key={i} className="flex flex-col gap-2 pl-4">
                    {block.items.map((item, j) => (
                      <li key={j} className="text-slate-400 text-base leading-relaxed flex items-start gap-2">
                        <span className="text-gold-500 mt-1.5 flex-shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === 'image') {
                return (
                  <figure key={i} className="my-4">
                    <img
                      src={block.src}
                      alt={block.alt}
                      className="w-full rounded-xl border border-navy-800 object-cover max-h-96"
                      loading="lazy"
                    />
                    {block.alt && block.alt !== 'image' && (
                      <figcaption className="text-slate-500 text-xs text-center mt-2">{block.alt}</figcaption>
                    )}
                  </figure>
                );
              }
              return (
                <p key={i} className="text-slate-400 text-base leading-relaxed">
                  {block.text}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="section-container bg-navy-900">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="font-display text-2xl md:text-3xl text-cream mb-10">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((relPost, index) => (
                <ScrollReveal key={relPost.id} delay={index * 0.1}>
                  <Link
                    to={`/news-and-insights/${relPost.slug}`}
                    className="group block bg-navy-800 rounded-xl overflow-hidden border border-navy-700 hover:border-gold-600/40 transition-all duration-300"
                  >
                    {relPost.hero_image ? (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={relPost.hero_image}
                          alt={relPost.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/9] bg-navy-900 flex items-center justify-center">
                        <span className="text-gold-500/30 font-display text-4xl">Q</span>
                      </div>
                    )}
                    <div className="p-5">
                      <span className="text-gold-500 text-xs uppercase tracking-widest">
                        {relPost.category}
                      </span>
                      <h3 className="font-display text-lg text-cream mt-2 leading-snug group-hover:text-gold-400 transition-colors">
                        {relPost.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gold-400 text-xs mt-3 opacity-0 group-hover:opacity-100 transition-all">
                        <span>Read</span>
                        <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-10">
        <Link
          to="/news-and-insights"
          className="inline-flex items-center gap-2 text-gold-500 text-sm hover:text-gold-400 transition-colors"
        >
          <ArrowLeft size={14} /> Back to News &amp; Insights
        </Link>
      </div>
    </div>
  );
}
