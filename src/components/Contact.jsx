import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { EarthCanvas, StaticEarthImage } from "./canvas/Earth";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [earthLoaded, setEarthLoaded] = useState(false);
  const [earthError, setEarthError] = useState(false);
  const earthContainerRef = useRef(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Handle form submission using Web3Forms
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Web3Forms public access key
    const accessKey = "efed4309-e7eb-478b-b0a4-f3f9f15d4176";
    
    // Prepare form data
    const formData = new FormData();
    formData.append("access_key", accessKey);
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("message", form.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setLoading(false);
        alert("Thank you. I will get back to you as soon as possible.");
        setForm({
          name: "",
          email: "",
          message: "",
        });
      } else {
        setLoading(false);
        alert(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Monitor Earth canvas loading status
  useEffect(() => {
    // Check if Earth canvas loaded correctly
    const checkEarthCanvas = () => {
      if (earthContainerRef.current) {
        const canvas = earthContainerRef.current.querySelector('canvas');
        if (canvas) {
          setEarthLoaded(true);
        } else {
          // If canvas doesn't exist after 3 seconds, show static fallback
          setTimeout(() => {
            const canvasCheck = earthContainerRef.current?.querySelector('canvas');
            if (!canvasCheck) {
              console.log("Earth canvas failed to load, showing static image");
              setEarthError(true);
            }
          }, 3000);
        }
      }
    };
    
    checkEarthCanvas();
    
    // Re-check after a delay
    const timer = setTimeout(checkEarthCanvas, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}>
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75] bg-black-100 p-8 rounded-2xl contact-form-container'
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-12 flex flex-col gap-8 contact-form'
        >
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Name</span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
              required
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your email</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email address?"
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
              required
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Message</span>
            <textarea
              rows={7}
              name='message'
              value={form.message}
              onChange={handleChange}
              placeholder='What do you want to say?'
              className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
              required
            />
          </label>

          <button
            type='submit'
            className='bg-white py-3 px-8 rounded-xl outline-none w-fit text-black font-bold shadow-md shadow-primary'
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px] earth-column'
        ref={earthContainerRef}
      >
        {earthError ? (
          <StaticEarthImage />
        ) : (
          <EarthCanvas />
        )}
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");