/* =====================================================================
   storage.js  -  Shob page-e use hoy emon data ebong helper function
   ---------------------------------------------------------------------
   Data shudhu browser-er memory-te thake (ekhono kono database nai).
   Page reload korle ba onno page-e gele abar shuru hoy,
   ei file-er nichey deowa demo data theke.
   ===================================================================== */

const KEYS = {
    FOOD: "foodOrders",
    ISSUES: "roomIssues",
    AMENITIES: "amenityRequests",
    USER: "currentUser"            // { name: "...", role: "..." }
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


/* ---------- Data shudhu memory-te thake ---------- */
let memoryStore = {};


/* ---------- Chhoto database helper ---------- */
let DB = {

    // List porhe (kichu save na thakle [] dey)
    get: function (key) {
        if (memoryStore[key] === undefined) {
            return [];
        }
        return memoryStore[key];
    },

    // List save kore
    set: function (key, data) {
        memoryStore[key] = data;
    },

    // Porer ID, jemon FO004, IR004, AR004
    nextId: function (prefix, list) {
        let biggest = 0;
        for (let i = 0; i < list.length; i++) {
            let numberText = String(list[i].id).slice(prefix.length);   // "FO101" -> "101"
            if (Number(numberText) > biggest) {
                biggest = Number(numberText);
            }
        }

        // Number 3 digit na hoa porjonto shamne 0 boshay: 4 -> "004"
        let newNumber = String(biggest + 1);
        while (newNumber.length < 3) {
            newNumber = "0" + newNumber;
        }
        return prefix + newNumber;
    },

    // Demo data shudhu prothom bar save kore (memory-te kichu na thakle)
    init: function (key, seed) {
        if (memoryStore[key] === undefined) {
            DB.set(key, seed);
        }
    }
};


/* ---------- Helper function gulo ---------- */

// 5 -> "05"
function pad(n) {
    let text = String(n);
    if (text.length < 2) {
        text = "0" + text;
    }
    return text;
}

// Ajker tarikh "YYYY-MM-DD" format-e
function todayString() {
    let now = new Date();
    return now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());
}

// Ekhon-er shomoy "2026-11-07 10:30 AM" format-e
function formatNow() {
    let d = new Date();
    let hours = d.getHours();
    let ampm = "AM";

    if (hours >= 12) {
        ampm = "PM";
    }
    hours = hours % 12;
    if (hours === 0) {
        hours = 12;
    }

    return todayString() + " " + pad(hours) + ":" + pad(d.getMinutes()) + " " + ampm;
}

// "2026-11-07 10:30 AM"  ->  ekta number (millisecond). Porte na parle 0 dey.
function parseTime(str) {
    if (!str) {
        return 0;
    }
    if (str.length < 19) {
        return 0;
    }

    let hours = Number(str.slice(11, 13)) % 12;          // 12 hoye jay 0
    let minutes = Number(str.slice(14, 16));
    if (str.slice(17, 19).toUpperCase() === "PM") {
        hours = hours + 12;
    }

    let midnight = Number(new Date(str.slice(0, 10) + "T00:00"));
    if (!(midnight > 0)) {
        return 0;
    }
    return midnight + (hours * 60 + minutes) * 60 * 1000;
}

// "2026-11-07 10:30 AM"  ->  "10:30 AM"
function timeOnly(str) {
    if (!str) {
        return "";
    }
    if (str.length < 19) {
        return str;
    }
    return str.slice(11);
}

// Ajker hole -> "10:30 AM", onno din hole -> "07 Nov, 10:30 AM"
function friendlyTime(str) {
    if (!str) {
        return "";
    }
    if (parseTime(str) === 0) {
        return str;
    }
    if (str.slice(0, 10) === todayString()) {
        return timeOnly(str);
    }
    return str.slice(8, 10) + " " + MONTHS[Number(str.slice(5, 7)) - 1] + ", " + timeOnly(str);
}

