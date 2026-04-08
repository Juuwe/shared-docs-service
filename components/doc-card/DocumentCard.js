import { FrwDocDetailBtn } from '../frwd-detail-button/ForwardDocButton.js';
import { DeleteDocButton } from '../del-doc-button/DeleteDocButton.js';

export class DocumentCardComponent {
  constructor(parent) {
    this.parent = parent;
  }

  getHTML(data) {
    return `
        <div class="card border-0 rounded-0 product-card" id="card-${data.id}"
             style="width: 230px; background: #f5f3f0; overflow: hidden; display: flex; flex-direction: column;">

            <div class="card-body d-flex justify-content-center align-items-center p-0" style="height: 280px; flex-grow: 1;">
                <div class="shadow-sm p-2" style="width: 170px; height: 230px; background: white; border: 1px solid #eee; overflow: hidden;">
                    <div style="font-size: 4px; line-height: 6px; color: #ccc; text-align: left;">
                        ${'LOREM IPSUM DOLOR SIT AMET '.repeat(60)}
                    </div>
                </div>
            </div>

            <div class="card-footer bg-white border-top p-3 w-100">
                <div class="d-flex align-items-center mb-1">
                    <img src="${data.src}" width="24" height="24" class="me-2" alt="type-icon">
                    <h6 class="card-title text-truncate mb-0" style="font-size: 0.9rem; font-weight: 600;" title="${data.title}">
                        ${data.title}
                    </h6>

                    <div id="delete-container-${data.id}" class="ms-auto"></div>
                </div>

                <div id="btn-container-${data.id}" class="hover-button d-flex justify-content-center w-100"></div>
            </div>
        </div>
    `;
  }

  render(docData, forwardListener, deleteListener) {
    const html = this.getHTML(docData);
    this.parent.insertAdjacentHTML('beforeend', html);

    const frwdBtnContainer = document.getElementById(`btn-container-${docData.id}`);
    const frwdBtn = new FrwDocDetailBtn(frwdBtnContainer);
    frwdBtn.render({ id: docData.id, text: 'Перейти' }, forwardListener);

    const delBtnContainer = document.getElementById(`delete-container-${docData.id}`);
    const delBtn = new DeleteDocButton(delBtnContainer);
    delBtn.render(docData.id, deleteListener);
  }
}
