// ==UserScript==
// @name       HF Live Preview
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.3
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
// version 1.0.3: Supports smilies, [hr], and [help] tags.
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
    $(".messageEditor, .smilie").on("click input onpropertychange", function () {
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
    $(outContainer).html(filterKeywords(preview.html));
}

function toggleCollapseAttr(){
    if($("#livePreview").is(':visible')){
        $("#livePreviewCollapse").attr("alt","[-]").attr("title","[-]").attr("src","https://hackforums.net/images/modern_bl/collapse.gif");
    } else{
        $("#livePreviewCollapse").attr("alt","[+]").attr("title","[+]").attr("src","https://hackforums.net/images/modern_bl/collapse_collapsed.gif");
    }
}

function filterKeywords(htmlInput){
    var filters = [
        [':pinch:', '<img src="images/smilies/pinch.gif" style="vertical-align: middle;" border="0" alt="Pinch" title="Pinch">'],
        [':victoire:', '<img src="images/smilies/victoire.gif" style="vertical-align: middle;" border="0" alt="Victoire" title="Victoire">'],
        [':hehe:', '<img src="images/smilies/hehe.gif" style="vertical-align: middle;" border="0" alt="Hehe" title="Hehe">'],
        [':oui:', '<img src="images/smilies/oui.gif" style="vertical-align: middle;" border="0" alt="Oui" title="Oui">'],
        [':bebe-pleure:', '<img src="images/smilies/bebe-pleure.gif" style="vertical-align: middle;" border="0" alt="Bebe-pleure" title="Bebe-pleure">'],
        [':ohmy:', '<img src="images/smilies/ohmy.gif" style="vertical-align: middle;" border="0" alt="Ohmy" title="Ohmy">'],
        [':blink:', '<img src="images/smilies/blink.gif" style="vertical-align: middle;" border="0" alt="Blink" title="Blink">'],
        [':superman:', '<img src="images/smilies/superman.gif" style="vertical-align: middle;" border="0" alt="Superman" title="Superman">'],
        [':nono:', '<img src="images/smilies/nono.gif" style="vertical-align: middle;" border="0" alt="Nono" title="Nono">'],
        [':biggrin:', '<img src="images/smilies/biggrin.gif" style="vertical-align: middle;" border="0" alt="Biggrin" title="Biggrin">'],
        [':sad:', '<img src="images/smilies/sad.gif" style="vertical-align: middle;" border="0" alt="Sad" title="Sad">'],
        [':unsure:', '<img src="images/smilies/unsure.gif" style="vertical-align: middle;" border="0" alt="Unsure" title="Unsure">'],
        [':glare:', '<img src="images/smilies/glare.gif" style="vertical-align: middle;" border="0" alt="Glare" title="Glare">'],
        [':roflmao:', '<img src="images/smilies/roflmao.gif" style="vertical-align: middle;" border="0" alt="Roflmao" title="Roflmao">'],
        [':devlish:', '<img src="images/smilies/devlish.gif" style="vertical-align: middle;" border="0" alt="Devlish" title="Devlish">'],
        [':rolleyes:', '<img src="images/smilies/rolleyes.gif" style="vertical-align: middle;" border="0" alt="Rolleyes" title="Rolleyes">'],
        [':cool:', '<img src="images/smilies/cool.gif" style="vertical-align: middle;" border="0" alt="Cool" title="Cool">'],
        [':gratte:', '<img src="images/smilies/gratte.gif" style="vertical-align: middle;" border="0" alt="Gratte" title="Gratte">'],
        [':confused:', '<img src="images/smilies/confused.gif" style="vertical-align: middle;" border="0" alt="Confused" title="Confused">'],
        [':blackhat:', '<img src="images/smilies/blackhat.gif" style="vertical-align: middle;" border="0" alt="Black Hat" title="Black Hat">'],
        [':ninja:', '<img src="images/smilies/ninja.gif" style="vertical-align: middle;" border="0" alt="Ninja" title="Ninja">'],
        [':blush:', '<img src="images/smilies/blush.gif" style="vertical-align: middle;" border="0" alt="Blush" title="Blush">'],
        [':lipssealed:', '<img src="images/smilies/lipssealed.gif" style="vertical-align: middle;" border="0" alt="Lipssealed" title="Lipssealed">'],
        [':yeye:', '<img src="images/smilies/yeye.gif" style="vertical-align: middle;" border="0" alt="Yeye" title="Yeye">'],
        [':non:', '<img src="images/smilies/non.gif" style="vertical-align: middle;" border="0" alt="Non" title="Non">'],
        [':smile:', '<img src="images/smilies/smile.gif" style="vertical-align: middle;" border="0" alt="Smile" title="Smile">'],
        [':whistle:', '<img src="images/smilies/whistle.gif" style="vertical-align: middle;" border="0" alt="Whistle" title="Whistle">'],
        [':sleep:', '<img src="images/smilies/sleep.gif" style="vertical-align: middle;" border="0" alt="Sleep" title="Sleep">'],
        [':evilgrin:', '<img src="images/smilies/evilgrin.gif" style="vertical-align: middle;" border="0" alt="Evilgrin" title="Evilgrin">'],
        [':omg:', '<img src="images/smilies/omg.gif" style="vertical-align: middle;" border="0" alt="Omg" title="Omg">'],
        [':tongue:', '<img src="images/smilies/tongue.gif" style="vertical-align: middle;" border="0" alt="Tongue" title="Tongue">'],
        [':mad:', '<img src="images/smilies/mad.gif" style="vertical-align: middle;" border="0" alt="Mad" title="Mad">'],
        [':huh:', '<img src="images/smilies/huh.gif" style="vertical-align: middle;" border="0" alt="Huh" title="Huh">'],
        [':thumbsup:', '<img src="images/smilies/thumbsup.gif" style="vertical-align: middle;" border="0" alt="Thumbsup" title="Thumbsup">'],
        [':wacko:', '<img src="images/smilies/wacko.gif" style="vertical-align: middle;" border="0" alt="Wacko" title="Wacko">'],
        [':pirate:', '<img src="images/smilies/pirate.gif" style="vertical-align: middle;" border="0" alt="Pirate" title="Pirate">'],
        ['[hr]', '<hr>'],
        ['[help]', 'We recommend you take the time to read the <a href="misc.php?action=help">HF Help Documents</a> section. The answer to your questions should be contained in there.']
    ];
    for (var i = 0; i < filters.length; i++){
        if(htmlInput.includes(filters[i][0])){
            htmlInput = htmlInput.replaceAll(filters[i][0],filters[i][1]);
        }
    }
    return htmlInput;
}

// Replace All (Credit: http://stackoverflow.com/a/17606289)
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};