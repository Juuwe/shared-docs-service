import { ButtonComponent } from '../../components/button/index.js';
import { DeleteDocComponent } from '../del-doc-button/del_doc_button.js';

export class ProductCardComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(data) {
    return `
        <div class="card border-0 rounded-0 product-card" id="card-${data.id}"
             style="width: 230px; background: #f5f3f0; overflow: hidden; display: flex; flex-direction: column;">
            <div class="card-body d-flex justify-content-center align-items-center" style="height: 280px; flex-grow: 1;">
                <div class="shadow-sm p-2" style="width: 160px; height: 220px; background: white; border: 1px solid #eee; overflow: hidden;">
                    <div style="font-size: 4px; line-height: 6px; color: #ccc; text-align: left;">
                        ${'LOREM IPSUM '.repeat(60)}
                    </div>
                </div>
            </div>
            <div class="card-footer bg-white border-top p-3 w-100">
                <div class="d-flex align-items-center mb-1">
                    <img src="${data.src}" width="20" height="20" class="me-2" alt="icon">
                    <h6 class="card-title text-truncate mb-0" style="font-size: 0.85rem; font-weight: 600;" title="${data.title}">
                        ${data.title}
                    </h6>
                </div>

                <div class="d-flex justify-content-between mb-3" style="font-size: 0.7rem; color: #999;">
                    <span><i class="bi bi-file-earmark-code"></i> ${data.size}</span>
                    <span><i class="bi bi-shield-check"></i> ${data.owner}</span>
                </div>

                <div class="d-flex align-items-center">
                    <div id="delete-container-${data.id}"></div>
                    <div id="btn-container-${data.id}" class="ms-auto"></div>
                </div>
            </div>
        </div>
    `;
  }

  //   <h5 class="card-title text-truncate w-100">${data.title}</h5>
  //                 <p class="card-text small text-muted text-truncate w-100">${data.text}</p>
  //<img src="${data.src}" width="20" style="position: absolute; top: 5px; right: 5px;"></img>
  //                 <div id="btn-container-${data.id}" class="hover-button w-100"></div>

  render(data, listener, deleteListener) {
    const html = this.getHTML(data);
    this.parent.insertAdjacentHTML('beforeend', html);

    const btnContainer = document.getElementById(`btn-container-${data.id}`);
    const button = new ButtonComponent(btnContainer);
    button.render({ id: data.id, text: 'Перейти' }, listener);

    const delBtnContainer = document.getElementById(`delete-container-${data.id}`);
    const delBtn = new DeleteDocComponent(delBtnContainer);
    delBtn.render(data.id, deleteListener);
  }
}
