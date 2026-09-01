/**
 * One-time seed: pushes the current portfolio content into MongoDB
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
// Data (mirrors the frontend fallbacks — keep the two in sync)
// ————————————————————————————————————————————————————————————

const projects = [
  {
    title: "VittaGems – Enterprise Web3 Jewellery Platform",
    description:
      "An enterprise Web3-based jewellery platform built on a microservices architecture. Independent Auth, User, Admin, Gateway, KYC and Token services communicate through secure REST APIs with JWT authentication, role-based access control and Swagger documentation. The Next.js frontend integrates payments, media uploads and real-time features, with the whole system containerised and deployed to AWS.",
    tools:
      "Next.js, React.js, TypeScript, Node.js, Express.js, MongoDB, Microservices, JWT, RBAC, Razorpay, Cloudinary, Multer, Nodemailer, Socket.IO, Cron, Docker, Docker Compose, PM2, Nginx, AWS EC2, Swagger",
    accomplishments: [
      "Built full-stack modules for a Web3 jewellery platform with Next.js, TypeScript, Node.js, Express.js and MongoDB",
      "Designed Auth, User, Admin, Gateway, KYC and Token microservices with secure REST APIs, JWT, RBAC and Swagger",
      "Integrated Razorpay, Cloudinary, Multer, Nodemailer, Socket.IO and Cron-based background jobs",
      "Deployed and maintained services using Docker, Docker Compose, PM2, Nginx and AWS EC2",
    ],
    liveLink: "",
    sourceLink: "",
    src: "",
    order: 1,
  },
  {
    title: "Launchly – Multi-Chain Web3 Launchpad",
    description:
      "A scalable, multi-chain Web3 launchpad that lets creators launch and manage projects across chains. Built with a microservices backend and a responsive Next.js dashboard covering creator workflows, chat and platform administration, deployed and monitored in production.",
    tools:
      "Next.js, React.js, TypeScript, Node.js, Express.js, MongoDB, Microservices, JWT, RBAC, Socket.IO, Docker, PM2, Nginx, AWS EC2",
    accomplishments: [
      "Developed scalable full-stack modules for a multi-chain Web3 launchpad with Next.js, TypeScript, Node.js and MongoDB",
      "Built secure REST APIs, authentication and RBAC, integrating multiple microservices for platform functionality",
      "Built responsive dashboards and backend services for creator workflows, chat and platform features",
      "Managed deployments and production support with Docker, PM2, Nginx and AWS EC2",
    ],
    liveLink: "",
    sourceLink: "",
    src: "",
    order: 2,
  },
  {
    title: "Licious – Online Meat Delivery Platform",
    description:
      "A responsive, SEO-friendly online meat delivery experience built with Next.js (SSR/SSG) and React.js. Includes a product catalog with search, cart and order management backed by REST APIs, and a reusable component architecture tuned for performance.",
    tools:
      "Next.js, React.js, Node.js, Express.js, MongoDB, REST APIs, Tailwind CSS",
    accomplishments: [
      "Developed responsive and SEO-friendly pages with Next.js (SSR/SSG) and React.js",
      "Built and integrated REST APIs for product catalog, search, cart and order management",
      "Improved performance through lazy loading, image optimization and reusable components",
      "Collaborated with backend teams to deliver scalable, production-ready features",
    ],
    liveLink: "https://www.licious.in/",
    sourceLink: "",
    src: "/images/licious.png",
    order: 3,
  },
  {
    title: "ShopKart – E-Commerce Platform (MERN)",
    description:
      "A full-stack e-commerce platform with authentication, product management, cart, orders, payments and an admin dashboard. Secure REST APIs with JWT and role-based access control, Redux Toolkit state management, and third-party integrations for payments, uploads and email.",
    tools:
      "React.js, Redux Toolkit, Material UI, Node.js, Express.js, MongoDB, JWT, RBAC, Razorpay, Cloudinary, Multer, Nodemailer",
    accomplishments: [
      "Built a full-stack e-commerce platform with auth, product management, cart, orders, payments and an admin dashboard",
      "Developed secure REST APIs with Node.js, Express.js, MongoDB, JWT authentication and role-based access control",
      "Integrated Razorpay, Cloudinary, Multer and Nodemailer for payments, file uploads and email notifications",
      "Optimized performance with Redux Toolkit, lazy loading, reusable components and responsive UI",
    ],
    liveLink: "https://shopkart-epla.onrender.com/",
    sourceLink: "https://github.com/bablukumar9001/ShopKart",
    src: "/images/shopkart.png",
    order: 4,
  },
  {
    title: "My Portfolio",
    description:
      "This MERN portfolio doubles as a live CMS: every section — projects, skills, experience, education, services and site content — is editable from a JWT-protected admin panel, with image uploads and an email-reply inbox for contact messages. Fully responsive with dark/light themes.",
    tools: "React, Node.js, Express, MongoDB, JavaScript, JWT, Vite",
    accomplishments: [
      "Admin panel with full CRUD for every portfolio section plus a Site Content editor",
      "Image uploads stored in MongoDB with automatic cleanup of unused images",
      "Contact form with spam protection; reply to messages by email from the dashboard",
      "Dark and light theme, resume download, and API-driven content with safe fallbacks",
      "Responsive design optimized for desktop, tablet and mobile",
    ],
    liveLink: "https://bablukumar.onrender.com/",
    sourceLink: "https://github.com/bablukumar9001/MERN-portfolio-frontend",
    src: "/images/portfolio.png",
    order: 5,
  },
  {
    title: "Veavix",
    description:
      "A responsive IT-services website with dynamic content sections and REST APIs for managing service pages and contact forms, built with the MERN stack and optimised for performance and SEO.",
    tools: "React, Bootstrap, JavaScript, Node.js, Express, MongoDB",
    accomplishments: [
      "Developed a responsive IT-services website with dynamic, updateable content sections",
      "Built REST APIs for managing service pages and contact forms with email integration",
      "Optimised performance and SEO with meta tags, React optimisation and clean UI components",
    ],
    liveLink: "https://veavix.onrender.com/",
    sourceLink: "https://github.com/bablukumar9001/Veavix-frontend",
    src: "/images/veavix.png",
    order: 6,
  },
];

const skills = [
  // Languages
  { name: "JavaScript (ES6+)", image: "/images/javascript.png", category: "Languages", order: 1 },
  { name: "TypeScript", image: "/images/typescript.png", category: "Languages", order: 2 },
  { name: "PHP", image: "/images/php.png", category: "Languages", order: 3 },
  { name: "HTML5", image: "/images/html5-300x300.jpg", category: "Languages", order: 4 },
  { name: "CSS3", image: "/images/css3-300x300.jpg", category: "Languages", order: 5 },

  // Frontend
  { name: "React.js", image: "/images/react.png", category: "Frontend", order: 1 },
  { name: "Next.js", image: "/images/nextjs.png", category: "Frontend", order: 2 },
  { name: "Redux Toolkit", image: "/images/redux.png", category: "Frontend", order: 3 },
  { name: "React Query", image: "", category: "Frontend", order: 4 },
  { name: "Tailwind CSS", image: "/images/tailwind.png", category: "Frontend", order: 5 },
  { name: "Material UI", image: "/images/materialui.png", category: "Frontend", order: 6 },
  { name: "Bootstrap", image: "/images/bootstrap.png", category: "Frontend", order: 7 },

  // Backend
  { name: "Node.js", image: "/images/node.png", category: "Backend", order: 1 },
  { name: "Express.js", image: "/images/express.png", category: "Backend", order: 2 },
  { name: "REST APIs", image: "/images/api.png", category: "Backend", order: 3 },
  { name: "JWT", image: "", category: "Backend", order: 4 },
  { name: "OAuth", image: "", category: "Backend", order: 5 },
  { name: "Socket.IO", image: "", category: "Backend", order: 6 },
  { name: "Microservices", image: "", category: "Backend", order: 7 },
  { name: "Laravel", image: "/images/laravel.png", category: "Backend", order: 8 },

  // Databases
  { name: "MongoDB", image: "/images/mongodb.png", category: "Databases", order: 1 },
  { name: "Mongoose", image: "", category: "Databases", order: 2 },
  { name: "MySQL", image: "/images/mysql-logo-1-300x300.jpg", category: "Databases", order: 3 },
  { name: "Redis", image: "", category: "Databases", order: 4 },

  // DevOps & Cloud
  { name: "Docker", image: "/images/docker.png", category: "DevOps & Cloud", order: 1 },
  { name: "Docker Compose", image: "", category: "DevOps & Cloud", order: 2 },
  { name: "AWS (EC2, S3)", image: "/images/aws.png", category: "DevOps & Cloud", order: 3 },
  { name: "CI/CD", image: "", category: "DevOps & Cloud", order: 4 },
  { name: "GitHub Actions", image: "", category: "DevOps & Cloud", order: 5 },
  { name: "PM2", image: "", category: "DevOps & Cloud", order: 6 },
  { name: "Nginx", image: "", category: "DevOps & Cloud", order: 7 },

  // Integrations & Tools
  { name: "Razorpay", image: "", category: "Integrations & Tools", order: 1 },
  { name: "Cloudinary", image: "", category: "Integrations & Tools", order: 2 },
  { name: "Nodemailer", image: "", category: "Integrations & Tools", order: 3 },
  { name: "Swagger", image: "", category: "Integrations & Tools", order: 4 },
  { name: "Git", image: "/images/git.png", category: "Integrations & Tools", order: 5 },
  { name: "Postman", image: "/images/postman.png", category: "Integrations & Tools", order: 6 },
  { name: "Jest", image: "", category: "Integrations & Tools", order: 7 },
  { name: "Azure DevOps", image: "", category: "Integrations & Tools", order: 8 },
];

const experiences = [
  {
    companyLogo: "",
    companyName: "Flexsin Technologies",
    position: "Software Engineer",
    duration: "Mar 2026 - Jul 2026",
    location: "Noida, India",
    color: "#00b359",
    icon: "fas fa-code",
    achievements: [
      "Developed enterprise-grade full-stack applications using Next.js, React.js, TypeScript, Node.js, Express.js, MongoDB and a microservices architecture",
      "Built and maintained Auth, User, Admin, Gateway, KYC and Token services with secure REST APIs, JWT authentication, RBAC and Swagger documentation",
      "Built a responsive Next.js frontend and integrated Razorpay, Cloudinary, Multer and Nodemailer, with Socket.IO for real-time features",
      "Automated background tasks with Cron jobs, optimised MongoDB queries and resolved production issues to improve performance",
      "Deployed and maintained applications with Docker, Docker Compose, PM2, Nginx and AWS EC2, working in an Agile team",
    ],
    order: 1,
  },
  {
    companyLogo: "/images/brancosoft.png",
    companyName: "Brancosoft Pvt. Ltd.",
    position: "MERN Stack Developer",
    duration: "Sep 2023 - Sep 2025",
    location: "Noida, India",
    color: "#ff014f",
    icon: "fas fa-briefcase",
    achievements: [
      "Developed scalable MERN stack and Next.js applications focused on performance, maintainability and responsive UX",
      "Built and integrated secure REST APIs with Node.js, Express.js and MongoDB, with JWT authentication and role-based access control",
      "Developed SEO-friendly applications with Next.js (SSR/SSG) and optimised frontend performance via lazy loading and code splitting",
      "Improved database performance with MongoDB indexing, aggregation pipelines and query optimisation",
      "Collaborated in an Agile team on feature development, code reviews, bug fixing and production releases",
    ],
    order: 2,
  },
  {
    companyLogo: "/images/drpu.jpg",
    companyName: "DRPU Software Pvt. Ltd.",
    position: "Frontend Developer",
    duration: "Mar 2023 - Aug 2023",
    location: "Noida, India",
    color: "#4d79ff",
    icon: "fas fa-laptop-code",
    achievements: [
      "Developed responsive, cross-browser interfaces with HTML5, CSS3, JavaScript, React.js and Bootstrap",
      "Built reusable UI components and integrated REST APIs for dynamic, interactive web applications",
      "Improved performance with lazy loading, code splitting and frontend optimisation, significantly raising Lighthouse scores",
      "Contributed to Next.js projects implementing SSR/SSG and SEO best practices",
      "Worked closely with designers and backend developers to ship pixel-perfect UIs within Agile cycles",
    ],
    order: 3,
  },
];

const education = [
  {
    degree: "Master of Computer Applications (MCA)",
    institution: "Dr. A.P.J. Abdul Kalam Technical University (AKTU)",
    year: "2021 - 2023",
    description:
      "Focused on software development, web technologies and database management. Built multiple projects using React.js and Node.js.",
    icon: "fas fa-graduation-cap",
    color: "#ff014f",
    order: 1,
  },
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Chaudhary Charan Singh University (CCSU)",
    year: "2018 - 2021",
    description:
      "Specialised in web development with the MERN stack and PHP Laravel. Completed projects including portfolio websites and e-commerce platforms.",
    icon: "fas fa-university",
    color: "#4d79ff",
    order: 2,
  },
  {
    degree: "Intermediate (12th)",
    institution: "SBN Public School (CBSE)",
    year: "2016 - 2018",
    description:
      "Completed higher secondary education with a focus on computer science and mathematics.",
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
      "Building scalable web applications with the MERN stack and Next.js (SSR/SSG/ISR). End-to-end delivery from database design to a polished, responsive UI.",
    order: 1,
  },
  {
    icon: "FaCubes",
    title: "Microservices Architecture",
    description:
      "Designing and building service-based backends — Auth, Gateway, KYC and domain services — with secure REST APIs, JWT/RBAC and Swagger documentation.",
    order: 2,
  },
  {
    icon: "FaEthereum",
    title: "Web3 Application Development",
    description:
      "Full-stack Web3 platforms and launchpads: wallet flows, multi-chain support, token and KYC services, and responsive Next.js dashboards.",
    order: 3,
  },
  {
    icon: "FaReact",
    title: "Frontend Development",
    description:
      "Responsive, dynamic interfaces with React.js and Next.js, Redux Toolkit / React Query state management and modern, accessible UI/UX.",
    order: 4,
  },
  {
    icon: "FaDatabase",
    title: "Backend & API Development",
    description:
      "Robust Node.js/Express services, RESTful APIs, authentication (JWT/OAuth), MongoDB aggregation pipelines and query optimisation.",
    order: 5,
  },
  {
    icon: "FaCreditCard",
    title: "Payment & Third-Party Integration",
    description:
      "Razorpay payments, Cloudinary media, Nodemailer email, Socket.IO real-time and Cron background jobs, wired cleanly into your app.",
    order: 6,
  },
  {
    icon: "FaCloud",
    title: "DevOps & Cloud Deployment",
    description:
      "Containerising and shipping apps with Docker, Docker Compose, PM2, Nginx and AWS EC2, with CI/CD via GitHub Actions.",
    order: 7,
  },
  {
    icon: "FaMobileAlt",
    title: "Responsive Design & Performance",
    description:
      "Mobile-first, cross-browser UIs tuned with lazy loading, code splitting, caching and image optimisation for strong Lighthouse scores.",
    order: 8,
  },
];

const siteContent = {
  key: "main",
  resumeUrl:
    "https://drive.google.com/file/d/15aOdmnAreAGIj3IoGbr2knPda-UNOxM-/view?usp=sharing",
  heroGreeting: "WELCOME TO MY WORLD",
  heroName: "Bablu kumar",
  heroLocation: "based in Ghaziabad, India",
  heroRoles: [
    "Software Engineer",
    "Full Stack Developer",
    "MERN Developer",
    "Next.js Developer",
  ],
  aboutBio:
    "I'm Bablu Kumar, a Full Stack Developer with 3+ years of experience building scalable web applications with Next.js, React.js, TypeScript, Node.js, Express.js and MongoDB. I design RESTful APIs and microservices-based architectures, and work across authentication, payment integration, real-time communication, cloud deployments and performance optimization. I'm skilled with Docker, AWS EC2, PM2, Nginx, Swagger and CI/CD, with hands-on experience delivering enterprise production applications.",
  aboutYears: "3+",
  contactEmail: "bablukumar09001@gmail.com",
  contactPhone: "+91 8920549001",
  contactLocation: "Lal Kuan, Ghaziabad, Uttar Pradesh, India",
  footerText:
    "Full stack developer building scalable, production-grade web applications with Next.js, the MERN stack and microservices architecture.",
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
