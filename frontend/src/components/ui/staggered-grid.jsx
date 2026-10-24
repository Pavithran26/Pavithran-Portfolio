import React from 'react';
import { technologyIcons } from '../TechnologyIcons.js';

/** Filterable staggered technology explorer based on the VengeanceUI reference. */
export function StaggeredGrid({ items = [], className = '' }) {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const gridRef = React.useRef(null);
  const categories = ['All', ...new Set(items.map(item => item.category).filter(Boolean))];
  const visibleItems = activeCategory === 'All' ? items : items.filter(item => item.category === activeCategory);
  const countFor = category => category === 'All' ? items.length : items.filter(item => item.category === category).length;

  // Reveal each row as it enters the real viewport instead of animating every
  // card at page load (the whole section sits far below the fold).
  React.useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    const cards = [...grid.querySelectorAll('.staggered-tech-card')];
    if (!cards.length) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      cards.forEach(card => card.classList.add('is-in-view'));
      return undefined;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in-view');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.06,
      rootMargin: '0px 0px -7% 0px'
    });

    cards.forEach((card, index) => {
      card.classList.remove('is-in-view');
      card.style.setProperty('--stagger-delay', `${(index % 5) * 62}ms`);
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [activeCategory, items]);

  return (
    <div className={`staggered-tech-explorer ${className}`.trim()}>
      <div className="staggered-tech-toolbar">
        <div className="staggered-tech-toolbar__summary">
          <span className="staggered-tech-toolbar__eyebrow">TECHNOLOGY INDEX</span>
          <strong>{visibleItems.length}<span> / {items.length} tools</span></strong>
          <p>Filter the toolkit by domain, then select any tile to see its details.</p>
        </div>
        <div className="staggered-tech-filters" role="group" aria-label="Filter technologies by domain">
          {categories.map(category => (
            <button
              key={category}
              type="button"
              className={`staggered-tech-filter ${activeCategory === category ? 'is-active' : ''}`}
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              <span>{category}</span><small>{countFor(category)}</small>
            </button>
          ))}
        </div>
      </div>

      <div ref={gridRef} className="staggered-tech-grid" aria-live="polite">
        {visibleItems.map((item, index) => {
          const localIcon = technologyIcons(item.title, { eager: index < 10 });
          const monogram = item.title.replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase() || 'T';
          return (
            <button
              key={item.title}
              type="button"
              className="staggered-tech-card"
              data-tool-card=""
              data-tool-title={item.title}
              data-tool-category={item.category}
              data-tool-description={item.description}
              style={{
                '--stagger-index': index,
                '--stagger-offset': `${(index % 4) * 5}px`,
                '--stagger-delay': `${(index % 5) * 62}ms`
              }}
              aria-label={`Open ${item.title} details`}
            >
              <span className="staggered-tech-card__top">
                <span className="staggered-tech-card__icon" aria-hidden="true">
                  {item.iconId ? (
                    <>
                      <img
                        className="staggered-tech-card__skill-icon"
                        src={`https://skillicons.dev/icons?i=${item.iconId}&theme=dark`}
                        alt=""
                        width="44"
                        height="44"
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                        onError={event => {
                          event.currentTarget.hidden = true;
                          const fallback = event.currentTarget.nextElementSibling;
                          if (fallback) fallback.hidden = false;
                        }}
                      />
                      <span className="staggered-tech-card__fallback-icon" hidden>
                        {localIcon
                          ? <span dangerouslySetInnerHTML={{ __html: localIcon }} />
                          : <span className="staggered-tech-card__monogram">{monogram}</span>}
                      </span>
                    </>
                  ) : localIcon ? (
                    <span dangerouslySetInnerHTML={{ __html: localIcon }} />
                  ) : (
                    <span className="staggered-tech-card__monogram">{monogram}</span>
                  )}
                </span>
                <span className="staggered-tech-card__index">{String(index + 1).padStart(3, '0')}</span>
              </span>
              <strong className="staggered-tech-card__title">{item.title}</strong>
              <span className="staggered-tech-card__category">{item.category}</span>
              <span className="staggered-tech-card__description">{item.description}</span>
              <span className="staggered-tech-card__arrow" aria-hidden="true">↗</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
