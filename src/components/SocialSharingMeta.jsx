"use client";

import Head from 'next/head';

/**
 * Comprehensive social sharing component with Open Graph and Twitter Card meta tags
 * 
 * @param {Object} props - Social sharing props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.url - Canonical URL
 * @param {string} props.image - Social sharing image URL
 * @param {string} props.type - Content type (e.g., website, article)
 * @param {string} props.siteName - Website name
 * @param {Object} props.twitter - Twitter-specific options
 * @param {Object} props.facebook - Facebook-specific options
 * @param {Object} props.linkedin - LinkedIn-specific options
 */
const SocialSharingMeta = ({
  title = "Mohammed Sadhef | Full Stack Developer | MERN Stack & Python",
  description = "Full Stack Developer specializing in MERN Stack, Python, JavaScript, and AI integration. View my portfolio and projects.",
  url = "https://sadhef.info",
  image = "https://sadhef.info/sadhefportfolio.webp",
  type = "website",
  siteName = "Mohammed Sadhef Portfolio",
  twitter = {
    card: "summary_large_image",
    creator: "@mohdsadhef",
    site: "@mohdsadhef"
  },
  facebook = {
    appId: "" // Add your Facebook App ID if available
  },
  linkedin = {
    authorName: "Mohammed Sadhef"
  }
}) => {
  return (
    <Head>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Additional Open Graph tags for articles */}
      {type === "article" && (
        <>
          <meta property="article:published_time" content={new Date().toISOString()} />
          <meta property="article:author" content={`https://linkedin.com/in/${linkedin.authorName}`} />
          <meta property="article:section" content="Technology" />
          <meta property="article:tag" content="Full Stack Development" />
          <meta property="article:tag" content="MERN Stack" />
          <meta property="article:tag" content="Web Development" />
        </>
      )}
      
      {/* Facebook App ID if available */}
      {facebook.appId && <meta property="fb:app_id" content={facebook.appId} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitter.card} />
      <meta name="twitter:site" content={twitter.site} />
      <meta name="twitter:creator" content={twitter.creator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:domain" content={url.replace(/^https?:\/\//, '')} />
      
      {/* LinkedIn */}
      <meta name="linkedin:author" content={linkedin.authorName} />
      
      {/* Pinterest */}
      <meta name="pinterest-rich-pin" content="true" />
      
      {/* WhatsApp */}
      <meta property="og:image:alt" content={title} />
      
      {/* General social tags */}
      <meta name="author" content="Mohammed Sadhef" />
      <meta name="news_keywords" content="Full Stack Developer, MERN Stack, Web Development" />
      
      {/* Preconnect to social domains for faster sharing */}
      <link rel="preconnect" href="https://platform.twitter.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://platform.linkedin.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.facebook.com" crossOrigin="anonymous" />
      
      {/* Dynamic sharing links */}
      <link rel="canonical" href={url} />
    </Head>
  );
};

export default SocialSharingMeta;