export class FrwDocDetailBtn {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(data) {
    return `
        <button class="btn btn-primary bg-dark border-0" id="click-card-${data.id}" data-id="${data.id}">Открыть</button>
    `;
  }

  addListeners(data, listener) {
    document.getElementById(`click-card-${data.id}`).addEventListener('click', listener);
  }

  render(data, listener) {
    const html = this.getHTML(data);
    this.parent.insertAdjacentHTML('beforeend', html);
    this.addListeners(data, listener);
  }
}
