// ==UserScript==
// @name       OrangeYouGladYouArentAHamburger?
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description  Adds hamburger links to HF header.
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/jquery.sticky.js
// @match      *://hackforums.net*
// @match      *://hackforums.net/*
// @copyright  2017+
// @updateURL
// @downloadURL
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Beta Release
// ------------------------------ Dev Notes -----------------------------
/*
  _____   ___  ____   ___        ____   __ __  ___      ___  _____
 / ___/  /  _]|    \ |   \      |    \ |  |  ||   \    /  _]/ ___/
(   \_  /  [_ |  _  ||    \     |  _  ||  |  ||    \  /  [_(   \_
 \__  ||    _]|  |  ||  D  |    |  |  ||  |  ||  D  ||    _]\__  |
 /  \ ||   [_ |  |  ||     |    |  |  ||  :  ||     ||   [_ /  \ |
 \    ||     ||  |  ||     |    |  |  ||     ||     ||     |\    |
  \___||_____||__|__||_____|    |__|__| \__,_||_____||_____| \___|
*/
// ------------------------------ SETTINGS ------------------------------
// Filter List
var settings = {
    "×" : false,
    "Home" : true,
    "Search" : true,
    "User CP" : true,
    "Memberlist" : true,
    "Extras" : true,
    "Upgrade" : true,
    "Awards" : true,
    "Site Staff" : true,
    "Statistics" : true,
    "Help" : true,
    "Contact" : true,
    "Open Buddy List" : true,
    "Log Out" : false
};
// ------------------------------ Page Load -----------------------------

// Get Hamburger String+Link
var headerMenu = $(".panel_links:eq(0)");

// Do work bby
$("#mySidenav > a").each(function( index1 ) {
    for(var i = 0; i < Object.keys(settings).length; i++) {
        // Filter based on settings
        if(Object.keys(settings)[i] == $(this).text() && Object.values(settings)[i] === true){
            // Append to Header
            headerMenu.append($("<li>").append($(this)));
        }
    } // End Filter Loop
}); // End Append Loop

// Fix Background image css
$("#header ul.menu li a").css("background-image","url()");