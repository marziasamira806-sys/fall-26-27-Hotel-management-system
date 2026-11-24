/* =====================================================================
   room_issue.js  -  Room issue report kora, dekha, status update, delete ebong search
   ===================================================================== */

let STATUSES = ["Pending", "Processing", "Solved"];

let issueForm = document.getElementById("issue-form");
let roomInput = document.getElementById("room-number");
let descInput = document.getElementById("problem-description");
let searchInput = document.getElementById("search-input");
let issueBody = document.getElementById("issue-table-body");

let issueFields = ["room-number", "problem-description"];


/* ---------- Table dekhano ---------- */

function renderIssues() {

    let query = searchInput.value.trim();
    let allIssues = DB.get(KEYS.ISSUES);
    let rowsHTML = "";
    let shown = 0;

    for (let i = 0; i < allIssues.length; i++) {
        let issue = allIssues[i];

        if (containsText(issue.room, query)) {

            // Ei row-er status drop-down, ekhon-er status select kora obosthay
            let optionsHTML = "";
            for (let s = 0; s < STATUSES.length; s++) {
                let selectedText = "";
                if (STATUSES[s] === issue.status) {
                    selectedText = " selected";
                }
                optionsHTML = optionsHTML + "<option value='" + STATUSES[s] + "'" + selectedText + ">" + STATUSES[s] + "</option>";
            }

            rowsHTML = rowsHTML +
                "<tr>" +
                "<td>" + escapeHTML(issue.id) + "</td>" +
                "<td>" + escapeHTML(issue.room) + "</td>" +
                "<td>" + escapeHTML(issue.description) + "</td>" +
                "<td><select id='status-" + i + "'>" + optionsHTML + "</select></td>" +
                "<td><button type='button' class='update-btn' onclick='updateIssue(" + i + ")'>Update</button></td>" +
                "<td><button type='button' class='delete-btn' onclick='deleteIssue(" + i + ")'>Delete</button></td>" +
                "</tr>";
            shown = shown + 1;
        }
    }

    if (shown === 0) {
        rowsHTML = "<tr><td colspan='6'>No issues found.</td></tr>";
    }
    issueBody.innerHTML = rowsHTML;
}


/* ---------- Notun issue report kora ---------- */

function saveIssue() {
    clearErrors(issueFields);

    let room = roomInput.value.trim();
    let description = descInput.value.trim();
    let isValid = true;

    if (isValidRoom(room) === false) {
        showError("room-number", "Enter a valid room number, for example 305.");
        isValid = false;
    }

    if (description.length < 3) {
        showError("problem-description", "Describe the problem in a few words.");
        isValid = false;
    }

    if (isValid === false) {
        return false;
    }

    let issues = DB.get(KEYS.ISSUES);

    let newIssue = {
        id: DB.nextId("IR", issues),
        room: room,
        description: description,
        status: "Pending",
        time: formatNow(),
        createdAt: Number(new Date())
    };

    issues.push(newIssue);
    DB.set(KEYS.ISSUES, issues);

    issueForm.reset();
    showMessage("pageMessage", "Issue " + newIssue.id + " reported.", "success");
    renderIssues();
    return false;       // false dile page reload hoy na
}


/* ---------- Update button: row-te je status choose kora hoyeche seta save kora ---------- */

function updateIssue(index) {
    let issues = DB.get(KEYS.ISSUES);
    let issue = issues[index];

    issue.status = document.getElementById("status-" + index).value;
    DB.set(KEYS.ISSUES, issues);

    showMessage("pageMessage", "Issue " + issue.id + " set to " + issue.status + ".", "success");
}


/* ---------- Delete button chapar por ---------- */

function deleteIssue(index) {
    let issues = DB.get(KEYS.ISSUES);
    let id = issues[index].id;

    DB.set(KEYS.ISSUES, removeAt(issues, index));

    showMessage("pageMessage", "Issue " + id + " deleted.", "success");
    renderIssues();
}


/* ---------- Search form ---------- */

function searchIssues() {
    renderIssues();
    return false;
}


renderIssues();
