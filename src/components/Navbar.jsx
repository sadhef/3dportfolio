import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { navLinks } from "../constants";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navbar item animations
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    show: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 transition-all duration-300 ${
        scrolled ? "bg-black bg-opacity-80 backdrop-blur-sm shadow-lg" : "bg-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <Link
          to='/'
          className='flex items-center gap-3'
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <p className='text-white text-[18px] font-medium cursor-pointer tracking-wider'>
            <span className="font-light">Mohammed</span>&nbsp;
            <span className="font-semibold">SADHEF</span>
          </p>
        </Link>

        {/* Desktop Navigation */}
        <motion.ul 
          className='list-none hidden sm:flex flex-row gap-10'
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
        >
          {navLinks.map((nav, index) => (
            <motion.li
              key={nav.id}
              custom={index}
              variants={itemVariants}
              className={`${
                active === nav.title ? "text-white" : "text-secondary"
              } hover:text-white text-[18px] font-light cursor-pointer`}
              onClick={() => setActive(nav.title)}
            >
              <a 
                href={`#${nav.id}`}
                className="relative inline-block py-2"
              >
                <span>{nav.title}</span>
                {active === nav.title && (
                  <motion.span 
                    layoutId="underline"
                    className="absolute left-0 top-full block h-[1px] w-full bg-white" 
                  />
                )}
              </a>
            </motion.li>
          ))}
        </motion.ul>

        {/* Mobile Navigation */}
        <div className='sm:hidden flex flex-1 justify-end items-center'>
          <div 
            className={`w-8 h-8 cursor-pointer flex flex-col justify-center gap-1.5 items-end`}
            onClick={() => setToggle(!toggle)}
          >
            <div className={`h-0.5 bg-white transition-all duration-300 ${toggle ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`}></div>
            <div className={`h-0.5 bg-white transition-all duration-300 ${toggle ? 'opacity-0' : 'w-4'}`}></div>
            <div className={`h-0.5 bg-white transition-all duration-300 ${toggle ? 'w-6 -rotate-45 -translate-y-2' : 'w-5'}`}></div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: toggle ? 1 : 0,
              scale: toggle ? 1 : 0.95,
              pointerEvents: toggle ? "auto" : "none" 
            }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-black bg-opacity-90 backdrop-blur-lg absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl border border-gray-800 shadow-xl"
          >
            <ul className='list-none flex flex-col gap-4'>
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-light cursor-pointer text-[16px] ${
                    active === nav.title ? "text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;