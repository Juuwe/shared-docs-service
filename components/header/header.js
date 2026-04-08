import { HomeButton } from '../home-button/HomeButton.js';

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
                    <div class="flex-grow-1"></div>
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
