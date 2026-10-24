import React from 'react';
import { technologyIcons } from '../TechnologyIcons.js';

/**
 * A lightweight, framework-native staggered grid for the portfolio's technology chapters.
 * It intentionally uses the project's existing CSS and local icon system instead of
 * pulling in a second Tailwind/shadcn styling stack just for these cards.
 */
export function StaggeredGrid({ items = [], className = '' }) {
  return (
    <div className={`staggered-tech-grid ${className}`.trim()}>
      {items.map((item, index) => (
        <button
          key={item.search || item.title}
          type="button"
          className="staggered-tech-card"
          data-technology={item.search || item.title}
          style={{ '--stagger-index': index, '--stagger-offset': index % 2 ? '14px' : '0px' }}
          aria-label={`Explore ${item.title}`}
        >
          <span className="staggered-tech-card__top">
            <span
              className="staggered-tech-card__icon"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: technologyIcons(item.title, { eager: true }) }}
            />
            <span className="staggered-tech-card__index">{String(index + 1).padStart(2, '0')}</span>
          </span>
          <strong className="staggered-tech-card__title">{item.title}</strong>
          <span className="staggered-tech-card__description">{item.description}</span>
          <span className="staggered-tech-card__arrow" aria-hidden="true">↗</span>
        </button>
      ))}
    </div>
  );
}
