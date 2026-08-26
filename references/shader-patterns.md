# Common GLSL Shader Patterns for DOM Elements

## 1. Object-Fit Cover UV Correction (Fragment Shader)

```glsl
varying vec2 vUv;
uniform sampler2D u_texture;
uniform vec2 u_planeRes;
uniform vec2 u_imageRes;

vec2 getCoverUv(vec2 uv, vec2 planeRes, vec2 imageRes) {
    vec2 s = planeRes;
    vec2 i = imageRes;
    float rs = s.x / s.y;
    float ri = i.x / i.y;
    vec2 newUv = uv;
    if (rs > ri) {
        newUv.y = (uv.y - 0.5) * (ri / rs) + 0.5;
    } else {
        newUv.x = (uv.x - 0.5) * (rs / ri) + 0.5;
    }
    return newUv;
}

void main() {
    vec2 coverUv = getCoverUv(vUv, u_planeRes, u_imageRes);
    vec4 color = texture2D(u_texture, coverUv);
    gl_FragColor = color;
}
```

## 2. Scroll Velocity Wave Deformation (Vertex Shader)

```glsl
uniform float u_velocity;
uniform float u_time;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec3 pos = position;

    // Deform Z or Y based on distance from center and scroll velocity
    float dist = distance(uv, vec2(0.5));
    pos.z += sin(uv.y * 3.14159) * u_velocity * 15.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

## 3. RGB Shift / Chromatic Aberration on Hover

```glsl
uniform sampler2D u_texture;
uniform float u_hover;
varying vec2 vUv;

void main() {
    float shift = u_hover * 0.02;
    float r = texture2D(u_texture, vUv + vec2(shift, 0.0)).r;
    float g = texture2D(u_texture, vUv).g;
    float b = texture2D(u_texture, vUv - vec2(shift, 0.0)).b;
    float a = texture2D(u_texture, vUv).a;

    gl_FragColor = vec4(r, g, b, a);
}
```
