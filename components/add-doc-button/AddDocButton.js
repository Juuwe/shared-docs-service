export class AddDocButton {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    return `
            <div class="d-flex justify-content-center align-items-center"
                 id="add-doc-button"
                 style="width: 230px; height: 320px; cursor: pointer; background: transparent;">

                <div class="d-flex justify-content-center align-items-center shadow"
                     style="width: 60px; height: 60px; background: #000; border-radius: 50%; transition: transform 0.2s ease;">

                    <i class="bi bi-plus-lg" style="font-size: 2rem; color: #fff;"></i>

                </div>
            </div>
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
