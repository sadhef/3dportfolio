"use client";

import React, { useEffect, useState, useCallback, memo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { navLinks } from "../constants";

const NavItem = memo(({ nav, active, setActive, index }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { delay: 0.1 * index, duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.li
      key={nav.id}
      custom={index}
      variants={itemVariants}
      className={`${active === nav.title ? "text-white" : "text-secondary"} hover:text-white text-[18px] font-light cursor-pointer`}
      onClick={() => setActive(nav.title)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setActive(nav.title);
          document.getElementById(nav.id)?.scrollIntoView({ behavior: "smooth" });
        }
      }}
      role="menuitem"
      aria-current={active === nav.title ? "page" : undefined}
    >
      <a href={`#${nav.id}`} className="relative inline-block py-2" aria-label={nav.title}>
        <span>{nav.title}</span>
        {active === nav.title && <motion.span layoutId="underline" className="absolute left-0 top-full block h-[1px] w-full bg-white" />}
      </a>
    </motion.li>
  );
});

NavItem.displayName = "NavItem";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = useCallback(() => {
    if (typeof window === "undefined") return;

    const currentScrollPos = window.scrollY;

    setScrolled(currentScrollPos > 100);

    if (window.innerWidth > 768) {
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
    }

    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    if (hash) {
      const item = navLinks.find((nav) => `#${nav.id}` === hash);
      if (item) setActive(item.title);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 transition-all duration-300 ${
        scrolled ? "bg-black bg-opacity-80 backdrop-blur-sm shadow-lg" : "bg-transparent"
      } ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => {
            setActive("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="Mohammed Sadhef, back to top"
        >
          <p className="text-white text-[18px] font-medium cursor-pointer tracking-wider">
            <span className="font-light">Mohammed</span>&nbsp;<span className="font-semibold">Sadhef</span>
          </p>
        </Link>

        {/* Desktop Navigation */}
        <motion.ul
          role="menubar"
          className="list-none hidden sm:flex flex-row gap-10"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
          }}
        >
          {navLinks.map((nav, index) => (
            <NavItem key={nav.id} nav={nav} active={active} setActive={setActive} index={index} />
          ))}
        </motion.ul>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <button
            aria-expanded={toggle}
            aria-controls="mobile-menu"
            aria-label={toggle ? "Close menu" : "Open menu"}
            className="w-8 h-8 cursor-pointer flex flex-col justify-center gap-1.5 items-end"
            onClick={() => setToggle(!toggle)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setToggle(!toggle);
            }}
          >
            <div className={`h-0.5 bg-white transition-all duration-300 ${toggle ? "w-6 rotate-45 translate-y-2" : "w-6"}`}></div>
            <div className={`h-0.5 bg-white transition-all duration-300 ${toggle ? "opacity-0" : "w-4"}`}></div>
            <div className={`h-0.5 bg-white transition-all duration-300 ${toggle ? "w-6 -rotate-45 -translate-y-2" : "w-5"}`}></div>
          </button>

          {toggle && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6 bg-black bg-opacity-90 backdrop-blur-lg absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl border border-gray-800 shadow-xl"
              role="menu"
            >
              <ul className="list-none flex flex-col gap-4">
                {navLinks.map((nav) => (
                  <li
                    key={nav.id}
                    role="menuitem"
                    tabIndex={0}
                    className={`font-poppins font-light cursor-pointer text-[16px] ${
                      active === nav.title ? "text-white" : "text-secondary"
                    }`}
                    onClick={() => {
                      setToggle(false);
                      setActive(nav.title);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setToggle(false);
                        setActive(nav.title);
                        document.getElementById(nav.id)?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    <a href={`#${nav.id}`}>{nav.title}</a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
