// src/app/layout.jsx
import { Inter } from "next/font/google";
import "./globals.css";
import { defaultMetadata } from "../config/metadata";

// Define fonts - Use only Inter for now
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// Export metadata for SEO
export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/webp" href="/sadhefportfolio.webp" />
        <link rel="preload" href="/sadhefportfolio.webp" as="image" type="image/webp" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        {/* Structured data for Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Mohammed Sadhef",
              "url": "https://sadhef.info",
              "jobTitle": "Full Stack Developer",
              "worksFor": {
                "@type": "Organization",
                "name": "Biztras"
              },
              "knowsAbout": [
                "MERN Stack Development",
                "React.js",
                "Node.js",
                "MongoDB",
                "Express.js",
                "JavaScript",
                "Python",
                "Docker",
                "Kubernetes",
                "AI Integration",
                "Full Stack Development",
                "Web Development"
              ],
              "sameAs": [
                "https://github.com/mohdsadhef",
                "https://linkedin.com/in/mohdsadhef",
                "https://twitter.com/mohdsadhef"
              ],
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "KTU"
              }
            })
          }}
        />
        
        {/* Structured data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://sadhef.info",
              "name": "Mohammed Sadhef - Full Stack Developer Portfolio",
              "description": "Portfolio of Mohammed Sadhef, a Full Stack Developer specializing in MERN Stack, Python, JavaScript, and AI integration.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://sadhef.info/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "author": {
                "@type": "Person",
                "name": "Mohammed Sadhef"
              },
              "audience": {
                "@type": "Audience",
                "audienceType": "Employers, Clients, Recruiters"
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