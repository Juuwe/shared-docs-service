import { ProductCardComponent } from '../../components/product-card/index.js';
import { DocumentPage } from '../document/document.js';
import { AddDocComponent } from '../../components/add-doc-button/add_doc_button.js';
import { DocFilterbarComponent } from '../../components/doc-filterbar/doc_filterbar.js'; // Не забудь импорт!
import { areTagsIdentical } from '../../utils/helpers/tag-search.js';
import { merge } from '../../utils/helpers/merger.js';

export class MainPage {
  constructor(parent) {
    this.parent = parent;
    this.cardsData = getData();
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

  clickCard(e) {
    const cardId = e.target.dataset.id;

    const productPage = new DocumentPage(this.parent, cardId);
    productPage.render();
  }

  render() {
    this.parent.innerHTML = this.getHTML();

    window.getData().then((data) => {
      this.cardsData = data; // Сохраняем данные в класс для фильтрации
      this.renderCards();
    });

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
  }

  renderCards() {
    // Очищаем контейнер перед перерисовкой (или удаляем только кнопку +)
    const container = this.pageRoot;
    container.innerHTML = '';

    const displayData = this.getFilteredData();

    displayData.forEach((item) => {
      const systemLayer = {
        size: '128 KB',
        owner: 'iu5-student',
        title: 'ЗАПАСНОЙ_ЗАГОЛОВОК', // Будет проигнорирован, т.к. в item уже есть title
      };

      // 3. Смешиваем! (Задача №2)
      const cardData = merge(item, systemLayer);

      const card = new ProductCardComponent(container);
      card.render(cardData, this.clickCard.bind(this), (id) => this.deleteCard(id));
    });

    // const addBtnContainer = document.getElementById('add-btn-container');
    const addButton = new AddDocComponent(container);

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
    return this.cardsData.filter((item) => {
      // 1. Фильтр по расширению (стандартный для твоего toolbar)
      const extension = item.title.split('.').pop().toLowerCase();
      const matchesFilter = this.filterExtension === 'all' || extension === this.filterExtension;

      // Если строка поиска пустая — оставляем только фильтр по расширению
      if (!this.searchQuery.trim()) return matchesFilter;

      // Готовим поисковые теги (даже если слово одно)
      const searchTags = this.searchQuery
        .toLowerCase()
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t !== '');

      // 2. СНАЧАЛА проверяем полное совпадение состава тегов (Задача №1 - Map + While)
      const matchesTags = areTagsIdentical(item.tags || [], searchTags);

      // 3. ЗАТЕМ проверяем вхождение строки в название документа
      const matchesSearch = item.title.toLowerCase().includes(this.searchQuery.toLowerCase());

      // Документ проходит, если совпал фильтр расширения И (совпали теги ИЛИ совпало название)
      return matchesFilter && (matchesTags || matchesSearch);
    });
  }
}
