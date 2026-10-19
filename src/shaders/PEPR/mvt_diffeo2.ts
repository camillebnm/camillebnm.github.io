import type { Timeline } from '../lib/types';
import { add, scale, rot, uvToPercent, type Vec2 } from '../lib/helpers';

const angle = 1.56;
const translation: Vec2 = [0.8, 1.75];
const x: Vec2 = [-1.5, -0.6];

// Même fonction que curvePos dans le shader
const curvePos = (t: number): Vec2 =>
  add(rot(t * angle, x), scale(translation, t));

const timeline: Timeline = (ctx) => {
  const aspect = ctx.aspect;

  // t = 1 tant qu'on n'a pas cliqué 3 fois, puis oscillation triangle (départ en phase 1)
  let t = 1;
  if (ctx.clickCount > 2) {
    const elapsed = Math.max(ctx.time - ctx.clickTimes[2], 0);
    const ph = (elapsed * 0.3 + 1) % 2;
    t = 1 - Math.abs(ph - 1);
  }

  const target = curvePos(t);
  const target0 = curvePos(1); // position initiale = y

  // Label φ_t(x) (index 2) : suit le point jaune
  const phiBlock = ctx.textBlocks[2];
  const phiOffset = sub(
    [phiBlock.x, phiBlock.y],
    uvToPercent(target0, aspect),
  );
  const phiPos = add(uvToPercent(target, aspect), phiOffset);

  return {
    texts: [
      undefined, // 0 : (x, t0)
      undefined, // 1 : (y, t1)
      { ...position(phiPos), opacity: ctx.clickCount > 2 ? 1 : 0 }, // 2 : φ_t(x), clicks: 3
      undefined, // 3 : D^{-1}_{t0}
      undefined, // 4 : D_t
      undefined, // 5 : Reference
    ],
  };
};

function sub(a: Vec2, b: Vec2): Vec2 {
  return [a[0] - b[0], a[1] - b[1]];
}

function position([x, y]: Vec2) {
  return { x, y };
}

export default timeline;
