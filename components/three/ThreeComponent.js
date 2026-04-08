import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ThreeComponent {
  constructor(parent) {
    this.parent = parent;
    this.camera = null;
    this.controls = null;
  }

  getHTML() {
    return `
            <div class="bg-white shadow-sm p-4 mx-auto" style="max-width: 1100px; border: 1px solid #dee2e6;">
                <div id="viewer-controls" class="d-flex gap-2 mb-3 justify-content-center">
                    <button id="zoom-in" class="btn btn-sm" style="background-color: black; color: white"><i class="bi bi-plus-lg"></i></button>
                    <button id="zoom-out" class="btn btn-sm" style="background-color: black; color: white"><i class="bi bi-dash-lg"></i></button>
                    <div class="vr mx-2"></div>
                    <button id="view-front" class="btn btn-sm border" style="background-color: #f6f5f3">Спереди</button>
                    <button id="view-back" class="btn btn-sm border" style="background-color: #f6f5f3">Сзади</button>
                    <button id="view-left" class="btn btn-sm border" style="background-color: #f6f5f3">Слева</button>
                    <button id="view-right" class="btn btn-sm border" style="background-color: #f6f5f3">Справа</button>
                </div>
                <canvas id="viewer-canvas" style="width: 100%; height: 600px; background: #f8f9fa; display: block; border-radius: 4px;"></canvas>
            </div>
        `;
  }

  render(data) {
    this.parent.innerHTML = this.getHTML();
    this.initThree(data);
    this.initListeners();
  }

  initThree(data) {
    const canvas = document.getElementById('viewer-canvas');
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf8f9fa);

    this.camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 5);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    this.scene.add(dirLight);

    const loader = new GLTFLoader();

    const addModelToScene = (gltf, xOffset = 0) => {
      const obj = gltf.scene;

      const box = new THREE.Box3().setFromObject(obj);
      const center = box.getCenter(new THREE.Vector3());

      obj.position.x = xOffset - center.x;
      obj.position.z = -center.z;
      obj.position.y = -box.min.y;

      this.scene.add(obj);
    };

    if (data.models && Array.isArray(data.models)) {
      const gap = 1.5;
      data.models.forEach((m, index) => {
        const offset = index === 0 ? -gap : gap;
        loader.load(m.model, (gltf) => addModelToScene(gltf, offset));
      });
      this.controls.target.set(0, 0.5, 0);
    } else if (data.buffer) {
      loader.parse(data.buffer, '', (gltf) => addModelToScene(gltf, 0));
    } else if (data.modelPath) {
      loader.load(data.modelPath, (gltf) => addModelToScene(gltf, 0));
    }

    const animate = () => {
      requestAnimationFrame(animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  initListeners() {
    const setCam = (x, y, z) => {
      const dist = this.camera.position.distanceTo(this.controls.target);
      this.camera.position.set(x * dist, y, z * dist);
      this.controls.update();
    };

    document.getElementById('zoom-in').onclick = () => {
      this.camera.position.multiplyScalar(0.9);
      this.controls.update();
    };
    document.getElementById('zoom-out').onclick = () => {
      this.camera.position.multiplyScalar(1.1);
      this.controls.update();
    };
    document.getElementById('view-front').onclick = () => setCam(0, 1, 1);
    document.getElementById('view-back').onclick = () => setCam(0, 1, -1);
    document.getElementById('view-left').onclick = () => setCam(-1, 1, 0);
    document.getElementById('view-right').onclick = () => setCam(1, 1, 0);
  }
}
