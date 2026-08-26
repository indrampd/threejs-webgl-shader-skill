import * as THREE from 'three';
import gsap from 'gsap';
import Lenis from 'lenis';

export class WebGLShaderSync {
  constructor({ canvas, targets }) {
    this.canvas = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
    this.targets = Array.from(document.querySelectorAll(targets));
    this.items = [];

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.fov = 45;
    this.updateCamera();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.initMeshes();
    this.bindEvents();
    this.render();
  }

  updateCamera() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    this.cameraDistance = height / (2 * Math.tan((this.fov * Math.PI) / 360));

    if (!this.camera) {
      this.camera = new THREE.PerspectiveCamera(this.fov, width / height, 1, 2000);
    } else {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
    this.camera.position.set(0, 0, this.cameraDistance);
  }

  initMeshes() {
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    const textureLoader = new THREE.TextureLoader();

    this.items = this.targets.map((el) => {
      const texture = textureLoader.load(el.src || el.dataset.src);
      const material = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform sampler2D u_texture;
          void main() {
            gl_FragColor = texture2D(u_texture, vUv);
          }
        `,
        uniforms: {
          u_texture: { value: texture },
          u_hover: { value: 0 },
          u_time: { value: 0 }
        },
        transparent: true
      });

      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);

      return { el, mesh, material };
    });

    this.updatePositions();
  }

  updatePositions() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.items.forEach(({ el, mesh }) => {
      const rect = el.getBoundingClientRect();
      mesh.position.x = rect.left + rect.width / 2 - w / 2;
      mesh.position.y = -(rect.top + rect.height / 2) + h / 2;
      mesh.scale.set(rect.width, rect.height, 1);
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.updateCamera();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.updatePositions();
    });
  }

  render() {
    this.updatePositions();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }
}
