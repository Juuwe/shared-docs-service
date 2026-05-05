export class EditDocButton {
    constructor(parent) {
        this.parent = parent;
    }

    addListeners(listener) {
        const btn = document.getElementById('edit-doc-button');
        if (btn) {
            btn.addEventListener('click', listener);
        }
    }

    getHTML() {
        return `
            <button class="btn btn-dark mb-3" id="edit-doc-button">
                <i class="bi bi-pencil me-1"></i>Редактировать
            </button>
        `;
    }

    render(listener) {
        const html = this.getHTML();
        this.parent.insertAdjacentHTML('beforeend', html);
        this.addListeners(listener);
    }
}
