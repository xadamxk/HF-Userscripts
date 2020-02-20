// ==UserScript==
// @name       GOL Scrapper
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.1
// @description Copies GOL data to your clipboard
// @require     https://code.jquery.com/jquery-3.1.1.js
// @match      *://gol.gg/champion/list/*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Other%20Sites/GOLScrapper.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/Other%20Sites/GOLScrapper.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// @grant    GM_setClipboard
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 1.0.0: Initial release
// v 1.0.1: Update and download links
// ------------------------------ Dev Notes -----------------------------
// I put notes here - nothing yet!
// ------------------------------ SETTINGS ------------------------------
// ------------------------------  Script  ------------------------------

const data = getData();
const output = formatOutput(data);
if (output.length > 0) {
    GM_setClipboard(output);
}

function getData() {
    var table = $(".playerslist")[0];
    var headers = [];
    var data = [];

    $(table).find("tr").each(function (index, tableRow) {
        if (index < 1) {
            let tempData = [];
            $(tableRow).find("th").each(function (index, tableHeader) {
                tempData.push($(tableHeader).text().trim())
            })
            data.push(tempData)
        } else {
            let tempData = [];
            $(tableRow).find("td").each(function (index, tableData) {
                let dataValue = $(tableData).text().trim();
                let isNumber = isNaN(dataValue) ? false : true;
                tempData.push(
                    isNumber ?
                        parseInt(dataValue) :
                        dataValue
                )
                // tempData.push(dataValue)
            })
            data.push(tempData)
        }
    });
    console.log(data);
    return data;
}

function formatOutput(data) {
    var outputString = "";
    data.forEach((row, index) => {
        row.forEach((item, index) => {
            outputString += item;
            if (index < row.length - 1) {
                outputString += ","
            }
        });
        outputString += "\n";
    });
    console.log(outputString);
    return outputString;
}