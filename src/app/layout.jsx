import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

// Define fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Export metadata for SEO
export const metadata = {
  title: {
    default: "Mohammed Sadhef | Full Stack Developer | MERN Stack & Python",
    template: "%s | Mohammed Sadhef",
  },
  description: "Full Stack Developer specializing in MERN Stack (MongoDB, Express.js, React.js, Node.js), Python, JavaScript, and AI integration. Building responsive web applications and enterprise solutions.",
  keywords: ["Full Stack Developer", "MERN Stack", "React.js", "Node.js", "MongoDB", "Express.js", "Python", "JavaScript", "AI Integration"],
  creator: "Mohammed Sadhef",
  publisher: "Mohammed Sadhef",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sadhef.info",
    title: "Mohammed Sadhef | Full Stack Developer",
    description: "Full Stack Developer specializing in MERN Stack and Python",
    siteName: "Mohammed Sadhef Portfolio",
    images: [
      {
        url: "https://sadhef.info/sadhefportfolio.webp",
        width: 1200,
        height: 630,
        alt: "Mohammed Sadhef - Full Stack Developer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammed Sadhef | Full Stack Developer",
    description: "Full Stack Developer specializing in MERN Stack and Python",
    creator: "@mohdsadhef",
    images: ["https://sadhef.info/sadhefportfolio.webp"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    }
  },
  alternates: {
    canonical: "https://sadhef.info",
  },
  metadataBase: new URL("https://sadhef.info"),
  authors: [{ name: "Mohammed Sadhef", url: "https://sadhef.info" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#000000",
  colorScheme: "dark",
  category: "Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
        {/* Structured data for Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              'name': 'Mohammed Sadhef',
              'url': 'https://sadhef.info',
              'jobTitle': 'Full Stack Developer',
              'worksFor': {
                '@type': 'Organization',
                'name': 'Biztras'
              },
              'knowsAbout': [
                'MERN Stack Development',
                'React.js',
                'Node.js',
                'MongoDB',
                'Express.js',
                'JavaScript',
                'Python',
                'Docker',
                'Kubernetes',
                'AI Integration',
                'Full Stack Development',
                'Web Development'
              ],
              'sameAs': [
                'https://github.com/mohdsadhef',
                'https://linkedin.com/in/mohdsadhef',
                'https://twitter.com/mohdsadhef'
              ],
              'alumniOf': {
                '@type': 'EducationalOrganization',
                'name': 'KTU'
              }
            })
          }}
        />
        
        {/* Structured data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              'url': 'https://sadhef.info',
              'name': 'Mohammed Sadhef - Full Stack Developer Portfolio',
              'description': "Full Stack Developer specializing in MERN Stack (MongoDB, Express.js, React.js, Node.js), Python, JavaScript, and AI integration.",
              'potentialAction': {
                '@type': 'SearchAction',
                'target': {
                  '@type': 'EntryPoint',
                  'urlTemplate': 'https://sadhef.info/search?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              },
              'author': {
                '@type': 'Person',
                'name': 'Mohammed Sadhef'
              }
            })
          }}
        />
      </head>
      <body className="bg-primary">
        {children}
      </body>
    </html>
  );
}
