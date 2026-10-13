import type { Timeline } from './lib/types';
import { add, scale, rot, progress, uvToPercent, type Vec2 } from './lib/helpers';

// Paramètres géométriques : source unique, envoyés au shader en uniforms.
//const ANGLE = 1.56;
//const TRANSLATION: Vec2 = [0.8, 1.75];
//const Y: Vec2 = add(rot(ANGLE, X), TRANSLATION);



const timeline: Timeline = (ctx) => {
  const t0 = ctx.textBlocks[0];             // le 3e textBlock
  const a = ctx.time * 5;  
  const t1 = ctx.textBlocks[1];
  const t2 = ctx.textBlocks[2];
  const t3 = ctx.textBlocks[3];
  
  const p = ctx.clickCount > 2
    ? Math.min(1, Math.max(0, (ctx.time - ctx.clickTimes[3]) / 1))
    : 0;

  return {
    texts: [
    undefined, 
    {x: !p ? t1.x : 1000, 
    y: !p ? t1.y : 1000
    }, 
    undefined,
    undefined,
    ],
  };
};
export default timeline;

//{ opacity: 0.6 + 0.4 * Math.sin(ctx.time * 3) }   // pulsation
//{ scale: 1 + 0.1 * Math.sin(ctx.time * 2) }       // respiration
//{ y: 50 + 3 * Math.sin(ctx.time * 2) }            // flottement vertical
