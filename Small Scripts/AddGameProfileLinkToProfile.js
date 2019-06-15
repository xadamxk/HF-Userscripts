// ==UserScript==
// @name       Add Game Link to Profiles
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description Adds a link to user's game profile on their main profile
// @require     https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/member.php?action=profile&uid=*
// @copyright  2016+
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 1.0.0:
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
var marketProfileButton = $("strong:contains('Forum Info')").siblings()[0];
$(marketProfileButton)
    .clone()
    .find("a").attr("href",($(marketProfileButton).find("a").attr("href").replace("marketcp","gamecp")))
    .text("Switch to Game Profile")
    .css("margin-right","13px")
    .prependTo($(marketProfileButton))