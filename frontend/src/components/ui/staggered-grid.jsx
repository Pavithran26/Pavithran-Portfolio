import React from 'react';
import { technologyIcons } from '../TechnologyIcons.js';

/** Filterable staggered technology explorer based on the VengeanceUI reference. */
export function StaggeredGrid({ items = [], className = '' }) {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [suggestionsDismissed, setSuggestionsDismissed] = React.useState(false);
  const gridRef = React.useRef(null);
  const searchInputRef = React.useRef(null);
  const categories = ['All', ...new Set(items.map(item => item.category).filter(Boolean))];
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchesQuery = item => !normalizedQuery || `${item.title} ${item.category} ${item.description}`.toLowerCase().includes(normalizedQuery);
  const categoryItems = activeCategory === 'All' ? items : items.filter(item => item.category === activeCategory);
  const visibleItems = categoryItems.filter(matchesQuery);
  const suggestions = normalizedQuery
    ? items.filter(matchesQuery).slice(0, 4)
    : [];
  const countFor = category => category === 'All' ? items.length : items.filter(item => item.category === category).length;
  const selectSuggestion = item => {
    if (item.category && categories.includes(item.category)) setActiveCategory(item.category);
    setSearchQuery(item.title);
    setSearchOpen(true);
    setSuggestionsDismissed(true);
  };

  React.useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

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
  }, [activeCategory, items, searchQuery]);

  return (
    <div className={`staggered-tech-explorer ${className}`.trim()}>
      <div className="staggered-tech-toolbar">
        <div className="staggered-tech-toolbar__summary">
          <span className="staggered-tech-toolbar__eyebrow">TECHNOLOGY INDEX</span>
          <strong>{visibleItems.length}<span> / {items.length} tools</span></strong>
          <p>Filter the toolkit by domain, then select any tile to see its details.</p>
        </div>
        <div className={`staggered-tech-search ${searchOpen ? 'is-open' : ''}`} role="search">
          <button
            className="staggered-tech-search__toggle"
            type="button"
            aria-expanded={searchOpen}
            aria-label={searchOpen ? 'Close technology search' : 'Open technology search'}
            onClick={() => {
              if (searchOpen) {
                setSearchOpen(false);
                setSearchQuery('');
                setSuggestionsDismissed(true);
              } else {
                setSearchOpen(true);
                setSuggestionsDismissed(false);
              }
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>
            <span>{searchOpen ? 'Close' : 'Search'}</span>
          </button>
          {searchOpen && (
            <div className="staggered-tech-search__panel">
              <label className="staggered-tech-search__label" htmlFor="technology-index-search">Find a tool</label>
              <div className="staggered-tech-search__input-wrap">
                <span className="staggered-tech-search__pulse" aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  id="technology-index-search"
                  className="staggered-tech-search__input"
                  type="search"
                  autoComplete="off"
                  placeholder="Search technologies..."
                  value={searchQuery}
                  onChange={event => {
                    setSearchQuery(event.target.value);
                    setSuggestionsDismissed(false);
                  }}
                  onKeyDown={event => {
                    if (event.key === 'Escape') {
                      setSuggestionsDismissed(true);
                      event.currentTarget.blur();
                    } else if (event.key === 'Enter' && suggestions[0]) {
                      event.preventDefault();
                      selectSuggestion(suggestions[0]);
                    }
                  }}
                />
              </div>
              {normalizedQuery && !suggestionsDismissed && (
                <div className="staggered-tech-search__suggestions" role="listbox" aria-label="Matching technologies">
                  {suggestions.length ? suggestions.map(item => (
                    <button
                      key={item.title}
                      type="button"
                      className="staggered-tech-search__suggestion"
                      role="option"
                      aria-selected="false"
                      onClick={() => selectSuggestion(item)}
                    >
                      <span>{item.title}</span><small>{item.category}</small>
                    </button>
                  )) : (
                    <p className="staggered-tech-search__empty">No matching tools found.</p>
                  )}
                </div>
              )}
            </div>
          )}
          <svg className="staggered-tech-search__filter-defs" aria-hidden="true" focusable="false">
            <defs>
              <filter id="technology-search-goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>
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
        {!visibleItems.length && (
          <p className="staggered-tech-empty">No tools match “{searchQuery.trim()}”. Try another search or choose a different domain.</p>
        )}
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
