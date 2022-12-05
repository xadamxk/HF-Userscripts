// ==UserScript==
// @name        HF Christmas
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Scripts
// @version     1.0.0
// @description Adds christmas lights to posts
// @require     https://code.jquery.com/jquery-3.1.1.js
// @require     https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/snowfall.jquery.js
// @match       *://hackforums.net/*
// @copyright   2022+
// @updateURL   https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Christmas/HF%20Christmas.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Christmas/HF%20Christmas.user.js
// @iconURL     https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 1.0.0: Added UpdateURL to script meta tag
// v 0.0.1: Initial release
// ------------------------------ Dev Notes -----------------------------
// merry x-mas ya filthy animals
// ------------------------------ SETTINGS ------------------------------
const enableChristmasLightsOnPosts = true;
const enableSnow = true;
// ------------------------------- SCRIPT -------------------------------

if (enableChristmasLightsOnPosts) {
    $(".post").each((index, post) => {
        $(post).css({ "padding-top": "50px", "background-image": "url(https://i.imgur.com/ml35Tvu.gif)", "background-repeat": "repeat-x" })
    });
}

if (enableSnow) {
    $("#container").snowfall({ flakeCount: 400, maxSpeed: 5, round: true, minSize: 2, maxSize: 3 });
}