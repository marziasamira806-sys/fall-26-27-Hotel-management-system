/* =====================================================================
   common.js  -  Shob page-e use hoy emon helper function gulo
   ---------------------------------------------------------------------
   storage.js-er por, ar proti page-er nijer script-er age load hoy.
   ===================================================================== */


/* ---------- 1. Message ----------
   Proti page-e <div id="pageMessage" class="message"></div> ache.
   type hocche "success", "error" ba "info" (egulo CSS class). */

function showMessage(boxId, text, type) {
    let box = document.getElementById(boxId);
    box.innerHTML = text;
    box.className = "message " + type;
    box.style.display = "block";
}

function hideMessage(boxId) {
    document.getElementById(boxId).style.display = "none";
}

// Jate onno page showToast(...) call korle-o kaj kore
function showToast(message, type) {
    if (type === undefined) {
        type = "success";
    }

    if (document.getElementById("pageMessage") == null) {
        alert(message);
    } else {
        showMessage("pageMessage", message, type);
    }
}


/* ---------- 2. Field-er pashe error dekhano ----------
   Je field check kora hoy tar pashe <span class="error" id="fieldIdError"></span> ache.
   Amra innerHTML diye error likhi ar element.style diye
   field-er border lal kori. */

function showError(fieldId, message) {
    let errorBox = document.getElementById(fieldId + "Error");
    if (errorBox != null) {
        errorBox.innerHTML = message;
    }

    let field = document.getElementById(fieldId);
    if (field != null) {
        field.style.border = "2px solid red";
    }
}

function clearError(fieldId) {
    let errorBox = document.getElementById(fieldId + "Error");
    if (errorBox != null) {
        errorBox.innerHTML = "";
    }

    let field = document.getElementById(fieldId);
    if (field != null) {
        field.style.border = "";   // "" dile border CSS file-er moto hoye jay
    }
}

// Onek field-er error ekshathe muchhe dey; fieldIds ekta array
function clearErrors(fieldIds) {
    for (let i = 0; i < fieldIds.length; i++) {
        clearError(fieldIds[i]);
    }
}


/* ---------- 3. List-er jonno chhoto helper ---------- */

// "text"-er bhitore "keyword" thakle true dey (boro/chhoto hater lekha dhorbe na)
function containsText(text, keyword) {
    return String(text).toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
}

// Je object-er id mile jay tar position (index) dey, na paile -1
function findIndexById(list, id) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

// "index"-er element chhara notun ekta array dey
function removeAt(list, index) {
    return list.slice(0, index).concat(list.slice(index + 1));
}


/* ---------- 4. Auto Tray Collection ----------
   Delivered order-er 10 minute pare "Eating Finished" alert chole ashe.
   Page load hole ekbar-i chole. */

function checkAutoTrayCollection() {
    let orders = DB.get(KEYS.FOOD);
    let now = Number(new Date());
    let tenMinutes = 10 * 60 * 1000;

    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        let placedAt = order.createdAt;
        if (!placedAt) {
            placedAt = parseTime(order.time);
        }

        if (order.status === "Delivered" && !order.trayStatus && placedAt && (now - placedAt >= tenMinutes)) {
            order.trayStatus = "Eating Finished";
        }
    }

    DB.set(KEYS.FOOD, orders);
}


/* ---------- 5. Profile-er nam ebong logout ---------- */

function showProfileName() {
    let user = memoryStore[KEYS.USER];
    let nameBox = document.getElementById("profile-name");

    if (user != null && user.name && nameBox != null) {
        nameBox.innerHTML = user.name;
    }
}

// Logout link eta call kore, tarpor login.html-e jay
function logout() {
    memoryStore[KEYS.USER] = undefined;
}


// Page load hole ekbar chole (script gulo <body>-r sheshe ache)
checkAutoTrayCollection();
showProfileName();
