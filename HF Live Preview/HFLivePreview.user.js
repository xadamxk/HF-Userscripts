// ==UserScript==
// @name       HF Live Preview
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.2
// @description  Adds live preview when composing posts and threads
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://raw.githubusercontent.com/xadamxk/ThreadDesignGenerator/master/JS/xbbcode.js
// @match      *://hackforums.net/showthread.php?tid=*
// @match      *://hackforums.net/newreply.php?tid=*
// @match      *://hackforums.net/newthread.php?fid=*
// @match      *://hackforums.net/editpost.php?pid=*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/releases/download/HFLP/HFLivePreview.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/releases/download/HFLP/HFLivePreview.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.0.2: Release URL
// version 1.0.1: Update/Download URLs
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
// Preview Background Color
var prevBackColor = "#333333";
// ------------------------------ On Page ------------------------------
// http://www.freeformatter.com/javascript-escape.html
// Dev: https://rawgit.com/xadamxk/ThreadDesignGenerator/master/CSS/xbbcode.css
// Prod: https:\/\/cdn.rawgit.com\/xadamxk\/ThreadDesignGenerator\/8c58d68e\/CSS\/xbbcode.css
$("head").append('<link '+ "href='https:\/\/cdn.rawgit.com\/xadamxk\/ThreadDesignGenerator\/8c58d68e\/CSS\/xbbcode.css'" + 'rel="stylesheet" type="text/css">');

// Quick Reply
if ( window.location.href.includes("hackforums.net/showthread.php?tid=")){
    // Check for quick reply box
    if($("strong:contains(Quick Reply)")){
        $("#quickreply_e tr:eq(1)").after($("<tr>")
                                          .append($("<td>").attr("colspan","2").addClass("trow1")
                                                  .append($("<div>").addClass("expcolimage")
                                                          .append("<img id='livePreviewCollapse' alt='[-]' title='[-]' style='cursor: pointer;' src='https://hackforums.net/images/modern_bl/collapse.gif' />"))
                                                  .append($("<div>")
                                                          .append($("<strong>").text("Live Preview")))));
        $("#quickreply_e tr:eq(2)").after($("<tr>")
                                          .append($("<td>").attr("colspan","2").css("background-color",prevBackColor)
                                                  //.append("<hr>")
                                                  .append($("<div>").attr("id","livePreview"))));
        // Event Listeners
        $("#message").on("input", function () {
            updatePreview($("#message").val(), "#livePreview");
        });
        $("#livePreviewCollapse").on("click", function () {
            $("#livePreview").toggle();
            toggleCollapseAttr();
        });
        $("#quick_reply_submit").on("click", function () {
            updatePreview($("#message").val(), "#livePreview");
        });
    }
}
// Thread Reply & New Thread
else if (window.location.href.includes("hackforums.net/newreply.php?tid=")||
         window.location.href.includes("hackforums.net/newthread.php?fid=")||
         window.location.href.includes("hackforums.net/editpost.php?pid=")){
    $("strong:contains(Your Message:)").parent().parent().after($("<tr>")
                                                                .append($("<td>").addClass("trow1").css("width","20%")
                                                                        .append($("<strong>").text("Live Preview:")))
                                                                .append($("<td>").addClass("trow1").append($("<div>").attr("id","livePreview"))));
    // Event Listeners
        $(".messageEditor").on("click input onpropertychange", function () {
            updatePreview($("#message_new").val(), "#livePreview");
        });
}



function updatePreview(input, outContainer) {
    // Instanciate xbb
    var preview = XBBCODE.process({
        text: input,
        removeMisalignedTags: false,
        addInLineBreaks: true
    });
    //console.error("Errors", preview.error);
    //console.dir(preview.errorQueue);
    $(outContainer).html(preview.html);
}

function toggleCollapseAttr(){
    if($("#livePreview").is(':visible')){
        $("#livePreviewCollapse").attr("alt","[-]").attr("title","[-]").attr("src","https://hackforums.net/images/modern_bl/collapse.gif");
    } else{
        $("#livePreviewCollapse").attr("alt","[+]").attr("title","[+]").attr("src","https://hackforums.net/images/modern_bl/collapse_collapsed.gif");
    }
}