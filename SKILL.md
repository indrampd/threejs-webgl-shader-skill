---
name: threejs-webgl-shader
description: "Build, optimize, and synchronize Three.js WebGL custom shaders with DOM elements, Lenis smooth scrolling, mouse interactions, and video/image textures. Use when implementing WebGL image effects, distortion shaders, hover effects, curtain animations, or DOM-to-WebGL mesh mapping."
argument-hint: "Describe shader effect, DOM sync requirement, or optimization task"
user-invocable: true
---

# Three.js WebGL Shader & DOM Synchronization Skill

## Overview

This skill provides a standardized workflow and architectural patterns for creating high-performance WebGL custom shaders mapped directly to HTML DOM elements (images, videos, backgrounds) using Three.js, GLSL, Lenis smooth scroll, and GSAP.

## When to Use

- Synchronizing DOM elements (`img`, `video`, `div`) with Three.js WebGL planes in a 1:1 pixel coordinate space.
- Writing custom Vertex & Fragment Shaders for hover distortion, wave/ripple effects, RGB shifts, liquid transitions, and scroll velocity stretching.
- Integrating smooth scroll libraries (Lenis) and animation engines (GSAP) with custom uniform updates.
- Managing WebGL lifecycle, resource cleanup, texture handling (CORS, video autoplay, aspect-ratio UV cover), and SPA route transitions.

## Core Architectural Workflow

### 1. Camera & Coordinate Space Setup (1 Unit = 1 Pixel)

To achieve pixel-perfect mapping between DOM `getBoundingClientRect()` and Three.js 3D space:

- Use a `PerspectiveCamera` with a defined FOV (e.g., $45^\circ$).
- Compute the camera distance:
  $$\text{cameraDistance} = \frac{\text{height}}{2 \cdot \tan\left(\frac{\text{fov} \cdot \pi}{360}\right)}$$
- Set `camera.position.set(0, 0, cameraDistance)`.
- Convert DOM coordinates to Three.js coordinates:
  - $\text{mesh.position.x} = \text{rect.left} + \frac{\text{rect.width}}{2} - \frac{\text{window.innerWidth}}{2}$
  - $\text{mesh.position.y} = -\left(\text{rect.top} + \frac{\text{rect.height}}{2}\right) + \frac{\text{window.innerHeight}}{2}$
  - $\text{mesh.scale.set}(\text{rect.width}, \text{rect.height}, 1)$

See [Coordinate Reference](./references/coordinate-mapping.md) for full implementation details.

### 2. Shader Uniforms & Responsive UV Cover

When texture aspect ratio differs from the DOM element aspect ratio, apply object-fit cover logic directly inside the vertex or fragment shader using an aspect ratio uniform vector:

- Uniform: `u_textureRes` and `u_elementRes` or `u_aspect`
- Compute scale factors in fragment shader to preserve aspect ratio without stretching.

See [Shader Patterns](./references/shader-patterns.md) for GLSL templates (RGB shift, noise distortion, wave, hover effects).

### 3. Rendering Loop & Interaction Pipeline

1. Update Lenis scroll state on `raf`.
2. Sync uniforms (time, scroll velocity, mouse position / hover progress via GSAP tweens).
3. Update mesh bounds via `getBoundingClientRect()` when scrolling or resizing (or interpolate with cached offsets for maximum performance).
4. Render scene via `WebGLRenderer`.

## Reference Guides & Assets

- [Coordinate Mapping & DOM Sync](./references/coordinate-mapping.md)
- [GLSL Shaders & Uniform Patterns](./references/shader-patterns.md)
- [Render Loop, Timing & Performance](./references/render-loop-performance.md)
- [Boilerplate Template](./assets/webgl-shader-template.js)
