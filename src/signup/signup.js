signup_button = document.getElementById("signup-button");
signup_button.addEventListener("click", signup);

var usernameExists = "Usuário já existe.";
var invalidUsername = "Nome de usuário inválido.\nO nome deve conter apenas letras minúsculas e números.";
var invalidPassword = "Senha inválida.\nAs senhas devem ser iguais.\nDevem conter de 8 até 100 caracteres.\nTer letras minúsculas e maísculas.\nTer pelo menos 2 dígitos.";
var emailExists = "Email já existe.";
var invalidEmail = "Endereço de email inválido.";

signup_form = document.getElementById("signup-form");
uname = signup_form.uname;
psw1 = signup_form.psw1;
psw2 = signup_form.psw2;
email = signup_form.email;

function signup() {
    var xhr = new XMLHttpRequest();
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          var status = String(JSON.parse(xhr.responseText).status); 
          if (status === 'usernameExists') {
            uname.setCustomValidity(usernameExists);
          }
          if (status === 'invalidUsername') {
            uname.setCustomValidity(invalidUsername);
          }
          if (status === 'invalidPassword') {
            psw1.setCustomValidity(invalidPassword);
          }
          if (status === 'emailExists') {
            email.setCustomValidity(emailExists);
          }
          if (status === 'invalidEmail') {
            email.setCustomValidity(invalidEmail);
          }
          if (status === 'valid') {
            alert("Criado!");
          }
      }
  }
    xhr.open("POST", "http://localhost:3000/create-user", false);
    xhr.send(serializeJSON(signup_form));
}

function serializeJSON (form) {
    var obj = {};
    Array.prototype.slice.call(form.elements).forEach(function (field) {
      if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1) return;
      if (field.type === 'select-multiple') {
        var options = [];
        Array.prototype.slice.call(field.options).forEach(function (option) {
          if (!option.selected) return;
          options.push(option.value);
        });
        if (options.length) {
          obj[field.name] = options;
        }
        return;
      }
      if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) return;
      obj[field.name] = field.value;
    });
    return JSON.stringify(obj, null, 2);
  }

function verify() {
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