// All portfolio content lives here — edit this file to update the site.

export const profile = {
  name: 'Raheem Baig',
  fullName: 'Mirza Raheem Baig',
  brand: 'raheem.dev',
  version: 'v26.3.0',
  prompt: 'raheem@portfolio:~',
  role: 'Software Developer · Full Stack Developer',
  intro:
    'I build secure, scalable web apps end to end — from MongoDB schemas and REST APIs to polished React interfaces. Currently shipping production software at Namya IT.',
  badges: ['CS Graduate', 'MERN Developer'],
  avatar: '/me.jpeg',
  email: 'raheembaig825@gmail.com',
  phone: '+91 9959014994',
  whatsapp: 'https://wa.me/919959014994',
  github: 'https://github.com/Raheem-Baig1210',
  githubUser: 'Raheem-Baig1210',
  linkedin: 'https://www.linkedin.com/in/raheem-baig-407574273/',
  resume: '/Raheem-Baig-Resume.pdf',
  timezone: 'Asia/Kolkata',
  tzLabel: 'IST',
}

// Sidebar endpoints, in order. `status` is the caption under the avatar card.
export const endpoints = [
  { method: 'GET', path: '/me', to: '/' },
  { method: 'GET', path: '/me/origin', to: '/me/origin', status: 'standing by' },
  { method: 'GET', path: '/stack', to: '/stack', status: 'running deps' },
  { method: 'GET', path: '/experience', to: '/experience', status: 'reviewing logs' },
  { method: 'GET', path: '/projects', to: '/projects', status: 'in production' },
  { method: 'GET', path: '/education', to: '/education', status: 'compiling notes' },
  { method: 'GET', path: '/certifications', to: '/certifications', status: 'showing receipts' },
  { method: 'GET', path: '/github', to: '/github', status: 'syncing repos' },
  { method: 'POST', path: '/ask', to: '/ask' },
  { method: 'POST', path: '/collab', to: '/collab', status: 'ready to respond' },
]

export const origin = {
  tagline: 'Curious by default, shipping by habit.',
  story:
    'I completed my B.E. in Computer Science and Engineering at Osmania University, Hyderabad. My first project was a quiz app in plain HTML, CSS and JavaScript — since then I have moved through the MERN stack into Next.js, NestJS and TypeScript, building platforms for tuition centers, schools and businesses. I care about clean, maintainable backends, secure auth and interfaces people actually enjoy using. Lately I also lean on AI tooling like Claude Code to ship faster without cutting corners.',
  facts: [
    ['Degree', 'B.E. Computer Science, Osmania University'],
    ['Role', 'Software Developer @ Namya IT'],
    ['Focus', 'Full-stack · MERN · Next.js · NestJS'],
    ['Based', 'Hyderabad, India'],
    ['Languages', 'English · Hindi · Urdu'],
  ],
}

