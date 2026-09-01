/**
 * One-time seed: pushes the current hard-coded portfolio content into MongoDB
 * so every section becomes editable from the admin panel.
 *
 * Usage:  npm run seed        (from the backend/ folder)
 *
 * Safe to re-run: each collection is only seeded when it is empty.
 * Use  SEED_FORCE=1 npm run seed  to wipe & re-seed everything.
 */

require("dotenv").config();
const mongoose = require("mongoose");

const Project = require("../model/project");
const Skill = require("../model/skill");
const Experience = require("../model/experience");
const Education = require("../model/education");
const Service = require("../model/service");
const SiteContent = require("../model/siteContent");

const DB = process.env.MONGODB_URI || process.env.DATABASE;
const FORCE = process.env.SEED_FORCE === "1";

// ————————————————————————————————————————————————————————————
// Data (mirrors the frontend fallbacks as of the last manual edit)
// ————————————————————————————————————————————————————————————

const projects = [
  {
    title: "Licious – Online Meat Delivery Platform",
    description:
      "A full-featured online meat delivery platform inspired by Licious, built using Next.js and the MERN ecosystem. The application offers a smooth and modern shopping experience with category-based browsing, product filtering, cart & checkout flow, and secure authentication. The platform is fully responsive, optimized for SEO, and delivers high-performance user interactions using server components and API routes from Next.js.",
    tools:
      "Next.js, React.js, Node.js, Express.js, MongoDB, Redux Toolkit, Tailwind CSS, Material UI, JWT, REST APIs",
    accomplishments: [
      "Modern homepage with banners, curated meat categories, and featured products",
      "Implemented secure user authentication & authorization using JWT",
      "Built product listing pages with category filters (Chicken, Mutton, Fish, Eggs, etc.)",
      "Developed detailed product pages with weight options, pricing, and nutritional info",
      "Added robust cart functionality with quantity updates and dynamic pricing",
      "Created a checkout flow with address input, delivery options, and payment simulation",
      "Developed an Admin Panel to manage products, categories, and orders",
      "Built using Next.js App Router, Server Components, API Routes, and optimized rendering",
      "Responsive and mobile-friendly UI inspired by Licious (Tailwind CSS + Material UI)",
      "Improved SEO using Next.js metadata, image optimization, and pre-rendering techniques",
    ],
    liveLink: "https://www.licious.in/",
    sourceLink: "",
    src: "/images/licious.png",
    order: 1,
  },
  {
    title: "ShopKart",
    description:
      "ShopKart is a fully functional MERN stack-based e-commerce platform designed to deliver a seamless online shopping experience. It includes secure authentication, product management, payment integration, and an admin dashboard for efficient store management. With a modern UI built using Tailwind CSS and Material UI, the platform ensures a smooth and responsive user experience.",
    tools:
      "React, Bootstrap, JavaScript, HTML, CSS ,Node.js, Express, MongoDB, tailwind css, material ui",
    accomplishments: [
      "User Authentication & Authorization (JWT-based login, signup, and secure access)",
      "Password Reset with email link for account recovery",
      "Admin Dashboard for managing products, users, and orders",
      "Product Listings with advanced filtering and sorting",
      "Shopping Cart for easy order management",
      "Secure Payment Integration with Stripe/Razorpay",
      "Product Reviews & Ratings to enhance customer engagement",
      "Fully Responsive UI with Tailwind CSS & Material UI",
      "SEO-Optimized structure for better search visibility",
    ],
    liveLink: "https://shopkart-epla.onrender.com/",
    sourceLink: "https://github.com/bablukumar9001/ShopKart",
    src: "/images/shopkart.png",
    order: 2,
  },
  {
    title: "My Portfolio",
    description:
      "This MERN stack-based portfolio website serves as a digital resume and professional showcase. It highlights personal information, skills, education, projects, and experience in an interactive and visually appealing manner. The platform is designed to be fully responsive, ensuring a seamless user experience across all devices.",
    tools: "React, Node.js, Express, MongoDB, JavaScript, HTML, CSS",
    accomplishments: [
      "About Me Section displaying professional summary, expertise, and contact details",
      "Projects Showcase with live project links and descriptions",
      "dark and light theme",
      "Skills & Tech Stack highlighting frontend, backend, and database expertise",
      "Education & Experience section detailing academic and professional journey",
      "Resume Download option for recruiters to access an up-to-date resume",
      "Contact Form enabling easy communication via email integration",
      "Responsive Design optimized for desktops, tablets, and mobile devices",
      "SEO Optimized for better search visibility and reach",
    ],
    liveLink: "https://bablukumar.onrender.com/",
    sourceLink: "https://github.com/bablukumar9001/MERN-portfolio-frontend",
    src: "/images/portfolio.png",
    order: 3,
  },
  {
    title: "Veavix",
    description:
      "Veavix is a professional business website designed to showcase company services, improve online presence, and enhance user engagement. Built with the MERN stack, the platform delivers a modern, responsive, and seamless user experience.",
    tools: "React, Bootstrap, JavaScript, HTML, CSS ,Node.js, Express, MongoDB ",
    accomplishments: [
      "Responsive UI/UX: Clean and intuitive interface optimized for all devices.",
      "Service Showcase: Detailed sections highlighting company services and offerings",
      "Dynamic Content Management: Easily updateable service and portfolio sections.",
      "Contact & Inquiry Forms: Secure forms for customer inquiries with backend email integration.",
      "SEO Optimization: Well-structured meta tags and content for better search visibility.",
      "Fast Performance: Optimized for speed using caching and efficient API calls.",
    ],
    liveLink: "https://veavix.onrender.com/",
    sourceLink: "https://github.com/bablukumar9001/Veavix-frontend",
    src: "/images/veavix.png",
    order: 4,
  },
];

