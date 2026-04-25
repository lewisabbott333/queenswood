import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ThemeProvider } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

const HomePage = lazy(() => import('@/pages/HomePage'));
const WhatWeDoPage = lazy(() => import('@/pages/WhatWeDoPage'));
const OurWorkPage = lazy(() => import('@/pages/OurWorkPage'));
const CaseStudyPage = lazy(() => import('@/pages/CaseStudyPage'));
const AboutUsPage = lazy(() => import('@/pages/AboutUsPage'));
const CareersPage = lazy(() => import('@/pages/CareersPage'));
const NewsPage = lazy(() => import('@/pages/NewsPage'));
const ArticlePage = lazy(() => import('@/pages/ArticlePage'));
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const SocialConstructPage = lazy(() => import('@/pages/SocialConstructPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const TeamMemberPage = lazy(() => import('@/pages/TeamMemberPage'));
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-base)' }}>
    <div className="w-12 h-12 border-2 border-gold-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const FadeWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <div
      key={location.pathname}
      style={{ animation: 'pageFadeIn 0.4s ease forwards' }}
    >
      {children}
    </div>
  );
};

function AdminRoute() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent indexing of admin pages
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.content = 'noindex,nofollow';
    document.title = 'Admin | Queenswood';
    return () => {
      if (robotsMeta) robotsMeta.content = 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1';
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) {
        navigate('/admin', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (session === undefined) {
    return <PageLoader />;
  }

  if (!session) {
    return <AdminLoginPage />;
  }

  return <AdminDashboard />;
}

export default function App() {
  return (
    <ThemeProvider>
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <Suspense fallback={<PageLoader />}>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/admin/*" element={<AdminRoute />} />

          <Route
            path="/*"
            element={
              <Layout>
                <FadeWrapper>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/what-we-do" element={<WhatWeDoPage />} />
                    <Route path="/our-work" element={<OurWorkPage />} />
                    <Route path="/our-work/:slug" element={<CaseStudyPage />} />
                    <Route path="/about-us" element={<AboutUsPage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/news-and-insights" element={<NewsPage />} />
                    <Route path="/news-and-insights/:slug" element={<ArticlePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/social-construct" element={<SocialConstructPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/team/:slug" element={<TeamMemberPage />} />
                  </Routes>
                </FadeWrapper>
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}