export const stack = [
  { group: 'Frontend', items: ['React.js', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'] },
  { group: 'Backend', items: ['Node.js', 'Express.js', 'NestJS', 'REST APIs', 'JWT Auth', '.NET (Basics)', 'Java (Basics)'] },
  { group: 'Data', items: ['MongoDB', 'PostgreSQL', 'SQL', 'Power BI'] },
  { group: 'Infra', items: ['AWS (EC2)', 'Vercel', 'Git', 'GitHub', 'Linux', 'Windows'] },
  { group: 'AI & Analysis', items: ['Python', 'Jupyter Notebook', 'Claude Code'] },
  { group: 'Tools', items: ['Postman', 'Canva', 'MS Excel', 'MS Word'] },
  { group: 'Core', items: ['Full Stack Development', 'Protected Routes', 'Role-based Access', 'Rendering Workflow Optimization'] },
  { group: 'Soft Skills', items: ['Analytical Thinking', 'Project Management', 'Teamwork', 'Problem-solving', 'Adaptability', 'Agile Methodologies', 'Leadership', 'Detail-oriented', 'Self-learner'] },
]

export const experience = [
  {
    slug: 'namya-it',
    company: 'Namya IT',
    role: 'Software Developer | Software Engineer',
    period: 'Mar 2026 – Present',
    location: 'Hyderabad, India',
    points: [
      'Develop and maintain full-stack web applications using the MERN stack, Next.js, NestJS and TypeScript, building scalable and maintainable solutions.',
      'Build and integrate secure RESTful APIs, optimize database operations with MongoDB, and improve application performance.',
      'Leverage Claude Code and other AI-powered development tools to accelerate development, streamline debugging and raise code quality.',
      'Collaborate with the team in an Agile environment — feature development, code reviews and bug fixes.',
    ],
    tags: ['MERN', 'Next.js', 'NestJS', 'TypeScript', 'MongoDB', 'Claude Code'],
  },
  {
    slug: 'career-guidance-council',
    company: 'Career Guidance Council',
    role: 'Full Stack Developer | Web Developer',
    period: 'Jan 2025 – Oct 2025',
    location: 'Hyderabad, India',
    points: [
      'Developed a complete full-stack web application for a tuition center using MongoDB, Express.js, React.js and Node.js — a seamless platform for students, tutors and administrators.',
      'Implemented secure authentication and authorization with JWT and bcrypt, enabling role-based access control (Admin/Tutor), protected routes and controlled feature access.',
      'Designed and built scalable RESTful APIs for attendance tracking, user management, class schedules and reporting, keeping the backend clean, modular and maintainable.',
    ],
    tags: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'JWT', 'bcrypt'],
  },
]

export const projects = [
  {
    slug: 'al-ozhan-perfumes',
    name: 'Al Özhan Perfumes',
    kind: 'perfume e-commerce + admin dashboard',
    image: '/projects/al-ozhan.jpg',
    live: 'https://www.alozhanperfumes.com/',
    description:
      'A full production e-commerce platform for Al Özhan, an artisanal perfume and attar house. Customers browse the signature edit and full catalogue of perfumes and attars, pick sizes, see ratings and offers, and check out from their bag with account sign-in. Behind the storefront sits a complete admin dashboard where the business runs everything — products and variants, pricing and offers, inventory, orders and customers — without touching code.',
    points: [
      'Storefront with collections, product variants by size, ratings, offer pricing and a persistent bag.',
      'Customer accounts with sign-in, plus consent-based cookie handling.',
      'Admin dashboard to manage the whole business: catalogue, pricing, offers, stock, orders and customers.',
      'Free-shipping threshold, samples-with-every-order messaging and a luxury editorial design.',
    ],
    tags: ['E-commerce', 'Admin Dashboard', 'React', 'Node.js', 'MongoDB', 'REST APIs'],
  },
  {
    slug: 'mestar-energy',
    name: 'Mestar Energy',
    kind: 'freelance · UAE MEP contractor',
    image: '/projects/mestar-energy.jpg',
    live: 'https://mestar-six.vercel.app/',
    description:
      'Multi-page company website for Mestar Energy, an electromechanical (MEP) contracting company in Abu Dhabi, UAE — built as a freelance project for a UAE client. A full-screen architectural hero slider leads into About Us, Team, Services, Projects, Blogs and Contact pages, with "Get a Quote" and "Call Us" calls to action throughout.',
    points: [
      'Seven routed pages: Home, About Us, Team, Services, Projects, Blogs and Contact.',
      'Auto-playing full-bleed hero slider with an adaptive navbar that changes on scroll.',
      'Lead-focused design with quote and call actions on every page.',
      'Fully responsive, deployed on Vercel.',
    ],
    tags: ['Freelance', 'React', 'React Router', 'Tailwind CSS', 'Vercel'],
  },
  {
    slug: 'witco',
    name: 'WITCO',
    kind: 'freelance · corporate website',
    image: '/projects/witcosa.jpg',
    live: 'https://witco-sigma.vercel.app',
    repo: 'https://github.com/Raheem-Baig1210/witco',
    description:
      'Corporate website for WITCO (World Integrated Trading & Contracting Company), a Saudi supplier of solar and industrial equipment. Built as a freelance project with a hero slider, product and service catalogues, downloads and direct call / chat contact actions.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive', 'Vercel'],
  },
  {
    slug: 'eleviq',
    name: 'ElevIQ',
    kind: 'construction & engineering website',
    image: '/projects/eleviq.jpg',
    live: 'https://rmm-2.vercel.app/',
    description:
      'Website for an engineering and contracting company covering HVAC, electricity transmission and electro-mechanical installation. Full-bleed architectural hero slider, company stats, a numbered services catalogue, light / dark theme toggle and quick email and call actions.',
    tags: ['React', 'Tailwind CSS', 'Dark Mode', 'Vercel'],
  },
  {
    slug: 'ar-bizflow',
    name: 'AR BizFlow Global Supply',
    kind: 'industrial supply company website',
    image: '/projects/ar-bizflow.jpg',
    live: 'https://n2-wine.vercel.app/',
    description:
      'Website for a general trading and engineering supply company sourcing electrical, mechanical, HVAC, automation, instrumentation, safety and MRO products across Saudi Arabia and India. Branded loading screen, hero slider, product and service categories, and request-a-quote flows.',
    tags: ['React', 'Responsive', 'Lead Generation', 'Vercel'],
  },
  {
    slug: 'school-crm',
    name: 'School CRM System',
    kind: 'multi-school management platform',
    description:
      'A scalable School CRM built on the MERN stack to run operations across multiple schools while keeping data consistent and access secure. JWT authentication with protected, role-based routes; RESTful APIs for student records, staff management, fee tracking, attendance and communication; MongoDB schemas designed for multi-school data separation and fast retrieval; and responsive React dashboards for administrators, teachers and staff.',
    tags: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JWT', 'RBAC'],
  },
  {
    slug: 'mohalla-tuition-center',
    name: 'Mohalla Tuition Center',
    kind: 'tuition management platform',
    description:
      'Full-stack platform for a tuition center serving students, tutors and administrators. Secure authentication and role-based access with JWT and bcrypt; scalable REST APIs for attendance, user management, class schedules and reporting; optimized MongoDB schemas and queries; and a responsive UI with React Hooks and the Context API for real-time updates. Also handled testing, deployment and API integration.',
    tags: ['MERN', 'JWT', 'bcrypt', 'Context API', 'React Hooks'],
  },
  {
    slug: 'laura-perfumes',
    name: "L'AURA Perfumes",
    kind: 'luxury fragrance storefront',
    image: '/projects/perfumes.jpg',
    live: 'https://perfumes-three-eta.vercel.app',
    repo: 'https://github.com/Raheem-Baig1210/Perfumes_Frontend',
    description:
      'An editorial, luxury-styled storefront for a custom fragrance brand — oversized serif typography, glassmorphic product cards and collection / new-arrival / atelier sections.',
    tags: ['TypeScript', 'React', 'UI/UX', 'Vercel'],
  },
  {
    slug: 'mmr-technical-services',
    name: 'MMR Technical Services',
    kind: 'service business website',
    image: '/projects/mm-services.jpg',
    live: 'https://mm-services-kappa.vercel.app',
    repo: 'https://github.com/Raheem-Baig1210/MM-Services',
    description:
      'A bold, dark-themed website for a technical services company with a grid hero, outlined display typography, service pages and an appointment booking call to action.',
    tags: ['JavaScript', 'React', 'Responsive', 'Vercel'],
  },
  {
    slug: 'nebula',
    name: 'Nebula',
    kind: 'e-commerce experience',
    image: '/projects/nebula.jpg',
    live: 'https://nebula-theta-six.vercel.app',
    repo: 'https://github.com/Raheem-Baig1210/E-commerce1',
    description:
      'A space-themed e-commerce front end with an animated starfield hero, explore and cart flows and login — an experiment in immersive storefront design.',
    tags: ['JavaScript', 'React', 'E-commerce', 'Animation'],
  },
  {
    slug: 'sagar-tours',
    name: 'Sagar Tours & Travels',
    kind: 'travel agency website',
    image: '/projects/sagar-tours.jpg',
    live: 'https://tours-ten-psi.vercel.app',
    repo: 'https://github.com/Raheem-Baig1210/Sagar-Tours-and-Travels',
    description:
      'Website for a travel agency covering services, destinations and packages, with trip booking calls to action and a login flow.',
    tags: ['TypeScript', 'React', 'Tailwind CSS'],
  },
  {
    slug: 'quiz-app',
    name: 'Quiz Application',
    kind: 'my first web project',
    description:
      'An interactive quiz in pure HTML, CSS and JavaScript — no frameworks. Questions appear one at a time with four options, answers are recorded and evaluated in real time, and a results summary closes the round. It taught me DOM manipulation and event handling from first principles.',
    tags: ['HTML', 'CSS', 'JavaScript', 'DOM'],
  },
]

