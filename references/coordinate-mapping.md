# Coordinate Mapping & DOM Sync in Three.js

## 1. Pixel-to-World Camera Equation

To map 1 Three.js unit to 1 screen pixel:

```javascript
import * as THREE from "three";

const fov = 45;
const width = window.innerWidth;
const height = window.innerHeight;
const cameraDistance = height / (2 * Math.tan((fov * Math.PI) / 360));

const camera = new THREE.PerspectiveCamera(fov, width / height, 1, 2000);
camera.position.set(0, 0, cameraDistance);
```

## 2. Syncing Meshes with DOM Elements

```javascript
function syncMeshWithElement(mesh, element) {
  const rect = element.getBoundingClientRect();

  // Center alignment offset
  const x = rect.left + rect.width / 2 - window.innerWidth / 2;
  const y = -(rect.top + rect.height / 2) + window.innerHeight / 2;

  mesh.position.set(x, y, 0);
  mesh.scale.set(rect.width, rect.height, 1);
}
```

## 3. Handling Resizes & Window Events

Always recalculate `cameraDistance`, `camera.aspect`, and call `camera.updateProjectionMatrix()` + `renderer.setSize()` on window resize:

```javascript
function onResize(camera, renderer, fov) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const cameraDistance = height / (2 * Math.tan((fov * Math.PI) / 360));

  camera.aspect = width / height;
  camera.position.z = cameraDistance;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
```
