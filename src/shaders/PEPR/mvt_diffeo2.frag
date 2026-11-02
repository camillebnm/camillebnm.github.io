uniform int u_clickCount;
uniform float u_clickTimes[100];

float disc(vec2 p, vec2 c, float r, float aa) {
    return 1.0 - smoothstep(r - aa, r + aa, length(p - c));
}

float pop(float t) {
    if (t < 0.0) return 0.0;
    float x = clamp(t / 0.45, 0.0, 1.0) - 1.0;
    return 1.0 + 2.70158*x*x*x + 1.70158*x*x;
}

float pulse(vec2 p, vec2 c, float t, float aa) {
    if (t < 0.0 || t > 0.7) return 0.0;
    float k = t / 0.7;
    float r = 0.1 * (1.0 + 2.2*k);
    float w = 0.004 * (1.0 - k) + 0.5*aa;
    return (1.0 - smoothstep(w - aa, w + aa, abs(length(p - c) - r))) * (1.0 - k) * 0.6;
}
vec2 curvePos(float t, vec2 x, vec2 translation, float angle) {
    mat2 R = mat2(cos(t * angle), sin(t * angle), -sin(t * angle), cos(t * angle));
    return R * x + t * translation;
}
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float aa = 1.0 / iResolution.y;
    vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    vec3 color = vec3(1.0);
    int clicked = u_clickCount;

    float angle = 1.56;
    vec2 translation = vec2(0.8, 1.75);
    vec2 x = vec2(-1.5, -0.6);
    vec2 refP = vec2(-1.0, 0.5);
    vec2 y = curvePos(1.0, x, translation, angle);

    // Géométrie commune
    vec2 d1     = normalize(refP - x);
    vec2 ortho1 = vec2(d1.y, -d1.x);

    // Position du point jaune : fixe à 75 %, animé à partir du clic 3
    float tTarget = 1.;
    if (clicked > 2) {
        float phase = max(iTime - u_clickTimes[2], 0.0) * 0.3;
        float ph = mod(phase + 1., 2.0);
        tTarget = 1.0 - abs(ph - 1.0);
    }
    vec2 target = curvePos(tTarget, x, translation, angle);

    vec2 d2     = normalize(target - refP);
    vec2 ortho2 = vec2(-d2.y, d2.x);

    // ===== 1) COURBES (en dessous) =====

    // Courbe jaune (clic 2)
    if (clicked > 2) {
        for (int i = 0; i <= 100; i++) {
            float t = float(i) / 100.0;
            color = mix(color, vec3(0.75, 0.75, 0.15),
                        disc(uv, curvePos(t, x, translation, angle), 0.01, aa));
        }
    }

    // Trajectoire violette x -> refP (clic 1)
    if (clicked > 0) {
        for (int i = 0; i <= 200; i++) {
            float s = float(i) / 200.0;
            vec2 p1 = mix(x, refP, s) + 0.2 * sin(3.14159 * s) * ortho1;
            color = mix(color, vec3(0.75, 0.1, 0.75), disc(uv, p1, 0.01, aa));
        }
    }

    // Trajectoire rouge refP -> target (clic 2)
    if (clicked > 1) {
        for (int i = 0; i <= 200; i++) {
            float s = float(i) / 200.0;
            vec2 p2 = mix(refP, target, s) + 0.2 * sin(3.14159 * s) * ortho2;
            color = mix(color, vec3(0.9, 0.1, 0.1), disc(uv, p2, 0.01, aa));
        }
    }

    // ===== 2) POINTS (au-dessus) =====

    


    if (clicked > 1) {
        

        // Point jaune mobile
        color = mix(color, vec3(0.75, 0.75, 0.15), disc(uv, target, 0.05, aa));
    }
	// Point x
    color = mix(color, vec3(0.1, 0.3, 0.95), disc(uv, x, 0.1, aa));
    // Point y (extrémité de la courbe jaune)
    color = mix(color, vec3(0.1, 0.95, 0.15), disc(uv, y, 0.1, aa));
    // Point noir refP (par-dessus la courbe rouge et violette)
        if (clicked > 0) {
        color = mix(color, vec3(0.0), disc(uv, refP, 0.05, aa));
    }
    fragColor = vec4(color, 1.0);
}
