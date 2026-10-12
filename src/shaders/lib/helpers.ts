import type { TimelineContext } from './types';

export type Vec2 = [number, number];

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easings = {
  linear: (t: number) => t,
  inCubic: (t: number) => t * t * t,
  outCubic: (t: number) => 1 - (1 - t) ** 3,
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
};

/**
 * Avancement 0 → 1 d'une animation déclenchée par le (click+1)-ième clic
 * (click est l'indice de clic, en partant de 0). Vaut 0 tant que ce clic n'a pas eu lieu.
 */
export function progress(
  ctx: TimelineContext,
  click: number,
  duration: number,
  ease: (t: number) => number = easings.linear
): number {
  if (ctx.clickCount <= click) return 0;
  return ease(clamp((ctx.time - ctx.clickTimes[click]) / duration));
}

export const add = (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]];
export const scale = (a: Vec2, s: number): Vec2 => [a[0] * s, a[1] * s];

/** Rotation antihoraire de `v` d'un angle `a` (même convention que mat2(c, s, -s, c) en GLSL). */
export function rot(a: number, v: Vec2): Vec2 {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [c * v[0] - s * v[1], s * v[0] + c * v[1]];
}

/**
 * Convertit une position du repère des shaders Shadertoy du composant,
 * uv = (2 * fragCoord - iResolution.xy) / iResolution.y (y vers le haut),
 * en pourcentages (x, y vers le bas) utilisables dans TextState.
 */
export function uvToPercent(uv: Vec2, aspect: number): Vec2 {
  return [(uv[0] / aspect + 1) * 50, (1 - uv[1]) * 50];
}
