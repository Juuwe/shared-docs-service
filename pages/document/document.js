import { DocumentComponent } from '../../components/document/document.js';
import { DocumentHeaderComponent } from '../../components/document/document-header.js';
import { BackButtonComponent } from '../../components/back-button/index.js';
import { MainPage } from '../main/index.js';
import { ThreeComponent } from '../../components/three/three-component.js';

export class DocumentPage {
  constructor(parent, id) {
    this.parent = parent;
    this.id = id;
  }

  get pageRoot() {
    return document.getElementById('document-page-root');
  }

  getHTML() {
    return `
            <div id="document-page-root" class="container mt-4">
                <div id="back-btn-container" class="mb-3"></div>
                <div id="doc-header-container"></div>
                <div id="document-container"></div>
            </div>
        `;
  }

  clickBack() {
    document.body.style.backgroundColor = 'white';
    const mainPage = new MainPage(this.parent);
    mainPage.render();
  }

  render() {
    document.body.style.backgroundColor = ' #f5f3f0';

    this.parent.innerHTML = '';
    const html = this.getHTML();
    this.parent.insertAdjacentHTML('beforeend', html);

    const backBtnContainer = document.getElementById('back-btn-container');
    const backBtn = new BackButtonComponent(backBtnContainer);
    backBtn.render(this.clickBack.bind(this));

    window.getData().then((allData) => {
      const currentDocData = allData.find((item) => item.id == this.id);
      if (currentDocData) {
        this.renderContent(currentDocData);
      }
    });
  }

  renderContent(data) {
    const docHeaderContainer = document.getElementById('doc-header-container');
    new DocumentHeaderComponent(docHeaderContainer).render(data);

    const docContainer = document.getElementById('document-container');

    if (data.is3D) {
      // Используем наш новый 3D вьювер
      const threeD = new ThreeComponent(docContainer);
      threeD.render(data);
    } else {
      // Стандартный текстовый документ
      const doc = new DocumentComponent(docContainer);
      doc.render(data);
    }
  }
}
