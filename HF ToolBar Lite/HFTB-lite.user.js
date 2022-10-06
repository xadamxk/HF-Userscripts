// ==UserScript==
// @name        HackForumsToolBar Lite
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Userscripts
// @version     1.0.3
// @description Custom HF Header
// @match       https://hackforums.net/*
// @copyright   2022+
// @updateUrl   https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20ToolBar%20Lite/HFTB-lite.user.js
// @downloadUrl https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20ToolBar%20Lite/HFTB-lite.user.js
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v1.0.2: Specify protocol for match
// v1.0.1: Switch from GM_getValue/GM_setValue to Cookies.get/Cookies.set
// v1.0.0: Update and Download URLs
// v0.0.1: Initial commit
// ------------------------------ Dev Notes -----------------------------
// Mobile friendly input
//
// const settingsElement = `<span id="HFTBLiteSettings" style='float:right; padding:5px;'><i class="fa fa-cog" /></span>`;
// document.getElementById("HFTBLiteSettings").addEventListener("click", () => {
//     //
//     window.alert("click!")
// });
//const favorites = GM_getValue(favoritesKey) || {};
//GM_setValue(favoritesKey, favorites)
// ------------------------------ SETTINGS ------------------------------
const favoritesKey = "HFTBLite_Favorites";
const debug = true;
// ------------------------------ SCRIPT ------------------------------
function dPrint(str) {
    return debug && console.log(str);
}

function createFavoriteElements(favorites) {
    if (!favorites) return [];
    return Object.entries(favorites).map((entry, index) => {
        const [url, text] = entry;
        return `<a href='${url}' style='margin:0px 2px'><button style='padding:5px; font-weight:600;'>${text}</button></a>`;
    })
}

function getBreadcrumbText() {
    const breadcrumb = document.getElementsByClassName("breadcrumb")[0];
    const currentPage = breadcrumb.querySelector("a:last-of-type").textContent;
    dPrint(`Current breadcrumb page: ${currentPage}`);
    return currentPage || '';
}

function promptForFavoriteText(currentPage) {
    return prompt("Favorite label for current page:", currentPage);
}

const cookie = Cookies.get(favoritesKey) || "{}";
const favorites = JSON.parse(cookie) || {};
console.log(typeof favorites)
const currentUrl = window.location;
const isFavorite = currentUrl in favorites;


dPrint(`Favorites: ${JSON.stringify(favorites)}`);
dPrint(`Current URL: ${currentUrl}`);
dPrint(`Is current page favorite: ${isFavorite}`);

const toggleText = isFavorite ? 'Remove' : 'Add';
const toggleFavoriteElement = `<a onclick="return false;" id="HFTBLiteToggle" style='float:right; margin:0px 2px;'><button style='padding:5px'>${toggleText}</button></a>`;
const favoriteElements = createFavoriteElements(favorites).join('');

// Append favorites row
$("#logo").append(`<div style='text-align:left; margin:auto'>${favoriteElements} ${toggleFavoriteElement}</div>`);


// Add/Remove button event listener
document.getElementById("HFTBLiteToggle").addEventListener("click", () => {
    if (isFavorite) {
        delete favorites[currentUrl];
    } else {
        // Default favorite text to current page per breadcrumb - allow override
        const favoriteText = promptForFavoriteText(getBreadcrumbText());
        favorites[currentUrl] = favoriteText;
    }
    dPrint(`Updated favorites: ${JSON.stringify(favorites)}`);
    Cookies.set(favoritesKey, favorites);
    // Reload page so UI doesn't have to be updated
    if (confirm("Reload page to update favorites?")) {
        location.reload();
    }
});