// User-er lekha text jate HTML hishebe na chole (innerHTML diye row banale shobshomoy eta lagao)
function escapeHTML(value) {
    let text = String(value);
    let result = "";

    for (let i = 0; i < text.length; i++) {
        let ch = text[i];

        if (ch === "&") {
            result = result + "&amp;";
        } else if (ch === "<") {
            result = result + "&lt;";
        } else if (ch === ">") {
            result = result + "&gt;";
        } else if (ch === "\"") {
            result = result + "&quot;";
        } else if (ch === "'") {
            result = result + "&#39;";
        } else {
            result = result + ch;
        }
    }

    return result;
}

// "Eating Finished" -> "eating-finished" (CSS-er .status class-er shathe mile)
function statusClass(status) {
    let text = String(status).toLowerCase();
    let result = "";

    for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
            result = result + "-";
        } else {
            result = result + text[i];
        }
    }

    return result;
}

// Room number jemon 305, 12, A101 (okkhor, shongkhya, hyphen, 1 theke 6 character)
function isValidRoom(value) {
    if (!value) {
        return false;
    }
    if (value.length < 1 || value.length > 6) {
        return false;
    }

    let allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
    for (let i = 0; i < value.length; i++) {
        if (allowed.indexOf(value[i]) === -1) {
            return false;
        }
    }

    return true;
}


/* ---------- Demo data ---------- */

function foodOrder(id, room, item, qty, status, time, trayStatus, collectedTime) {
    if (trayStatus === undefined) {
        trayStatus = "";
    }
    if (collectedTime === undefined) {
        collectedTime = "";
    }

    return {
        id: id,
        room: room,
        item: item,
        qty: qty,
        status: status,
        time: time,
        trayStatus: trayStatus,
        collectedTime: collectedTime,
        createdAt: parseTime(time)
    };
}

function simpleRow(fields) {
    fields.createdAt = parseTime(fields.time);
    return fields;
}

DB.init(KEYS.FOOD, [
    foodOrder("FO001", "305", "Chicken Burger", 2, "Pending",   "2026-11-07 10:30 AM"),
    foodOrder("FO002", "302", "Fried Rice",     1, "Preparing", "2026-11-07 09:15 AM"),
    foodOrder("FO003", "308", "Pasta",          2, "Delivered", "2026-11-06 08:20 PM"),

    // Tray alert (customer khawa shesh koreche)
    foodOrder("FO101", "305", "Chicken Burger", 1, "Delivered", "2026-11-07 10:00 AM", "Eating Finished"),
    foodOrder("FO102", "308", "Fried Rice",     1, "Delivered", "2026-11-07 10:15 AM", "Eating Finished"),

    // Tray collection-er itihash
    foodOrder("FO098", "302", "Pasta",    1, "Delivered", "2026-11-07 10:30 AM", "Tray Collected", "2026-11-07 11:05 AM"),
    foodOrder("FO099", "307", "Soup",     1, "Delivered", "2026-11-07 10:40 AM", "Tray Collected", "2026-11-07 11:10 AM"),
    foodOrder("FO100", "305", "Sandwich", 1, "Delivered", "2026-11-07 10:45 AM", "Tray Collected", "2026-11-07 11:20 AM")
]);

DB.init(KEYS.ISSUES, [
    simpleRow({ id: "IR001", room: "305", description: "AC not working",     status: "Solved",     time: "2026-11-07 08:45 AM" }),
    simpleRow({ id: "IR002", room: "308", description: "TV not working",     status: "Processing", time: "2026-11-07 09:30 AM" }),
    simpleRow({ id: "IR003", room: "301", description: "Water supply issue", status: "Solved",     time: "2026-11-06 07:50 PM" })
]);

DB.init(KEYS.AMENITIES, [
    simpleRow({ id: "AR001", room: "305", item: "Extra Towel",  time: "2026-11-07 09:10 AM" }),
    simpleRow({ id: "AR002", room: "301", item: "Water Bottle", time: "2026-11-07 09:20 AM" }),
    simpleRow({ id: "AR003", room: "308", item: "Soap",         time: "2026-11-07 10:05 AM" })
]);