const skills = [
  // Languages and Databases
  { name: "Javascript", image: "/images/javascript.png", category: "Languages and Databases", order: 1 },
  { name: "Typescript", image: "/images/typescript.png", category: "Languages and Databases", order: 2 },
  { name: "PHP", image: "/images/php.png", category: "Languages and Databases", order: 3 },
  { name: "HTML5", image: "/images/html5-300x300.jpg", category: "Languages and Databases", order: 4 },
  { name: "MySQL", image: "/images/mysql-logo-1-300x300.jpg", category: "Languages and Databases", order: 5 },
  { name: "MongoDB", image: "/images/mongodb.png", category: "Languages and Databases", order: 6 },
  // Libraries and Frameworks
  { name: "React Js", image: "/images/react.png", category: "Libraries and Frameworks", order: 1 },
  { name: "Next Js", image: "/images/nextjs.png", category: "Libraries and Frameworks", order: 2 },
  { name: "Express Js", image: "/images/express.png", category: "Libraries and Frameworks", order: 3 },
  { name: "Node Js", image: "/images/node.png", category: "Libraries and Frameworks", order: 4 },
  { name: "Laravel", image: "/images/laravel.png", category: "Libraries and Frameworks", order: 5 },
  { name: "CSS3", image: "/images/css3-300x300.jpg", category: "Libraries and Frameworks", order: 6 },
  { name: "Bootstrap", image: "/images/bootstrap.png", category: "Libraries and Frameworks", order: 7 },
  { name: "Tailwind", image: "/images/tailwind.png", category: "Libraries and Frameworks", order: 8 },
  { name: "Material UI", image: "/images/materialui.png", category: "Libraries and Frameworks", order: 9 },
  // Tools & Technologies
  { name: "Git", image: "/images/git.png", category: "Tools & Technologies", order: 1 },
  { name: "Postman", image: "/images/postman.png", category: "Tools & Technologies", order: 2 },
  { name: "API's", image: "/images/api.png", category: "Tools & Technologies", order: 3 },
  { name: "aws", image: "/images/aws.png", category: "Tools & Technologies", order: 4 },
  { name: "docker", image: "/images/docker.png", category: "Tools & Technologies", order: 5 },
];

const experiences = [
  {
    companyLogo: "/images/brancosoft.png",
    companyName: "Brancosoft Pvt. Ltd.",
    position: "Full Stack Developer",
    duration: "Sep 2023 - Present",
    location: "Noida, India",
    color: "#ff014f",
    icon: "fas fa-briefcase",
    achievements: [
      "Experienced in building high-performance, SEO-friendly applications using Next.js with SSR, SSG, Server Actions, and the App Router.",
      "Developed high-performance backend systems using Node.js and Express, delivering secure and scalable RESTful APIs.",
      "Improved integration with third-party services to create smoother and more seamless user experiences.",
      "Built scalable server-side solutions to enhance performance, reliability, and application efficiency.",
      "Contributed to front-end development using React.js by implementing reusable components and improving overall UI/UX.",
      "Converted design mockups into responsive, interactive, and visually appealing interfaces using modern frontend technologies.",
    ],
    order: 1,
  },
  {
    companyLogo: "/images/drpu.jpg",
    companyName: "DRPU Software Pvt. Ltd.",
    position: "Frontend Developer",
    duration: "March 2023 - Aug 2023",
    location: "Noida, India",
    color: "#4d79ff",
    icon: "fas fa-laptop-code",
    achievements: [
      "Developed responsive web interfaces with HTML, CSS, and JavaScript",
      "Enhanced user experience across devices with mobile-first approach",
      "Collaborated with design teams to implement visually appealing layouts",
      "Applied HTML for structure, CSS for styling, and JavaScript for interactivity",
      "Employed front-end best practices, ensuring optimized code for consistent design",
    ],
    order: 2,
  },
];

