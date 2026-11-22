/* COMMON CUSTOMER FUNCTIONS - 24-57252-2 (Samira) */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Common JavaScript Loaded!");

    const profileName = document.querySelectorAll(".profile span");

    profileName.forEach(function (item) {

        if (item.textContent.trim() === "Rahim Ahmed") {
            item.textContent = "Rahim Ahmed";
        }

    });

});