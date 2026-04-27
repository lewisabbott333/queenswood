export type SEOProps = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
  keywords?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
};

export const SITE_URL = 'https://wearequeenswood.com';
export const SITE_NAME = 'Queenswood Engagement';
export const SITE_TWITTER = '@queenswood';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.jpg`;

export const setPageSEO = (props: SEOProps) => {
  document.title = props.title;
  setMetaTag('description', props.description);

  if (props.keywords) {
    setMetaTag('keywords', props.keywords);
  }

  if (props.noIndex) {
    setMetaTag('robots', 'noindex,nofollow');
  } else {
    setMetaTag('robots', 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1');
  }

  if (props.canonical) {
    setCanonical(props.canonical);
  }

  setMetaProperty('og:site_name', SITE_NAME);
  setMetaProperty('og:title', props.title);
  setMetaProperty('og:description', props.description);
  setMetaProperty('og:type', props.ogType || 'website');
  setMetaProperty('og:locale', 'en_GB');
  if (props.canonical) {
    setMetaProperty('og:url', props.canonical);
  }

  const ogImg = props.ogImage || DEFAULT_OG_IMAGE;
  setMetaProperty('og:image', ogImg);
  setMetaProperty('og:image:width', '1200');
  setMetaProperty('og:image:height', '630');
  setMetaProperty('og:image:alt', props.title);
  setMetaTag('twitter:image', ogImg);
  setMetaTag('twitter:image:alt', props.title);

  if (props.datePublished) {
    setMetaProperty('article:published_time', props.datePublished);
  }
  if (props.dateModified) {
    setMetaProperty('article:modified_time', props.dateModified);
  }

  setMetaTag('twitter:card', props.twitterCard || 'summary_large_image');
  setMetaTag('twitter:site', SITE_TWITTER);
  setMetaTag('twitter:title', props.title);
  setMetaTag('twitter:description', props.description);

  if (props.structuredData) {
    const dataArray = Array.isArray(props.structuredData) ? props.structuredData : [props.structuredData];
    setStructuredData(dataArray);
  }
};

const setMetaTag = (name: string, content: string) => {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('name', name);
    document.head.appendChild(element);
  }
  element.content = content;
};

const setMetaProperty = (property: string, content: string) => {
  let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute('property', property);
    document.head.appendChild(element);
  }
  element.content = content;
};

const setCanonical = (url: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = url;
};

const setStructuredData = (data: Record<string, unknown>[]) => {
  document.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
  data.forEach((schema) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  description: 'Specialist community and stakeholder engagement consultancy for UK infrastructure projects including HS2, National Highways, Thames Water, and Crossrail.',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/images/logo-horizontal.svg`,
    width: 400,
    height: 80,
  },
  foundingDate: '2015',
  numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 10, maxValue: 50 },
  areaServed: { '@type': 'Country', name: 'United Kingdom' },
  knowsAbout: [
    'Community Engagement',
    'Stakeholder Engagement',
    'Infrastructure Projects',
    'Public Consultation',
    'Social Value',
    'Agricultural Liaison',
    'Digital Engagement',
  ],
  sameAs: [
    'https://linkedin.com/company/queenswood',
    'https://twitter.com/queenswood',
    'https://instagram.com/queenswood',
    'https://facebook.com/queenswood',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '175-185 Grays Inn Road',
    addressLocality: 'London',
    postalCode: 'WC1X 8UE',
    addressCountry: 'GB',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    telephone: '+44-20-8058-9563',
    email: 'hello@wearequeenswood.com',
    availableLanguage: 'English',
    areaServed: 'GB',
  },
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: 'Specialist community and stakeholder engagement consultancy for UK infrastructure projects',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/news-and-insights?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE_NAME,
  image: `${SITE_URL}/images/logo-horizontal.svg`,
  description: 'Specialist community and stakeholder engagement consultancy for UK infrastructure projects',
  priceRange: '££££',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '175-185 Grays Inn Road',
    addressLocality: 'London',
    postalCode: 'WC1X 8UE',
    addressCountry: 'GB',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.5238,
    longitude: -0.1142,
  },
  telephone: '+44-20-8058-9563',
  email: 'hello@wearequeenswood.com',
  url: SITE_URL,
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  hasMap: 'https://maps.google.com/?q=175+Grays+Inn+Road+London+WC1X+8UE',
};

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.url}`,
  })),
});

export const articleSchema = (article: {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
  category?: string;
  keywords?: string[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: article.headline,
  description: article.description,
  image: {
    '@type': 'ImageObject',
    url: article.image || `${SITE_URL}/images/logo-horizontal.svg`,
    width: 1200,
    height: 630,
  },
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  author: {
    '@type': 'Organization',
    name: article.author || SITE_NAME,
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/logo-horizontal.svg`,
      width: 400,
      height: 80,
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_URL}${article.url}`,
  },
  url: `${SITE_URL}${article.url}`,
  inLanguage: 'en-GB',
  isAccessibleForFree: true,
  keywords: article.keywords?.join(', '),
  articleSection: article.category || 'Infrastructure',
  about: {
    '@type': 'Thing',
    name: 'Infrastructure Stakeholder Engagement',
  },
});

export const jobPostingSchema = (job: {
  title: string;
  description: string;
  location?: string;
  salary?: string;
  url: string;
  datePosted?: string;
  employmentType?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: job.title,
  description: job.description,
  datePosted: job.datePosted || new Date().toISOString().split('T')[0],
  employmentType: job.employmentType || 'FULL_TIME',
  hiringOrganization: {
    '@type': 'Organization',
    name: SITE_NAME,
    sameAs: SITE_URL,
    logo: `${SITE_URL}/images/logo-horizontal.svg`,
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: job.location || 'London',
      addressCountry: 'GB',
    },
  },
  baseSalary: job.salary ? {
    '@type': 'MonetaryAmount',
    currency: 'GBP',
    value: {
      '@type': 'QuantitativeValue',
      value: job.salary,
      unitText: 'YEAR',
    },
  } : undefined,
  url: `${SITE_URL}${job.url}`,
  directApply: true,
  industry: 'Infrastructure Consulting',
});

export const faqPageSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const personSchema = (person: {
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
  linkedinUrl?: string;
  slug: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  jobTitle: person.role,
  description: person.bio,
  image: person.imageUrl,
  url: `${SITE_URL}/team/${person.slug}`,
  sameAs: person.linkedinUrl ? [person.linkedinUrl] : [],
  worksFor: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
});

export const serviceSchema = (service: {
  name: string;
  description: string;
  url: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: service.name,
  description: service.description,
  url: `${SITE_URL}${service.url}`,
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  areaServed: { '@type': 'Country', name: 'United Kingdom' },
  serviceType: service.name,
});

export const truncateBio = (bio: string, maxLength = 155): string => {
  if (!bio || bio.length <= maxLength) return bio;
  const trimmed = bio.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');
  return lastSpace > 0 ? trimmed.slice(0, lastSpace) + '…' : trimmed + '…';
};

export const caseStudySchema = (cs: {
  headline: string;
  description: string;
  image?: string;
  client: string;
  url: string;
  datePublished: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${SITE_URL}${cs.url}`,
  headline: cs.headline,
  description: cs.description,
  image: cs.image || `${SITE_URL}/images/logo-horizontal.svg`,
  datePublished: cs.datePublished,
  author: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/images/logo-horizontal.svg`,
    },
  },
  about: {
    '@type': 'Organization',
    name: cs.client,
  },
  articleSection: 'Case Study',
  inLanguage: 'en-GB',
  url: `${SITE_URL}${cs.url}`,
});
