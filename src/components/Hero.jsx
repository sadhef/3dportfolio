import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeIn } from "../utils/motion";

const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto flex items-center justify-center overflow-hidden">
      {/* Subtle spotlight effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent to-black opacity-80 z-0" />
      
      {/* Animated spotlight */}
      <motion.div 
        className="absolute w-full max-w-lg h-96 rounded-full bg-white blur-[120px] opacity-5 z-0"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.03, 0.05, 0.03]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="container relative z-10 px-6 mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Profile line */}
          <motion.div 
            variants={fadeIn("down", "tween", 0.2, 1)}
            initial="hidden"
            animate="show"
            className="flex items-center mb-4"
          >
            <div className="h-[1px] w-6 bg-white-100 mr-2 opacity-60" />
            <span className="text-white-100 text-sm tracking-widest uppercase font-light">Full Stack Developer</span>
            <div className="h-[1px] w-6 bg-white-100 ml-2 opacity-60" />
          </motion.div>
          
          {/* Name with elegant styling */}
          <motion.h1 
            variants={fadeIn("down", "tween", 0.3, 1)}
            initial="hidden"
            animate="show"
            className={`${styles.heroHeadText} text-white mb-2 text-center`}
          >
            Mohammed <span className="text-white relative inline-block after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-white after:opacity-30">Sadhef</span>
          </motion.h1>
          
          {/* Subtitle based on CV */}
          <motion.p 
            variants={fadeIn("down", "tween", 0.4, 1)}
            initial="hidden"
            animate="show"
            className="text-secondary text-lg max-w-2xl text-center leading-relaxed font-light mt-3"
          >
            Highly motivated self-starter specializing in MERN stack development, 
            with experience in data science, AI integration, and mobile app development.
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div 
            variants={fadeIn("up", "tween", 0.5, 1)}
            initial="hidden"
            animate="show"
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <a href="#contact" className="btn-primary">
              <span className="z-10 relative">Get In Touch</span>
            </a>
            <a href="#projects" className="btn-secondary">
              <span className="z-10 relative">View Projects</span>
            </a>
          </motion.div>
          
          {/* Tech keywords from CV */}
          <motion.div 
            variants={fadeIn("up", "tween", 0.6, 1)}
            initial="hidden"
            animate="show"
            className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-12 max-w-xl"
          >
            {["React.js", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "Docker", "Python", "Redux", "TailwindCSS"].map((tech, index) => (
              <span key={index} className="text-white text-opacity-50 text-sm">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute xs:bottom-10 bottom-16 w-full flex justify-center items-center">
        <a href="#about" className="flex flex-col items-center">
          <motion.div
            animate={{
              y: [0, 12, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
            className="mb-1 w-6 h-10 rounded-full border-2 border-white border-opacity-20 flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
          <span className="text-white-100 text-opacity-50 text-xs uppercase tracking-widest">Scroll</span>
        </a>
      </div>
    </section>
  );
};

export default Hero;