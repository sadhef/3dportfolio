import NextImage from 'next/image';
import { useState, useEffect } from 'react';

/**
 * SEO-optimized image component with lazy loading and LQIP (Low Quality Image Placeholder)
 * 
 * @param {Object} props - Image properties
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text (required for SEO)
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {string} props.className - CSS class
 * @param {boolean} props.priority - Whether to prioritize loading
 * @param {string} props.sizes - Responsive sizes attribute
 * @param {boolean} props.objectFit - CSS object-fit property
 * @param {Object} props.placeholderSrc - Optional LQIP source URL
 */
const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  objectFit = 'cover',
  placeholderSrc,
  ...props
}) => {
  const [loading, setLoading] = useState(!priority);
  const [imgSrc, setImgSrc] = useState(src);
  
  // Handle errors by falling back to placeholder
  const handleError = () => {
    if (imgSrc !== placeholderSrc && placeholderSrc) {
      setImgSrc(placeholderSrc);
    }
  };
  
  // Mark as loaded when image loads
  const handleLoad = () => {
    setLoading(false);
  };
  
  // Ensure alt text is provided for SEO
  useEffect(() => {
    if (!alt || alt === '') {
      console.warn(`SEO Warning: Image ${src} is missing alt text. Alt text is required for SEO.`);
    }
  }, [src, alt]);
  
  // Generate optimized sizes
  const getSizes = () => {
    if (props.fill) {
      return sizes;
    }
    
    if (width && width > 0) {
      // Calculate responsive sizes based on image width
      const maxWidth = width;
      return `(max-width: 768px) min(100vw, ${maxWidth}px), (max-width: 1200px) min(50vw, ${maxWidth}px), min(33vw, ${maxWidth}px)`;
    }
    
    return sizes;
  };
  
  return (
    <div className={`relative ${className} ${loading ? 'bg-gray-200 animate-pulse' : ''}`} style={{ width: props.fill ? '100%' : width, height: props.fill ? '100%' : height }}>
      <NextImage
        src={imgSrc}
        alt={alt}
        width={props.fill ? undefined : width}
        height={props.fill ? undefined : height}
        sizes={getSizes()}
        priority={priority}
        quality={props.quality || 85}
        loading={priority ? 'eager' : 'lazy'}
        onError={handleError}
        onLoad={handleLoad}
        style={{ objectFit }}
        {...props}
        // Add structured data through data attributes for better SEO
        data-caption={props.caption || alt}
        data-copyright={props.copyright || "Mohammed Sadhef"}
      />
      
      {/* Optional LQIP blurred placeholder */}
      {loading && placeholderSrc && (
        <div className="absolute inset-0 z-0 overflow-hidden bg-gray-100">
          <NextImage
            src={placeholderSrc}
            alt=""
            fill
            sizes={getSizes()}
            className="scale-110 blur-xl"
            priority
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Generate LQIP base64 data URLs for smaller images
 * 
 * @param {string} src - Original image source
 * @param {number} width - Width of the LQIP
 * @param {number} quality - Quality of the LQIP (1-100)
 * @returns {string} - Base64 encoded data URL
 */
export const generatePlaceholderDataURL = (src, width = 10, quality = 10) => {
  // This would typically be implemented server-side with Sharp or another image processing library
  // For client-side, we'll generate a simple placeholder format
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${width}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#cccccc" />
    </svg>`
  ).toString('base64')}`;
};

/**
 * Generate image metadata for SEO
 * 
 * @param {Object} image - Image information
 * @returns {Object} - Image metadata for structured data
 */
export const generateImageMetadata = (image) => {
  const { src, alt, width, height, caption, copyright } = image;
  
  return {
    "@context": "https://schema.org/",
    "@type": "ImageObject",
    "contentUrl": src,
    "description": alt,
    "name": caption || alt,
    "width": width,
    "height": height,
    "author": {
      "@type": "Person",
      "name": copyright || "Mohammed Sadhef"
    },
    "copyrightNotice": copyright || "© 2025 Mohammed Sadhef"
  };
};

export default OptimizedImage;