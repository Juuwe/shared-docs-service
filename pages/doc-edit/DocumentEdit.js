import { ajax } from '../../modules/Ajax.js';
import { docUrls } from '../../modules/DocumentUrls.js';
import { DocumentListPage } from '../doc-list/DocumentList.js';
import { BackDocListButton } from '../../components/back-list-button/BackDocListButton.js';
import { SaveDocButton } from '../../components/save-doc-button/SaveDocButton.js';

export class DocumentEditPage {
    constructor(parent, id = null) {
        this.parent = parent;
        this.id = id;
    }

    getHTML() {
        return `
            <div id="document-page-root" class="container py-4" style="max-width: 1200px;">
                <div id="back-btn-container" class="mb-3"></div>

                <div class="card shadow-sm border-0 rounded-0 overflow-hidden">
                    <div class="card-body p-4 p-lg-5">

                        <div class="mb-4 pb-3 border-bottom">
                            <div class="mb-1">
                                <label class="text-muted small fw-bold text-uppercase" style="letter-spacing: 1px; font-size: 0.7rem;">Название документа</label>
                                <input type="text" id="input-title"
                                       class="form-control border-0 shadow-none ps-0 fw-bold"
                                       style="font-size: 2.5rem; color: #212529; background: transparent; outline: none;"
                                       placeholder="Без названия">
                            </div>

                            <div class="p-2 rounded-1 mb-2" style="border: 1px dashed #ddd; background: #fafafa;">
                                <label class="text-muted small fw-bold text-uppercase d-block mb-1" style="font-size: 0.65rem;">Теги (через запятую)</label>
                                <input type="text" id="input-tags"
                                       class="form-control form-control-sm border-0 shadow-none bg-transparent p-0"
                                       style="font-size: 0.9rem; outline: none;"
                                       placeholder="например: отчет, схема">
                            </div>

                            <div class="p-2 rounded-1" style="border: 1px dashed #ddd; background: #fafafa;">
                                <label class="text-muted small fw-bold text-uppercase d-block mb-1" style="font-size: 0.65rem;">URL / Путь к превью (изображение или .glb)</label>
                                <input type="text" id="input-src"
                                       class="form-control form-control-sm border-0 shadow-none bg-transparent p-0"
                                       style="font-size: 0.9rem; outline: none;"
                                       placeholder="Например: static/img/photo.png или models/model.glb">
                            </div>
                        </div>

                        <div class="bg-white" style="min-height: 600px;">
                            <label class="text-muted small fw-bold text-uppercase d-block mb-3" style="font-size: 0.7rem;">Содержимое текста</label>
                            <textarea id="input-text" class="form-control border-0 shadow-none p-0"
                                      style="line-height: 1.8; color: #333; min-height: 550px; resize: none; background: transparent; font-size: 1.1rem; outline: none;"
                                      placeholder="Вводите текст..."></textarea>
                        </div>

                        <div class="mt-4 pt-3 border-top text-end" id="save-btn-container"></div>
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

        const saveBtnContainer = document.getElementById('save-btn-container');
        const saveBtn = new SaveDocButton(saveBtnContainer);

        saveBtn.render(async () => {
            const tagsString = document.getElementById('input-tags').value;
            const tagsArray = tagsString.split(',').map(t => t.trim()).filter(t => t !== '');
            const srcValue = document.getElementById('input-src').value.trim();

            const payload = {
                title: document.getElementById('input-title').value.trim() || 'Без названия',
                text: document.getElementById('input-text').value.trim(),
                src: srcValue, // Передаем путь как есть
                tags: tagsArray.length > 0 ? tagsArray : ['документ']
            };

            const url = this.id ? docUrls.updateDocById(this.id) : docUrls.createDoc();

            try {
                let responseData = this.id ? await ajax.patch(url, payload) : await ajax.post(url, payload);
                if (responseData !== null) {
                    new DocumentListPage(this.parent).render();
                }
            } catch (e) {
                console.error('Ошибка при сохранении:', e);
            }
        });

        if (this.id) {
            const data = await ajax.get(docUrls.getDocById(this.id));

            if (data) {
                document.getElementById('input-title').value = data.title || '';
                document.getElementById('input-tags').value = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '';
                document.getElementById('input-src').value = data.src || data.modelPath || '';
                document.getElementById('input-text').value = data.text || '';
            }
        }
    }
}
