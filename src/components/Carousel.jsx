import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Carousel.css';

const cardVariants = {
  enter: (dir) => ({ x: dir > 0 ? 480 : -480, scale: 0.7, opacity: 0 }),
  left:  { x: -260, scale: 0.76, opacity: 0.5, zIndex: 1, filter: 'blur(2px)' },
  center: { x: 0, scale: 1, opacity: 1, zIndex: 10, filter: 'blur(0px)' },
  right: { x: 260, scale: 0.76, opacity: 0.5, zIndex: 1, filter: 'blur(2px)' },
  exit:  (dir) => ({ x: dir > 0 ? -480 : 480, scale: 0.7, opacity: 0 }),
};

function ProjectCard({ project }) {
  return (
    <>
      <div className="carousel-card__thumb">
        {project.image
          ? <img src={project.image} alt={project.title} />
          : <div className="carousel-card__placeholder" />
        }
      </div>
      <div className="carousel-card__body">
        <span className="carousel-card__category">{project.category}</span>
        <h3 className="carousel-card__title">{project.title}</h3>
        <p className="carousel-card__desc">{project.description}</p>
        <div className="carousel-card__tags">
          {project.tags?.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
      </div>
    </>
  );
}

export default function Carousel({ items }) {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback((dir) => {
    setCurrent(([prev]) => [(prev + dir + items.length) % items.length, dir]);
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(() => paginate(1), 4500);
    return () => clearInterval(timer);
  }, [paused, paginate, items.length]);

  if (!items.length) return null;

  const prev = (current - 1 + items.length) % items.length;
  const next = (current + 1) % items.length;

  const slots = [
    { idx: prev, pos: 'left' },
    { idx: current, pos: 'center' },
    { idx: next, pos: 'right' },
  ];

  return (
    <div
      className="carousel-wrapper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="carousel-stage">
        <AnimatePresence custom={direction} initial={false}>
          {slots.map(({ idx, pos }) => (
            <motion.div
              key={idx}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate={pos}
              exit="exit"
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="carousel-card"
              onClick={pos !== 'center' ? () => paginate(pos === 'right' ? 1 : -1) : undefined}
              style={{ cursor: pos !== 'center' ? 'pointer' : 'default' }}
            >
              <ProjectCard project={items[idx]} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="carousel-controls">
        <button className="carousel-arrow" onClick={() => paginate(-1)} aria-label="Anterior">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="carousel-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? 'active' : ''}`}
              onClick={() => setCurrent([i, i > current ? 1 : -1])}
              aria-label={`Proyecto ${i + 1}`}
            />
          ))}
        </div>
        <button className="carousel-arrow" onClick={() => paginate(1)} aria-label="Siguiente">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
