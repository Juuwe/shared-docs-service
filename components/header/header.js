import { HomeButton } from '../home-button/HomeButton.js';
import { DocumentListPage } from '../../pages/doc-list/DocumentList.js';

export class HeaderComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    return `
      <nav class="navbar navbar-light bg-light border-bottom mb-3">
        <div class="container-fluid">
          <div id="home-button-container" class="me-2"></div>

          <a class="navbar-brand" href="#">
            <span>shared-docs-service</span>
          </a>

          <div class="d-flex align-items-center ms-auto">
            <input type="file" id="upload-3d-model" accept=".glb" style="display: none;">

            <button class="btn btn-outline-dark btn-sm d-flex align-items-center gap-2"
                    id="upload-btn"
                    style="background-color: black; color: white">
              <i class="bi bi-upload"></i>
              <span>Загрузить 3D (.glb)</span>
            </button>
          </div>
        </div>
      </nav>
    `;
  }

  render() {
    const html = this.getHTML();
    this.parent.innerHTML = html;

    const homeButtonContainer = document.getElementById('home-button-container');
    const homeButton = new HomeButton(homeButtonContainer);
    homeButton.render();

    this.initUploadListener();
  }

  initUploadListener() {
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('upload-3d-model');

    if (!uploadBtn || !fileInput) return;

    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const modelData = {
          title: file.name,
          buffer: e.target.result,
          is3D: true,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          owner: 'Локальный файл',
          tags: ['user', '3d'],
          created: new Date().toLocaleDateString('ru-RU'),
        };

        if (window.addModelToDB) {
          try {
            await window.addModelToDB(modelData);

            const root = document.getElementById('root');
            const mainPage = new DocumentListPage(root);
            mainPage.render();
          } catch (err) {
            console.error('Ошибка сохранения в IDB:', err);
          }
        } else {
          console.error('Функция addModelToDB не найдена');
        }
      };

      reader.readAsArrayBuffer(file);
      fileInput.value = '';
    });
  }
}
