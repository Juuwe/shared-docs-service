import { DocumentCardComponent } from '../../components/doc-card/DocumentCard.js';
import { DocumentPage } from '../doc-detail/Document.js';
import { AddDocButton } from '../../components/add-doc-button/AddDocButton.js';
import { DocFilterbarComponent } from '../../components/doc-filterbar/DocumentFilterbar.js';

export class DocumentListPage {
  constructor(parent) {
    this.parent = parent;
    this.docCardsData = this.getData();
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

            <div id="main-page" class="d-flex flex-wrap gap-3 mt-3"></div>
        </div>
    `;
  }

  getData() {   
    return [
      {
        id: 1,
        src: 'static/img/docx.png',
        title: 'РПЗ.docx',
        text: 'LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET',
      },
      {
        id: 2,
        src: 'static/img/pdf.png',
        title: 'Титул КР БД.pdf',
        text: 'LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET',
      },
      {
        id: 3,
        src: 'static/img/pdf.png',
        title: 'ИУ5-41Б_Паронько_ТЗ_2026.pdf',
        text: 'LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET LOREM IPSUM DOLOR SIT AMET',
      },
    ];
  }

  clickCard(e) {
    const cardId = e.target.dataset.id;

    const documentPage = new DocumentPage(this.parent, cardId);
    documentPage.render();
  }

  deleteCard(id) {
    this.docCardsData = this.docCardsData.filter((card) => card.id !== id);
    this.renderCards();
  }

  addCopyOfFirstCard() {
    if (this.docCardsData.length > 0) {
      const firstCard = { ...this.docCardsData[0] };

      firstCard.id = Date.now();
      firstCard.title = `${firstCard.title}`;

      this.docCardsData.push(firstCard);

      this.renderCards();
    }
  }

  getFilteredData() {
    return this.docCardsData.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(this.searchQuery.toLowerCase());

      const extension = item.title.split('.').pop().toLowerCase();
      const matchesFilter = this.filterExtension === 'all' || extension === this.filterExtension;

      return matchesSearch && matchesFilter;
    });
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

    this.renderCards();
  }

  renderCards() {
    const container = this.pageRoot;
    container.innerHTML = '';

    const displayData = this.getFilteredData();

    displayData.forEach((item) => {
      const card = new DocumentCardComponent(container);
      card.render(item, this.clickCard.bind(this), (id) => this.deleteCard(id));
    });
  }
}
