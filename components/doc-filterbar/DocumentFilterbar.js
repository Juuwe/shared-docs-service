export class DocFilterbarComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML() {
    return `
            <div class="row g-2">
                <div class="col-md-6">
                    <input type="text" id="search-input" class="form-control" placeholder="Поиск по названию и тегам...">
                </div>

                <div class="col-md-3">
                    <select id="filter-select" class="form-select">
                        <option value="all">Все форматы</option>
                        <option value="pdf">PDF</option>
                        <option value="docx">DOCX</option>
                    </select>
                </div>

                <div class="col-md-3">
                  <button id="search-btn" class="btn btn-dark">Найти</button>
                </div>

            </div>
        `;
  }

  addListeners(onSearch) {
    const btn = document.getElementById('search-btn');
    const input = document.getElementById('search-input');
    const select = document.getElementById('filter-select');

    btn.addEventListener('click', () => {
      onSearch(input.value, select.value);
    });
  }

  render(onSearch) {
    this.parent.innerHTML = this.getHTML();
    this.addListeners(onSearch);
  }
}
