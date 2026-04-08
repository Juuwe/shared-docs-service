export class DeleteDocButton {
  constructor(parent) {
    this.parent = parent;
  }

  // В методичке данные (id) прокидываются в строку для создания уникального ID элемента
  getHTML(id) {
    return `
            <button class="btn btn-link text-danger p-0"
                    id="delete-card-${id}"
                    style="text-decoration: none;">
                <i class="bi bi-trash3" style="font-size: 1.1rem;"></i>
            </button>
        `;
  }

  // Стандартный метод из методички: рендер, вставка, навешивание слушателя
  render(id, listener) {
    const html = this.getHTML(id);
    this.parent.insertAdjacentHTML('beforeend', html);
    this.addListeners(id, listener);
  }

  addListeners(id, listener) {
    document.getElementById(`delete-container-${id}`).addEventListener('click', () => {
      listener(id);
    });
  }
}
