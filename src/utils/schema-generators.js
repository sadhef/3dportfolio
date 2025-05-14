/**
 * Advanced Schema.org data generator for MERN Stack Developer Portfolio
 * This file generates all structured data objects for the website
 */

/**
 * Generate Schema.org Person structured data
 * @returns {Object} Person schema
 */
export const generatePersonSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mohammed Sadhef",
    "givenName": "Mohammed",
    "familyName": "Sadhef",
    "url": "https://sadhef.info",
    "image": "https://sadhef.info/sadhefportfolio.webp",
    "jobTitle": "Full Stack Developer",
    "gender": "Male",
    "worksFor": {
      "@type": "Organization",
      "name": "Biztras",
      "url": "https://biztras.com"
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
    },
    "workLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Kerala",
        "addressCountry": "India"
      }
    },
    "knowsLanguage": [
      {
        "@type": "Language",
        "name": "English"
      },
      {
        "@type": "Language",
        "name": "Malayalam"
      }
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full Stack Developer",
      "occupationCategory": {
        "@type": "CategoryCode",
        "name": "15-1132.00",
        "url": "https://www.onetonline.org/link/summary/15-1132.00",
        "inDefinedTermSet": "https://www.onetonline.org/"
      },
      "skills": [
        "JavaScript", "React", "Node.js", "Python", 
        "MongoDB", "Express", "Three.js", "Docker"
      ]
    }
  };
};

/**
 * Generate Schema.org WebSite structured data
 * @returns {Object} WebSite schema
 */
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://sadhef.info",
    "name": "Mohammed Sadhef - Full Stack Developer Portfolio",
    "description": "Full Stack Developer specializing in MERN Stack, Python, JavaScript, and AI integration. View my portfolio and projects.",
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
    },
    "copyrightYear": "2025",
    "creator": {
      "@type": "Person",
      "name": "Mohammed Sadhef"
    },
    "inLanguage": "en-US",
    "thumbnailUrl": "https://sadhef.info/sadhefportfolio.webp",
    "datePublished": "2025-01-01",
    "dateModified": new Date().toISOString()
  };
};

/**
 * Generate Schema.org Portfolio/CreativeWork structured data
 * @returns {Object} CreativeWork schema
 */
export const generatePortfolioSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Mohammed Sadhef's Portfolio",
    "creator": {
      "@type": "Person",
      "name": "Mohammed Sadhef"
    },
    "dateCreated": "2025-01-01",
    "dateModified": new Date().toISOString(),
    "keywords": "Full Stack Developer, MERN Stack, React.js, Node.js, MongoDB, Express.js, Python, JavaScript, AI Integration, Web Development, Portfolio",
    "description": "Full Stack Developer specializing in MERN Stack, Python, JavaScript, and AI integration. View my portfolio and projects.",
    "url": "https://sadhef.info",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Mohammed Sadhef Portfolio",
      "url": "https://sadhef.info"
    },
    "genre": "Professional Portfolio",
    "about": {
      "@type": "Thing",
      "name": "Full Stack Development",
      "description": "Professional portfolio showcasing Full Stack Development skills and projects."
    },
    "creativeWorkStatus": "Published",
    "abstract": "Portfolio of Mohammed Sadhef, a Full Stack Developer specializing in MERN Stack and Python."
  };
};

/**
 * Generate Schema.org Project schema for a specific project
 * @param {Object} project - Project data
 * @returns {Object} SoftwareApplication schema
 */
export const generateProjectSchema = (project) => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": project.name,
    "description": project.description,
    "url": project.source_code_link,
    "applicationCategory": "WebApplication",
    "operatingSystem": "All",
    "author": {
      "@type": "Person",
      "name": "Mohammed Sadhef"
    },
    "datePublished": "2025-01-01", // Replace with actual project date when available
    "keywords": project.tags.map(tag => tag.name).join(", "),
    "screenshot": project.image,
    "softwareVersion": "1.0",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };
};

/**
 * Generate Schema.org Blog structured data
 * @returns {Object} Blog schema
 */
export const generateBlogSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Mohammed Sadhef's Blog",
    "description": "Insights and tutorials on Full Stack Development, MERN Stack, Python, and modern web technologies.",
    "url": "https://sadhef.info/blog",
    "author": {
      "@type": "Person",
      "name": "Mohammed Sadhef"
    },
    "inLanguage": "en-US",
    "copyrightYear": "2025",
    "datePublished": "2025-01-01",
    "dateModified": new Date().toISOString(),
    "isPartOf": {
      "@type": "WebSite",
      "name": "Mohammed Sadhef Portfolio",
      "url": "https://sadhef.info"
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url": "https://sadhef.info/blog/modern-mern-stack"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url": "https://sadhef.info/blog/python-ai-integration"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url": "https://sadhef.info/blog/three-js-optimization"
        }
      ]
    }
  };
};

/**
 * Generate Schema.org BlogPosting structured data for an article
 * @param {Object} post - Post data
 * @returns {Object} BlogPosting schema
 */
export const generateBlogPostSchema = (post) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://sadhef.info/blog/${post.slug}`
    },
    "headline": post.title,
    "description": post.excerpt,
    "image": post.image,
    "datePublished": post.date,
    "dateModified": post.lastModified || post.date,
    "author": {
      "@type": "Person",
      "name": "Mohammed Sadhef",
      "url": "https://sadhef.info"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Mohammed Sadhef",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sadhef.info/sadhefportfolio.webp"
      }
    },
    "articleBody": post.content,
    "keywords": post.tags.join(", "),
    "wordCount": post.content ? post.content.split(/\s+/).length : 0,
    "articleSection": post.category,
    "isPartOf": {
      "@type": "Blog",
      "name": "Mohammed Sadhef's Blog",
      "url": "https://sadhef.info/blog"
    }
  };
};

/**
 * Generate Schema.org FAQPage structured data
 * @param {Array} faqs - List of FAQs
 * @returns {Object} FAQPage schema
 */
export const generateFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

/**
 * Generate Schema.org BreadcrumbList structured data
 * @param {Array} breadcrumbs - List of breadcrumb items
 * @returns {Object} BreadcrumbList schema
 */
export const generateBreadcrumbsSchema = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

/**
 * Generate Schema.org ServiceOffering structured data
 * @returns {Object} ServiceOffering schema
 */
export const generateServicesSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Full Stack Development",
    "provider": {
      "@type": "Person",
      "name": "Mohammed Sadhef"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Global"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Full Stack Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Web Development",
            "description": "Custom web application development using modern frameworks and technologies."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Python Development",
            "description": "Python application development with a focus on data science and AI integration."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Backend Development",
            "description": "Scalable and secure backend solutions using Node.js, Express, and MongoDB."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Content Creation",
            "description": "Technical content creation and documentation for development projects."
          }
        }
      ]
    }
  };
};

// Export all schema generators
export default {
  generatePersonSchema,
  generateWebsiteSchema,
  generatePortfolioSchema,
  generateProjectSchema,
  generateBlogSchema,
  generateBlogPostSchema,
  generateFAQSchema,
  generateBreadcrumbsSchema,
  generateServicesSchema
};