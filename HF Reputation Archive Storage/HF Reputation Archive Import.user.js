// ==UserScript==
// @name        HF Reputation Archive Import
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Userscripts
// @version     0.0.1
// @description Export your Reputation Archive to xadamxk via PM
// @match       https://hackforums.net/private.php?action=read&pmid=*
// @copyright   2022+
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v0.0.1: Initial commit
// ------------------------------ Dev Notes -----------------------------
// Add validation for timesent?
// ------------------------------ SETTINGS ------------------------------
const exportPMTitle = "ReputationArchiveExport";
// ------------------------------ SCRIPT ------------------------------
const table = getPMTableByTitle();
if (!table) { return };

const quoteElement = $(table).find(".mycode_quote")[0];
const isValid = $(quoteElement).find("cite:first").text().includes(`${exportPMTitle} Wrote:`)
if (!isValid) { return };

const base64EncodedPayloadOutput = $(quoteElement).contents().filter((_, element) => element.nodeType == 3).text().trim().replaceAll('"', "")
const decodedPayloadOutput = atob(base64EncodedPayloadOutput);
const payloadOutput = JSON.parse(decodedPayloadOutput);
const output = `"${payloadOutput.uid}": ${payloadOutput.total},`;

prompt("Output:", output);

function getPMTableByTitle() {
    const tables = document.getElementById("content").querySelectorAll("table.tborder") || [];
    return Array.from(tables).find(table => {
        const tableHeader = table.querySelector("tbody > tr > td > strong").innerText;
        return tableHeader.includes(exportPMTitle);
    });
};