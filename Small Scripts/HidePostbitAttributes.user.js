// ==UserScript==
// @name       Hide Postbit Attributes
// @author xadamxk
// @namespace  https://github.com/xadamxk/
// @version    1.0.0
// @description  Hide various aspects of the postbit.
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/showthread.php?tid=*
// @copyright  2016+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.0.1: Public Release
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// TODO: Signatures
// ------------------------------ SETTINGS ------------------------------
var hideAvatar = true;
var hideUserTitle = true;
var hidePrestige = true;
var hidePostCount = true;
var hideJoinDate = true;
var hideReputation = true;
var hideWarningLevel = true;
var hideAwards = true;
var hideSignatures = true;
// ------------------------------ SETTINGS ------------------------------
$("#posts > table").each(function( index ) {
    if(hideUserTitle)
        $(this).find(".post_avatar").hide();
    if(hideUserTitle)
        $(this).find(".post_author").find(".smalltext")[0].childNodes[0].nodeValue = '';
    if(hidePrestige)
        $(this).find(".post_author_info")[0].childNodes[0].nodeValue = '';
    if(hidePostCount)
        $(this).find(".post_author_info")[0].childNodes[3].nodeValue = '';
    if(hideJoinDate)
        $(this).find(".post_author_info")[0].childNodes[5].nodeValue = '';
    if(hideReputation){
        $(this).find(".post_author_info")[0].childNodes[9].nodeValue = '';
        $(this).find(".post_author_info").find(".reputation_positive").remove();
        $(this).find(".post_author_info").find(".reputation_negative").remove();
        $(this).find(".post_author_info").find(".reputation_neutral").remove();
    }
    if(hideWarningLevel){
        $(this).find(".post_author_info")[0].childNodes[16].nodeValue = '';
        $(this).find(".post_author_info > a:eq(1)").remove();
    }
    if(hideAwards)
        $(this).find(".post_author_info > span").remove();
});