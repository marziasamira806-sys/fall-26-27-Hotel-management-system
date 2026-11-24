/* =====================================================================
   dashboard.js  -  Staff Dashboard (dashboard_rafi.html)
   ===================================================================== */

function renderDashboard() {

    let orders = DB.get(KEYS.FOOD);
    let issues = DB.get(KEYS.ISSUES);
    let amenities = DB.get(KEYS.AMENITIES);

    // Je tray gulo collect korar opekkhay ache tader gona
    let trayAlertCount = 0;
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].trayStatus === "Eating Finished") {
            trayAlertCount = trayAlertCount + 1;
        }
    }

    // Upor-er shonkhyar card gulo
    document.getElementById("total-orders").innerHTML = orders.length;
    document.getElementById("total-issues").innerHTML = issues.length;
    document.getElementById("total-tray-alerts").innerHTML = trayAlertCount;
    document.getElementById("total-amenities").innerHTML = amenities.length;

    // Shomprotik kaj: tin-ta array theke ekta list banano
    let activities = [];

    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        let orderStamp = order.createdAt;
        if (!orderStamp) {
            orderStamp = parseTime(order.time);
        }
        activities.push({
            label: "Order",
            room: order.room,
            text: "Food order placed (" + order.item + ")",
            time: order.time,
            stamp: orderStamp
        });
    }

    for (let i = 0; i < issues.length; i++) {
        let issue = issues[i];
        let issueStamp = issue.createdAt;
        if (!issueStamp) {
            issueStamp = parseTime(issue.time);
        }
        activities.push({
            label: "Issue",
            room: issue.room,
            text: "Issue reported (" + issue.description + ")",
            time: issue.time,
            stamp: issueStamp
        });
    }

    for (let i = 0; i < amenities.length; i++) {
        let request = amenities[i];
        let requestStamp = request.createdAt;
        if (!requestStamp) {
            requestStamp = parseTime(request.time);
        }
        activities.push({
            label: "Request",
            room: request.room,
            text: "Amenities requested (" + request.item + ")",
            time: request.time,
            stamp: requestStamp
        });
    }

    // Notun age rakha (shohoj bubble sort)
    for (let x = 0; x < activities.length; x++) {
        for (let y = 0; y < activities.length - 1 - x; y++) {
            if (activities[y].stamp < activities[y + 1].stamp) {
                let temp = activities[y];
                activities[y] = activities[y + 1];
                activities[y + 1] = temp;
            }
        }
    }

    // Shudhu shobcheye notun 5-ta rakha
    let topActivities = activities.slice(0, 5);

    if (topActivities.length === 0) {
        document.getElementById("activity-list").innerHTML =
            "<div class='activity-item'>" +
            "<span class='activity-description'>No activity yet. New orders, issues and requests will show up here.</span>" +
            "</div>";
        return;
    }

    let activitiesHTML = "";
    for (let t = 0; t < topActivities.length; t++) {
        let activity = topActivities[t];
        activitiesHTML = activitiesHTML +
            "<div class='activity-item'>" +
            "<span class='activity-icon'>" + activity.label + "</span>" +
            "<span class='room-number'>Room " + escapeHTML(activity.room) + "</span>" +
            "<span class='activity-description'>- " + escapeHTML(activity.text) + "</span>" +
            "<span class='activity-time'>" + escapeHTML(friendlyTime(activity.time)) + "</span>" +
            "</div>";
    }
    document.getElementById("activity-list").innerHTML = activitiesHTML;
}

renderDashboard();
