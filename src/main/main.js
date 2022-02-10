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
