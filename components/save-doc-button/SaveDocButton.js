export class SaveDocButton {
    constructor(parent) {
        this.parent = parent;
    }

    render(listener) {
        const html = `
            <button type="button" class="btn btn-dark mb-2" id="btn-save-doc">
                <i class="bi bi-cloud-arrow-up me-2"></i> Сохранить
            </button>
        `;

        this.parent.insertAdjacentHTML('beforeend', html);

        const btn = document.getElementById('btn-save-doc');
        btn.addEventListener('click', listener);
    }
}
