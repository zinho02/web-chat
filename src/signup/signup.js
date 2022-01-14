function signup() {
    /*
    1 - Mandar para endpoint do backend os dados (usuário, senha, email)
    2 - Endpoint verificar se não existe na base de dados o usuário ou email
    2.1 - Caso tenha, retorne erro
    2.2 - Caso não tenha, salve na base de dados e retorne sucesso e entre na tela de login
    */
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