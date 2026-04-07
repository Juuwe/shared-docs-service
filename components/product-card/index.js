import { ButtonComponent } from '../../components/button/index.js';
import { DeleteDocComponent } from '../del-doc-button/del_doc_button.js';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class ProductCardComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(data) {
    // Исправление: для текста добавляем margin-bottom: auto, чтобы он выталкивал себя вверх,
    // и убираем центровку через align-self
    const previewContent = data.is3D
      ? `<canvas id="canvas-${data.id}" width="160" height="220" style="width: 160px; height: 220px; display: block;"></canvas>`
      : `<div style="font-size: 4px; line-height: 6px; color: #ccc; text-align: left; width: 100%; word-break: break-all; margin-bottom: auto;">
                ${'LOREM IPSUM '.repeat(60)}
               </div>`;

    return `
            <div class="card border-0 rounded-0 product-card" id="card-${data.id}"
                 style="width: 230px; background: #f5f3f0; overflow: hidden; display: flex; flex-direction: column;">
                <div class="card-body d-flex justify-content-center align-items-center" style="height: 280px; flex-grow: 1;">
                    <div class="shadow-sm p-2"
                         style="width: 160px; height: 220px; background: white; border: 1px solid #eee; overflow: hidden;
                                display: flex; flex-direction: column;
                                justify-content: ${data.is3D ? 'center' : 'flex-start'};
                                align-items: ${data.is3D ? 'center' : 'flex-start'};">
                        ${previewContent}
                    </div>
                </div>
                <div class="card-footer bg-white border-top p-3 w-100">
                    <div class="d-flex align-items-center mb-1">
                        <img src="${data.src || 'static/img/3d-icon.png'}" width="20" height="20" class="me-2" alt="icon">
                        <h6 class="card-title text-truncate mb-0" style="font-size: 0.85rem; font-weight: 600;" title="${data.title}">
                            ${data.title}
                        </h6>
                    </div>

                    <div class="d-flex justify-content-between mb-3" style="font-size: 0.7rem; color: #999;">
                        <span><i class="bi bi-file-earmark-code"></i> ${data.size || 'N/A'}</span>
                        <span><i class="bi bi-shield-check"></i> ${data.owner || 'Me'}</span>
                    </div>

                    <div class="d-flex align-items-center">
                        <div id="delete-container-${data.id}"></div>
                        <div id="btn-container-${data.id}" class="ms-auto"></div>
                    </div>
                </div>
            </div>
        `;
  }

  render(data, listener, deleteListener) {
    const html = this.getHTML(data);
    this.parent.insertAdjacentHTML('beforeend', html);

    if (data.is3D) {
      this.init3DPreview(data);
    }

    const btnContainer = document.getElementById(`btn-container-${data.id}`);
    const button = new ButtonComponent(btnContainer);
    button.render({ id: data.id, text: 'Перейти' }, listener);

    const delBtnContainer = document.getElementById(`delete-container-${data.id}`);
    const delBtn = new DeleteDocComponent(delBtnContainer);
    delBtn.render(data.id, deleteListener);
  }

  init3DPreview(data) {
    const canvas = document.getElementById(`canvas-${data.id}`);
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0xffffff, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 160 / 220, 0.1, 1000);
    // Чуть отодвинем камеру назад, чтобы две модели влезли в кадр
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const sun = new THREE.DirectionalLight(0xffffff, 0.6);
    sun.position.set(2, 5, 3);
    scene.add(sun);

    const loader = new GLTFLoader();

    // Вспомогательная функция для обработки одной модели
    const processSingleModel = (gltf, offset = 0) => {
      const obj = gltf.scene;
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Центрируем меш
      obj.position.x = offset - center.x; // Сдвиг по X для пары
      obj.position.y = -center.y;
      obj.position.z = -center.z;

      // Масштабируем, чтобы модель не была огромной
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) obj.scale.multiplyScalar(1.0 / maxDim);

      scene.add(obj);
      renderer.render(scene, camera);
    };

    // ЛОГИКА ЗАГРУЗКИ
    if (data.models && Array.isArray(data.models)) {
      // ПАРНЫЕ МОДЕЛИ
      const gap = 0.6; // Расстояние между моделями
      data.models.forEach((modelCfg, index) => {
        const xOffset = index === 0 ? -gap : gap;
        loader.load(modelCfg.model, (gltf) => processSingleModel(gltf, xOffset));
      });
    } else if (data.buffer) {
      // ОДИНОЧНАЯ ИЗ IDB
      loader.parse(data.buffer, '', (gltf) => processSingleModel(gltf, 0));
    } else if (data.modelPath) {
      // ОДИНОЧНАЯ ИЗ ПРЕСЕТОВ
      loader.load(data.modelPath, (gltf) => processSingleModel(gltf, 0));
    }
  }
}
