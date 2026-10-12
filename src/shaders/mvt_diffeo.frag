uniform int u_clickCount;
uniform float u_clickTimes[100];

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 pos = u_textPositions[2];
	vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    	vec3 color = vec3(1.0);
    	vec2 mouse = iMouse.xy;
    	float angle = 1.56;
    	vec2 translation = vec2(0.8, 1.75);
    	int clicked = u_clickCount;
	vec2 x = vec2(-1.5, -0.6);
	mat2 R = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
        vec2 y = R * x + translation;
        
        float angle2 = 2.1;
        mat2 R2 = mat2(cos(angle2), sin(angle2), -sin(angle2), cos(angle2));
        vec2 translation2 = vec2(-0.8, -.75);
        
        vec2 z = R2 * y + translation2;
        
        
        if (clicked > 2 && clicked < 4) {
		float elapse = max(iTime - u_clickTimes[2] , 0.);
	    int n = clamp(int(elapse * 100.0), 0, 100);

	    for (int i = 0; i <= 100; i++) {
		if (i > n) break;

		float t = 1. - float(i) / 100.0;

		mat2 R_time = mat2(
		    cos(t * angle2), sin(t * angle2),
		    -sin(t * angle2), cos(t * angle2)
		);

		vec2 translation_time = t * translation2;
		vec2 p = R_time * y + translation_time;

		if (length(uv - p) < 0.01)
		    color = vec3(0.75, 0.1, 0.25);
	    }

	    if (length(uv - z) < 0.1)
		color = vec3(0.75, 0.1, 0.25);
	}
        
        
        if (clicked > 3) {
	    float elapsed = max(iTime - u_clickTimes[3], 0.0);
	    int n = clamp(int(elapsed * 100.0), 0, 100);
	    float actual_time = float(n) / 100.0;

	    for (int i = 0; i <= 100; i++) {

		float t = float(i) / 100.0;

		mat2 R_time2 = mat2(
		    cos(t * angle), sin(t * angle),
		    -sin(t * angle), cos(t * angle)
		);
		vec2 translation_time2 = t * translation;
		vec2 p2 = R_time2 * x + translation_time2;

		t = 1.0 - t;

		mat2 R_time = mat2(
		    cos(t * angle2), sin(t * angle2),
		    -sin(t * angle2), cos(t * angle2)
		);
		vec2 translation_time = t * translation2;
		vec2 p = R_time * y + translation_time;

		if (length(uv - (actual_time * p2 + (1.0 - actual_time) * p)) < 0.01)
		    color = vec3(0.75, 0.1, 0.25);

		if (length(uv - (actual_time * x + (1.0 - actual_time) * z)) < 0.1)
		    color = vec3(0.75, 0.1, 0.25);
	    }
	} 
        
    	if (clicked > 0) {
    		if (length(uv - x) < 0.1) color = vec3(0.1, 0.3, 0.95);
    	}


    	if (clicked > 1) {
    	    if (length(uv - y) < 0.1) color = vec3(0.1, 0.75, 0.25);

    	}
    	
	



    fragColor = vec4(color, 1.0);
}
