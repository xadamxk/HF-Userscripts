// ==UserScript==
// @name       Header Links
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.3
// @description  Adds various links to HF's header (replaces HFES headers)
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net*
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Header%20Links/Header%20Links.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/Header%20Links/Header%20Links.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.3: Bug fix: document-start
// version 1.0.2: Fixed auto-update
// version 1.0.1: Initial Release
// version 1.0.0: Beta Release
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
// Bans
var showBans = true; // (Default: true)
// Gauth
var showGauth = true; // (Default: true)
// Warnings
var showWarnings = true; // (Default: true)
// Groups
var showGroups = true; // (Default: true)
// Neg Reps
var showNegreps = true; // (Default: true)
// Staff
var showStaff = true; // (Default: true)
// Mods
var showMods = true; // (Default: true)
// PM Tracking
var showTracking = true; // (Default: true)
// ------------------------------ ON PAGE LOAD ------------------------------
// Append Links: if (){appendLink("","");}
if (showNegreps){appendLink("negreplog.php","Neg Reps");}
if (showGroups){appendLink("showgroups.php","Groups");}
if (showWarnings){appendLink("warnlog.php","Warnings");}
if (showGauth){appendLink("gauth.php","Gauth");}
if (showBans){ appendLink("bans.php","Bans");}
if (showStaff){appendLink("showstaff.php","Staff");}
if (showMods){appendLink("showmods.php","Mods");}
if (showTracking){appendLink("private.php?action=tracking","PM Tracking");}
// Add spacer
appendSpacer();

// Functions
function appendLink(href,text){
    $(".links a:eq(0)").before($("<a>").attr("href",href).text(text));
}
function appendSpacer(){
    $(".links a").before(" | ");
}