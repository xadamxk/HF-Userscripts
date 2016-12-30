// ==UserScript==
// @name       Smart Quotes
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.1
// @description  Enhances quotes by adding style & highlights mentioned quotes
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/showthread.php?tid=*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Smart%20Quotes/Smart%20Quotes.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/Smart%20Quotes/Smart%20Quotes.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.1: Initial Release
// version 1.0.0: Beta Release
// ------------------------------ Dev Notes -----------------------------
// TODO: Add support for code and other blocks.
// Colors: http://ios7colors.com/
// ------------------------------ SETTINGS ------------------------------
// Quote Body Colors (Entire Quote Block)
var smartQuoteBackgroundColor = "#adb1a1"; // (Default: #adb1a1)
var smartQuoteTextColor = "#111111"; // (Default: #111111)
// Quote Header Colors (Header of Quote Block)
var smartQuoteHeaderTextColor = "#000000"; // (Default: #000000)
var smartQuoteHeaderBackgroundColor = "#b1d8bf"; // (Default: #b1d8bf)
// Notification Text - Username Quoted (Mention text at top of page)
var showsmartQuoteNotification = true; // (Default: true)
var smartQuoteNotificationColor = "#FF3B30"; // (Default: #FF3B30)
// Quote Header Colors - Username Quoted
var smartQuoteHeaderMatchBackgroundColor = "#bc3232"; // (Default: #bc3232)
var smartQuoteHeaderMatchTextColor = "#000000"; // (Default: #000000)
// Debug
var debug = false;
// ------------------------------ ON PAGE LOAD ------------------------------
var username = $("#panel strong a:eq(0)").text();
var usernameCount = 0;
// Blockquotes
if (debug){console.log("Number of Quotes: "+$("*").find("blockquote").length);}
if ($("*").find("blockquote").length > 0){
    // Each Block Quote
    $("*").find("blockquote").each(function() {
        $(this)
            .css("border-radius","5px")
            .css("border","1px solid black")
            .css("padding","1px 4px 1px 4px")
            .css("background-color",smartQuoteBackgroundColor)
            .css("color",smartQuoteTextColor);
    });
    // Each Block Quote Header
    $("*").find("blockquote cite").each(function() {
        // Standard QuoteCite Settings
        $(this)
            .css("border-bottom","1px solid #999")
            .css("padding","2px 8px 2px 8px");
        // Username Quoted
        if ($(this).text().includes(username)){
            usernameCount++;
            if (debug){console.log("Username found.");}
            $(this)
                .css("background-color",smartQuoteHeaderMatchBackgroundColor)
                .css("color",smartQuoteHeaderMatchTextColor);
        }
        // No username match
        else{
            $(this)
                .css("background-color",smartQuoteHeaderBackgroundColor)
                .css("color",smartQuoteHeaderTextColor);
        }
    });
}
if (showsmartQuoteNotification){
    if (usernameCount < 1)
        $(".pagination").append($("<strong>").text("No Mentions Found").css("color",smartQuoteNotificationColor));
    else
        $(".pagination").append($("<strong>").text("("+usernameCount+") Mentions").css("color",smartQuoteNotificationColor));
}