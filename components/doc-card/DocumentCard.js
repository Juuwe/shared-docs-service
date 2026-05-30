import { FrwDocDetailBtn } from '../frwd-detail-button/ForwardDocButton.js';
import { DeleteDocButton } from '../del-doc-button/DeleteDocButton.js';
import { docUrls } from '../../modules/DocumentUrls.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class DocumentCardComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(data) {
    const tagsHtml = typeof data.tags === 'string' && data.tags.trim() !== ''
        ? data.tags.split(',').map((tag) => tag.trim())
            .map((tag) => `<span class="badge me-1" style="background: #e9e5e0; color: #5c5c5c; font-size: 0.7rem;">${tag}</span>`)
            .join('')
        : (Array.isArray(data.tags) ? data.tags.map(tag => `<span class="badge me-1" style="background: #e9e5e0; color: #5c5c5c; font-size: 0.7rem;">${tag}</span>`).join('') : '');

    let previewContent = '';
    const srcPath = (data.src || '').toLowerCase();

    // ИСПРАВЛЕНИЕ: Логика иконки. Если это модель, ставим дефолтную иконку glb, иначе берем src.
    let iconUrl = data.src || 'static/img/docx.png';

    if (srcPath.endsWith('.glb')) {
        previewContent = `<canvas id="canvas-${data.id}" width="160" height="220" style="width: 160px; height: 220px; display: block;"></canvas>`;
        iconUrl = 'static/img/glb.png'; // Заглушка для иконки 3D модели
    }
    else if (srcPath.endsWith('.png') || srcPath.endsWith('.jpg') || srcPath.endsWith('.jpeg') || srcPath.endsWith('.webp')) {
        previewContent = `<img src="${data.src}" alt="Preview" style="width: 100%; height: 100%; object-fit: contain;">`;
    }
    else {
        const docText = data.text || 'Нет содержимого';
        previewContent = `<div style="font-size: 5px; line-height: 7px; color: #7a7a7a; text-align: left; word-break: break-all; overflow: hidden; height: 100%;">
            ${docText}
        </div>`;
    }

    return `
        <div class="card border-0 rounded-0 product-card" id="card-${data.id}" style="width: 230px; background: #f5f3f0;">
             <div class="position-relative">
                <div class="card-body d-flex justify-content-center align-items-center p-0" style="height: 280px; width: 100%;">
                    <div class="shadow-sm p-2" style="width: 160px; height: 220px; background: white; border: 1px solid #eee; overflow: hidden;">
                        ${previewContent}
                    </div>
                </div>
                <div id="btn-container-${data.id}" class="hover-button position-absolute top-0 start-50 translate-middle-x p-2"></div>
            </div>

            <div class="card-footer bg-white border-top p-3">
                <div class="d-flex align-items-center mb-1">
                    <img src="${iconUrl}" width="24" height="24" class="me-2" alt="type-icon">
                    <h6 class="card-title text-truncate mb-0" style="font-size: 0.9rem; font-weight: 600;" title="${data.title}">
                        ${data.title}
                    </h6>
                    <div id="delete-container-${data.id}" class="ms-auto"></div>
                </div>
                <div style="font-size: 0.7rem; color: #8a8a8a; margin-bottom: 4px;">
                    ${data.owner || 'iu5-student'} · ${data.size || '128 KB'} · ${data.created || '07.04.2026'}
                </div>
                ${tagsHtml ? `<div class="mb-2">${tagsHtml}</div>` : ''}
                <div id="btn-container-${data.id}" class="hover-button d-flex justify-content-center w-100"></div>
            </div>
        </div>
    `;
  }

  render(docData, forwardListener, deleteListener) {
    const html = this.getHTML(docData);
    this.parent.insertAdjacentHTML('beforeend', html);

    // ИСПРАВЛЕНИЕ: Проверяем не только флаг, но и расширение файла
    const isModel = docData.is3D || (docData.src && docData.src.toLowerCase().endsWith('.glb'));
    if (isModel) {
      this.init3DPreview(docData);
    }

    const frwdBtnContainer = document.getElementById(`btn-container-${docData.id}`);
    const frwdBtn = new FrwDocDetailBtn(frwdBtnContainer);
    frwdBtn.render({ id: docData.id, text: 'Перейти' }, forwardListener);

    const delBtnContainer = document.getElementById(`delete-container-${docData.id}`);
    const delBtn = new DeleteDocButton(delBtnContainer);
    delBtn.render(docData.id, deleteListener);
  }

  init3DPreview(data) {
    const canvas = document.getElementById(`canvas-${data.id}`);
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0xffffff, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 160 / 220, 0.1, 1000);
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const sun = new THREE.DirectionalLight(0xffffff, 0.6);
    sun.position.set(2, 5, 3);
    scene.add(sun);

    const loader = new GLTFLoader();

    const processSingleModel = (gltf, offset = 0) => {
      const obj = gltf.scene;
      const box = new THREE.Box3().setFromObject(obj);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      obj.position.x = offset - center.x;
      obj.position.y = -center.y;
      obj.position.z = -center.z;

      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) obj.scale.multiplyScalar(1.0 / maxDim);

      scene.add(obj);
      renderer.render(scene, camera);
    };

    if (data.models && Array.isArray(data.models)) {
      const gap = 0.6;
      data.models.forEach((modelCfg, index) => {
        const xOffset = index === 0 ? -gap : gap;
        loader.load(modelCfg.model, (gltf) => processSingleModel(gltf, xOffset));
      });
    } else if (data.buffer) {
      loader.parse(data.buffer, '', (gltf) => processSingleModel(gltf, 0));
    } else if (data.modelPath || data.src) {
      // ИСПРАВЛЕНИЕ: Читаем путь из src, если modelPath отсутствует
      const pathToLoad = data.modelPath || data.src;
      loader.load(pathToLoad, (gltf) => processSingleModel(gltf, 0));
    }
  }
}
