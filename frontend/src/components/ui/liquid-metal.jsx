import React from 'react';
import { LiquidMetal as LiquidMetalShader } from '@paper-design/shaders-react';

/**
 * Small animated liquid-metal outline for the landing mode buttons.
 * The centre stays readable; the shader is visible as a moving metallic rim.
 */
export function LiquidMetalSurface({ variant = 'animation' }) {
  const isProfessional = variant === 'professional';

  return (
    <div className={`liquid-metal-surface liquid-metal-surface--${variant}`} aria-hidden="true">
      <div className="liquid-metal-shader-layer">
        <LiquidMetalShader
          colorBack={isProfessional ? '#a8e7bb' : '#0b2616'}
          colorTint={isProfessional ? '#ffffff' : '#c7ffda'}
          speed={0.32}
          repetition={3.5}
          distortion={0.16}
          softness={0}
          shiftRed={0.12}
          shiftBlue={-0.12}
          angle={45}
          shape="none"
          scale={1.12}
          fit="cover"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <span className="liquid-metal-inner" />
    </div>
  );
}

export default LiquidMetalSurface;
