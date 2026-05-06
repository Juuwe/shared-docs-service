import { DocumentCardComponent } from '../../components/doc-card/DocumentCard.js';
import { DocumentPage } from '../doc-detail/Document.js';
import { DocumentEditPage } from '../doc-edit/DocumentEdit.js';
import { AddDocButton } from '../../components/add-doc-button/AddDocButton.js';
import { DocFilterbarComponent } from '../../components/doc-filterbar/DocumentFilterbar.js';
import { areTagsIdentical } from '../../utils/helpers/tagSearcher.js';
import { merge } from '../../utils/helpers/merger.js';
import { ConfirmModalComponent } from '../../components/confirm-modal/ConfirmModal.js';

import { ajax } from '../../modules/Ajax.js';
import { docUrls } from '../../modules/DocumentUrls.js';

export class DocumentListPage {
  constructor(parent) {
    this.parent = parent;
    this.docCardsData = [];
    this.searchQuery = '';
    this.filterExtension = 'all';
  }

  get pageRoot() {
    return document.getElementById('main-page');
  }

  getHTML() {
    return `
        <div class="container-fluid p-4">
            <div id="toolbar-container" class="d-flex justify-content-between align-items-center bg-white p-3 shadow-sm rounded">
                <div id="filter-container" style="flex-grow: 1; max-width: 600px;"></div>
                <div id="add-btn-toolbar-container" class="ms-3"></div>
            </div>

            <div id="main-page" class="d-flex flex-wrap gap-3 mt-3 align-items-start"></div>
        </div>
    `;
  }

  clickCard(e) {
    const cardId = e.target.dataset.id;

    const productPage = new DocumentPage(this.parent, cardId);
    productPage.render();
  }

  async getData(title = '', ext = 'all') {
    const url = `${docUrls.getDocs()}?title=${encodeURIComponent(title)}&ext=${encodeURIComponent(ext)}&tags=${encodeURIComponent(title)}`;

    const data = await ajax.get(url);
    if (data) {
        this.renderData(data);
    }
  }

  renderData(items) {
    this.docCardsData = items;
    this.renderCards();
  }

  render() {
    document.body.style.backgroundColor = 'white';
    this.parent.innerHTML = this.getHTML();

    const filterContainer = document.getElementById('filter-container');
    const filterbar = new DocFilterbarComponent(filterContainer);

    filterbar.render((query, ext) => {
      this.searchQuery = query;
      this.filterExtension = ext;

      this.getData(this.searchQuery, this.filterExtension);
    });

    const addBtnContainer = document.getElementById('add-btn-toolbar-container');
    const addButton = new AddDocButton(addBtnContainer);

    addButton.render(() => {
      const docEditPage = new DocumentEditPage(this.parent);
      docEditPage.render();
    });

    this.getData();
  }

  renderCards() {
    const container = this.pageRoot;
    if (!container) return;
    container.innerHTML = '';

    this.docCardsData.forEach((item) => {
      const systemLayer = {
        size: item.is3D ? '3D Model' : '128 KB',
        owner: 'iu5-student',
        created: '07.04.2026',
        title: 'БЕЗЫМЯННЫЙ_ДОКУМЕНТ',
        text: 'Текст документа отсутствует',
        src: item.is3D ? 'static/img/pdf.png' : 'static/img/docx.png',
      };

      const cardData = merge(item, systemLayer);

      const card = new DocumentCardComponent(container);
      card.render(cardData, this.clickCard.bind(this), (id) => this.deleteCard(id));
    });
  }

  deleteCard(id) {
    const doc = this.docCardsData.find(item => item.id === id);

    const confirmModal = new ConfirmModalComponent(document.body);

    confirmModal.render(
      {
        title: 'Подтверждение удаления',
        message: `Вы уверены, что хотите удалить <strong>${doc.title}</strong>?`,
      },
      async () => {
        const url = docUrls.removeDocById(id);
        const success = await ajax.delete(url);

        if (success) {
          this.docCardsData = this.docCardsData.filter((card) => card.id !== id);
          this.renderCards();
        }
      }
    );
  }
}
