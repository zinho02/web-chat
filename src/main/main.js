add_contact_button = document.getElementById("add-contact-button");
add_contact_button.addEventListener("click", add_contact);
add_contact_text = document.getElementById("add-contact-text");

add_contact_button_m = document.getElementById("add-contact-button-m");
add_contact_button_m.addEventListener("click", add_contact_m);
add_contact_text_m = document.getElementById("add-contact-text-m");

var usernameNotExists = "Usuários não existe.";
var all_contacts = [];

setInterval(function() {
    updateContacts();
}, 30000);

function get_all_contacts() {
    console.log(all_contacts);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        all_contacts = JSON.parse(xhr.responseText);    
    }
    }
    xhr.open("POST", "http://localhost:3000/all-contacts", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(null, null, 2);
}

function remove_all_contacts_front() {
    var contacts = document.getElementById("contacts-list").childNodes;
    for (var i = 0; i < contacts.length; i++) {
        contacts[i].remove();
    }

    var contacts_m = document.getElementById("contacts-list-m").childNodes;
    for (var i = 0; i < contacts_m.length; i++) {
        contacts_m[i].remove();
    }
}

function add_all_contacts_front() {
    for (var i = 0; i < all_contacts.length; i++) {
        addContact(all_contacts[i].usuario2);
        addContactM(all_contacts[i].usuario2 + "-m");
    }
}

function add_contact() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var status = String(JSON.parse(xhr.responseText).status);
        if (status === 'usernameNotExists') {
            add_contact_text.setCustomValidity(usernameNotExists);
            add_contact_text.reportValidity();
        } else {
            addContact(add_contact_text.value);
            addContactM(add_contact_text.value + "-m");
        }
    }
    }
    xhr.open("POST", "http://localhost:3000/add-user", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({uname : add_contact_text.value}, null, 2));
}

function remove_contact(user) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var status = String(JSON.parse(xhr.responseText).status);
        document.getElementById(user).remove();
        document.getElementById(user + "-m").remove();
    }
    }
    xhr.open("POST", "http://localhost:3000/remove-user", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({uname : user}, null, 2));
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
            addContact(add_contact_text.value);
            addContactM(add_contact_text.value + "-m");
        }
    }
    }
    xhr.open("POST", "http://localhost:3000/remove-user", false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({uname : add_contact_text_m.value}, null, 2));
}

function openLeftMenu() {
    document.getElementById("leftMenu").style.display = "block";
}

function closeLeftMenu() {
    document.getElementById("leftMenu").style.display = "none";
}

function addContact(contact) {
    var selectContact = document.createElement("div");
    selectContact.className = "select-contact";
    selectContact.id = contact;
    var input = document.createElement("input");
    input.setAttribute("type", "image");
    input.setAttribute("src", "./resources/images/icons/cat-solid.svg");
    //input.addEventListener("click", chat_contact);
    input.className = "cat-contact";

    var remove = document.createElement("input");
    remove.setAttribute("type", "image");
    remove.setAttribute("src", "./resources/images/icons/user-times-solid.svg");
    remove.addEventListener("click", function() {remove_contact(contact)}, false);
    remove.className = "remove-contact";

    var contactsList = document.getElementById("contacts-list");
    selectContact.innerHTML = contact;
    selectContact.appendChild(input);
    selectContact.appendChild(remove);
    contactsList.appendChild(selectContact);
}

function addContactM(contact) {
    var selectContact = document.createElement("div");
    selectContact.className = "select-contact";
    selectContact.id = contact + "-m";
    var input = document.createElement("input");
    input.setAttribute("type", "image");
    input.setAttribute("src", "./resources/images/icons/cat-solid.svg");
    //input.addEventListener("click", chat_contact);
    input.className = "cat-contact";

    var remove = document.createElement("input");
    remove.setAttribute("type", "image");
    remove.setAttribute("src", "./resources/images/icons/user-times-solid.svg");
    remove.addEventListener("click", function() {remove_contact(contact + "-m")}, false);
    remove.className = "remove-contact";

    var contactsList = document.getElementById("contacts-list-m");
    selectContact.innerHTML = contact;
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
    get_all_contacts();
    remove_all_contacts_front();
    add_all_contacts_front();
}

function sendMessage() {
    /*
    1 - Manda mensagem para endpoint no backend
    2 - Endpoint adiciona mensagem na base de dados dos dois usuários
    3 - Endpoint retorna a lista de mensagens ordenada
    4 - Frontend atualiza
    */
}
