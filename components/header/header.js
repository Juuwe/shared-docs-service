export class HeaderComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <nav class="navbar navbar-light bg-light border-bottom mb-3">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">
                        <span>DOCS</span>
                    </a>
                </div>
            </nav>
        `;
    }

    render() {
        const html = this.getHTML();
        this.parent.innerHTML = html;
    }
}
