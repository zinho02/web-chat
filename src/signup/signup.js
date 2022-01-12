function signup() {
}

function verify() {
    form = document.getElementById("signup-form");
    psw1 = form.psw1;
    psw2 = form.psw2;

    if (psw1.value !== psw2.value) {
        psw2.setCustomValidity("As senhas devem ser iguais");
        return false;
    }
    if (psw1.value === '') {
        psw1.setCustomValidity("A senha não pode ser vazia");
        return false;
    }
    if (psw2.value === '') {
        psw2.setCustomValidity("A senha não pode ser vazia");
        return false;
    }
    psw1.setCustomValidity('');
    psw2.setCustomValidity('');
    return true;
}