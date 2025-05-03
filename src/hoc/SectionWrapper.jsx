import { motion } from "framer-motion";
import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";

const StarWrapper = (Component, idName) =>
  function HOC() {
    // Determine if we should reduce motion
    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldReduceMotion = isMobile || prefersReducedMotion;
    
    // Use simpler version for better performance on mobile/reduced motion
    if (shouldReduceMotion) {
      return (
        <section
          className={`${styles.padding} max-w-7xl mx-auto relative z-0`}
        >
          <span className='hash-span' id={idName}>
            &nbsp;
          </span>
          <Component />
        </section>
      );
    }
    
    return (
      <motion.section
        variants={staggerContainer()}
        initial='hidden'
        whileInView='show'
        viewport={{ once: true, amount: 0.1 }} // Reduced from 0.25 for better performance
        className={`${styles.padding} max-w-7xl mx-auto relative z-0`}
      >
        <span className='hash-span' id={idName}>
          &nbsp;
        </span>

        <Component />
      </motion.section>
    );
  };

export default StarWrapper;