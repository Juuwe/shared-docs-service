export class DocumentHeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="d-flex align-items-center justify-content-between mb-3 py-2 border-bottom">
                <div class="d-flex align-items-center">
                    <img src="${data.src}" width="32" class="me-3">
                    <h4 class="m-0 text-dark">${data.title}</h4>
                </div>
                <div class="text-muted small">
                    <span>Последнее изменение: 07.04.2026</span>
                </div>
            </div>
        `;
    }

    render(data) {
        this.parent.innerHTML = this.getHTML(data);
    }
}
