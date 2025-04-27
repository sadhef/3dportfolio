import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Transition = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-black z-50 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }}
          onAnimationComplete={() => setIsLoading(false)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, times: [0, 0.5, 1], repeat: 0 }}
            className="text-white text-4xl font-bold"
          >
            <div className="text-center">
              <div className="text-5xl mb-3">Mohammed Sadhef</div>
              <div className="text-2xl">Portfolio</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Transition;