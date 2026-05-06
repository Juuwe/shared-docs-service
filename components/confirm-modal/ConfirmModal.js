export class ConfirmModalComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(title, message) {
    return `
      <div class="modal" id="confirm-modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 rounded-0" style="background: #f5f3f0;">
            <div class="modal-header border-0 p-4 pb-0">
              <h5 class="modal-title" style="font-weight: 600; color: #5c5c5c;">${title}</h5>
            </div>
            <div class="modal-body p-4" style="color: #8a8a8a; font-size: 0.9rem;">
              ${message}
            </div>
            <div class="modal-footer border-0 p-4 pt-0">
              <button type="button" class="btn btn-link text-decoration-none" data-bs-dismiss="modal" style="color: #8a8a8a; font-size: 0.9rem;">Отмена</button>
              <button type="button" id="modal-confirm-btn" class="btn btn-dark rounded-0 px-4" style="font-size: 0.9rem;">Удалить</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  addListeners(onConfirm) {
    const modalElem = document.getElementById('confirm-modal');
    const bootstrapModal = new bootstrap.Modal(modalElem);
    const confirmBtn = document.getElementById('modal-confirm-btn');

    confirmBtn.addEventListener('click', () => {
      onConfirm();
      bootstrapModal.hide();
    });

    bootstrapModal.show();

    modalElem.addEventListener('hidden.bs.modal', () => {
      modalElem.remove();
      document.querySelector('.modal-backdrop')?.remove();
    });
  }

  render(data, onConfirm) {
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-holder';
    document.body.appendChild(modalContainer);

    modalContainer.innerHTML = this.getHTML(data.title, data.message);
    this.addListeners(onConfirm);
  }
}
