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
                            <span class="badge text-secondary fw-normal italic" style="font-size: 0.75rem;">
                                <i class="bi bi-info-circle me-1"></i> Сохранение будет доступно в Лабораторной работе №6
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        document.body.style.backgroundColor = '#f5f3f0';
        this.parent.innerHTML = this.getHTML();

        // Кнопка назад
        const backBtnContainer = document.getElementById('back-btn-container');
        const backBtn = new BackDocListButton(backBtnContainer);
        backBtn.render(() => {
            const mainPage = new DocumentListPage(this.parent);
            mainPage.render();
        });

        // Если передан ID, загружаем существующие данные
        if (this.id) {
            ajax.get(docUrls.getDocById(this.id), (data) => {
                if (data) {
                    document.getElementById('input-title').value = data.title || '';
                    document.getElementById('input-text').value = data.text || '';
                    document.getElementById('input-tags').value = (data.tags || []).join(', ');
                }
            });
        }
    }
}
