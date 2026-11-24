/* =====================================================================
   amenities.js  -  Amenities request add kora, dekha, delete kora ebong search kora
   ===================================================================== */

// Notun item dite chaile ekhane likhe dao. Drop-down ebong list duto-i nijer theke update hoy.
let AVAILABLE_ITEMS = ["Extra Towel", "Water Bottle", "Soap", "Toiletries Kit", "Pillow"];

let amenityForm = document.getElementById("amenity-form");
let roomInput = document.getElementById("room-number");
let itemSelect = document.getElementById("item-name");
let availableList = document.getElementById("available-items-list");
let searchInput = document.getElementById("search-input");
let amenityBody = document.getElementById("amenity-table-body");

let amenityFields = ["room-number", "item-name"];


/* ---------- Drop-down ebong Available Items list bhore dewa ---------- */

let optionsHTML = "<option value=''>Select Item</option>";
let listHTML = "";

for (let i = 0; i < AVAILABLE_ITEMS.length; i++) {
    optionsHTML = optionsHTML + "<option value='" + AVAILABLE_ITEMS[i] + "'>" + AVAILABLE_ITEMS[i] + "</option>";
    listHTML = listHTML + "<li>" + AVAILABLE_ITEMS[i] + "</li>";
}

itemSelect.innerHTML = optionsHTML;
availableList.innerHTML = listHTML;


/* ---------- Table dekhano ---------- */

function renderRequests() {

    let query = searchInput.value.trim();
    let allRequests = DB.get(KEYS.AMENITIES);
    let rowsHTML = "";
    let shown = 0;

    for (let i = 0; i < allRequests.length; i++) {
        let request = allRequests[i];

        if (containsText(request.room, query)) {
            rowsHTML = rowsHTML +
                "<tr>" +
                "<td>" + escapeHTML(request.id) + "</td>" +
                "<td>" + escapeHTML(request.room) + "</td>" +
                "<td>" + escapeHTML(request.item) + "</td>" +
                "<td>" + escapeHTML(request.time) + "</td>" +
                "<td><button type='button' class='delete-btn' onclick='deleteRequest(" + i + ")'>Delete</button></td>" +
                "</tr>";
            shown = shown + 1;
        }
    }

    if (shown === 0) {
        rowsHTML = "<tr><td colspan='5'>No requests found.</td></tr>";
    }
    amenityBody.innerHTML = rowsHTML;
}


/* ---------- Notun request add kora ---------- */

function saveRequest() {
    clearErrors(amenityFields);

    let room = roomInput.value.trim();
    let item = itemSelect.value;
    let isValid = true;

    if (isValidRoom(room) === false) {
        showError("room-number", "Enter a valid room number, for example 305.");
        isValid = false;
    }

    if (item === "") {
        showError("item-name", "Select an item.");
        isValid = false;
    }

    if (isValid === false) {
        return false;
    }

    let requests = DB.get(KEYS.AMENITIES);

    let newRequest = {
        id: DB.nextId("AR", requests),
        room: room,
        item: item,
        time: formatNow(),
        createdAt: Number(new Date())
    };

    requests.push(newRequest);
    DB.set(KEYS.AMENITIES, requests);

    amenityForm.reset();
    showMessage("pageMessage", "Request " + newRequest.id + " added.", "success");
    renderRequests();
    return false;       // false dile page reload hoy na
}


/* ---------- Delete button chapar por ---------- */

function deleteRequest(index) {
    let requests = DB.get(KEYS.AMENITIES);
    let id = requests[index].id;

    DB.set(KEYS.AMENITIES, removeAt(requests, index));

    showMessage("pageMessage", "Request " + id + " deleted.", "success");
    renderRequests();
}


/* ---------- Search form ---------- */

function searchRequests() {
    renderRequests();
    return false;
}


renderRequests();
