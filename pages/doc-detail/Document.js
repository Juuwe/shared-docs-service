import { DocumentComponent } from '../../components/document/document.js';
import { DocumentHeaderComponent } from '../../components/document/doc-header.js';
import { BackDocListButton } from '../../components/back-list-button/BackDocListButton.js';
import { DocumentListPage } from '../doc-list/DocumentList.js';
import { ThreeComponent } from '../../components/three/ThreeComponent.js';

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
      <div id="document-page-root" class="container py-4" style="max-width: 1200px;">
        <div id="back-btn-container" class="mb-2"></div>

        <div class="card shadow-sm border-0 rounded-0 overflow-hidden">
          <div class="card-body p-4 p-lg-5">
            <div id="doc-header-container" class="mb-4 pb-3"></div>
            <div id="document-container"></div>
          </div>
        </div>
      </div>
    `;
  }

  clickBack() {
    document.body.style.backgroundColor = 'white';
    const mainPage = new DocumentListPage(this.parent);
    mainPage.render();
  }

  render() {
    document.body.style.backgroundColor = ' #f5f3f0';

    this.parent.innerHTML = '';
    const html = this.getHTML();
    this.parent.insertAdjacentHTML('beforeend', html);

    const backBtnContainer = document.getElementById('back-btn-container');
    const backBtn = new BackDocListButton(backBtnContainer);
    backBtn.render(this.clickBack.bind(this));

    getData().then((data) => {
      const currentDocData = data.find((item) => item.id == this.id);

      const docHeaderContainer = document.getElementById('doc-header-container');
      const docHeader = new DocumentHeaderComponent(docHeaderContainer);
      docHeader.render(currentDocData);

      const docContainer = document.getElementById('document-container');

      if (currentDocData.is3D) {
        const threeD = new ThreeComponent(docContainer);
        threeD.render(currentDocData);
      } else {
        const doc = new DocumentComponent(docContainer);
        doc.render(currentDocData);
      }
    });
  }
}
