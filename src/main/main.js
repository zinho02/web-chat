function closeNav() {
    document.getElementById("contacts-container").style.display = "none";
}

function addContact() {
    var selectContact = document.createElement("div");
    selectContact.className = "select-contact";
    var input = document.createElement("input");
    input.setAttribute("type", "image");
    input.setAttribute("src", "../resources/images/icons/cat-solid.svg");
    input.setAttribute("onclick", "catContact()");
    input.className = "cat-contact";
    var addContactText = document.getElementById("add-contact-text").value;
    var contactsList = document.getElementById("contacts-list");
    selectContact.innerHTML = addContactText;
    selectContact.appendChild(input);
    contactsList.appendChild(selectContact);
}