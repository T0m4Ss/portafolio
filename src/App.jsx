import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import PlanetScene from './components/PlanetScene';
import Carousel from './components/Carousel';
import { projects, skills, services, planetConfigs, sectionPlanetMap } from './data/content';
import './App.css';

/* ──────────────────────────────────
   Parallax twinkling star layers
   3 depth layers move at different speeds as the camera travels.
   Containers are 200vw wide (left:-50vw to right:150vw) so there
   are always stars on screen even at max parallax shift.
────────────────────────────────── */
const rand = () => Math.random();

const STAR_LAYERS = [
  {
    id: 'far',
    // Small, dim, barely move — deepest background
    stars: Array.from({ length: 65 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: 0.4 + rand() * 0.5,
      dur: 3 + rand() * 4,
      delay: rand() * 7,
    })),
    parallax: 4,   // % of container width (200vw) = 8vw max shift
  },
  {
    id: 'mid',
    // Medium stars, moderate movement
    stars: Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: 0.9 + rand() * 0.8,
      dur: 2.5 + rand() * 3,
      delay: rand() * 6,
    })),
    parallax: 10,  // = 20vw max shift
  },
  {
    id: 'close',
    // Large, bright, travel the most — closest layer
    stars: Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: 1.6 + rand() * 1.2,
      dur: 2 + rand() * 2.5,
      delay: rand() * 5,
    })),
    parallax: 20,  // = 40vw max shift
  },
];

// Camera x ranges: hero ≈ 5, contact (Neptune) ≈ 91
const CAM_X_MIN = 5;
const CAM_X_MAX = 91;

const TwinklingStars = memo(function TwinklingStars({ cameraX }) {
  const progress = Math.max(0, Math.min(1, (cameraX - CAM_X_MIN) / (CAM_X_MAX - CAM_X_MIN)));

  return (
    <>
      {STAR_LAYERS.map(layer => (
        <div
          key={layer.id}
          style={{
            position: 'fixed',
            width: '200%',
            height: '100%',
            top: 0,
            left: '-50%',
            zIndex: 0,
            pointerEvents: 'none',
            transform: `translateX(${-progress * layer.parallax}%)`,
            transition: 'transform 1.8s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {layer.stars.map(s => (
            <span
              key={s.id}
              className="twinkling-star"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                '--twinkle-dur': `${s.dur}s`,
                '--twinkle-delay': `${s.delay}s`,
              }}
            />
          ))}
        </div>
      ))}
    </>
  );
});

/* ──────────────────────────────────
   Scroll-reveal wrapper
────────────────────────────────── */
function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const NAV_LINKS = [
  { href: 'about', label: 'Sobre Mí' },
  { href: 'skills', label: 'Habilidades' },
  { href: 'projects', label: 'Proyectos' },
  { href: 'contact', label: 'Contacto' },
];

