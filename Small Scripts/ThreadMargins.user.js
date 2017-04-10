// ==UserScript==
// @name       HF Custom Margins
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description  Allows users to set custom margins when viewing threads.
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/showthread.php?tid=*
// @copyright  2017+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// I don't know why you would need this, but yolo
// ------------------------------ SETTINGS ------------------------------
// ------------------------------ On Page ------------------------------
$(".post_body").css({
   'padding-top' : '10px',
   'padding-right' : '30px',
   'padding-bottom' : '10px',
   'padding-left' : '30px'
});