// ==UserScript==
// @name       HF Slot AutoClicker
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description Autoclick the slots button every second
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/slots.php
// @copyright  2018+
// ==/UserScript==
var byteLimit = 1000;

var iteration = 0;
(function loop() {
    setTimeout(function () {
        if (parseInt($("#credits").text()) > byteLimit){
            iteration  = iteration+1;
            console.clear();
            console.log("Iteration " + iteration);
            $("#spinButton").click();
        } else {
            console.log("Credits too low");
        }
        loop()
    }, 2000);
}());