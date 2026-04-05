import './globals.css';
import RootLayoutClient from './RootLayoutClient';

export const metadata = {
  metadataBase: new URL('https://a2zstaffs.com'),
  title: {
    default: 'A2Z Staffs - Professional Recruitment & Staffing Solutions',
    template: '%s | A2Z Staffs',
  },
  description: 'A2Z Staffs connects top talent with leading employers. Professional recruitment services, staffing solutions, and career opportunities across industries.',
  keywords: [
    'recruitment',
    'staffing',
    'hiring',
    'job placement',
    'talent acquisition',
    'A2Z Staffs',
    'recruitment agency',
    'staffing solutions',
    'employment services',
    'career opportunities',
  ],
  authors: [{ name: 'A2Z Staffs' }],
  creator: 'A2Z Staffs',
  publisher: 'A2Z Staffs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://a2zstaffs.com',
    siteName: 'A2Z Staffs',
    title: 'A2Z Staffs - Professional Recruitment & Staffing Solutions',
    description: 'A2Z Staffs connects top talent with leading employers. Professional recruitment services and staffing solutions.',
    images: [
      {
        url: '/image/homepage.png',
        width: 1200,
        height: 630,
        alt: 'A2Z Staffs — Professional Recruitment & Staffing Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A2Z Staffs - Professional Recruitment & Staffing Solutions',
    description: 'Connecting top talent with leading employers. Professional recruitment and staffing solutions.',
    images: ['/image/homepage.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // 1. Go to search.google.com/search-console
    // 2. Add property → https://a2zstaffs.com
    // 3. Choose "HTML tag" verification → copy the content value
    // 4. Paste it below and uncomment:
    // google: 'paste-your-code-here',
  },
  alternates: {
    canonical: 'https://a2zstaffs.com',
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

// JSON-LD Structured Data for Organization (enables logo in Google search)
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'A2Z Staffs',
  alternateName: 'A2ZStaffs',
  url: 'https://a2zstaffs.com',
  logo: 'https://a2zstaffs.com/image/a2zstaff logo.png',
  description: 'Professional recruitment and staffing solutions connecting top talent with leading employers.',
  foundingDate: '2024',
  founder: {
    '@type': 'Person',
    name: 'Sandeep Kushwaha',
  },
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'contact@a2zstaffs.com',
  },
  sameAs: [
    // Add your social media URLs when available
    // 'https://www.linkedin.com/company/a2zstaffs',
    // 'https://twitter.com/a2zstaffs',
  ],
};

// Website Schema
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'A2Z Staffs',
  url: 'https://a2zstaffs.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://a2zstaffs.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}
