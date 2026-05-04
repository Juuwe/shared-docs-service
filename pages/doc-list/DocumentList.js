import { DocumentCardComponent } from '../../components/doc-card/DocumentCard.js';
import { DocumentPage } from '../doc-detail/Document.js';
import { AddDocButton } from '../../components/add-doc-button/AddDocButton.js';
import { DocFilterbarComponent } from '../../components/doc-filterbar/DocumentFilterbar.js';
import { areTagsIdentical } from '../../utils/helpers/tagSearcher.js';
import { merge } from '../../utils/helpers/merger.js';

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

  getData() {
    ajax.get(docUrls.getDocs(), (data) => {
      this.renderData(data);
    });
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

    filterbar.render(
      (query) => {
        this.searchQuery = query;
        this.renderCards();
      },
      (ext) => {
        this.filterExtension = ext;
        this.renderCards();
      }
    );

    const addBtnContainer = document.getElementById('add-btn-toolbar-container');
    const addButton = new AddDocButton(addBtnContainer);
    addButton.render(this.addCopyOfFirstCard.bind(this));

    this.getData();
  }

  renderCards() {
    const container = this.pageRoot;
    if (!container) return;
    container.innerHTML = '';

    const displayData = this.getFilteredData();

    displayData.forEach((item) => {
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

  addCopyOfFirstCard() {
    if (this.docCardsData.length > 0) {
      const firstCard = { ...this.docCardsData[0] };

      firstCard.id = Date.now();
      firstCard.title = `Копия - ${firstCard.title}`;

      firstCard.tags = [...(firstCard.tags || []), 'копия'];

      this.docCardsData.push(firstCard);

      this.renderCards();
    }
  }

  deleteCard(id) {
    this.docCardsData = this.docCardsData.filter((card) => card.id !== id);
    this.renderCards();
  }

  getFilteredData() {
    return this.docCardsData.filter((item) => {
      const extension = item.title.split('.').pop().toLowerCase();
      const matchesFilter = this.filterExtension === 'all' || extension === this.filterExtension;

      if (!this.searchQuery.trim()) return matchesFilter;

      const searchTags = this.searchQuery
        .toLowerCase()
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== '');

      const matchesTags = areTagsIdentical(item.tags || [], searchTags);

      const matchesSearch = item.title.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesFilter && (matchesTags || matchesSearch);
    });
  }
}
