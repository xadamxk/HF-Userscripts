// ==UserScript==
// @name         HF Report Queue Bytes Donation
// @author       xadamxk
// @namespace    https://github.com/xadamxk/HF-Scripts
// @version      1.0.0
// @description  Adds option to donate bytes to reported posts.
// @require      https://code.jquery.com/jquery-3.1.1.js
// @require      https://cdn.jsdelivr.net/npm/toastify-js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @match        *://hackforums.net/modcp.php?action=reports
// @copyright    2020+
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Initial Release
// ------------------------------ Dev Notes -----------------------------
// Tested using Chrome
// ------------------------------ SETTINGS ------------------------------
const defaultBytes = 1; // Byte amount
const defaultMessage = "Thank you for the report. 5 Bytes have been rewarded to you. Keep up the good work!"; // Bytes donation message
const notification_timeout = 3000; // milliseconds
// ------------------------------ ON PAGE LOAD ------------------------------
// Import toastify css
const my_css = GM_getResourceText("TOASTIFY_CSS");
GM_addStyle(my_css);

let reportTableRows = $("table:eq(3) > tbody > tr");
reportTableRows.each(function (index) {
    if (index == 0) {
        $(this).find(".thead").attr("colspan", 6);
    } else if (index == (reportTableRows.length - 1) || index == 1) {
        // Do nothing on the second and last row
    } else {
        let uid = $(this).find("td:eq(0)").find("a:eq(1)").attr("href").split("&uid=")[1];
        $(this).append(
            $("<td>").addClass("trow1").attr("align", "center").append(
                $("<a>").text("Donate").attr("href", "javascript:void(0)").on("click", function () {
                    giveBytes(uid, defaultBytes, defaultMessage)
                })));
    }
});

function giveBytes(uid, amount, reason = "") {
    $.ajax({
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        url: "/myps.php",
        data: {
            "my_post_key": getMyPostKey(),
            "action": "do_send",
            "uid": uid,
            "givemyps": amount,
            "givereason": reason,
            "submit": "Donate"
        },
        success: function (data) {
            console.log(data);
            Toastify({
                text: `Bytes successfully sent to UID: ${uid}`,
                duration: notification_timeout
            }).showToast();
        }
    });
}

// Unsure if this works for firefox?
function getMyPostKey() {
    return unsafeWindow.my_post_key;
}