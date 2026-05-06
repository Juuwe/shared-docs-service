import { ajax } from '../../modules/Ajax.js';
import { docUrls } from '../../modules/DocumentUrls.js';
import { DocumentListPage } from '../doc-list/DocumentList.js';
import { BackDocListButton } from '../../components/back-list-button/BackDocListButton.js';

export class DocumentEditPage {
  constructor(parent, id = null) {
    this.parent = parent;
    this.id = id; // Если id есть — редактирование, если нет — добавление
  }

  getHTML() {
    return `
            <div id="document-page-root" class="container py-4" style="max-width: 1200px;">
                <div id="back-btn-container" class="mb-3"></div>

                <div class="card shadow-sm border-0 rounded-0 overflow-hidden">
                    <div class="card-body p-4 p-lg-5">

                        <!-- Заголовок документа: убираем border и shadow у инпута -->
                        <div class="mb-4 pb-3 border-bottom">
                            <div class="mb-1">
                                <label class="text-muted small fw-bold text-uppercase" style="letter-spacing: 1px; font-size: 0.7rem;">Название документа</label>
                                <input type="text" id="input-title"
                                       class="form-control border-0 shadow-none ps-0 fw-bold"
                                       style="font-size: 2.5rem; color: #212529; background: transparent; outline: none;"
                                       placeholder="Без названия">
                            </div>

                            <!-- Поле для тегов -->
                            <div class="p-2 rounded-1" style="border: 1px dashed #ddd; background: #fafafa;">
                                <label class="text-muted small fw-bold text-uppercase d-block mb-1" style="font-size: 0.65rem;">Теги (через запятую)</label>
                                <input type="text" id="input-tags"
                                       class="form-control form-control-sm border-0 shadow-none bg-transparent p-0"
                                       style="font-size: 0.9rem; outline: none;"
                                       placeholder="например: отчет, важный_документ">
                            </div>
                        </div>

                        <!-- Основной текст: имитация листа бумаги из DocumentComponent -->
                        <div class="bg-white" style="min-height: 600px;">
                            <label class="text-muted small fw-bold text-uppercase d-block mb-3" style="font-size: 0.7rem;">Содержимое</label>
                            <textarea id="input-text"
                                      class="form-control border-0 shadow-none p-0"
                                      style="line-height: 1.8; color: #333; min-height: 550px; resize: none; background: transparent; font-size: 1.1rem; outline: none;"
                                      placeholder="Начните вводить текст здесь..."></textarea>
                        </div>

                        <div class="mt-4 pt-3 border-top text-end">
                            <button id="save-btn" class="btn btn-dark w-100 rounded-pill mt-3 shadow-sm">
                                Сохранить документ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  async render() {
    document.body.style.backgroundColor = '#f5f3f0';
    this.parent.innerHTML = this.getHTML();

    const backBtnContainer = document.getElementById('back-btn-container');
    const backBtn = new BackDocListButton(backBtnContainer);
    backBtn.render(() => {
      const mainPage = new DocumentListPage(this.parent);
      mainPage.render();
    });

    document.getElementById('save-btn').onclick = async () => {
    const payload = {
        title: document.getElementById('input-title').value,
        text: document.getElementById('input-text').value,
        tags: document.getElementById('input-tags').value, // если бэкенд ждет строку
        src: "/img/docx.png"
    };

    const method = this.id ? 'PATCH' : 'POST';
    const url = this.id ? `/documents/${this.id}` : '/documents';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            new DocumentListPage(this.parent).render();
        }
    } catch (e) {
        console.error("Ошибка при сохранении:", e);
    }
};

    if (this.id) {
      const data = await ajax.get(docUrls.getDocById(this.id));
      if (data) {
        document.getElementById('input-title').value = data.title || '';
        document.getElementById('input-text').value = data.text || '';
        document.getElementById('input-tags').value = Array.isArray(data.tags)
          ? data.tags.join(', ')
          : data.tags || '';
      }
    }
  }
}
