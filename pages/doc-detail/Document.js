import { DocumentComponent } from '../../components/document/document.js';
import { DocumentHeaderComponent } from '../../components/document/doc-header.js';
import { DocumentEditPage } from '../doc-edit/DocumentEdit.js';
import { BackDocListButton } from '../../components/back-list-button/BackDocListButton.js';
import { EditDocButton } from '../../components/edit-doc-button/EditDocButton.js';
import { DocumentListPage } from '../doc-list/DocumentList.js';
import { ThreeComponent } from '../../components/three/ThreeComponent.js';

import { ajax } from '../../modules/Ajax.js';
import { docUrls } from '../../modules/DocumentUrls.js';

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
       <div class="d-flex justify-content-between align-items-center mb-3">
            <div id="back-btn-container"></div>
            <div id="edit-btn-container"></div>
        </div>

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

  clickEdit() {
    const editPage = new DocumentEditPage(this.parent, this.id);
    editPage.render();
  }

  render() {
    document.body.style.backgroundColor = ' #f5f3f0';

    this.parent.innerHTML = '';
    const html = this.getHTML();
    this.parent.insertAdjacentHTML('beforeend', html);

    const backBtnContainer = document.getElementById('back-btn-container');
    const backBtn = new BackDocListButton(backBtnContainer);
    backBtn.render(this.clickBack.bind(this));

    const editBtnContainer = document.getElementById('edit-btn-container');
    const editBtn = new EditDocButton(editBtnContainer);
    editBtn.render(this.clickEdit.bind(this));

    ajax.get(docUrls.getDocById(this.id), (currentDocData) => {
      if (!currentDocData) return;

      const docHeaderContainer = document.getElementById('doc-header-container');
      new DocumentHeaderComponent(docHeaderContainer).render(currentDocData);

      const docContainer = document.getElementById('document-container');
      if (currentDocData.is3D) {
        new ThreeComponent(docContainer).render(currentDocData);
      } else {
        new DocumentComponent(docContainer).render(currentDocData);
      }
    });
  }
}
