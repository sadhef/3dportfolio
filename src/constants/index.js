import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  biztras,
  tesla,
  shopify,
  carrent,
  jobit,
  tripguide,
  threejs,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "Python Developer",
    icon: web,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: " Full Stack Developer",
    company_name: "Biztras",
    icon: biztras,
    iconBg: "#383E56",
    date: "October 2024 - April 2025",
    points: [
      "Developed a web application using React.js, Express.js, Node.js, MongoDB, PostgreSQL, and Docker for containerization, ensuring a scalable and efficient architecture.",
      "Integrated Python for data science, AI, and machine learning functionalities, utilizing Dash to build interactive data visualizations and dashboards.",
      "Combined React.js for the front-end with Dash in Python to create a seamless user interface, merging the power of React's dynamic components with Python’s data-driven insights.",
      "Gained hands-on experience in handling both full-stack web development and data-driven applications, leveraging a diverse tech stack to meet project requirements.",
    ],
  },
  
];

const projects = [
  {
    name: "Weather Application",
    description:
      "A web-based weather application utilizing HTML, CSS, Bootstrap, and JavaScript for an intuitive and responsive user interface, enabling users to search and view real-time weather data efficiently.",
    tags: [
      {
        name: "HTML",
        color: "blue-text-gradient",
      },
      {
        name: "JAVASCRIPT",
        color: "green-text-gradient",
      },
      {
        name: "BOOTSTRAP",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://66ba64628742a40eefd6ae4b--dazzling-duckanoo-9ca102.netlify.app/",
  },
  {
    name: "Movie Website",
    description:
      "A React app using Vite and Bootstrap that displays favorite movies with reusable components (Header, Movie, MovieList) and props.Fetches movie data from an external API.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "Bootstrap",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    source_code_link: "https://66b8f83704f2f5888f435af8--lovely-buttercream-40047c.netlify.app/",
  },
];

export { services, technologies, experiences, projects };
