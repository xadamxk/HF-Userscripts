// ==UserScript==
// @name         Liquidpedia Scrapper
// @namespace    xadamxk
// @version      0.0.1
// @description  Scraps player information on team pages
// @require https://code.jquery.com/jquery-3.1.1.js
// @author       Adam K
// @match        *://liquipedia.net/*
// @grant    GM_setClipboard
// ==/UserScript==
// === Settings ===
const ID_TEXT = "ID";
const NAME_TEXT = "Name";
const POSITION_TEXT = "Position";
const JOINDATE_TEXT = "Join";
const TEAM_TEXT = "Team";

const players = getPlayers();
const output = formatPlayersOutput(players);
if (output.length > 0) {
    GM_setClipboard(output);
}

function formatPlayersOutput(players) {
    var outputString = "";
    players.forEach((player, index) => {
        outputString += [player[TEAM_TEXT], player[NAME_TEXT], player[ID_TEXT], player[JOINDATE_TEXT]].join(",") + "\n";
    });
    return outputString;
}

function getPlayers() {
    var playerEntries = [];
    $(".roster-card").each(function (index, tableElement) {
        // Team name based on page header
        const teamName = $("#firstHeading").text().trim();
        const headerRow = $(tableElement).find(".HeaderRow")[0];
        // Table Headers
        const indexId = getIndexByHeaderText(headerRow, ID_TEXT);
        const indexName = getIndexByHeaderText(headerRow, NAME_TEXT);
        const indexPosition = getIndexByHeaderText(headerRow, POSITION_TEXT);
        const indexJoinDate = getIndexByHeaderText(headerRow, JOINDATE_TEXT);
        // Loop through rows
        $(tableElement).find("tr").each(function (index2, rowElement) {
            var valuePosition = $(rowElement).find("td:eq(" + indexPosition + ")").text();
            if (valuePosition !== null && valuePosition.length > 0 && isNumeric(valuePosition)) {
                const valueId = $(rowElement).find("td:eq(" + indexId + ")").text().trim();
                const valueName = $(rowElement).find("td:eq(" + indexName + ")").text().replace("(", "").replace(")", "").trim();
                const valueJoinDate = $(rowElement).find("td:eq(" + indexJoinDate + ")").find(".Date").text().split("[")[0].trim();
                const playerEntry = {
                    [JOINDATE_TEXT]: valueJoinDate,
                    [ID_TEXT]: valueId,
                    [NAME_TEXT]: valueName,
                    [TEAM_TEXT]: teamName
                };
                playerEntries.push(playerEntry);
            }
        });
    });
    return playerEntries;
}

function getIndexByHeaderText(tableRow, headerText) {
    var desiredIndex = null;
    $(tableRow).find("th").each(function (index, row) {
        if ($(row).text().includes(headerText)) {
            desiredIndex = index;
        }
    });
    return desiredIndex;
}

function isNumeric(num) {
    return !isNaN(num)
}