signup_button = document.getElementById("signup-button");
signup_button.addEventListener("click", signup);

function signup() {
    var form = document.getElementById("signup-form");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/create-user", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(serializeJSON(form));
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