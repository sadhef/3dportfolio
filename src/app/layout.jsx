import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { defaultMetadata } from "../config/metadata";

// Define fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

// Export metadata for SEO
export const metadata = defaultMetadata;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/webp" href="/sadhefportfolio.webp" />
        <link rel="preload" href="/sadhefportfolio.webp" as="image" type="image/webp" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
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