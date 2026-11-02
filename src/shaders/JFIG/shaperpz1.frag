#define PI 3.14159265359

float sdSegment(vec2 p, vec2 a, vec2 b)
{
    vec2 pa = p-a, ba = b-a;
    float h = clamp(dot(pa,ba)/max(dot(ba,ba),1e-12),0.,1.);
    return length(pa-ba*h);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (2.0*fragCoord-iResolution.xy)/iResolution.y;
    float t = 0.5-0.5*cos(iTime*0.8);

    // Sommets du grand carré
    vec2 V[9];

    V[0] = vec2(-0.5,-0.5);
    V[1] = vec2( 0.0,-0.5);
    V[2] = vec2( 0.5,-0.5);
    V[3] = vec2(-0.5, 0.0);
    V[4] = vec2( 0.0, 0.0);
    V[5] = vec2( 0.5, 0.0);
    V[6] = vec2(-0.5, 0.5);
    V[7] = vec2( 0.0, 0.5);
    V[8] = vec2( 0.5, 0.5);

    // Positions finales réparties sur un cercle
int boundary[8] = int[8](0, 1, 2, 5, 8, 7, 6, 3);

vec2 targets[9];

for(int k=0; k<8; k++)
{
    float angle = -3.0*PI/4.0 + 2.0*PI*float(k)/8.0;
    targets[boundary[k]] = 0.65*vec2(cos(angle), sin(angle));
}

// Centre et sommets adjacents rapprochés de V[0]
vec2 p = targets[0];
targets[1] = mix(targets[1], p, 0.65);
targets[3] = mix(targets[3], p, 0.65);
targets[4] = mix(vec2(0.0), p, 0.65);

for(int i=0; i<9; i++)
    V[i] = mix(V[i], targets[i], t);
    // 8 triangles
    ivec3 T[8] = ivec3[8](
        ivec3(0,1,4), ivec3(0,4,3),
        ivec3(1,2,5), ivec3(1,5,4),
        ivec3(3,4,7), ivec3(3,7,6),
        ivec3(4,5,8), ivec3(4,8,7)
    );

    float d = 1e5;

    for(int i=0;i<8;i++)
    {
        ivec3 tri = T[i];
        d = min(d,sdSegment(uv,V[tri.x],V[tri.y]));
        d = min(d,sdSegment(uv,V[tri.y],V[tri.z]));
        d = min(d,sdSegment(uv,V[tri.z],V[tri.x]));
    }

    float aa = 1.5/iResolution.y;
    float line = 1.0-smoothstep(0.003,0.003+aa,d);

    vec3 col = mix(vec3(1.0),vec3(0.25,0.35,0.45),line);
    fragColor = vec4(col,1.0);
}
