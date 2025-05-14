"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// Sample blog posts - in a real implementation, these would come from a CMS or API
const blogPosts = [
  {
    id: "modern-mern-stack",
    title: "Modern MERN Stack Development in 2025",
    excerpt: "Explore the latest techniques and best practices in MERN stack development for building scalable applications.",
    date: "May 10, 2025",
    image: "/blog/mern-stack.webp",
    category: "Development",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    slug: "/blog/modern-mern-stack"
  },
  {
    id: "python-ai-integration",
    title: "Integrating Python AI Models with React Applications",
    excerpt: "A comprehensive guide to connecting Python-based machine learning models with frontend React applications.",
    date: "April 25, 2025",
    image: "/blog/python-ai.webp",
    category: "AI & ML",
    tags: ["Python", "React", "Machine Learning", "API"],
    slug: "/blog/python-ai-integration"
  },
  {
    id: "three-js-optimization",
    title: "Optimizing Three.js for Performance on Low-End Devices",
    excerpt: "Learn how to create high-performance 3D web experiences that work smoothly across all devices.",
    date: "April 12, 2025",
    image: "/blog/threejs-opt.webp",
    category: "3D Graphics",
    tags: ["Three.js", "WebGL", "Performance", "Optimization"],
    slug: "/blog/three-js-optimization"
  }
];

// Blog post card component
const BlogPostCard = ({ post, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  
  // Use Intersection Observer for better performance
  useEffect(() => {
    if (typeof window === 'undefined' || !cardRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(cardRef.current);
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      className="bg-tertiary p-5 rounded-2xl sm:w-[340px] w-full h-full flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative w-full h-[200px] mb-4">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover rounded-lg"
        />

        <div className="absolute top-2 left-2">
          <span className="px-3 py-1 text-xs font-medium bg-black bg-opacity-70 text-white rounded-full">
            {post.category}
          </span>
        </div>
      </div>

      <div className="flex-grow">
        <div className="text-xs text-gray-400 mb-2">{post.date}</div>
        <h3 className="text-white font-bold text-[20px] mb-2">{post.title}</h3>
        <p className="mt-2 text-secondary text-[14px]">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span
            key={`${post.id}-${tag}`}
            className="text-[12px] bg-black bg-opacity-40 px-2 py-1 rounded-full text-white"
          >
            #{tag}
          </span>
        ))}
      </div>
      
      <Link 
        href={post.slug} 
        className="mt-auto text-sm font-medium text-white hover:underline self-start py-2 px-4 rounded-lg transition-colors duration-300 bg-gray-800 hover:bg-gray-700"
      >
        Read Article
      </Link>
    </motion.div>
  );
};

const Blog = () => {
  // State to track section visibility
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
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
    <div ref={sectionRef} className="relative w-full mx-auto">
      {/* Section heading */}
      <div className="mb-8">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`${styles.sectionSubText} text-center`}
        >
          Latest Insights
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${styles.sectionHeadText} text-center`}
        >
          Blog.
        </motion.h2>
        
        {/* Introduction text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px] mx-auto text-center px-4 sm:px-0"
        >
          Sharing my knowledge and experiences in full stack development,
          exploring MERN stack, Python, AI integration, and modern web technologies.
        </motion.p>
      </div>

      {/* Blog posts grid */}
      <div className="mt-10 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 px-4 sm:px-0">
        {blogPosts.map((post, index) => (
          <BlogPostCard key={post.id} index={index} post={post} />
        ))}
      </div>
      
      {/* View all posts link */}
      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center justify-center px-6 py-3 border border-white text-white rounded-full hover:bg-white hover:text-black transition-colors duration-300"
        >
          View All Articles
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 ml-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default SectionWrapper(Blog, "blog");