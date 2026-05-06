import { HomeButton } from '../home-button/HomeButton.js';
import { DocumentListPage } from '../../pages/doc-list/DocumentList.js';

export class HeaderComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    return `
      <nav class="navbar navbar-light bg-light border-bottom mb-3">
        <div class="container-fluid">
          <div id="home-button-container" class="me-2"></div>

          <a class="navbar-brand" href="#">
            <span>shared-docs-service</span>
          </a>

          <div class="d-flex align-items-center ms-auto">
            <input type="file" id="upload-3d-model" accept=".glb" style="display: none;">
          </div>
        </div>
      </nav>
    `;
  }

  render() {
    const html = this.getHTML();
    this.parent.innerHTML = html;

    const homeButtonContainer = document.getElementById('home-button-container');
    const homeButton = new HomeButton(homeButtonContainer);
    homeButton.render();
  }
}
