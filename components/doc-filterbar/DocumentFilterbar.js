export class DocFilterbarComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    return `
            <div class="row g-2">
            <div class="col-md-8">
                <input type="text" id="search-input" class="form-control" placeholder="Поиск по названию и тегам...">
            </div>
            <div class="col-md-4">
                <select id="filter-select" class="form-select">
                    <option value="all">Все форматы</option>
                    <option value="pdf">PDF</option>
                    <option value="docx">DOCX</option>
                </select>
            </div>
        </div>
        `;
  }

  addListeners(onSearch, onFilter) {
    document.getElementById('search-input').addEventListener('input', (e) => {
      onSearch(e.target.value);
    });

    document.getElementById('filter-select').addEventListener('change', (e) => {
      onFilter(e.target.value);
    });
  }

  render(onSearch, onFilter) {
    this.parent.innerHTML = this.getHTML();
    this.addListeners(onSearch, onFilter);
  }
}
