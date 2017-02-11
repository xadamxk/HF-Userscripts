// ==UserScript==
// @name       Original Additional Usergroups
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.1
// @description  Adds line breaks after each additional usergroup on profiles
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/member.php?action=profile&uid=*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Small%20Scripts/OriginalAdditionalUsergroups.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/Small%20Scripts/OriginalAdditionalUsergroups.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.1: Public Release
// version 1.0.0: Initial Release
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
//
// ------------------------------ ON PAGE LOAD ------------------------------
if($(".quick_keys").find("strong:contains(Additional Usergroups)").length > 0){
    $(".quick_keys").find("strong:contains(Additional Usergroups)").parent().parent().next().find("img").each(function( index ) {
        $(this).parent().after("</br>");
    });
}