/* ──────────────────────────────────
   Main App
────────────────────────────────── */
export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [filter, setFilter] = useState('all');
  const sectionRefs = useRef({});

  const [allProjects, setAllProjects] = useState(projects);

  const sections = sectionPlanetMap.map(e => e.section);

  const [cameraTarget, planetTarget] = useMemo(() => {
    const entry = sectionPlanetMap.find(e => e.section === activeSection);
    if (!entry) return [[5, 1, 6], [0, 0, 0]];
    const planet = planetConfigs[entry.planetIndex];
    const [px, py, pz] = planet.position;
    const [ox, oy, oz] = entry.cameraOffset;
    return [[px + ox, py + oy, pz + oz], planet.position];
  }, [activeSection]);

  const registerSection = useCallback((id) => (el) => {
    if (el) sectionRefs.current[id] = el;
  }, []);

  // Intersection Observer for active section tracking
  useEffect(() => {
    const observers = [];
    sections.forEach((id) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  useEffect(() => {
    let rafId;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setNavScrolled(window.scrollY > 60));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const filtered = useMemo(
    () => filter === 'all' ? allProjects : allProjects.filter(p => p.category === filter),
    [filter, allProjects]
  );
  const popular = useMemo(() => allProjects.filter(p => p.popular), [allProjects]);

  // Add projects from JSON file
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const list = Array.isArray(data) ? data : [data];
        const valid = list.filter(p => p.title && p.description && p.category);
        if (valid.length > 0) {
          setAllProjects(prev => [...prev, ...valid]);
        }
      } catch { /* ignore */ }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Download template
  const downloadTemplate = () => {
    const tpl = [{ title: "Nombre", description: "Descripción", category: "web", tags: ["React"], image: "", demo: "", github: "", popular: false }];
    const blob = new Blob([JSON.stringify(tpl, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'proyectos-template.json';
    a.click();
    URL.revokeObjectURL(url);
  };


  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <TwinklingStars cameraX={cameraTarget[0]} />
      {/* 3D Background */}
      <PlanetScene planets={planetConfigs} cameraTarget={cameraTarget} planetTarget={planetTarget} />

      {/* ─── NAVBAR ─── */}
      <nav className={`navbar ${navScrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner section-container">
          <button className="navbar__logo" onClick={() => scrollTo('hero')}>
            COSMIC<span>DEV</span>
          </button>
          <div className="navbar__links">
            {NAV_LINKS.map(l => (
              <button key={l.href} className={`navbar__link ${activeSection === l.href ? 'active' : ''}`} onClick={() => scrollTo(l.href)}>
                {l.label}
              </button>
            ))}
          </div>
          <button className="navbar__mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menú">
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        {mobileMenuOpen && (
          <motion.div className="navbar__mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            {NAV_LINKS.map(l => (
              <button key={l.href} className="navbar__mobile-link" onClick={() => scrollTo(l.href)}>{l.label}</button>
            ))}
          </motion.div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section ref={registerSection('hero')} className="hero">
        <div className="section-container hero__content">
          <Reveal>
            <div className="hero__badge">Full Stack Developer & Freelancer</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="hero__title">
              <span>Explorando el</span>
              <span className="hero__title--gradient">Universo Digital</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="hero__subtitle">
              Desarrollo web, edición de video y soluciones creativas.<br />Cada proyecto es una nueva misión.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="hero__actions">
              <button className="btn btn--primary" onClick={() => scrollTo('projects')}>
                Ver Proyectos
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
              <button className="btn btn--ghost" onClick={() => scrollTo('contact')}>Contactar</button>
            </div>
          </Reveal>
        </div>
        <div className="hero__scroll-hint">
          <span>SCROLL</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <section ref={registerSection('about')} className="section" id="about">
        <div className="section-container about__grid">
          <Reveal className="about__avatar-wrap">
            <div className="about__avatar">
              <div className="about__avatar-ring" />
            </div>
          </Reveal>
          <div className="about__text">
            <Reveal>
              <span className="section__tag">01</span>
              <h2 className="section__title">Sobre Mí</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="about__bio">
                Soy un <strong className="text-accent">desarrollador Full Stack</strong> apasionado por crear experiencias
                digitales impactantes. Combino código limpio con diseño visual para construir
                aplicaciones que no solo funcionan, sino que <strong className="text-lavender">inspiran</strong>.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="about__bio">
                Como freelancer, ofrezco servicios de <strong className="text-warm">edición de video</strong>,
                desarrollo web y consultoría técnica. Cada proyecto es una oportunidad para
                superar los límites de lo posible.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="about__stats">
                {[['50+', 'Proyectos'], ['30+', 'Clientes'], ['5+', 'Años Exp.']].map(([n, l]) => (
                  <div key={l} className="stat-card">
                    <span className="stat-card__number">{n}</span>
                    <span className="stat-card__label">{l}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── SKILLS ─── */}
      <section ref={registerSection('skills')} className="section" id="skills">
        <div className="section-container">
          <Reveal className="section__header">
            <span className="section__tag">02</span>
            <h2 className="section__title">Habilidades</h2>
            <p className="section__desc">Tecnologías y herramientas que domino en mi viaje por el cosmos digital</p>
          </Reveal>
          <div className="skills__grid">
            {skills.map((group, i) => (
              <Reveal key={group.title} delay={i * 0.08}>
                <div className="skill-card">
                  <h3 className="skill-card__title">{group.title}</h3>
                  <div className="skill-card__tags">
                    {group.items.map(item => <span key={item} className="skill-tag">{item}</span>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROJECTS ─── */}
      <section ref={registerSection('projects')} className="section" id="projects">
        <div className="section-container">
          <Reveal>
            <div className="projects__header">
              <div>
                <span className="section__tag">03</span>
                <h2 className="section__title">Proyectos</h2>
                <p className="section__desc">Misiones completadas en mi viaje por el universo del desarrollo</p>
              </div>
              <div className="projects__actions">
                <label className="btn btn--primary btn--sm" style={{ cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>
                  Añadir
                  <input type="file" accept=".json" hidden onChange={handleFileUpload} />
                </label>
                <button className="btn btn--ghost btn--sm" onClick={downloadTemplate}>Plantilla</button>
              </div>
            </div>
          </Reveal>

          {/* Carousel — Populares */}
          <Reveal>
            <h3 className="subsection-title">Populares</h3>
            <Carousel items={popular} />
          </Reveal>

          {/* All Projects Grid */}
          <Reveal>
            <h3 className="subsection-title" style={{ marginTop: '3rem' }}>Explorar Todos</h3>
          </Reveal>
          <Reveal>
            <div className="filter-bar">
              {['all', 'web', 'video', 'fullstack', 'freelance'].map(f => (
                <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </Reveal>
          <div className="projects__grid">
            {filtered.map((project, i) => (
              <Reveal key={project.title + i} delay={i * 0.07}>
                <div className="project-card">
                  <div className="project-card__thumb">
                    {project.image ? <img src={project.image} alt={project.title} /> : <div className="project-card__placeholder" />}
                  </div>
                  <div className="project-card__body">
                    <span className="project-card__cat">{project.category}</span>
                    <h4 className="project-card__title">{project.title}</h4>
                    <p className="project-card__desc">{project.description}</p>
                    <div className="project-card__tags">
                      {project.tags?.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                    <div className="project-card__links">
                      {project.demo && <a href={project.demo} className="project-link" target="_blank" rel="noopener noreferrer">Demo</a>}
                      {project.github && <a href={project.github} className="project-link" target="_blank" rel="noopener noreferrer">Código</a>}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section ref={registerSection('services')} className="section" id="services">
        <div className="section-container">
          <Reveal className="section__header">
            <span className="section__tag">04</span>
            <h2 className="section__title">Servicios</h2>
            <p className="section__desc">Soluciones profesionales para llevar tu proyecto a nuevas galaxias</p>
          </Reveal>
          <div className="services__grid">
            {services.map((svc, i) => (
              <Reveal key={svc.title} delay={i * 0.1}>
                <div className="service-card" style={{ '--svc-accent': svc.accent }}>
                  <h3 className="service-card__title">{svc.title}</h3>
                  <p className="service-card__desc">{svc.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section ref={registerSection('contact')} className="section" id="contact">
        <div className="section-container" style={{ maxWidth: '700px' }}>
          <Reveal className="section__header">
            <span className="section__tag">05</span>
            <h2 className="section__title">Contacto</h2>
            <p className="section__desc">¿Listo para lanzar tu próximo proyecto? Envía una señal</p>
          </Reveal>
          <Reveal delay={0.1}>
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); }}>
              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label>Nombre</label>
                  <input type="text" placeholder="Tu nombre" required />
                </div>
                <div className="contact-form__field">
                  <label>Email</label>
                  <input type="email" placeholder="tu@email.com" required />
                </div>
              </div>
              <div className="contact-form__field">
                <label>Asunto</label>
                <input type="text" placeholder="¿En qué puedo ayudarte?" />
              </div>
              <div className="contact-form__field">
                <label>Mensaje</label>
                <textarea rows="5" placeholder="Cuéntame sobre tu proyecto..." required />
              </div>
              <button type="submit" className="btn btn--primary" style={{ width: '100%', justifyContent: 'center' }}>
                Enviar Transmisión
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="footer">
        <div className="section-container footer__inner">
          <span className="footer__logo">COSMIC<span>DEV</span> © 2026</span>
          <div className="footer__socials">
            <a href="#" aria-label="GitHub"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
            <a href="#" aria-label="LinkedIn"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            <a href="#" aria-label="X"><svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          </div>
        </div>
      </footer>
    </>
  );
}
