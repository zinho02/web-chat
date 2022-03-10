signup_button = document.getElementById("signup");
signup_button.addEventListener("click", signup);

signup_button_m = document.getElementById("signup-m");
signup_button_m.addEventListener("click", signup);

form_login = document.getElementById("form-login");
form_login_m = document.getElementById("form-mobile");

uname = form_login.uname;
uname_m = form_login_m.uname_m;

login_button = document.getElementById("enter");
login_button.addEventListener("click", login);

login_button_m = document.getElementById("send");
login_button_m.addEventListener("click", loginMobile);

var invalidUsernameOrPassword = "Usuário ou senha inválido.";

function login() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          var status = String(JSON.parse(xhr.responseText).status); 
          if (status === 'invalidUsernameOrPassword') {
            uname.setCustomValidity(invalidUsernameOrPassword);
          }
      }
    }
    xhr.open("POST", "http://localhost:3000/login", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(serializeJSON(form_login));
}

function loginMobile() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          var status = String(JSON.parse(xhr.responseText).status); 
          if (status === 'invalidUsernameOrPassword') {
            uname.setCustomValidity(invalidUsernameOrPassword);
          }
      }
    }
    xhr.open("POST", "http://localhost:3000/login-m", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(serializeJSON(form_login_m));
}

function signup() {
    window.location.href = "http://localhost:3000/signup";
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