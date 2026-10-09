// src/shaders/mesh_light.frag
varying vec3 vNormal;
varying vec3 vColor;

void main() {
    vec3 n = normalize(vNormal);
    vec3 light = normalize(vec3(cos(iTime), 0.6, sin(iTime) + 1.5));
    float diff = max(dot(n, light), 0.0);
    vec3 base = vColor * (0.5 + 0.5 * n);
    gl_FragColor = vec4(base * (0.25 + 0.75 * diff), 1.0);
}
