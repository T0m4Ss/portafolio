// Planet configs for the 3D solar system scene
// Positioned along x-axis to simulate traveling through the solar system
export const planetConfigs = [
  {
    id: 'sun',
    name: 'Sol',
    radius: 3.0,
    position: [0, 0, 0],
    color: '#ff6b00',
    emissive: '#e64a00',
    emissiveIntensity: 0.85,
    rotationSpeed: 0.03,
  },
  {
    id: 'mercury',
    name: 'Mercurio',
    radius: 0.45,
    position: [10, -0.5, -1],
    color: '#9e9e9e',
    emissive: '#616161',
    emissiveIntensity: 0.05,
    rotationSpeed: 0.12,
  },
  {
    id: 'venus',
    name: 'Venus',
    radius: 0.7,
    position: [18, 0.8, 1],
    color: '#e8b960',
    emissive: '#c49a3c',
    emissiveIntensity: 0.08,
    rotationSpeed: 0.08,
  },
  {
    id: 'earth',
    name: 'Tierra',
    radius: 0.75,
    position: [27, -0.3, -0.5],
    color: '#1565c0',
    secondaryColor: '#2e7d32',
    emissive: '#0d47a1',
    emissiveIntensity: 0.1,
    rotationSpeed: 0.1,
    hasMoon: true,
  },
  {
    id: 'mars',
    name: 'Marte',
    radius: 0.55,
    position: [35, 0.6, 0.8],
    color: '#bf360c',
    emissive: '#8d2208',
    emissiveIntensity: 0.08,
    rotationSpeed: 0.09,
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    radius: 2.0,
    position: [48, -0.8, -1.5],
    color: '#d4a26a',
    emissive: '#8d6e46',
    emissiveIntensity: 0.06,
    rotationSpeed: 0.15,
  },
  {
    id: 'saturn',
    name: 'Saturno',
    radius: 1.7,
    position: [62, 0.5, 1],
    color: '#c9a96e',
    emissive: '#a08050',
    emissiveIntensity: 0.05,
    rotationSpeed: 0.12,
    hasRing: true,
  },
  {
    id: 'uranus',
    name: 'Urano',
    radius: 1.1,
    position: [75, -0.4, -0.8],
    color: '#4dd0e1',
    emissive: '#00838f',
    emissiveIntensity: 0.08,
    rotationSpeed: 0.07,
    hasRing: true,
    ringTilt: Math.PI / 1.8,
  },
  {
    id: 'neptune',
    name: 'Neptuno',
    radius: 1.05,
    position: [88, 0.3, 0.5],
    color: '#1a237e',
    emissive: '#0d1560',
    emissiveIntensity: 0.1,
    rotationSpeed: 0.06,
  },
  {
    id: 'pluto',
    name: 'Plutón',
    radius: 0.28,
    position: [100, -0.2, -0.5],
    color: '#a1887f',
    emissive: '#6d4c41',
    emissiveIntensity: 0.04,
    rotationSpeed: 0.04,
  },
];

// Map sections to absolute camera world positions (planet.position + offset)
export const sectionPlanetMap = [
  { section: 'hero',     planetIndex: 0, cameraOffset: [5, 1, 6] },
  { section: 'about',    planetIndex: 3, cameraOffset: [3, 0.5, 4] },
  { section: 'skills',   planetIndex: 4, cameraOffset: [3, 0.3, 3.5] },
  { section: 'projects', planetIndex: 5, cameraOffset: [5, 1, 6] },
  { section: 'services', planetIndex: 6, cameraOffset: [4, 0.8, 5] },
  { section: 'contact',  planetIndex: 8, cameraOffset: [3, 0.5, 4] },
];

export const projects = [
  {
    title: "E-Commerce Platform",
    description: "Plataforma de comercio electrónico con panel de administración, pasarela de pagos y gestión de inventario en tiempo real.",
    category: "fullstack",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    image: "",
    demo: "#",
    github: "#",
    popular: true
  },
  {
    title: "Analytics Dashboard",
    description: "Panel de análisis de datos con gráficos interactivos, reportes automatizados y sistema de notificaciones en tiempo real.",
    category: "web",
    tags: ["Vue.js", "D3.js", "Firebase", "Tailwind"],
    image: "",
    demo: "#",
    github: "#"
  },
  {
    title: "Reel Cinematográfico",
    description: "Producción y edición de video corporativo con motion graphics, color grading profesional y diseño sonoro.",
    category: "video",
    tags: ["Premiere Pro", "After Effects", "DaVinci"],
    image: "",
    demo: "#",
    github: "#",
    popular: true
  },
  {
    title: "Task Management App",
    description: "Aplicación de gestión de tareas y proyectos con autenticación, roles y seguimiento de tiempo integrado.",
    category: "fullstack",
    tags: ["Next.js", "MongoDB", "JWT", "Docker"],
    image: "",
    demo: "#",
    github: "#"
  },
  {
    title: "Landing Page de Alto Impacto",
    description: "Diseño y desarrollo de landing page con animaciones avanzadas, optimización SEO y alta tasa de conversión.",
    category: "freelance",
    tags: ["HTML", "CSS", "JavaScript", "GSAP"],
    image: "",
    demo: "#",
    github: "#",
    popular: true
  },
  {
    title: "Mobile App — Fitness Tracker",
    description: "Aplicación móvil de seguimiento de ejercicio con gráficas en tiempo real, notificaciones push y sincronización en la nube.",
    category: "fullstack",
    tags: ["React Native", "Node.js", "MongoDB", "Firebase"],
    image: "",
    demo: "#",
    github: "#",
    popular: true
  },
  {
    title: "Video Promocional",
    description: "Edición de video promocional para redes sociales con subtítulos dinámicos y transiciones personalizadas.",
    category: "video",
    tags: ["Premiere Pro", "Photoshop", "Audition"],
    image: "",
    demo: "#",
    github: "#"
  }
];

export const skills = [
  { title: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "React", "Tailwind", "Vue.js"] },
  { title: "Backend", items: ["Node.js", "Python", "Express", "REST APIs", "GraphQL", "SQL"] },
  { title: "Bases de Datos", items: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase"] },
  { title: "Edición de Video", items: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Motion Graphics"] },
  { title: "DevOps & Cloud", items: ["Docker", "AWS", "Git", "CI/CD", "Linux"] },
  { title: "Diseño", items: ["Figma", "UI/UX", "Photoshop", "Illustrator"] },
];

export const services = [
  {
    title: "Desarrollo Web",
    description: "Sitios web y aplicaciones modernas, rápidas y responsivas con las últimas tecnologías.",
    accent: "var(--accent)"
  },
  {
    title: "Edición de Video",
    description: "Edición profesional, motion graphics y post-producción para contenido de alto impacto.",
    accent: "var(--lavender)"
  },
  {
    title: "Consultoría Tech",
    description: "Asesoría técnica para optimizar tu stack, arquitectura y flujo de trabajo.",
    accent: "var(--warm)"
  },
];