const education = [
  {
    degree: "Masters in Computer and Application (MCA)",
    institution: "AKTU University",
    year: "2021 - 2023",
    description:
      "Focused on software development, web technologies, and database management. Developed multiple projects using React.js and Node.js.",
    icon: "fas fa-graduation-cap",
    color: "#ff014f",
    order: 1,
  },
  {
    degree: "Bachelor in Computer and Application (BCA)",
    institution: "ABC Technical Institute",
    year: "2018 - 2021",
    description:
      "Specialized in web development using MERN stack and PHP Laravel. Completed various projects including personal portfolio websites and e-commerce platforms.",
    icon: "fas fa-university",
    color: "#4d79ff",
    order: 2,
  },
  {
    degree: "Intermediate (12th)",
    institution: "SBN public school (CBSE)",
    year: "2016 - 2018",
    description:
      "Completed higher secondary education with focus on computer science and mathematics.",
    icon: "fas fa-school",
    color: "#00b359",
    order: 3,
  },
];

const services = [
  {
    icon: "FaCode",
    title: "Full-Stack Web Development",
    description:
      "Building scalable web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js). Expertise in both front-end and back-end development for seamless user experiences.",
    order: 1,
  },
  {
    icon: "FaReact",
    title: "Frontend Development",
    description:
      "Creating responsive and dynamic user interfaces with React.js. Specializing in modern UI/UX design principles for engaging and accessible web applications.",
    order: 2,
  },
  {
    icon: "FaDatabase",
    title: "Backend Development",
    description:
      "Developing robust server-side applications using Node.js and Express.js. Experience with RESTful APIs, database integration, and authentication systems.",
    order: 3,
  },
  {
    icon: "FaMobileAlt",
    title: "Responsive Design",
    description:
      "Designing websites that are mobile-friendly and responsive. Ensuring that web applications perform flawlessly across all devices, from desktops to smartphones.",
    order: 4,
  },
  {
    icon: "FaLaptopCode",
    title: "Custom Web Application Development",
    description:
      "Designing and developing tailored web applications using both MERN and PHP Laravel. Providing solutions that meet specific business needs with scalability and performance in mind.",
    order: 5,
  },
  {
    icon: "FaNetworkWired",
    title: "API Development & Integration",
    description:
      "Building and integrating RESTful APIs using Node.js/Express.js and PHP Laravel for seamless communication between client and server. Expertise in third-party API integration for enhanced functionality.",
    order: 6,
  },
];

const siteContent = {
  key: "main",
  resumeUrl:
    "https://drive.google.com/file/d/15aOdmnAreAGIj3IoGbr2knPda-UNOxM-/view?usp=sharing",
  heroGreeting: "WELCOME TO MY WORLD",
  heroName: "Bablu kumar",
  heroLocation: "based in India",
  heroRoles: [
    "Web Developer",
    "React Developer",
    "Full Stack Developer",
    "MERN Developer",
  ],
  aboutBio:
    "I'm Bablu Kumar, a dedicated MERN stack developer from India. I specialize in merging logic with creativity to deliver intuitive, accessible, and visually appealing web experiences. My work ranges from small business websites to sophisticated, feature-rich web applications. I'm eager to bring my skills to a dynamic team where I can continue to grow and make an impact.",
  aboutYears: "2+",
  contactEmail: "bablukumar09001@gmail.com",
  contactPhone: "+91 8920549001",
  contactLocation: "Noida, UP, India",
  footerText:
    "I'm a passionate full-stack developer specializing in creating modern, responsive web applications using the MERN stack and other cutting-edge technologies.",
  social: {
    instagram: "https://www.instagram.com/abhay__9001/",
    facebook: "https://www.facebook.com/abhay559722/",
    twitter: "https://twitter.com/babluku9001",
    linkedin: "https://www.linkedin.com/in/bablu-kumar-a0aa16231/",
    github: "https://github.com/bablukumar9001",
  },
};

// ————————————————————————————————————————————————————————————

async function seedCollection(name, Model, docs) {
  const count = await Model.countDocuments();
  if (count > 0 && !FORCE) {
    console.log(`• ${name}: skipped (${count} docs already present)`);
    return;
  }
  if (FORCE) await Model.deleteMany({});
  await Model.insertMany(docs);
  console.log(`✓ ${name}: inserted ${docs.length}`);
}

async function seedSiteContent() {
  const existing = await SiteContent.findOne({ key: "main" });
  if (existing && !FORCE) {
    console.log("• site content: skipped (already present)");
    return;
  }
  await SiteContent.findOneAndUpdate({ key: "main" }, siteContent, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
  console.log("✓ site content: saved");
}

(async () => {
  if (!DB) {
    console.error("Missing MONGODB_URI / DATABASE in .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(DB);
    console.log("Connected. Seeding…\n");

    await seedCollection("projects", Project, projects);
    await seedCollection("skills", Skill, skills);
    await seedCollection("experiences", Experience, experiences);
    await seedCollection("education", Education, education);
    await seedCollection("services", Service, services);
    await seedSiteContent();

    console.log("\nDone.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
})();
