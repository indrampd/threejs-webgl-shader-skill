# Render Loop, Timing & Performance Best Practices

## 1. Frame Timing Strategy

When driving shader animations with time (`u_time`), use the timestamp passed by `requestAnimationFrame` rather than creating extra timer objects:

```javascript
render(time = 0) {
  if (this.isDestroyed) return;

  // Convert milliseconds to seconds
  const elapsedTime = time * 0.001;

  // Sync Lenis smooth scroll
  this.lenis.raf(time);

  // Update uniforms
  this.items.forEach((item) => {
    item.material.uniforms.u_time.value = elapsedTime;
  });

  this.renderer.render(this.scene, this.camera);
  this.rafId = requestAnimationFrame((t) => this.render(t));
}
```

### When to use what?

- **`time * 0.001` (from `rAF`)**: **Recommended**. Zero GC overhead, lightweight, automatically synced with the browser's refresh rate and pauses/resumes naturally when tabs change.
- **`THREE.Timer`**: Use only if you specifically need simulation timescale features (e.g. slow-motion, delta clamping, fixed-step physics). Always call `timer.update(timestamp)` before reading `timer.getElapsed()`.
- **`THREE.Clock`**: Avoid in modern code due to large delta jumps when browser tabs are backgrounded.

---

## 2. Lerping Mouse Target vs Current

Avoid writing directly to mouse uniforms on raw pointer events. Instead, store the target and lerp in the render loop for smooth trailing motion:

```javascript
// In render loop
item.mouseCurrent.lerp(item.mouseTarget, 0.1);
item.material.uniforms.u_mouse.value.copy(item.mouseCurrent);
```
