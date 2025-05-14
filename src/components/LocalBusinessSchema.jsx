/**
 * Generate LocalBusiness schema for improved local SEO
 * This is particularly helpful if you do freelance work or have a business presence
 */
const LocalBusinessSchema = () => {
  const businessData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://sadhef.info/#business",
    "name": "Mohammed Sadhef - Full Stack Development",
    "description": "Professional Full Stack Development services specializing in MERN Stack, Python, and AI integration for businesses and startups.",
    "url": "https://sadhef.info",
    "logo": "https://sadhef.info/sadhefportfolio.webp",
    "image": "https://sadhef.info/sadhefportfolio.webp",
    "telephone": "+91-XXXXXXXXXX", // Replace with your actual phone if you want to display it
    "email": "contact@sadhef.info", // Replace with your actual email
    "priceRange": "$$", // Price range indicator
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kannur",
      "addressRegion": "Kerala",
      "addressCountry": "India"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 11.8745, // Replace with your actual coordinates
      "longitude": 75.3704 // Replace with your actual coordinates
    },
    "areaServed": [
      {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 11.8745,
          "longitude": 75.3704
        },
        "geoRadius": "50000" // 50 km radius
      },
      {
        "@type": "Country",
        "name": "India"
      },
      {
        "@type": "Country",
        "name": "Global"
      }
    ],
    "sameAs": [
      "https://github.com/mohdsadhef",
      "https://linkedin.com/in/mohdsadhef",
      "https://twitter.com/mohdsadhef"
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Full Stack Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "MERN Stack Development",
            "description": "Custom web application development using MongoDB, Express, React, and Node.js."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Python Development",
            "description": "Development of Python applications with a focus on data science and AI integration."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "API Development",
            "description": "Creation of RESTful and GraphQL APIs for web and mobile applications."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Database Design",
            "description": "Design and optimization of MongoDB, PostgreSQL, and other database systems."
          }
        }
      ]
    },
    "founder": {
      "@type": "Person",
      "name": "Mohammed Sadhef",
      "jobTitle": "Full Stack Developer",
      "sameAs": [
        "https://github.com/mohdsadhef",
        "https://linkedin.com/in/mohdsadhef"
      ]
    },
    "employee": [
      {
        "@type": "Person",
        "name": "Mohammed Sadhef",
        "jobTitle": "Full Stack Developer",
        "sameAs": [
          "https://github.com/mohdsadhef",
          "https://linkedin.com/in/mohdsadhef" 
        ]
      }
    ],
    "potentialAction": [
      {
        "@type": "ReserveAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://sadhef.info/#contact",
          "inLanguage": "en-US",
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "result": {
          "@type": "Reservation",
          "name": "Development Consultation"
        }
      },
      {
        "@type": "ViewAction",
        "target": [
          "https://sadhef.info/#projects"
        ],
        "name": "View Projects"
      }
    ],
    "paymentAccepted": ["Credit Card", "PayPal", "Bank Transfer"],
    "currenciesAccepted": "INR, USD"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }}
    />
  );
};

export default LocalBusinessSchema;