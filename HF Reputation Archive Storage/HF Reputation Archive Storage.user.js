// ==UserScript==
// @name        HF Reputation Archive Storage
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Userscripts
// @version     0.0.2
// @description Fetch all reputation archive pages and download as JSON.
// @match       https://hackforums.net/reputation_archive.php*
// @require     https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/FileSaver.js
// @copyright   2022+
// @updateURL   https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Reputation%20Archive%20Storage/HF%20Reputation%20Archive%20Storage.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Reputation%20Archive%20Storage/HF%20Reputation%20Archive%20Storage.user.js
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v0.0.2: Update require, update, and download urls
// v0.0.1: Initial commit
// ------------------------------ Dev Notes -----------------------------
// PLEASE use cautiously - do not make delay shorter than 5 seconds
// ------------------------------ SETTINGS ------------------------------
const delay = 5 * 1000; // 5 seconds
// ------------------------------ SCRIPT ------------------------------
const ReputationType = {
    "POSITIVE": "Positive",
    "NEUTRAL": "Neutral",
    "NEGATIVE": "Negative",
    "UNKNOWN": "Unknown"
};

const [total, positive, neutral, negative] = getReputationSummary();
const userId = $(".welcome > strong > a").attr("href").replace("https://hackforums.net/member.php?action=profile&uid=", "");
const username = $(".welcome > strong > a").text();

// Current page
const currentPage = parseInt($(".pagination_current").text());
const totalPages = parseInt($(".pagination_last").text()) || parseInt($(".pagination_page:last").text());
const rows = $("td.trow_reputation_positive, td.trow_reputation_neutral, td.trow_reputation_negative");
const parsedRows = parseRows(rows);
const formattedPage1Data = formatPageData(parsedRows, currentPage);

const output = {
    "userId": parseInt(userId),
    "username": username,
    "total": total,
    "positive": positive,
    "neutral": neutral,
    "negative": negative,
    "recieved": [formattedPage1Data]
};

$(".breadcrumb").after($("<div>").css({ "paddingBottom": "4px", "float": "right" }).append($("<a>").addClass("button").attr({ "href": "javascript:void(0);", "id": "downloadReputationArchive" }).append($("<span>").text("Download Archive"))));

$("#downloadReputationArchive").click(function () {
    if (confirm(`HF REPUTATION ARCHIVE STORAGE USERSCRIPT\n
    DO NOT LEAVE THE PAGE UNTIL INGESTION IS COMPLETE! \n
    Progress will be displayed along the way.\n\n
    ARE YOU SURE YOU WANT TO BULK INGEST ${totalPages} PAGES OF REPUTATION HISTORY?\n
    Press OK to begin ingesting archived reputation.`)) {
        sendNotification(currentPage, totalPages);
        getPageData(currentPage, totalPages);
    }
});



// ------------------------------ FUNCTIONS ------------------------------
async function getPageData(currentPage, totalPages) {
    for (let i = currentPage + 1; i <= totalPages; i++) {
        await new Promise(resolve => resolve(getReputationArchivePage(userId, i)));
    }
    // Save output
    saveAsJson(userId, output);
};

async function getReputationArchivePage(uid, pageNumber) {
    console.log(`Begin page: ${pageNumber}`);
    await sleep(delay);
    const response = await $.ajax(`https://hackforums.net/reputation_archive.php?uid=${uid}&page=${pageNumber}`);
    const repRows = $(response).find("td.trow_reputation_positive, td.trow_reputation_neutral, td.trow_reputation_negative");
    const parsedRows = parseRows(repRows);
    const formattedPageData = formatPageData(parsedRows, pageNumber);
    output.recieved.push(formattedPageData);
    console.log(`Data saved: ${pageNumber}`);
    sendNotification(pageNumber, totalPages);
    return;
};

function formatPageData(parsedRows, pageNumber) {
    return {
        "page": pageNumber,
        "data": parsedRows
    };
};

function parseRows(rows) {
    return rows.toArray().map((row, rowIndex) => {
        const date = $(row).find("span.smalltext").text().split('Last updated ')[1]
        const giverUID = $(row).find("> a").attr("href")?.replace("https://hackforums.net/member.php?action=profile&uid=", "") || null;
        const giverUsername = $(row).find("> a")?.text() || null;
        const giverTotalReputation = $(row).find("span.smalltext > a").text()
        const recievedRepElement = $(row).find("> strong");
        const recievedType = $(recievedRepElement).has("reputation_positive") ? ReputationType.POSITIVE
            : $(recievedRepElement).has("reputation_neutral") ? ReputationType.NEUTRAL
                : $(recievedRepElement).has("reputation_negative") ? ReputationType.NEGATIVE
                    : ReputationType.UNKNOWN;
        const reason = $(row).contents().toArray().filter((element, elementIndex) => {
            return element.nodeType == Node.TEXT_NODE
        }).slice(-1)[0].nodeValue.trim();
        return {
            "date": date,
            "uid": parseInt(giverUID),
            "username": giverUsername,
            "total": parseInt(giverTotalReputation),
            "type": recievedType,
            "reason": reason
        };
    });
};

function getReputationSummary() {
    const totalReputation = $(".repbox").text().replace(",", "");
    const allTimeRow = $(".reputation > tbody > tr:eq(4)")[0];
    const allTimePositives = $(allTimeRow).find("td:eq(1)").text();
    const allTimeNeutrals = $(allTimeRow).find("td:eq(2)").text();
    const allTimeNegatives = $(allTimeRow).find("td:eq(3)").text();
    return [parseInt(totalReputation), parseInt(allTimePositives), parseInt(allTimeNeutrals), parseInt(allTimeNegatives)];
};

function saveAsJson(userId, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
    });
    saveAs(blob, `${userId}_ReputationArchive.json`);
};

function sendNotification(pageNumber, totalPages) {
    $.jGrowl(`Progress ${pageNumber}/${totalPages} pages.`, { theme: 'jgrowl_error' });
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms))
}