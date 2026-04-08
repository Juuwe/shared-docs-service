import { DocumentCardComponent } from '../../components/doc-card/DocumentCard.js';
import { DocumentPage } from '../doc-detail/Document.js';
import { AddDocButton } from '../../components/add-doc-button/AddDocButton.js';
import { DocFilterbarComponent } from '../../components/doc-filterbar/DocumentFilterbar.js';
import { areTagsIdentical } from '../../utils/helpers/tagSearcher.js';
import { merge } from '../../utils/helpers/merger.js';

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

            <div id="main-page" class="d-flex flex-wrap gap-3 mt-3 align-items-start"></div>
        </div>
    `;
  }

  getData() {
    return [
      {
        id: 1,
        src: 'static/img/docx.png',
        title: 'РПЗ.docx',
        text: 'LOREM IPSUM DOLOR SIT AMET...',
        tags: ['отчет', 'программирование', '2026'],
      },
      {
        id: 2,
        src: 'static/img/pdf.png',
        title: 'Титул КР БД.pdf',
        text: 'LOREM IPSUM DOLOR SIT AMET...',
        tags: ['базы данных', 'курсовая', 'sql'],
      },
      {
        id: 3,
        src: 'static/img/pdf.png',
        title: 'ИУ5-41Б_Паронько_ТЗ_2026.pdf',
        text: 'LOREM IPSUM DOLOR SIT AMET...',
        tags: ['тз', 'техническое задание', '2026'],
      },
    ];
  }

  clickCard(e) {
    const cardId = e.target.dataset.id;

    const productPage = new DocumentPage(this.parent, cardId);
    productPage.render();
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
      // Системный слой с дефолтными значениями
      const systemLayer = {
        size: '128 KB',
        owner: 'iu5-student',
        created: '07.04.2026',
        title: 'БЕЗЫМЯННЫЙ_ДОКУМЕНТ', // Будет проигнорирован, если title уже есть
        text: 'Текст документа отсутствует',
        src: 'static/img/default.png',
      };

      // Смешиваем данные: item имеет приоритет над systemLayer
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

      // Добавляем теги для копии
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
      // 1. Фильтр по расширению
      const extension = item.title.split('.').pop().toLowerCase();
      const matchesFilter = this.filterExtension === 'all' || extension === this.filterExtension;

      // 2. Если строка поиска пустая — только фильтр по расширению
      if (!this.searchQuery.trim()) return matchesFilter;

      // 3. Подготовка поисковых тегов
      const searchTags = this.searchQuery
        .toLowerCase()
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== '');

      // 4. Проверка полного совпадения тегов
      const matchesTags = areTagsIdentical(item.tags || [], searchTags);

      // 5. Проверка вхождения в название
      const matchesSearch = item.title.toLowerCase().includes(this.searchQuery.toLowerCase());

      // 6. Итоговая фильтрация
      return matchesFilter && (matchesTags || matchesSearch);
    });
  }
}
