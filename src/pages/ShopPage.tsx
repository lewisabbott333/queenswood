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
    <div className="relative w-full h-full min-h-[260px] cursor-pointer group" onClick={toggle}>
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-cover"
        style={{ minHeight: '260px' }}
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
    <div className="bg-white pt-20">
      {/* Full-width GIF hero */}
      <section className="w-full overflow-hidden relative" style={{ backgroundColor: '#fff100' }}>
        <img
          src="/images/66ed6f3c98160b1942fbb4bb_2000px-Open-Sign-Master.gif"
          alt="Engagement Shop — A one-stop-shop for engagement professionals"
          className="w-full block object-contain"
          style={{ maxHeight: '600px' }}
        />
      </section>

      {/* Product listing */}
      <section className="py-0">
        <div className="max-w-6xl mx-auto">
          {products.map((product, index) => {
            const isEven = index % 2 === 0;
            return (
              <ScrollReveal key={product.slug} delay={index * 0.05}>
                <div className={`border-b border-gray-100 ${isEven ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} min-h-[360px]`}>

                    {/* Video panel */}
                    <div className="md:w-1/2 relative bg-gray-900 overflow-hidden flex-shrink-0">
                      {product.video_url ? (
                        <InlineVideo url={product.video_url} />
                      ) : (
                        <div className="w-full h-full min-h-[260px] flex items-center justify-center bg-gray-100">
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400 ml-1"><polygon points="5,3 19,12 5,21" /></svg>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Text + CTA panel */}
                    <div className="md:w-1/2 flex flex-col justify-center px-10 md:px-14 py-12">
                      <h2 className="font-display text-2xl md:text-3xl text-gray-900 mb-5 leading-snug">
                        {product.title}
                      </h2>
                      <p className="text-gray-600 text-base leading-relaxed mb-8">
                        {product.tagline}
                      </p>
                      <div>
                        <Link
                          to={`/contact?subject=${encodeURIComponent(subjectMap[product.slug] ?? product.title + ' Enquiry')}`}
                          className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3 transition-colors"
                          style={{ backgroundColor: '#fff100', color: '#111111' }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e6d900')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#fff100')}
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-24 bg-black text-center">
        <div className="max-w-2xl mx-auto px-6">
          <ScrollReveal>
            <h2 className="font-display text-3xl md:text-4xl mb-5" style={{ color: '#fff100' }}>
              Not sure what you need?
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Get in touch and we'll help you work out the best approach for your project.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-base px-10 py-4 font-semibold transition-colors"
              style={{ backgroundColor: '#fff100', color: '#111111' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e6d900')}
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
