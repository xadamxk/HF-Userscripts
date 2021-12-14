// ==UserScript==
// @name        Award Whore V4
// @author      Device (Prev. Snorlax, Hash G, xadamxk)
// @namespace   https://github.com/DeviceHF/HF-UserScripts/blob/main/award-whore-v4.user.js
// @version     1.1.0
// @description Allows members to add custom awards.
// @require     https://code.jquery.com/jquery-3.1.1.js
// @match       *://hackforums.net/showthread.php?tid=*
// @match       *://hackforums.net/myawards.php
// @copyright   2021+
// @updateURL   https://github.com/DeviceHF/HF-UserScripts/raw/main/award-whore-v4.user.js
// @downloadURL https://github.com/DeviceHF/HF-UserScripts/raw/main/award-whore-v4.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.1.0: Append stored awards to posts
// version 1.0.1: Update and Download URLs
// version 1.0.0: Initial Release
// ------------------------------ Dev Notes -----------------------------
// RIP Snorlax <3
// xadamxk was here
// ------------------------------ SETTINGS ------------------------------
const storageKey = 'AwardWhoreKey';
const addAwardStr = 'Add';
const removeAwardStr = 'Remove';
const awardWhoreTitle = 'Thanks for using Award Whore Userscript!';
const debug = false;
// ------------------------------ ON PAGE LOAD ------------------------------

const dPrint = (txt) => {
    return debug && console.log(txt)
}

dPrint(`Initial stored values: ${GM_getValue(storageKey)}`);

// Condition for page (awards or thread)
if (location.href.includes('/myawards.php')) {
    const awardsTableBody = $("strong:contains(\"My Awards\")") ? $("strong:contains(\"My Awards\")").parent().parent().parent() : null;
    if (!awardsTableBody) {
        return null;
    }
    // Fetch state
    const storedValues = GM_getValue(storageKey);
    // Parse stored values as an array
    let storedValuesArray = storedValues && storedValues.includes(",") && storedValues.split(',') || [null];
    dPrint(`Values parsed: ${storedValuesArray}`);
    // Fetch existing state
    $(awardsTableBody).find("tr").each((index, element) => {
        if (index == 0) {
            $(element).find("td").attr('colspan', 4);
        } else if (index == 1) {
            $(element).append($("<td>").addClass("tcat").append("<strong>Manage<strong>"));
        } else {
            // Get award id from award column
            let awardClasses = $(element).find(".award_sprite").attr("class");
            awardClasses = awardClasses.includes('award_sprite') ? awardClasses.replace('award_sprite', '').trim() : awardClasses;
            let isInMemory = false;
            if (storedValuesArray.includes(awardClasses)) {
                // Found in state - remove
                isInMemory = true;
            }
            // Append award id to add/remove button
            $(element).append($("<td>").addClass("trow2").append(`<button id='changeAwardWhore${index}' value='${awardClasses}' class='awardWhoreButton'>${isInMemory ? removeAwardStr : addAwardStr}</button>`));
        }
    });
} else if (location.href.includes('/showthread.php')) {
    // TODO: Parse state as an array (logic above)
    const storedValues = GM_getValue(storageKey);
    let storedValuesArray = storedValues.split(',') || [null];
    // TODO: Loop posts, find current user id in .welcome
    const userId = $(".welcome").find("a").attr("href").split("&uid=")[1];
    const users = document.querySelectorAll(".author_information");
    // TODO: If UIDs match, append custom awards
    users.forEach(user => {
        const awards = $(user).find(".post_myawards");
        if (user.innerHTML.includes(userId)) {
            storedValuesArray.slice(1).forEach(item => $(awards).append(`<i class='award_sprite ${item}' title='${awardWhoreTitle}'></i>`));
        }
    });
}

const filterStoredAwards = (awardsArray, awardToRemove) => {
    return awardsArray.filter(awardKey => {
        return awardKey !== awardToRemove
    })
}

$('.awardWhoreButton').click(function (event) {
    // Prevent default form redirect functionality
    event.preventDefault();
    // Get award key value from button
    const awardKey = $(this).val();
    // Fetch stored values
    const storedValues = GM_getValue(storageKey);
    // Parse stored values as an array
    let storedValuesArray = storedValues && storedValues.split(',') || [null];
    // Check if award is already added, if it does, remove it, if not, add it
    if (storedValuesArray.includes(awardKey)) {
        storedValuesArray = filterStoredAwards(storedValuesArray, awardKey);
        $(this).text(addAwardStr)
    } else {
        storedValuesArray.push(awardKey);
        $(this).text(removeAwardStr)
    }
    // Store result
    GM_setValue(storageKey, storedValuesArray.toString())
});