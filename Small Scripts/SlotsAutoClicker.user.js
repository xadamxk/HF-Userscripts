// ==UserScript==
// @name       HF Slot AutoClicker
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.1.0
// @description Autoclick the slots button every second
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/slots.php
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Small%20Scripts/SlotsAutoClicker.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/Small%20Scripts/SlotsAutoClicker.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// @copyright  2018+
// ==/UserScript==
const useCalcByteLimit = true;
var byteLimit = 0; // Change this to what you want the script to stop at (also, make useCalcByteLimit = false)

/* DO NOT EDIT BELOW THIS LINE*/
const secTimer = 3;
const cancelLoop = false;

var currentBytes = parseInt($("#credits").text()); // Gets your current byte count
const origByteCount = currentBytes;
const origLifetimeWinnings = parseInt($("#lifetimeWinnings").text()); // lifetimeWinnings
//var currentLifetimeWinnings = 0;

if (useCalcByteLimit) {
    switch(origByteCount) {
        case origByteCount <= 100:
            byteLimit = origByteCount * .6;
            break;
        case origByteCount > 100 && origByteCount <= 1000:
            byteLimit = origByteCount * .5;
            break;
        default:
            byteLimit = origByteCount * .75;
    }
}

console.clear();
var iteration = 0;
(function loop() {
    if (cancelLoop){
        // Stop spinning
    } else {
        setTimeout(function () {
            if (parseInt($("#credits").text()) > byteLimit){
                iteration = iteration+1;
                $("#spinButton").click();
                console.clear();
                console.group("HF Slot AutoClicker:");
                console.info("Iteration: " + iteration);
                if (useCalcByteLimit){
                    console.info("Calculated byte limit: "+byteLimit);
                } else {
                    console.info("Byte limit: "+byteLimit);
                }
                calcSessionWinningsOutput();
                calcSessionTotalOutput();
                console.groupEnd();
            } else {
                currentBytes = parseInt($("#credits").text());
                console.group("HF Slot AutoClicker:");
                if (useCalcByteLimit){
                    console.error("Actual bytes (" + currentBytes + ") dropped below calculated byte limit of " + byteLimit);
                } else {
                    console.error("Actual bytes (" + currentBytes + ") dropped below byte limit of " + byteLimit);
                }
                console.log("Refresh the page to lower your byte limit and continue spinning!");
                console.groupEnd();
                cancelLoop = true;
            }
            loop()
        }, secTimer * 1000); // Loop continuously for x seconds
    }
}());

function calcSessionWinningsOutput(){
    console.log("Session Winnings: " + calcSessionWinnings());
}

function calcSessionWinnings(){
    return parseInt($("#lifetimeWinnings").text()) - origLifetimeWinnings;
}

function calcSessionTotalOutput(){
    $('title').text("Rate: " + calcSessionTotal() + " Bet: " + $('#bet').text() + " Credits: " + $('#credits').text());
    console.log("Session Total: " + calcSessionTotal());
}

function calcSessionTotal(){
    return parseInt($("#credits").text()) - origByteCount;
}
