export class BackDocListButton {
  constructor(parent) {
    this.parent = parent;
  }

  addListeners(listener) {
    document.getElementById('back-button').addEventListener('click', listener);
  }

  getHTML() {
    return `
        <button class="btn btn-dark mb-3" id="back-button">
            <i class="bi bi-arrow-left me-2"></i>Назад к документам
        </button>
    `;
  }

  render(data, listener) {
    const html = this.getHTML(data);
    this.parent.insertAdjacentHTML('beforeend', html);
    this.addListeners(data, listener);
  }
}
