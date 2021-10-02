// ==UserScript==
// @name        HF Octoberfest 2021 Calculations
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Userscripts
// @version     0.0.1
// @description Calculates estimated posts, avg daily posts needed, and more for the 2021 Octoberfest event.
// @match       ://hackforums.net/awardgoals.php
// @copyright   2021+
// @updateURL
// @downloadURL
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v1.0.0: Update and Download URLs
// v0.0.1: Initial commit
// ------------------------------ Dev Notes -----------------------------
// What did Omni get when he dropped his pumpkin?
// ...
// ...
// Squash
// ------------------------------ SETTINGS ------------------------------
const awardThreshold = 500;
const dateCutoff = 1635753599 * 1000; // Oct 31st 11PM PST
// ------------------------------ SCRIPT ------------------------------
// Check if today is past cutoff point
const cutoff = new Date(dateCutoff);
const now = new Date();
if (now > cutoff) return;

// Get octoberfest awardgoal card, then progress
const octoberfestparentElement = $("i[title='Octoberfest 2021']").parent().parent();
const octoberfestElement = octoberfestparentElement.length > 0 ? octoberfestparentElement[0] : null;
const progress = octoberfestElement ? $(octoberfestElement).find(".percentage").text().replace('%', '') : 0;

const diffInDays = (date1, date2) => {
    if (date1 instanceof Date && !isNaN(date1) && date2 instanceof Date && !isNaN(date2)){
        return Math.floor((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24));
    }
    return null;
}

// Calculate days, posts, and differences
const daysRemaining = diffInDays(now, cutoff);
const estimatedPosts = Math.floor(awardThreshold * (progress / 100));
const remainingPosts = awardThreshold - estimatedPosts;

// Append results to card
$(octoberfestparentElement).append($("<div>").text(`Days Left: ${daysRemaining}`));
$(octoberfestparentElement).append($("<div>").text(`Posts Remaining: ~${remainingPosts}`));
$(octoberfestparentElement).append($("<div>").text(`Avg Posts/Day: ${(remainingPosts / daysRemaining).toFixed(2)}`));