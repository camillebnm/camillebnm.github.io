uniform int u_clickCount;
uniform float u_clickTimes[100];

const float PI       = 3.14159265359;
const float DURATION = 1.5;                  // durée de l'animation (s)
const float HALF     = 0.72;                 // demi-côté du carré
const vec2  C0       = vec2(-0.9, 0.0);      // centre de S0
const vec2  C1       = vec2( 0.9, 0.0);      // centre de S1
const float ROT      = PI;                   // angle total de rotation (anti-horaire)
const int   N        = 120;                   // nombre de points de la trajectoire
const float DOT_R    = 0.011;
const float LINE_W   = 0.008;
const float DISC_R   = 0.09;

const vec3 RED    = vec3(0.95, 0.05, 0.05);
const vec3 GREEN  = vec3(0.00, 0.60, 0.05);
const vec3 BLUE   = vec3(0.00, 0.60, 1.00);
const vec3 ORANGE = vec3(1.00, 0.50, 0.00);
const vec3 DARK   = vec3(0.00, 0.25, 0.58);

// Positions initiales des coins par rapport au centre (carré S0)
const vec2 O_RED    = vec2(-1.0,  1.0) * HALF;
const vec2 O_GREEN  = vec2( 1.0,  1.0) * HALF;
const vec2 O_BLUE   = vec2( 1.0, -1.0) * HALF;
const vec2 O_ORANGE = vec2(-1.0, -1.0) * HALF;

vec2 rot(vec2 v, float a) {
    float c = cos(a), s = sin(a);
    return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

float disc(vec2 p, vec2 c, float r, float px) {
    return 1.0 - smoothstep(r - 1.5 * px, r, length(p - c));
}

float squareOutline(vec2 p, vec2 c, float a, float px) {
    vec2 q = rot(p - c, -a);
    float d = max(abs(q.x), abs(q.y)) - HALF;
    return 1.0 - smoothstep(LINE_W, LINE_W + 1.5 * px, abs(d));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float aspect = iResolution.x / iResolution.y;
    float zoom = max(1.1, 1.8 / aspect);     // garde tout visible
    vec2 uv = zoom * (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    float px = zoom * 2.0 / iResolution.y;   // taille d'un pixel en unités uv

    // Progression : 0 avant le clic, puis 0 → 1 avec un easing
    float e = 0.0;
    if (u_clickCount > 0) {
        float s = clamp((iTime - u_clickTimes[0]) / DURATION, 0.0, 1.0);
        e = s * s * (3.0 - 2.0 * s);
    }

    vec3 col = vec3(1.0);

    // Trajectoires pointillées (rouge et orange), tracées au fur et à mesure
    if (u_clickCount > 0) {
        for (int i = 0; i <= N; i++) {
            float s = float(i) / float(N);
            if (s > e) break;
            vec2 c = mix(C0, C1, s);
            float a = ROT * s;
            col = mix(col, RED,    disc(uv, c + rot(O_RED,    a), DOT_R, px));
            col = mix(col, ORANGE, disc(uv, c + rot(O_ORANGE, a), DOT_R, px));
        }
    }

    // Carré initial S0 (fixe)
    if (u_clickCount < 1) col = mix(col, DARK, squareOutline(uv, C0, 0.0, px));

    // Carré mobile : rotation + translation
    vec2 c = mix(C0, C1, e);
    float a = ROT * e;
    col = mix(col, DARK, squareOutline(uv, c, a, px));

    // Coins colorés du carré mobile
    col = mix(col, GREEN,  disc(uv, c + rot(O_GREEN,  a), DISC_R, px));
    col = mix(col, BLUE,   disc(uv, c + rot(O_BLUE,   a), DISC_R, px));
    col = mix(col, RED,    disc(uv, c + rot(O_RED,    a), DISC_R, px));
    col = mix(col, ORANGE, disc(uv, c + rot(O_ORANGE, a), DISC_R, px));

    fragColor = vec4(col, 1.0);
}
