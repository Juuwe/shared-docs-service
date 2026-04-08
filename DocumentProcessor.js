window.onload = function() {
    let mainDocumentDraft = ''
    let secondaryAppendix = ''

    let activeProcessingRule = null

    let finalizedDocument = ''

    const documentDisplayArea = document.getElementById("result_output")
    const documentInputElements = document.querySelectorAll('[id ^= "btn_digit_"]')

    function onContentUpdate(contentFragment) {
        if (!activeProcessingRule) {
            if (contentFragment == '.' && mainDocumentDraft.includes(contentFragment)) {
                return;
            }

            mainDocumentDraft += contentFragment;
            documentDisplayArea.innerHTML = mainDocumentDraft;

        } else {
            if (contentFragment == '.' && secondaryAppendix.includes(contentFragment)) {
                return;
            }

            secondaryAppendix += contentFragment;
            documentDisplayArea.innerHTML = secondaryAppendix;
        }
    }

    documentInputElements.forEach(element => {
        element.onclick = function() {
            const fragmentValue = element.innerHTML;
            onContentUpdate(fragmentValue);
        }
    });

    function applyDataTransformation(transformation) {
        if (mainDocumentDraft === '') {
            return;
        }

        if (!activeProcessingRule) {
            mainDocumentDraft = transformation(mainDocumentDraft);
            documentDisplayArea.innerHTML = mainDocumentDraft;

        } else {
            if (secondaryAppendix === '') {
                return;
            }

            secondaryAppendix = transformation(secondaryAppendix);
            documentDisplayArea.innerHTML = secondaryAppendix;
        }
    }

    document.getElementById("btn_op_mult").onclick = function() {
        if (mainDocumentDraft === '') {return;}
        activeProcessingRule = 'x';
    }

    document.getElementById("btn_op_plus").onclick = function() {
        if (mainDocumentDraft === '') {return;}

        if (secondaryAppendix != '') {
            executeDocumentOperation(activeProcessingRule);
        }

        activeProcessingRule = '+';
    }

    document.getElementById("btn_op_div").onclick = function() {
        if (mainDocumentDraft === '') {return;}
        activeProcessingRule = '/'

    }

    document.getElementById("btn_op_minus").onclick = function() {
        if (mainDocumentDraft === '') {return;}

        if (secondaryAppendix != '') {
            executeDocumentOperation(activeProcessingRule);
        }

        activeProcessingRule = '-';
    }

    document.getElementById("btn_op_sign").onclick = function() {
        applyDataTransformation(content => -content);
    }

    document.getElementById("btn_op_threezeros").onclick = function() {
        applyDataTransformation(content => content + '000');
    }

    document.getElementById("btn_op_sqrt").onclick = function() {
        applyDataTransformation(content => Math.sqrt(content))
    }

    document.getElementById("btn_op_square").onclick = function() {
        applyDataTransformation(content => content * content)
    }

    document.getElementById("btn_op_fact").onclick = function() {
        applyDataTransformation(content => {
            let result = 1;
            for (let i = 2; i <= content; ++i) {
                result *= i;
            }
            return result;
        })
    }

    document.getElementById("btn_op_backspace").onclick = function() {
        applyDataTransformation(content => content.slice(0, - 1))
    }

    document.getElementById("btn_op_clear").onclick = function() {
        mainDocumentDraft = '';
        secondaryAppendix = '';
        activeProcessingRule = '';
        finalizedDocument = '';
        documentDisplayArea.innerHTML = 0;
    }

    function executeDocumentOperation(rule) {
        switch (rule) {
            case 'x':
                mainDocumentDraft = ((+mainDocumentDraft) * (+secondaryAppendix)).toString()
                break;
            case '+':
                mainDocumentDraft = ((+mainDocumentDraft) + (+secondaryAppendix)).toString()
                break;
            case '-':
                mainDocumentDraft = ((+mainDocumentDraft) - (+secondaryAppendix)).toString()
                break
            case '/':
                mainDocumentDraft = ((+mainDocumentDraft) / (+secondaryAppendix)).toString()
                break;
            default:
                break;
        }

        secondaryAppendix = ''
        activeProcessingRule = null
        finalizedDocument = mainDocumentDraft
    }

    document.getElementById("btn_op_equal").onclick = function() {
        if (mainDocumentDraft === '' || secondaryAppendix === '' || !activeProcessingRule) {
            return;
        }

        executeDocumentOperation(activeProcessingRule)

        documentDisplayArea.innerHTML = finalizedDocument
    }

    const documentAccessLevels = ["П", "К", "Р", "С", "УД"];
    document.getElementById("btn_check_perm").onclick = function() {
        applyDataTransformation(accessMask => {
            if (accessMask < 0 || accessMask > 31) {
                return "Некорректный ввод";
            }

            if (accessMask == 0) {
                return "Нет прав";
            }

            let grantedRights = [];
            let flagValue = 1;

            for (let i = 0; i < 5; ++i) {
                if (accessMask & flagValue) {
                    grantedRights.push(documentAccessLevels[i]);
                }

                flagValue = flagValue << 1;
            }

            return grantedRights.join(' ');
        })
    }

    const interfaceThemeSwitch = document.querySelector('.theme-select');
    interfaceThemeSwitch.onchange = function() {
        if (this.value === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}
