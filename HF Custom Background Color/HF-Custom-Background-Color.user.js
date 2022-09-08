// ==UserScript==
// @name        HF Custom Background Color
// @author      xadamxk
// @namespace   https://github.com/xadamxk/HF-Scripts
// @version     1.0.0
// @description Makes donating bytes super easy
// @require     https://code.jquery.com/jquery-3.1.1.js
// @match       *://hackforums.net/*
// @grant       GM_cookie
// @copyright   2022+
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Release
// ------------------------------ Dev Notes -----------------------------
// grumble grumble
// ------------------------------ SETTINGS ------------------------------
const backgroundCookieName = "mybb_bgcolor";
// ------------------------------ Script ------------------------------

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const currentBackgroundColor = getCookie(backgroundCookieName);

if (currentBackgroundColor) {
    document.body.style.backgroundColor = currentBackgroundColor;
}

const containerStyle = {
    display: "inline-block",
    position: "relative",
    overflow: "hidden",
    width: "20px",
    height: "16px",
    border: "2px solid #ccc",
    "border-radius": "4px",
    "vertical-align": "bottom"
};

const inputStyle = {
    position: "absolute",
    width: "30px",
    top: "-8px",
    right: "-5px",
    height: "30px",
    border: "none"
};

// Append color picker
$("#content > div > div:last-child")
    .append($("<div>").css(containerStyle)
        .append($("<input>").attr({ "type": "color", "id": "hfcbcInput", "value": currentBackgroundColor || "#FFFFFF" }).css(inputStyle)));

// Add event listeners
$(document).on("input", "#hfcbcInput", function () {
    // Update background color
    document.body.style.backgroundColor = $(this).val();
});
$(document).on("change", "#hfcbcInput", function () {
    // Storage background color via cookie
    const value = $(this).val();
    document.cookie = `${backgroundCookieName}=${value};domain=.hackforums.net`;
});