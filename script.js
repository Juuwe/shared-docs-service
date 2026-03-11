window.onload = function() {
    let currentDocumentContent = ''
    let incomingContribution = ''

    let permittedAccessAction = null

    let finalDocumentContent = ''

    const activeDocumentView = document.getElementById("result_output")
    const contentInputControls = document.querySelectorAll('[id ^= "btn_digit_"]')

    function onContentInput(contentToken) {
        if (!permittedAccessAction) {
            if (contentToken == '.' && currentDocumentContent.includes(contentToken)) {
                return;
            }

            currentDocumentContent += contentToken;
            activeDocumentView.innerHTML = currentDocumentContent;

        } else {
            if (contentToken == '.' && incomingContribution.includes(contentToken)) {
                return;
            }

            incomingContribution += contentToken;
            activeDocumentView.innerHTML = incomingContribution;
        }
    }

    contentInputControls.forEach(control => {
        control.onclick = function() {
            const tokenValue = control.innerHTML;
            onContentInput(tokenValue);
        }
    });

    function handleUnaryOperation(operation) {
        if (currentDocumentContent === '') {
            return;
        }

        if (!permittedAccessAction) {
            currentDocumentContent = operation(currentDocumentContent);
            activeDocumentView.innerHTML = currentDocumentContent;

        } else {
            if (incomingContribution === '') {
                return;
            }

            incomingContribution = operation(incomingContribution);
            activeDocumentView.innerHTML = incomingContribution;
        }
    }

    document.getElementById("btn_op_mult").onclick = function() {
        if (currentDocumentContent === '') {return;}
        permittedAccessAction = 'x';
    }

    document.getElementById("btn_op_plus").onclick = function() {
        if (currentDocumentContent === '') {return;}

        if (incomingContribution != '') {
            processAccessAction(permittedAccessAction);
        }

        permittedAccessAction = '+';
    }

    document.getElementById("btn_op_sign").onclick = function() {
        handleUnaryOperation(operand => -operand);
    }

    document.getElementById("btn_op_threezeros").onclick = function() {
        handleUnaryOperation(operand => operand + '000');
    }

    document.getElementById("btn_op_sqrt").onclick = function() {
        handleUnaryOperation(operand => Math.sqrt(operand))
    }

    document.getElementById("btn_op_square").onclick = function() {
        handleUnaryOperation(operand => operand * operand)
    }

    document.getElementById("btn_op_fact").onclick = function() {
        handleUnaryOperation(operand => {
            let res = 1;
            for (let i = 2; i <= operand; ++i) {
                res *= i;
            }
            return res;
        })
    }

    document.getElementById("btn_op_backspace").onclick = function() {
        handleUnaryOperation(operand => operand.slice(0, - 1))
    }

    document.getElementById("btn_op_div").onclick = function() {
        if (currentDocumentContent === '') {return;}
        permittedAccessAction = '/'

    }

    document.getElementById("btn_op_minus").onclick = function() {
        if (currentDocumentContent === '') {return;}

        if (incomingContribution != '') {
            processAccessAction(permittedAccessAction);
        }

        permittedAccessAction = '-';
    }

    document.getElementById("btn_op_clear").onclick = function() {
        currentDocumentContent = '';
        incomingContribution = '';
        permittedAccessAction = '';
        finalDocumentContent = '';
        activeDocumentView.innerHTML = 0;
    }

    function processAccessAction(action) {
        switch (action) {
            case 'x':
                currentDocumentContent =  ((+currentDocumentContent) * (+incomingContribution)).toString()
                break;
            case '+':
                currentDocumentContent =  ((+currentDocumentContent) + (+incomingContribution)).toString()
                break;
            case '-':
                currentDocumentContent =  ((+currentDocumentContent) - (+incomingContribution)).toString()
                break
            case '/':
                currentDocumentContent = ((+currentDocumentContent) / (+incomingContribution)).toString()
                break;
            default:
                break;
        }

        incomingContribution = ''
        permittedAccessAction = null
        finalDocumentContent = currentDocumentContent
    }

    document.getElementById("btn_op_equal").onclick = function() {
        if (currentDocumentContent === '' || incomingContribution === '' || !permittedAccessAction) {
            return;
        }

        processAccessAction(permittedAccessAction)

        activeDocumentView.innerHTML = currentDocumentContent
    }

    const accessRights = ["Просмотр", "Комментирование", "Редактирование", "Скачивание", "Управление доступом"];

    document.getElementById("btn_check_perm").onclick = function() {
        handleUnaryOperation(bitMask => {
            if (bitMask > 31) {
                return "Некорректный ввод";
            }

            let res = [];
            let bitValue = 1;

            for (let i = 0; i < 5; ++i) {
                if (bitMask & bitValue) {
                    res.push(accessRights[i]);
                }

                bitValue = bitValue << 1;
            }

            return res;
        })
    }

    const themeSelect = document.querySelector('.theme-select');
    themeSelect.onchange = function() {
        if (this.value === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

}
