#define PI 3.14159265359

float sdSquare(vec2 p, float s)
{
    vec2 d = abs(p) - s;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdCircle(vec2 p, float r)
{
    return length(p) - r;
}

float dashed(float d, float period, float width, float aa)
{
    float phase = mod(d, period);
    float dist = min(phase, period-phase);
    return 1.0 - smoothstep(width - aa, width + aa, dist);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (2.0*fragCoord-iResolution.xy)/iResolution.y;
    float t = 0.5 - 0.5*cos(iTime*0.8);

    float d0 = sdSquare(uv, 0.5);
    float d1 = sdCircle(uv, 0.65);
    float d = mix(d0, d1, t);

    float aa = fwidth(d);

    float contour = 1.0 - smoothstep(0.01 - aa, 0.01 + aa, abs(d));

    float inner = dashed(d + 1.5, 0.075, 0.008, aa);
    float outer = dashed(d - 1.5, 0.075, 0.008, aa);

    vec3 col = vec3(1.0);
    col = mix(col, vec3(0.0), contour);
    col = mix(col, vec3(0.9, 0.1, 0.1), inner * (d < -aa ? 1.0 : 0.0));
    col = mix(col, vec3(0.1, 0.65, 0.2), outer * (d > aa ? 1.0 : 0.0));

    fragColor = vec4(col, 1.0);
}
