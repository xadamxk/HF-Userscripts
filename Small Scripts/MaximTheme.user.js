// ==UserScript==
// @name       Maxim Theme Userscript
// @author xadamxk
// @namespace  https://github.com/thatguymaxim/Hack-Forums-Userscript-Theme
// @version    1.0.0
// @description  Description
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net*
// @match      *://hackforums.net/*
// @copyright  2017+
// @updateURL
// @downloadURL
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// Use this to get a cdn hosted css file:
//      https://rawgit.com/
// Use this to make an href string for the two lines below:
//      http://www.freeformatter.com/javascript-escape.html
$("head").append('<link '+ "href='https:\/\/cdn.rawgit.com\/thatguymaxim\/Hack-Forums-Userscript-Theme\/19f3bc27\/Hack%20Forums_files\/global.css'" + 'rel="stylesheet" type="text/css">');
$("head").append('<link '+ "href='https:\/\/cdn.rawgit.com\/thatguymaxim\/Hack-Forums-Userscript-Theme\/19f3bc27\/Hack%20Forums_files\/tabbed.css'" + 'rel="stylesheet" type="text/css">');