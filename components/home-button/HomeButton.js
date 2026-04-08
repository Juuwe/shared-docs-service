import { DocumentListPage } from '../../pages/doc-list/DocumentList.js';

export class HomeButton {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    return `
            <button id="home-button" class="btn btn-dark" type="button" title="На главную">
                <i class="bi bi-house-door"></i>
            </button>
        `;
  }

  render() {
    const html = this.getHTML();
    this.parent.insertAdjacentHTML('beforeend', html);
    this.addListeners();
  }

  addListeners() {
    const homeButton = document.getElementById('home-button');
    homeButton.addEventListener('click', () => {
      const root = document.getElementById('root');
      const mainPage = new DocumentListPage(root);
      mainPage.render();
    });
  }
}
