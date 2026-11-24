/* =====================================================================
   traycollection.js  -  Tray collection-er alert ebong itihash
   ===================================================================== */

let alertBody = document.getElementById("tray-alert-body");
let historyBody = document.getElementById("tray-history-body");


/* ---------- Duto table-i dekhano ---------- */

function renderTrays() {

    let allOrders = DB.get(KEYS.FOOD);
    let alertsHTML = "";
    let alertCount = 0;
    let historyList = [];

    for (let i = 0; i < allOrders.length; i++) {
        let order = allOrders[i];

        if (order.trayStatus === "Eating Finished") {
            alertsHTML = alertsHTML +
                "<tr>" +
                "<td>" + escapeHTML(order.id) + "</td>" +
                "<td>" + escapeHTML(order.room) + "</td>" +
                "<td>" + escapeHTML(order.item) + "</td>" +
                "<td>" + escapeHTML(timeOnly(order.time)) + "</td>" +
                "<td><span class='status eating-finished'>Eating Finished</span></td>" +
                "<td><button type='button' class='collect-btn' onclick='collectTray(" + i + ")'>Collect Tray</button></td>" +
                "</tr>";
            alertCount = alertCount + 1;
        }

        if (order.trayStatus === "Tray Collected") {
            historyList.push(order);
        }
    }

    // Itihash collected time onujayi sajano, notun age (shohoj bubble sort)
    for (let a = 0; a < historyList.length; a++) {
        for (let b = 0; b < historyList.length - 1 - a; b++) {
            let timeA = parseTime(historyList[b].collectedTime);
            let timeB = parseTime(historyList[b + 1].collectedTime);
            if (timeA < timeB) {
                let temp = historyList[b];
                historyList[b] = historyList[b + 1];
                historyList[b + 1] = temp;
            }
        }
    }

    // Alert gulo
    if (alertCount === 0) {
        alertsHTML = "<tr><td colspan='6'>No trays waiting for collection.</td></tr>";
    }
    alertBody.innerHTML = alertsHTML;

    // Itihash
    let historyHTML = "";
    for (let h = 0; h < historyList.length; h++) {
        let historyOrder = historyList[h];
        historyHTML = historyHTML +
            "<tr>" +
            "<td>" + escapeHTML(historyOrder.id) + "</td>" +
            "<td>" + escapeHTML(historyOrder.room) + "</td>" +
            "<td>" + escapeHTML(historyOrder.item) + "</td>" +
            "<td>" + escapeHTML(timeOnly(historyOrder.collectedTime)) + "</td>" +
            "<td><span class='status tray-collected'>Tray Collected</span></td>" +
            "</tr>";
    }

    if (historyList.length === 0) {
        historyHTML = "<tr><td colspan='5'>No trays collected yet.</td></tr>";
    }
    historyBody.innerHTML = historyHTML;
}


/* ---------- Collect Tray button chapar por ---------- */

function collectTray(index) {
    let orders = DB.get(KEYS.FOOD);
    let order = orders[index];

    order.trayStatus = "Tray Collected";
    order.collectedTime = formatNow();
    DB.set(KEYS.FOOD, orders);

    showMessage("pageMessage", "Tray collected from room " + order.room + ".", "success");
    renderTrays();
}


renderTrays();
