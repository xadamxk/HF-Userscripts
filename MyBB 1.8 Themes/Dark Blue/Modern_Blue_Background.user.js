// ==UserScript==
// @name       HF Modern Blue Background
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description Makes the background the old HF Modern Blue
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net*
// @match      *://hackforums.net/*
// @copyright  2018+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// @resource        MODERN_BLUE_GLOBAL  https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/MyBB%201.8%20Themes/Dark%20Blue/global.css
// @grant           GM_addStyle
// @grant           GM_getResourceText
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.1: Public Release
// version 1.0.0: Beta Release
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
// ------------------------------ Page Load -----------------------------
var cssTxt  = GM_getResourceText ("MODERN_BLUE_GLOBAL");
GM_addStyle (cssTxt);