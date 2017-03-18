// ==UserScript==
// @name       HF Live Preview
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description  Adds live preview when composing posts and threads
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://raw.githubusercontent.com/xadamxk/ThreadDesignGenerator/master/JS/xbbcode.js
// @match      *://hackforums.net/showthread.php?tid=*
// @match      *://hackforums.net/newreply.php?tid=*
// @match      *://hackforums.net/newthread.php?fid=*
// @copyright  2016+
// @updateURL 
// @downloadURL 
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.0.1: Update/Download URLs
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// Hide after post
// Work in quick edit/full edit
// ------------------------------ SETTINGS ------------------------------
// Preview Background Color
var prevBackColor = "#333333";
// ------------------------------ On Page ------------------------------
// http://www.freeformatter.com/javascript-escape.html
// https://rawgit.com/xadamxk/ThreadDesignGenerator/master/CSS/xbbcode.css
$("head").append('<link '+ "href='https:\/\/rawgit.com\/xadamxk\/ThreadDesignGenerator\/master\/CSS\/xbbcode.css'" + 'rel="stylesheet" type="text/css">');

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
    }
}
// Thread Reply
else if (window.location.href.includes("hackforums.net/newreply.php?tid=")){

}
// New Thread
else if(window.location.href.includes("hackforums.net/newthread.php?fid=")){

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