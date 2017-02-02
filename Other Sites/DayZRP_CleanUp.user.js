// ==UserScript==
// @name       DayZRP CleanUp
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.1
// @description Makes existing posts IPB friendly.
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://www.dayzrp.com/forums/topic/*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Other%20Sites/DayZRP_CleanUp.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/Other%20Sites/DayZRP_CleanUp.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.0.1: Added Update/Download URL
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// Images?
// ------------------------------ SETTINGS ------------------------------
// Run on page/post edit
if (window.location.href.includes("dayzrp.com/forums/topic/") && window.location.href.includes("?do=edit")){
    // append button
    $("#ipsTabs_tabs_form_form_tab_topic_mainTab_panel")
        .after($("<a>")
               .text("CLEAN")
               .addClass("ipsButton ipsButton_link ipsButton")
               .attr("id","cleanContent")
               .css("background-color","#990000"));
    // Event listener
    $( "#cleanContent" ).click(function() {
        cleanPost();
    });
}

// Remove remains of align
function cleanPost(){
    // Align
    $(".cke_wysiwyg_div").find($("p")).each(function( index ) {
        // Left Align
        if ($(this).text().includes("[align=left]"))
            $(this).text($(this).text().replace("[align=left]",""));
        // Center Align
        else if ($(this).text().includes("[align=center]"))
            $(this).text($(this).text().replace("[align=center]",""));
        // Right Align
        else if ($(this).text().includes("[align=right]"))
            $(this).text($(this).text().replace("[align=right]",""));
        // End Align
        if ($(this).text().includes("[/align]"))
            $(this).text($(this).text().replace("[/align]",""));
    });
    // Images
    $(".cke_wysiwyg_div").find($("a")).each(function( index ) {
        // beggining
        $(this).text($(this).text().replace("http://www.dayzrp.com/applications/core/interface/imageproxy/imageproxy.php?img=",""));
        // end
        var subStr = $(this).text();
        subStr = subStr.substring(0, subStr.indexOf('&key='));
        $(this).text(subStr);
    });
}

