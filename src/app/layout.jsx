import { Inter } from "next/font/google";
import "./globals.css";
import EnhancedSEO from "../components/EnhancedSEO";
import SocialSharingMeta from "../components/SocialSharingMeta";
import LocalBusinessSchema from "../components/LocalBusinessSchema";
import GoogleIntegration from "../components/GoogleIntegration";
import schemaGenerators from "../utils/schema-generators";

// Define fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({ children }) {
  // Generate structured data
  const personSchema = schemaGenerators.generatePersonSchema();
  const websiteSchema = schemaGenerators.generateWebsiteSchema();
  const portfolioSchema = schemaGenerators.generatePortfolioSchema();
  const servicesSchema = schemaGenerators.generateServicesSchema();

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Base SEO */}
        <EnhancedSEO />
        
        {/* Social Sharing Meta Tags */}
        <SocialSharingMeta />
        
        {/* Business Schema for Local SEO */}
        <LocalBusinessSchema />
        
        {/* Google Search Console and Analytics */}
        <GoogleIntegration />
        
        {/* Additional Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
        />
        
        {/* Link to sitemap and manifest */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-primary">
        {children}
      </body>
    </html>
  );
}