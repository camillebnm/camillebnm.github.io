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

    vec2 ref = vec2(-1,0.5 );
    


    	
    







color = mix(color, vec3(0.1, 0.3, 0.95), disc(uv, x, 0.1, aa));
color = mix(color, vec3(0.1, 0.75, 0.25), disc(uv, y, 0.1, aa));

if (clicked > 0){

    color = mix(color, vec3(0.0, 0.0, 0.0), disc(uv, ref, 0.05, aa));
    
    
    
}
if (clicked > 1) {
    float phase = mod(max(iTime - u_clickTimes[1], 0.0)*0.3, 2.0);
    float t = 1.0 - abs(phase - 1.0);
    mat2 Rmid = mat2(cos(t * angle), sin(t * angle), -sin(t * angle), cos(t * angle));
    vec2 target = Rmid * x + t * translation;

    vec2 d1 = normalize(ref - x);
    vec2 ortho1 = vec2(d1.y, -d1.x);
    vec2 d2 = normalize(target - ref);
    vec2 ortho2 = vec2(-d2.y, d2.x);

    for (int i = 0; i <= 1000; i++) {
        float s = float(i) / 1000.0;
        vec2 p1 = mix(x, ref, s) + 0.2  * sin(3.14159 * s) * ortho1;
        vec2 p2 = mix(ref, target, s) + 0.2  * sin(3.14159 * s) * ortho2;
	color = mix(color, vec3(0.75, 0.1, 0.75), disc(uv, p1, 0.01, aa));
	color = mix(color, vec3(0.9, 0.1, 0.1), disc(uv, p2, 0.01, aa));
    }
    color = mix(color, vec3(0.75, 0.75, 0.15), disc(uv, target, 0.05, aa));
    int n = 100;
for (int i = 0; i <= n; i++) {
    float t = float(i) / 100.0;
    mat2 Rt = mat2(cos(t * angle), sin(t * angle), -sin(t * angle), cos(t * angle));
    vec2 p = Rt * x + t * translation;
    color = mix(color, vec3(0.75, 0.75, 0.15), disc(uv, p, 0.01, aa));
}
}





    fragColor = vec4(color, 1.0);
   

}
