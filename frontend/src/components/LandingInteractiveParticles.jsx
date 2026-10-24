import { useEffect, useState } from 'react';
import InteractiveParticles from './ui/interactive-particles.tsx';

const DESKTOP_MASK = '/images/pavithran-fde-particles.svg';
const MOBILE_MASK = '/images/pavithran-fde-particles-mobile.svg';

/**
 * Brand-shaped particle layer for the mode selector.
 * The source is a generated text mask, so visitors never need to upload anything.
 */
export function LandingInteractiveParticles() {
  const [src, setSrc] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
      ? MOBILE_MASK
      : DESKTOP_MASK
  );

  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)');
    const updateSource = () => setSrc(query.matches ? MOBILE_MASK : DESKTOP_MASK);
    query.addEventListener?.('change', updateSource);
    return () => query.removeEventListener?.('change', updateSource);
  }, []);

  return (
    <InteractiveParticles
      src={src}
      allowUpload={false}
      background="transparent"
      color="#70dfa1"
      size={1.25}
      randomness={2.2}
      depth={2.1}
      touchRadius={0.16}
      maxDimension={320}
      threshold={34}
      className="fde-interactive-particles"
    />
  );
}

export default LandingInteractiveParticles;
