export class HeaderComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    return `
            <nav class="navbar navbar-light bg-light border-bottom mb-3">
                <div class="container-fluid d-flex justify-content-between">
                    <a class="navbar-brand" href="#">
                        <span style="font-weight: 700; letter-spacing: 1px;">DOCS</span>
                    </a>

                    <div class="d-flex align-items-center">
                        <input type="file" id="upload-3d-model" accept=".glb" style="display: none;">

                        <button class="btn btn-outline-dark btn-sm d-flex align-items-center gap-2"
                                id="upload-btn"
                                style="border-radius: 6px; font-weight: 500;">
                            <i class="bi bi-upload"></i>
                            <span>Загрузить 3D (.glb)</span>
                        </button>
                    </div>
                </div>
            </nav>
        `;
  }

  initListeners() {
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('upload-3d-model');

    if (!uploadBtn || !fileInput) return;

    // При клике на красивую кнопку нажимаем на скрытый инпут
    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        const modelData = {
          title: file.name,
          buffer: e.target.result, // Бинарные данные для сохранения
          is3D: true,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          owner: 'Локальный файл',
          tags: ['user', '3d'],
        };

        // Вызываем функцию из idb.js (она должна быть доступна глобально через script в index.html)
        if (window.addModelToDB) {
          try {
            await window.addModelToDB(modelData);
            // Вызываем кастомное событие или просто перезагружаем страницу,
            // чтобы MainPage подтянула новые данные
            window.location.reload();
          } catch (err) {
            console.error('Ошибка сохранения в IDB:', err);
          }
        } else {
          console.error('idb.js не подключен или функция addModelToDB не найдена');
        }
      };

      // Читаем как ArrayBuffer, так как Three.js loader.parse и IDB работают с этим форматом
      reader.readAsArrayBuffer(file);
    });
  }

  render() {
    const html = this.getHTML();
    this.parent.innerHTML = html;
    this.initListeners();
  }
}
