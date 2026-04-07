export class DocumentComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(data) {
    return `
            <div class="bg-white shadow-sm p-5 mx-auto"
                 style="max-width: 1100px; min-height: 100vh; border: 1px solid #dee2e6;">
                <div class="document-text" style="line-height: 1.6; color: #333;">
                    ${data.text}
                </div>
            </div>
        `;
  }

  render(data) {
    this.parent.innerHTML = this.getHTML(data);
  }
}
