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
              <div id="toolbar-container"></div>
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

    const productPage = new DocumentPage(this.parent, cardId);
    productPage.render();
  }

  render() {
    this.parent.innerHTML = this.getHTML();

    const filterbar = new DocFilterbarComponent(document.getElementById('toolbar-container'));

    filterbar.render(
        (query) => {
            this.searchQuery = query;
            this.renderCards(); // Перерисовываем только карточки
        },
        (ext) => {
            this.filterExtension = ext;
            this.renderCards(); // Перерисовываем только карточки
        }
    );

    this.renderCards();
  }

  renderCards() {
    // Очищаем контейнер перед перерисовкой (или удаляем только кнопку +)
    const container = this.pageRoot;
    container.innerHTML = '';

    const displayData = this.getFilteredData();

    displayData.forEach((item) => {
      const card = new DocumentCardComponent(container);
      card.render(item, this.clickCard.bind(this), (id) => this.deleteCard(id));
    });

    // const addBtnContainer = document.getElementById('add-btn-container');
    const addButton = new AddDocButton(container);

    // Передаем метод добавления, привязав контекст (bind),
    // чтобы внутри него this указывал на MainPage
    addButton.render(this.addCopyOfFirstCard.bind(this));
  }

  addCopyOfFirstCard() {
    if (this.cardsData.length > 0) {
      const firstCard = { ...this.cardsData[0] };

      firstCard.id = Date.now();
      firstCard.title = `${firstCard.title}`;

      this.cardsData.push(firstCard);

      this.renderCards();
    }
  }

  deleteCard(id) {
    this.cardsData = this.cardsData.filter((card) => card.id !== id);
    this.renderCards();
  }

  getFilteredData() {
    return this.cardsData.filter(item => {
        // 1. Поиск (приводим всё к нижнему регистру для честности)
        const matchesSearch = item.title.toLowerCase().includes(this.searchQuery.toLowerCase());

        // 2. Фильтрация по расширению
        // Предполагаем, что расширение — это всё, что после точки
        const extension = item.title.split('.').pop().toLowerCase();
        const matchesFilter = this.filterExtension === 'all' || extension === this.filterExtension;

        return matchesSearch && matchesFilter;
    });
}
}
