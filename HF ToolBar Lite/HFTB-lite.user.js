// ==UserScript==
// @name        HF Favorites Lite
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Userscripts
// @version     1.0.5
// @description Custom HF Header
// @match       https://hackforums.net/*
// @copyright   2022+
// @updateURL   https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20ToolBar%20Lite/HFTB-lite.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20ToolBar%20Lite/HFTB-lite.user.js
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v1.0.5: Fix storage of null favorite label
// v1.0.4: Tweaking storage logic to make mobile Safari happy >:|
// v1.0.3: Tweak favorites storage
// v1.0.2: Specify protocol for match
// v1.0.1: Switch from GM_getValue/GM_setValue to Cookies.get/Cookies.set
// v1.0.0: Update and Download URLs
// v0.0.1: Initial commit
// ------------------------------ Dev Notes -----------------------------
// TODO: Add setting cog back - ability to reorder favorites
//
// const settingsElement = `<span id="HFTBLiteSettings" style='float:right; padding:5px;'><i class="fa fa-cog" /></span>`;
// document.getElementById("HFTBLiteSettings").addEventListener("click", () => {
//     // Reorder settings
// });
// ------------------------------ SETTINGS ------------------------------
const favoritesKey = "HF_FAVORITES_LITE";
const debug = false;
// ------------------------------ SCRIPT ------------------------------
const currentUrl = window.location;
dPrint(`Current URL: ${currentUrl}`);

function dPrint(str) {
    return debug && console.log(str);
}

function createFavoriteElements(favorites) {
    if (!favorites) return [];
    return Object.entries(favorites).map((entry, index) => {
        const [url, text] = entry;
        const isActive = currentUrl == url;
        return `<a href='${url}' style='margin:0px 2px;'><button style='padding:5px; font-weight:600;${isActive ? 'background-color:#1d1d1d;' : ''}'>${text}</button></a>`;
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

function storeFavorites(favorites) {
    //Cookies.set(favoritesKey, favorites, { expires: 365, path: 'hackforums.net' });
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
}

function retrieveFavorites() {
    //return Cookies.get(favoritesKey);
    return localStorage.getItem(favoritesKey);
}

const cookie = retrieveFavorites() || "{}"; // Initial state
const favorites = JSON.parse(cookie) || {}; // If cookie becomes corrupt
dPrint(`Favorites: ${JSON.stringify(favorites)}`);

const isFavorite = currentUrl in favorites;
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
        if (!favoriteText) {
            return;
        }
        favorites[currentUrl] = favoriteText;
    }
    dPrint(`Updated favorites: ${JSON.stringify(favorites)}`);
    storeFavorites(favorites);
    // Reload page so UI doesn't have to be updated
    if (confirm("Reload page to update favorites?")) {
        location.reload();
    }
});
