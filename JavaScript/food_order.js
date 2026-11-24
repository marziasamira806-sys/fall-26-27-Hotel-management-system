/* =====================================================================
   food_order.js  -  Food order toiri, dekha, update, delete ebong search
   ---------------------------------------------------------------------
   Read    - renderOrders() array-er upor loop chalay ebong table-er row banay
   Search  - ei renderOrders()-i je row mile na seta bad dey
   Create  - saveOrder() form check kore, tarpor notun object push() kore
   Update  - editOrder() form bhore dey, saveOrder() object bodle dey
   Delete  - deleteOrder() common.js-er removeAt() bebohar kore
   ===================================================================== */

let editId = null;     // Je order edit hocche tar id (null mane notun order add hocche)

let orderForm = document.getElementById("order-form");
let roomInput = document.getElementById("room-number");
let itemSelect = document.getElementById("food-item");
let qtyInput = document.getElementById("quantity");
let statusGroup = document.getElementById("status-group");
let statusSelect = document.getElementById("order-status");
let submitBtn = document.getElementById("order-submit");
let cancelBtn = document.getElementById("cancel-btn");
let searchInput = document.getElementById("search-input");
let statusFilter = document.getElementById("status-filter");
let orderBody = document.getElementById("order-table-body");

let orderFields = ["room-number", "food-item", "quantity"];


/* ---------- Table dekhano ---------- */

function renderOrders() {

    let query = searchInput.value.trim();
    let status = statusFilter.value;

    let allOrders = DB.get(KEYS.FOOD);
    let rowsHTML = "";
    let shown = 0;

    for (let i = 0; i < allOrders.length; i++) {
        let order = allOrders[i];
        let matchesSearch = containsText(order.id, query) || containsText(order.room, query);
        let matchesStatus = (status === "") || (order.status === status);

        if (matchesSearch && matchesStatus) {
            rowsHTML = rowsHTML +
                "<tr>" +
                "<td>" + escapeHTML(order.id) + "</td>" +
                "<td>" + escapeHTML(order.room) + "</td>" +
                "<td>" + escapeHTML(order.item) + "</td>" +
                "<td>" + escapeHTML(order.qty) + "</td>" +
                "<td>" + escapeHTML(order.time) + "</td>" +
                "<td><span class='status " + statusClass(order.status) + "'>" + escapeHTML(order.status) + "</span></td>" +
                "<td><button type='button' class='edit-btn' onclick='editOrder(" + i + ")'>Edit</button></td>" +
                "<td><button type='button' class='delete-btn' onclick='deleteOrder(" + i + ")'>Delete</button></td>" +
                "</tr>";
            shown = shown + 1;
        }
    }

    if (shown === 0) {
        rowsHTML = "<tr><td colspan='8'>No orders found.</td></tr>";
    }
    orderBody.innerHTML = rowsHTML;
}


/* ---------- Add / Update ---------- */

function saveOrder() {
    clearErrors(orderFields);

    let room = roomInput.value.trim();
    let item = itemSelect.value;
    let qty = Number(qtyInput.value);
    let isValid = true;

    if (isValidRoom(room) === false) {
        showError("room-number", "Enter a valid room number, for example 305.");
        isValid = false;
    }

    if (item === "") {
        showError("food-item", "Select a food item.");
        isValid = false;
    }

    let qtyIsOk = (qty >= 1) && (qty === Math.floor(qty));
    if (qtyIsOk === false) {
        showError("quantity", "Quantity must be a whole number, 1 or more.");
        isValid = false;
    }

    if (isValid === false) {
        return false;
    }

    let orders = DB.get(KEYS.FOOD);

    if (editId !== null) {

        let orderIndex = findIndexById(orders, editId);
        if (orderIndex === -1) {
            showMessage("pageMessage", "This order no longer exists.", "error");
            exitEditMode();
            renderOrders();
            return false;
        }

        let order = orders[orderIndex];
        order.room = room;
        order.item = item;
        order.qty = qty;
        order.status = statusSelect.value;

        // Tray alert shudhu delivered order-er jonno ortho rakhe
        if (order.status !== "Delivered") {
            order.trayStatus = "";
            order.collectedTime = "";
        }

        showMessage("pageMessage", "Order " + order.id + " updated.", "success");

    } else {

        let newOrder = {
            id: DB.nextId("FO", orders),
            room: room,
            item: item,
            qty: qty,
            status: "Pending",
            trayStatus: "",
            collectedTime: "",
            time: formatNow(),
            createdAt: Number(new Date())
        };

        orders.push(newOrder);
        showMessage("pageMessage", "Order " + newOrder.id + " added.", "success");
    }

    DB.set(KEYS.FOOD, orders);
    exitEditMode();
    renderOrders();
    return false;       // false dile page reload hoy na
}


/* ---------- Edit mode (Edit button chapar por) ---------- */

function editOrder(index) {
    let order = DB.get(KEYS.FOOD)[index];

    clearErrors(orderFields);
    hideMessage("pageMessage");

    editId = order.id;
    roomInput.value = order.room;
    itemSelect.value = order.item;
    qtyInput.value = order.qty;
    statusSelect.value = order.status;

    submitBtn.innerHTML = "Update Order";
    statusGroup.style.display = "block";
    cancelBtn.style.display = "block";
}

function exitEditMode() {
    editId = null;
    orderForm.reset();                  // quantity abar 1 hoye jay
    clearErrors(orderFields);

    submitBtn.innerHTML = "Add Order";
    statusGroup.style.display = "none";
    cancelBtn.style.display = "none";
}


/* ---------- Delete button chapar por ---------- */

function deleteOrder(index) {
    let orders = DB.get(KEYS.FOOD);
    let id = orders[index].id;

    DB.set(KEYS.FOOD, removeAt(orders, index));

    if (editId === id) {
        exitEditMode();
    }

    showMessage("pageMessage", "Order " + id + " deleted.", "success");
    renderOrders();
}


/* ---------- Search form ---------- */

function searchOrders() {
    renderOrders();
    return false;
}


renderOrders();
