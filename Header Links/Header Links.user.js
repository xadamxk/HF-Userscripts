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
var links = [
    {
        "enabled": true,
        "name": "Neg Reps",
        "url": "negreplog.php",
    },
    {
        "enabled": true,
        "name": "Groups",
        "url": "showgroups.php",
    },
    {
        "enabled": true,
        "name": "Warnings",
        "url": "warnlog.php",
    },
    {
        "enabled": true,
        "name": "Gauth",
        "url": "gauth.php",
    },
    {
        "enabled": true,
        "name": "Bans",
        "url": "bans.php",
    },
    {
        "enabled": true,
        "name": "Staff",
        "url": "showstaff.php",
    },
    {
        "enabled": true,
        "name": "Mods",
        "url": "showmods.php",
    },
    {
        "enabled": true,
        "name": "PM Tracking",
        "url": "private.php?action=tracking",
    }
];
// ------------------------------ ON PAGE LOAD ------------------------------

links.forEach(function(link) {
    if (link.enabled === true) {
        $(".links a:eq(0)").before($("<a>").attr("href", link.url).text(link.name));
    }
});

$(".links a:not(:last)").after(" | ");
