export class AddDocButton {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    return `
      <button id="add-doc-button" class="btn btn-primary border-0" style="background-color: #b4dc19; color: black">
        <i class="bi bi-plus-circle me-2"></i>Добавить документ
      </button>
    `;
  }

  render(listener) {
    const html = this.getHTML();
    this.parent.insertAdjacentHTML('beforeend', html);
    this.addListeners(listener);
  }

  addListeners(listener) {
    document.getElementById('add-doc-button').addEventListener('click', listener);
  }
}
