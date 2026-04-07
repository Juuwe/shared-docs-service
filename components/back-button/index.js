export class BackButtonComponent {
  constructor(parent) {
    this.parent = parent;
  }

  addListeners(listener) {
    document.getElementById('back-button').addEventListener('click', listener);
  }

  getHTML() {
    return `
        <button class="btn btn-primary bg-dark border-0" id="back-button">Назад</button>
    `;
  }

    render(data, listener) {
        const html = this.getHTML(data);
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(data, listener);
    }

}
