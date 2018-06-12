// ==UserScript==
// @name       HF EasyRep
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description Makes giving away reps super easy
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/reputation.php?uid=*
// @match      *://hackforums.net/showthread.php?tid=*
// @copyright  2016+
// @updateURL
// @downloadURL
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.1: Public Release
// version 1.0.0: Beta Release
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
//
// ------------------------------ Script ------------------------------
// Ripped from HFX
if ($(".posts").length > 0){
    $(".post").each(function (index) {
        // Post ID Selector
        var postIDSelector = $(this).find(".post_head > .float_right > strong > a:eq(0)");
        // If post collapsed
        if (!$(this).find(".author_information > strong > span > a").attr('href') > 0)
            return true;
        var usernameUID = $(this).find(".author_information > strong > span > a").attr('href').replace(/\D/g, '');
        var usernameName = $(this).find(".author_information > strong > span > a").text();
        //
        const potLinkConst = "search.php?action=finduser&uid=";
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
    console.log("test");
    $(".postbit_report").each(function (index) {
        var usernameUID = $(this).parent().next().attr("href").replace(/\D/g, '');
        console.log(usernameUID);
        var usernameName = $(this).parent().next().children().text();
        console.log(usernameName);
        $(this).prepend($("<a>").append("<span>").attr({
            "title": "Quick Rep " + usernameName,
            "onclick": "MyBB.reputation("+usernameUID+"); return false;",
            "href":"javascript:void(0);"})
                        .text("Quick Rep")
                        .css({ "cursor": "pointer", "margin-right": "5px" })
                        .addClass(""));
    });
}