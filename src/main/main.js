function addContact() {
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

}

function removeContact(contact) {
    contact.parentElement.remove();
}