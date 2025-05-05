import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

// Optimized Contact component with better form handling and error management
const Contact = () => {
  const formRef = useRef();
  const sectionRef = useRef();
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Check for mobile device
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  
  // Detect if Earth canvas can be rendered (based on WebGL support)
  const [canRenderEarth, setCanRenderEarth] = useState(true);
  
  useEffect(() => {
    // Handle resize events for responsive design
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Check WebGL support for Earth rendering
    try {
      const canvas = document.createElement("canvas");
      const hasWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setCanRenderEarth(hasWebGL && !isMobile);
    } catch (e) {
      setCanRenderEarth(false);
    }
    
    // Use IntersectionObserver for animation triggering
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
          
          // Once it's been visible, we can stop observing
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [controls, isMobile]);

  // Validate form inputs
  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }
    
    if (!form.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message should be at least 10 characters";
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  // Handle input change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setForm({
      ...form,
      [name]: value,
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle form submission with improved error handling and user feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Create and send form data to Web3Forms
      const accessKey = "efed4309-e7eb-478b-b0a4-f3f9f15d4176"; // Get your own key from web3forms.com
      const formData = new FormData();
      
      formData.append("access_key", accessKey);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("message", form.message);
      formData.append("subject", `Contact from ${form.name} via Portfolio`);
      
      // Add honeypot field to prevent spam
      formData.append("botcheck", "");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setFormSubmitted(true);
        setForm({
          name: "",
          email: "",
          message: "",
        });
      } else {
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({
        ...errors,
        submit: error.message || "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants - simplified for reduced motion
  const formVariants = prefersReducedMotion || isMobile
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
      }
    : slideIn("left", "tween", 0.2, 1);
  
  const earthVariants = prefersReducedMotion || isMobile
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
      }
    : slideIn("right", "tween", 0.2, 1);

  return (
    <div 
      ref={sectionRef}
      className={`${isMobile ? 'mt-0' : 'xl:mt-12'} flex ${isMobile ? 'flex-col' : 'xl:flex-row flex-col-reverse'} gap-10 overflow-hidden w-full safari-stacking-fix`}
      itemScope 
      itemType="https://schema.org/ContactPage"
    >
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className={`${isMobile ? 'w-full' : 'flex-[0.75]'} bg-black-100 p-5 sm:p-8 rounded-2xl`}
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        {formSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 sm:mt-12 bg-tertiary py-6 px-4 sm:py-8 sm:px-6 rounded-lg text-center"
          >
            <h4 className="text-white font-bold text-xl sm:text-2xl mb-3 sm:mb-4">Thank You!</h4>
            <p className="text-secondary text-base sm:text-lg mb-4 sm:mb-6">
              Your message has been received. I'll get back to you as soon as possible.
            </p>
            <button
              onClick={() => setFormSubmitted(false)}
              className="bg-white py-2 px-6 sm:py-3 sm:px-8 rounded-xl outline-none w-fit text-black font-bold shadow-md shadow-primary mx-auto"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className='mt-8 sm:mt-12 flex flex-col gap-6 sm:gap-8'
            itemProp="potentialAction"
            itemScope
            itemType="https://schema.org/EmailMessage"
          >
            <label className='flex flex-col'>
              <span className='text-white font-medium mb-2 sm:mb-4'>Your Name</span>
              <input
                type='text'
                name='name'
                value={form.name}
                onChange={handleChange}
                placeholder="What's your name?"
                className={`bg-tertiary py-3 sm:py-4 px-4 sm:px-6 placeholder:text-secondary text-white rounded-lg outline-none border ${
                  errors.name ? "border-red-500" : "border-none"
                } font-medium`}
                aria-required="true"
                aria-invalid={errors.name ? "true" : "false"}
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1">{errors.name}</span>
              )}
            </label>
            
            <label className='flex flex-col'>
              <span className='text-white font-medium mb-2 sm:mb-4'>Your Email</span>
              <input
                type='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                placeholder="What's your email address?"
                className={`bg-tertiary py-3 sm:py-4 px-4 sm:px-6 placeholder:text-secondary text-white rounded-lg outline-none border ${
                  errors.email ? "border-red-500" : "border-none"
                } font-medium`}
                aria-required="true"
                aria-invalid={errors.email ? "true" : "false"}
                itemProp="email"
              />
              {errors.email && (
                <span className="text-red-500 text-sm mt-1">{errors.email}</span>
              )}
            </label>
            
            <label className='flex flex-col'>
              <span className='text-white font-medium mb-2 sm:mb-4'>Your Message</span>
              <textarea
                rows={isMobile ? 5 : 7}
                name='message'
                value={form.message}
                onChange={handleChange}
                placeholder='What do you want to say?'
                className={`bg-tertiary py-3 sm:py-4 px-4 sm:px-6 placeholder:text-secondary text-white rounded-lg outline-none border ${
                  errors.message ? "border-red-500" : "border-none"
                } font-medium`}
                aria-required="true"
                aria-invalid={errors.message ? "true" : "false"}
                itemProp="description"
              />
              {errors.message && (
                <span className="text-red-500 text-sm mt-1">{errors.message}</span>
              )}
            </label>
            
            {/* General submission error */}
            {errors.submit && (
              <div className="bg-red-900 bg-opacity-30 text-white p-4 rounded-lg">
                {errors.submit}
              </div>
            )}

            <button
              type='submit'
              disabled={loading}
              className={`${
                loading ? "bg-gray-400" : "bg-white hover:bg-gray-100"
              } py-2 px-6 sm:py-3 sm:px-8 rounded-xl outline-none w-fit text-black font-bold shadow-md shadow-primary transition-colors duration-200`}
              aria-busy={loading ? "true" : "false"}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </motion.div>

      <motion.div
        variants={earthVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className={`${isMobile ? 'w-full' : 'xl:flex-1'} xl:h-auto md:h-[550px] h-[250px] sm:h-[350px]`}
      >
        {canRenderEarth ? (
          <EarthCanvas />
        ) : (
          // Fallback for devices without WebGL support or mobile
          <div className="w-full h-full flex items-center justify-center bg-tertiary rounded-2xl">
            <div className="text-center p-4 sm:p-8">
              <h4 className="text-white text-lg sm:text-xl mb-2 sm:mb-4">Connect With Me</h4>
              <p className="text-secondary text-sm sm:text-base">
                I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
              </p>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Schema.org markup for SEO */}
      <div itemScope itemType="https://schema.org/Person" className="hidden">
        <meta itemProp="name" content="Mohammed Sadhef" />
        <meta itemProp="jobTitle" content="Full Stack Developer" />
        <link itemProp="url" href="https://sadhef.info" />
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");