export const education = [
  {
    date: '2025',
    title: 'B.E. Computer Science and Engineering',
    org: 'Osmania University, Hyderabad',
    text: 'Relevant coursework: MERN Stack Development · Software Engineering · Computer Networking · Data Structures and Algorithms.',
  },
  {
    date: '2019',
    title: 'High School (Intermediate)',
    org: 'Narayana Junior College, Hyderabad',
    text: 'Built the maths and science foundation that led me into computer science.',
  },
]

export const certifications = [
  {
    title: 'Claude 101',
    issuer: 'Anthropic',
    image: '/certificates/claude-101.jpg',
  },
  {
    title: 'AI Fluency: Framework & Foundations',
    issuer: 'Anthropic · with UCC, Ringling College & HEA',
    image: '/certificates/ai-fluency.jpg',
  },
  {
    title: 'Foundations of Cybersecurity',
    issuer: 'Google · Coursera',
    date: 'October 2024',
    image: '/certificates/google-foundations-of-cybersecurity.jpg',
  },
  {
    title: 'Play It Safe: Manage Security Risks',
    issuer: 'Google · Coursera',
    date: 'October 2024',
    image: '/certificates/google-play-it-safe.jpg',
  },
]

// Shown on /github if the live GitHub API is unavailable.
export const fallbackRepos = [
  ['Perfumes_Frontend', 'TypeScript', 'https://perfumes-three-eta.vercel.app'],
  ['MM-Services', 'JavaScript', 'https://mm-services-kappa.vercel.app'],
  ['witco', 'CSS', 'https://witco-sigma.vercel.app'],
  ['E-commerce1', 'JavaScript', 'https://nebula-theta-six.vercel.app'],
  ['Sagar-Tours-and-Travels', 'TypeScript', 'https://tours-ten-psi.vercel.app'],
  ['Ozhan_Backend', 'JavaScript', null],
  ['DSA_with_CPP', 'C++', null],
  ['Tube2Tune_Backend', 'JavaScript', null],
  ['PDF_Reader', 'JavaScript', null],
].map(([name, language, homepage]) => ({
  name,
  language,
  homepage,
  description: null,
  html_url: `https://github.com/Raheem-Baig1210/${name}`,
}))
