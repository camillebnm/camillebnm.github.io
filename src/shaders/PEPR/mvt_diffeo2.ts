import type { Timeline } from '../lib/types';
import { add, scale, rot, uvToPercent, type Vec2 } from '../lib/helpers';

const angle = 1.56;
const translation: Vec2 = [0.8, 1.75];
const x: Vec2 = [-1.5, -0.6];
const ref: Vec2 = [-1, 0.5];

const timeline: Timeline = (ctx) => {
const aspect = ctx.aspect;
  const elapsed = Math.max(ctx.time - ctx.clickTimes[1], 0);
const phase = (elapsed * 0.3) % 2;
const t = 1 - Math.abs(phase - 1);

const target = add(rot(t * angle, x), scale(translation, t));

const d1 = normalize(sub(ref, x));
const ortho1: Vec2 = [d1[1], -d1[0]];

const p1 = (s: number): Vec2 =>
  add(
    add(scale(x, 1 - s), scale(ref, s)),
    scale(ortho1, 0.2 * Math.sin(Math.PI * s)),
  );
const d2 = normalize(sub(target, ref));
const ortho2: Vec2 = [-d2[1], d2[0]];

const p2 = (s: number): Vec2 =>
  add(
    add(scale(ref, 1 - s), scale(target, s)),
    scale(ortho2, 0.2 * Math.sin(Math.PI * s)),
  );

const target0 = x;
const targetBlock = ctx.textBlocks[2];

const targetOffset = sub(
  [targetBlock.x, targetBlock.y],
  uvToPercent(target0, aspect),
);

const targetPos = add(uvToPercent(target, aspect), targetOffset);
const inversePos = uvToPercent(p1(t), aspect);

const targetInitial = x;
const d20 = normalize(sub(targetInitial, ref));
const ortho20: Vec2 = [-d20[1], d20[0]];

const refPoint0 = add(
  scale(ref, 0.5),
  scale(targetInitial, 0.5),
);

const refBlock = ctx.textBlocks[4];
const refOffset = sub(
  [refBlock.x, refBlock.y],
  uvToPercent(refPoint0, aspect),
);

const refPoint = p2(0.5);
const refPos = add(uvToPercent(refPoint, aspect), refOffset);


  return {
    texts: [
  undefined,
  undefined,
  { ...position(targetPos), opacity: ctx.clickCount > 1 ? 1 : 0 },
  undefined,
  undefined,
],
  };
};

function sub(a: Vec2, b: Vec2): Vec2 {
  return [a[0] - b[0], a[1] - b[1]];
}

function normalize(v: Vec2): Vec2 {
  const n = Math.hypot(v[0], v[1]);
  return [v[0] / n, v[1] / n];
}

function position([x, y]: Vec2) {
  return { x, y };
}

export default timeline;
