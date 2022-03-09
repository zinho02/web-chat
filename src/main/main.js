add_contact_button = document.getElementById("add-contact-button");
add_contact_button.addEventListener("click", add_contact);
add_contact_text = document.getElementById("add-contact-text");

add_contact_button_m = document.getElementById("add-contact-button-m");
add_contact_button_m.addEventListener("click", add_contact_m);
add_contact_text_m = document.getElementById("add-contact-text-m");

var usernameNotExists = "Usuários não existe.";

function add_contact() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var status = String(JSON.parse(xhr.responseText).status);
        if (status === 'usernameNotExists') {
            add_contact_text.setCustomValidity(usernameNotExists);
            add_contact_text.reportValidity();
        } else {
            var selectContact = document.createElement("div");
            selectContact.className = "select-contact";
            var input = document.createElement("input");
            input.setAttribute("type", "image");
            input.setAttribute("src", "./resources/images/icons/cat-solid.svg");
            input.setAttribute("onclick", "catContact()");
            input.className = "cat-contact";
        
            var remove = document.createElement("input");
            remove.setAttribute("type", "image");
            remove.setAttribute("src", "./resources/images/icons/user-times-solid.svg");
            remove.setAttribute("onclick", "removeContact(this)");
            remove.className = "remove-contact";
        
            var contactsList = document.getElementById("contacts-list");
            selectContact.innerHTML = add_contact_text.value;
            selectContact.appendChild(input);
            selectContact.appendChild(remove);
            contactsList.appendChild(selectContact);
        }
    }
    }
    xhr.open("POST", "http://localhost:3000/add-user", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({uname : add_contact_text.value}, null, 2));
}

function add_contact_m() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var status = String(JSON.parse(xhr.responseText).status);
        if (status === 'usernameNotExists') {
            add_contact_text_m.setCustomValidity(usernameNotExists);
            add_contact_text_m.reportValidity();
        } else {
          alert("Entrei na tela principal");
        }
    }
    }
    xhr.open("POST", "http://localhost:3000/add-user", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({uname : add_contact_text_m.value}, null, 2));
}

function openLeftMenu() {
    document.getElementById("leftMenu").style.display = "block";
}

function closeLeftMenu() {
    document.getElementById("leftMenu").style.display = "none";
}

function addContact() {
    /*
    1 - Manda para endpoint no backend o usuário
    2 - Endpoint adiciona na base de dados dos contatos dos dois usuários
    3 - Endpoint retorna lista de contatos
    4 - Frontend atualiza
    */
    var selectContact = document.createElement("div");
    selectContact.className = "select-contact";
    var input = document.createElement("input");
    input.setAttribute("type", "image");
    input.setAttribute("src", "../resources/images/icons/cat-solid.svg");
    input.setAttribute("onclick", "catContact()");
    input.className = "cat-contact";

    var remove = document.createElement("input");
    remove.setAttribute("type", "image");
    remove.setAttribute("src", "../resources/images/icons/user-times-solid.svg");
    remove.setAttribute("onclick", "removeContact(this)");
    remove.className = "remove-contact";

    var addContactText = document.getElementById("add-contact-text").value;
    var contactsList = document.getElementById("contacts-list");
    selectContact.innerHTML = addContactText;
    selectContact.appendChild(input);
    selectContact.appendChild(remove);
    contactsList.appendChild(selectContact);
}

function catContact() {
    /*
    1 - Manda para endpoint no backend o id da conversa
    2 - Endpoint retorna lista ordenada das mensagens
    3 - Frontend atualiza elas
    */

}

function updateMessages() {}

function removeContact(contact) {
    /*
    1 - Manda o nome de usuário para um endpoint no backend
    2 - Endpoint remove o usuário da base de dados dos contatos dos dois usuários
    3 - Depois de retorna a lista de contatos (updateContacts()), atualizar no frontend
    */
    contact.parentElement.remove();
    updateContacts();
}

function updateContacts() {
    /*
    1 - Endpoint retorna lista de contatos
    */
}

function sendMessage() {
    /*
    1 - Manda mensagem para endpoint no backend
    2 - Endpoint adiciona mensagem na base de dados dos dois usuários
    3 - Endpoint retorna a lista de mensagens ordenada
    4 - Frontend atualiza
    */
}
