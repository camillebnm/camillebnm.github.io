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

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    float aa = 1.0 / iResolution.y;
    vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    vec3 color = vec3(1.0);
    int clicked = u_clickCount;

    float angle = 1.56;
    float angle2 = 2.1;
    vec2 translation = vec2(0.8, 1.75);
    vec2 translation2 = vec2(-0.8, -0.75);
    vec2 x = vec2(-1.5, -0.6);
    mat2 R = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
    vec2 y = R * x + translation;
    mat2 R2 = mat2(cos(angle2), sin(angle2), -sin(angle2), cos(angle2));
    vec2 z = R2 * y + translation2;

    float elapsed = clicked > 3 ? max(iTime - u_clickTimes[3], 0.0) : 0.0;
    float a = clamp(elapsed, 0.0, 1.0);
    float tx = clicked > 0 ? iTime - u_clickTimes[0] : -1.0;
    float ty = clicked > 1 ? iTime - u_clickTimes[1] : -1.0;

    if (clicked > 2) {
        int n = clamp(int(max(iTime - u_clickTimes[2], 0.0) * 100.0), 0, 100);
        for (int i = 0; i <= 100; i++) {
            if (i > n) break;
            float t = float(i) / 100.0;
            mat2 Rt = mat2(cos(t * angle), sin(t * angle), -sin(t * angle), cos(t * angle));
            vec2 p = Rt * x + t * translation;
            color = mix(color, vec3(0.75, 0.1, 0.25), disc(uv, p, 0.01, aa));
        }
    }
    
	if (clicked > 3) {
        int n = clamp(int(max(iTime - u_clickTimes[3], 0.0) * 100.0), 0, 100);
        for (int i = 0; i <= 100; i++) {
            if (i > n) break;
            float t =  float(i) / 100.0;
            mat2 Rt = mat2(cos(t * angle), - sin(t * angle),  sin(t * angle), cos(t * angle));
            vec2 d = normalize(y - x);
vec2 p0 = Rt * (y - t * translation);
vec2 p = x + 2.0 * d * dot(p0 - x, d) - (p0 - x);
            color = mix(color, vec3(0.75, 0.1, 0.75), disc(uv, p, 0.01, aa));
        }
    }
    

    color = mix(color, vec3(0.1, 0.3, 0.95), pulse(uv, x, tx, aa));
    color = mix(color, vec3(0.1, 0.75, 0.25), pulse(uv, y, ty, aa));
    color = mix(color, vec3(0.1, 0.3, 0.95), disc(uv, x, 0.1 * pop(tx), aa));
    color = mix(color, vec3(0.1, 0.75, 0.25), disc(uv, y, 0.1 * pop(ty), aa));

    fragColor = vec4(color, 1.0);
}
