import type { Timeline } from './lib/types';
import { add, scale, rot, progress, uvToPercent, type Vec2 } from './lib/helpers';

// Paramètres géométriques : source unique, envoyés au shader en uniforms.
//const ANGLE = 1.56;
//const TRANSLATION: Vec2 = [0.8, 1.75];
//const Y: Vec2 = add(rot(ANGLE, X), TRANSLATION);



const timeline: Timeline = (ctx) => {
  const t0 = ctx.textBlocks[0];             // le 3e textBlock
  const a = ctx.time * 5;
  const t2 = ctx.textBlocks[2];
  
  const p = ctx.clickCount > 3
    ? Math.min(1, Math.max(0, (ctx.time - ctx.clickTimes[3]) / 1))
    : 0;
  
  const env = Math.sin(Math.PI * p);        // 0 → 1 → 0 : la danse n'existe que pendant la transition
  const beat = p * 2 * Math.PI * 2;         // 5 "pas" de danse sur toute la transition
  const s = Math.sin(beat);
  
  return {
    texts: [
      {
        x: t0.x + 10 * Math.cos(a)/ ctx.aspect,          // oscille autour de sa position initiale
        y: t0.y + 10 + 10 * Math.sin(a),          
      },
      undefined, 
      { x: t2.x - (10 * p) / ctx.aspect + (4 * env * s) / ctx.aspect,
        // trajectoire de base + rebonds
        y: t2.y + 70 * p - 3 * env * Math.abs(s),
        // balancement
        rotate: 25 * env * s,
        // petite pulsation sur le rythme
        scale: 1 + 0.25 * env * Math.abs(s),  },
    ],
  };
};
export default timeline;

//{ opacity: 0.6 + 0.4 * Math.sin(ctx.time * 3) }   // pulsation
//{ scale: 1 + 0.1 * Math.sin(ctx.time * 2) }       // respiration
//{ y: 50 + 3 * Math.sin(ctx.time * 2) }            // flottement vertical
