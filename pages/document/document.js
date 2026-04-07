import { DocumentComponent } from '../../components/document/document.js';
import { DocumentHeaderComponent } from '../../components/document/document-header.js';
import { BackButtonComponent } from '../../components/back-button/index.js';
import { MainPage } from '../main/index.js';

export class DocumentPage {
  constructor(parent, id) {
    this.parent = parent;
    this.id = id;
  }

  get pageRoot() {
    return document.getElementById('document-page-root');
  }

  getData() {
    return [
      {
        id: 1,
        src: 'static/img/docx.png',
        title: 'РПЗ.docx',
        text: 'Содержание пояснительной записки...',
      },
      { id: 2, src: 'static/img/pdf.png', title: 'Титул.pdf', text: 'Текст титульного листа...' },
    ];
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
    document.body.style.backgroundColor = 'white'
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

    const data = this.getData();
    const currentDocData = data.find(item => item.id == this.id);

    const docHeaderContainer = document.getElementById('doc-header-container');
    const docHeader = new DocumentHeaderComponent(docHeaderContainer);
    docHeader.render(currentDocData);


    const docContainer = document.getElementById('document-container');
    const doc = new DocumentComponent(docContainer);
    doc.render(currentDocData);
  }
}
