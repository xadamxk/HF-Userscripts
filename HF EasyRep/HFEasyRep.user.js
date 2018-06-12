// ==UserScript==
// @name       HF EasyRep
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.2
// @description Makes giving away reps super easy
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/reputation.php?uid=*
// @match      *://hackforums.net/showthread.php?tid=*
// @copyright  2018+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20EasyRep/HFEasyRep.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20EasyRep/HFEasyRep.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.1: Public Release
// version 1.0.0: Beta Release
// ------------------------------ Dev Notes -----------------------------
// If you like this script, test it out on me :)
// ------------------------------ SETTINGS ------------------------------
// None atm
// ------------------------------ Script ------------------------------
// Ripped from HFX
if ($("#posts").length > 0){
    $(".post").each(function (index) {
        // If post collapsed
        if (!$(this).find(".author_information > strong > span > a").attr('href') > 0)
            return true;
        var usernameUID = $(this).find(".author_information > strong > span > a").attr('href').replace(/\D/g, '');
        var usernameName = $(this).find(".author_information > strong > span > a").text();
        // Append button
        $(this).find(".author_buttons").append($("<a>").attr({
            "title": "Quick Rep " + usernameName,
            "onclick": "MyBB.reputation("+usernameUID+"); return false;",
            "href":"javascript:void(0);"})
                                               .text("Quick Rep")
                                               .css({ "cursor": "pointer", "margin-right": "5px" })
                                               .addClass("bitButton"));
    });
} else if ($(".postbit_report").length > 0){
    $(".postbit_report").each(function (index) {
        var usernameUID = $(this).parent().next().attr("href").replace(/\D/g, '');
        var usernameName = $(this).parent().next().children().text();
        $(this).prepend($("<a>").append("<span>").attr({
            "title": "Quick Rep " + usernameName,
            "onclick": "MyBB.reputation("+usernameUID+"); return false;",
            "href":"javascript:void(0);"})
                        .text("Quick Rep")
                        .css({ "cursor": "pointer", "margin-right": "5px" })
                        .addClass(""));
    });
}