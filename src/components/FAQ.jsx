"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import schemaGenerators from "../utils/schema-generators";

// FAQ items designed to capture featured snippets
const faqItems = [
  {
    question: "What is a Full Stack MERN Developer?",
    answer: "A Full Stack MERN Developer is a web developer proficient in MongoDB, Express.js, React.js, and Node.js. They can handle both frontend and backend development, creating complete web applications from database design to user interface implementation. These developers build responsive websites, APIs, and manage database operations using JavaScript throughout the entire stack."
  },
  {
    question: "What skills should a MERN Stack developer have in 2025?",
    answer: "In 2025, a competitive MERN Stack developer should have expertise in MongoDB, Express.js, React.js, and Node.js, along with TypeScript, Next.js, and testing frameworks. They should also be proficient in containerization (Docker & Kubernetes), CI/CD pipelines, cloud services (AWS/Azure/GCP), and have working knowledge of AI integration, GraphQL, WebSockets, and Progressive Web Apps for modern application development."
  },
  {
    question: "How do you integrate Python AI with MERN Stack applications?",
    answer: "To integrate Python AI with MERN Stack applications, create a Python API using Flask or FastAPI that hosts your AI/ML models. Deploy this API separately, then connect your Node.js backend to it via HTTP requests. Your Node.js application can send data to the Python API for processing and receive predictions or insights, which it then forwards to the React frontend. For production, containerize both services with Docker and orchestrate with Kubernetes for seamless integration."
  },
  {
    question: "What is Three.js and how is it used in portfolio websites?",
    answer: "Three.js is a JavaScript library that enables 3D graphics in web browsers using WebGL. In portfolio websites, Three.js creates interactive 3D elements like animated backgrounds, custom cursors, rotating models, and immersive showcases of work. Developers use it to create memorable user experiences that demonstrate technical skill while highlighting their projects through interactive 3D galleries or animations, making portfolios stand out from traditional static websites."
  },
  {
    question: "How can I optimize a Three.js portfolio for performance?",
    answer: "To optimize a Three.js portfolio for performance: 1) Use lower-polygon models, 2) Implement level-of-detail rendering, 3) Enable progressive loading with placeholder geometries, 4) Add device capability detection to adjust complexity, 5) Optimize textures and implement texture compression, 6) Use instancing for repeated objects, 7) Implement occlusion culling, 8) Minimize real-time lights and shadows, 9) Employ scene partitioning, and 10) Load assets asynchronously. Always test on lower-end devices and include fallbacks for older browsers."
  },
  {
    question: "What are the best practices for creating a developer portfolio in 2025?",
    answer: "Best practices for a developer portfolio in 2025 include: 1) Implementing responsive design with mobile-first approach, 2) Optimizing for Core Web Vitals and performance, 3) Showcasing 3-5 high-quality projects with case studies, 4) Including interactive elements using technologies like Three.js, 5) Incorporating accessibility features (WCAG compliance), 6) Adding dark/light mode options, 7) Implementing proper SEO optimization, 8) Demonstrating technical writing through a blog section, 9) Ensuring cross-browser compatibility, and 10) Adding subtle animations and micro-interactions for engagement."
  }
];

// FAQ Item component
const FAQItem = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="mb-6 border-b border-gray-700 pb-6">
      <button
        className="flex w-full justify-between items-center text-left focus:outline-none"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <h3 className="text-xl font-semibold text-white">{question}</h3>
        <svg
          className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      <div 
        className={`mt-4 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        aria-hidden={!isOpen}
      >
        <p className="text-secondary text-base leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  // State to track open FAQ items
  const [openItems, setOpenItems] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Toggle FAQ item open/closed
  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Use Intersection Observer to track when section becomes visible
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(sectionRef.current);
    
    return () => observer.unobserve(sectionRef.current);
  }, []);

  return (
    <>
      {/* Add FAQ Schema.org structured data */}
      {typeof window !== 'undefined' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaGenerators.generateFAQSchema(faqItems))
          }}
        />
      )}
      
      <div ref={sectionRef} className="relative w-full mx-auto">
        {/* Section heading */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className={styles.sectionSubText}>Common Questions</p>
          <h2 className={styles.sectionHeadText}>FAQ.</h2>
          
          <p className="mt-4 text-secondary text-[17px] max-w-3xl mx-auto leading-[30px]">
            Answers to frequently asked questions about full stack development,
            MERN stack, Python integration, and portfolio building.
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <FAQItem
                question={item.question}
                answer={item.answer}
                isOpen={openItems[index] || false}
                toggleOpen={() => toggleItem(index)}
              />
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-secondary text-[17px] mb-6">
            Have more questions about my work or how I can help with your project?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 bg-white text-black font-medium rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Contact Me
            <svg 
              className="ml-2 w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </>
  );
};

export default SectionWrapper(FAQ, "faq");