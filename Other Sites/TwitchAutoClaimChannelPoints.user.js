// ==UserScript==
// @name         Twitch Auto Claim Channel Points
// @namespace    xadamxk
// @version      0.0.1
// @description  Automatically claims channel points.
// @require https://code.jquery.com/jquery-3.1.1.js
// @author       Adam K
// @match        *://www.twitch.tv/*
// @match        *://twitch.tv/*
// ==/UserScript==
// === Settings ===
const interval = 30000;

setInterval(checkForClaimButton, interval);

function checkForClaimButton(){
    console.log("checking for claim button...");
    const claimButton = $(".tw-button.tw-button--success.tw-interactive");
    if(claimButton.length > 0){
        claimButton.click();
    }
}