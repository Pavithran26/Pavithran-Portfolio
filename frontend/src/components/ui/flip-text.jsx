import { useMemo } from 'react';

/**
 * FlipText-inspired character animation adapted for this Vite portfolio.
 * Mirrors the VengeanceUI component API without requiring Tailwind or shadcn aliases.
 */
export function FlipText({
  className = '',
  children,
  duration = 2.2,
  delay = 0,
  loop = true,
  separator = ' ',
  together = false,
}) {
  const text = String(children ?? '');
  const words = useMemo(() => text.split(separator), [text, separator]);
  const totalChars = Math.max(1, text.length);

  const getCharIndex = (wordIndex, charIndex) => {
    let index = 0;
    for (let i = 0; i < wordIndex; i++) {
      index += words[i].length + separator.length;
    }
    return index + charIndex;
  };

  return (
    <span
      className={['flip-text-wrapper', className].filter(Boolean).join(' ')}
      style={{ perspective: '1000px' }}
      aria-hidden="true"
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${wordIndex}-${word}`}
          className="flip-text-word"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {word.split('').map((char, charIndex) => {
            const currentGlobalIndex = getCharIndex(wordIndex, charIndex);
            const normalizedIndex = currentGlobalIndex / totalChars;
            const calculatedDelay = together
              ? delay
              : Math.sin(normalizedIndex * (Math.PI / 2)) * (duration * 0.25) + delay;

            return (
              <span
                key={`${charIndex}-${char}`}
                className="flip-char"
                data-char={char}
                style={{
                  '--flip-duration': `${duration}s`,
                  '--flip-delay': `${calculatedDelay}s`,
                  '--flip-iteration': loop ? 'infinite' : '1',
                  transformStyle: 'preserve-3d',
                }}
              >
                {char}
              </span>
            );
          })}
          {separator === ' ' && wordIndex < words.length - 1 && (
            <span className="flip-text-whitespace">&nbsp;</span>
          )}
          {separator !== ' ' && wordIndex < words.length - 1 && (
            <span className="flip-text-separator">{separator}</span>
          )}
        </span>
      ))}
    </span>
  );
}

export default FlipText;
