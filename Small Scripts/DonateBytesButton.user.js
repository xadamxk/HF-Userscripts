// ==UserScript==
// @name       HF DonateBytes
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description Makes donating bytes super easy
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/showthread.php?tid=*
// @copyright  2018+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Beta Release
// ------------------------------ Dev Notes -----------------------------
// If you like this script, test it out on me :)
// ------------------------------ SETTINGS ------------------------------
// ------------------------------ Script ------------------------------
// Ripped from HFX :)
if ($("#posts").length > 0){
    $(".post").each(function (index) {
        // If post collapsed
        if (!$(this).find(".author_information > strong > span > a").attr('href') > 0)
            return true;
        var usernameUID = $(this).find(".author_information > strong > span > a").attr('href').replace(/\D/g, '');
        var usernameName = $(this).find(".author_information > strong > span > a").text();
        var existingBytesJS = $(this).find("div:contains(Bytes:).author_label").parent().find(".author_value > a").attr("onclick");

        // Append button
        $(this).find(".author_buttons").append($("<a>").attr({
            "title": "Donate bytes to " + usernameName,
            "onclick": existingBytesJS,
            "href":"javascript:void(0);"})
                                               .text("Donate")
                                               .css({ "cursor": "pointer", "margin-right": "5px" })
                                               .addClass("bitButton")
                                               .attr("id","donate"+index));
    });
}