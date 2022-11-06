// ==UserScript==
// @name        HF Reputation Archive Export
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Userscripts
// @version     0.0.2
// @description Export your Reputation Archive to xadamxk via PM
// @match       https://hackforums.net/reputation_archive.php
// @copyright   2022+
// @updateURL   https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Reputation%20Archive%20Storage/HF%20Reputation%20Archive%20Export.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Reputation%20Archive%20Storage/HF%20Reputation%20Archive%20Export.user.js
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v0.0.2: Release
// v0.0.1: Initial commit
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
const debug = false;
// ------------------------------ SCRIPT ------------------------------
$(".breadcrumb").after($("<div>").css({ "paddingBottom": "4px", "float": "right" }).append($("<a>").addClass("button").attr({ "href": "javascript:void(0);", "id": "shareReputationArchive" }).append($("<span>").text("Share Summary"))));

$("#shareReputationArchive").click(function () {
    if (confirm(`Are you sure you want to share your reputation archive summary with xadamxk?`)) {
        sendReport();
    }
});
// ------------------------------ FUNCTIONS ------------------------------
function getReputationSummary() {
    const totalReputation = $(".repbox").text().replace(",", "");
    const allTimeRow = $(".reputation > tbody > tr:eq(4)")[0];
    const allTimePositives = $(allTimeRow).find("td:eq(1)").text();
    const allTimeNeutrals = $(allTimeRow).find("td:eq(2)").text();
    const allTimeNegatives = $(allTimeRow).find("td:eq(3)").text();
    const userId = $(".welcome > strong > a").attr("href").replace("https://hackforums.net/member.php?action=profile&uid=", "");
    const username = $(".welcome > strong > a").text();
    return {
        "uid": parseInt(userId),
        "username": username,
        "total": parseInt(totalReputation),
        "positives": parseInt(allTimePositives),
        "neutrals": parseInt(allTimeNeutrals),
        "negatives": parseInt(allTimeNegatives)

    };
};

function sendReport() {
    const userPostKey = $("head").html().match(/my_post_key = "([a-f0-9]+)"/).pop() || null;
    const summary = getReputationSummary();
    try {
        $.ajax({
            type: "POST",
            url: "https://hackforums.net/private.php",
            data: {
                "my_post_key": userPostKey,
                "to": "xadamxk",
                "bcc": "",
                "subject": debug ? `ReputationArchiveExport_${new Date().getTime()}` : 'ReputationArchiveExport',
                "message": formatSummary(summary),
                "action": "do_send",
                "submit": "Send Message",
            },
            success: () => {
                sendNotification(`Successfully shared Reputation Archive Summary with xadamxk. Thank you :)`);
            }
        });
    } catch (err) {
        sendNotification(`Failed to share Reputation Archive Summary. Contact xadamxk for assistance.`);
    };
};

function sendNotification(message, isError = false) {
    const theme = isError ? 'jgrowl_error' : 'jgrowl_success';
    $.jGrowl(message, { theme: theme });
};

function formatSummary(summary) {
    const currentTimeInSeconds = new Date().getTime() / 1000;
    return `[quote="ReputationArchiveExport" dateline="${Math.floor(currentTimeInSeconds)}"]
    ${btoa(JSON.stringify(summary))}
    [/quote]`;
};

