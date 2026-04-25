import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@/components/ui/MaterialIcon';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { setPageSEO, SITE_URL, organizationSchema, breadcrumbSchema } from '@/lib/seo';
import { supabase } from '@/lib/supabase';

type ShopProduct = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  video_url: string | null;
  order_index: number;
};

const subjectMap: Record<string, string> = {
  'road-work-visualisations': 'Road Work Visualisations Enquiry',
  'construction-work-visuals': 'Construction Work Visuals Enquiry',
  'drone-footage-graphics': 'Drone Footage Graphics Enquiry',
  'noise-impact-animations': 'Noise Impact Animations Enquiry',
  'maps-graphs-exhibition-graphics': 'Maps Graphs Exhibition Graphics Enquiry',
  'letters-engagement-plans': 'Letters Engagement Plans Enquiry',
};

function InlineVideo({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="relative w-full h-full cursor-pointer group" onClick={toggle}>
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain bg-black"
        preload="metadata"
        playsInline
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-900 ml-1"><polygon points="5,3 19,12 5,21" /></svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);

  useEffect(() => {
    setPageSEO({
      title: 'Engagement Shop | Visual Communication Services | Queenswood',
      description:
        "Queenswood's Engagement Shop offers visual communication and engagement planning services — road work visualisations, construction graphics, noise animations, exhibition materials, and more.",
      canonical: `${SITE_URL}/shop`,
      keywords: 'engagement shop, road work visualisations, construction graphics, noise impact animations, exhibition graphics, engagement planning services UK',
      structuredData: [organizationSchema, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Engagement Shop', url: '/shop' }])],
    });

    supabase
      .from('shop_products')
      .select('id, slug, title, tagline, description, video_url, order_index')
      .eq('active', true)
      .order('order_index', { ascending: true })
      .then(({ data }) => {
        if (data) setProducts(data as ShopProduct[]);
      });
  }, []);

  return (
    <div className="bg-navy-950">
      {/* Full-width GIF hero */}
      <section className="w-full overflow-hidden relative pt-20" style={{ backgroundColor: '#fff100' }}>
        <img
          src="/images/66ed6f3c98160b1942fbb4bb_2000px-Open-Sign-Master.gif"
          alt="Engagement Shop — A one-stop-shop for engagement professionals"
          className="w-full block object-contain"
          style={{ maxHeight: '600px' }}
        />
      </section>

      {/* Product listing */}
      <section className="py-0">
        {products.map((product, index) => {
          const isEven = index % 2 === 0;
          return (
            <section
              key={product.slug}
              className={`py-16 md:py-24 ${isEven ? 'bg-navy-950' : 'bg-navy-900'}`}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <ScrollReveal delay={index * 0.05}>
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 items-center ${
                      !isEven ? 'lg:grid-flow-dense' : ''
                    }`}
                  >
                    {/* Video */}
                    <ScrollReveal
                      from={isEven ? 'left' : 'right'}
                      className={!isEven ? 'lg:col-start-2' : ''}
                    >
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black">
                        {product.video_url ? (
                          <InlineVideo url={product.video_url} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-900">
                            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400 ml-1"><polygon points="5,3 19,12 5,21" /></svg>
                            </div>
                          </div>
                        )}
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
                        <h2 className="font-display text-3xl md:text-4xl text-cream">{product.title}</h2>
                        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                          {product.tagline}
                        </p>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          {product.description}
                        </p>
                        <Link
                          to={`/contact?subject=${encodeURIComponent(subjectMap[product.slug] ?? product.title + ' Enquiry')}`}
                          className="inline-flex items-center gap-2 text-gold-500 text-sm font-medium hover:text-gold-400 transition-colors mt-2 w-fit"
                        >
                          Shop Now <ArrowRight size={14} />
                        </Link>
                      </div>
                    </ScrollReveal>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          );
        })}
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-navy-950 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <h2
              className="font-display text-3xl md:text-4xl mb-5"
              style={{ color: '#fff100' }}
            >
              Not sure what you need?
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Get in touch and we'll help you work out the best approach for your project.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-base px-10 py-4 font-semibold transition-colors rounded-lg"
              style={{ backgroundColor: '#fff100', color: '#1a1a1a' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fff433')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff100')}
            >
              Get in Touch <ArrowRight size={18} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
