// ==UserScript==
// @name       Custom Header
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.3
// @description  Adds various shortcuts to the HF toolbar. (Leave strings blank to exclude)
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Custom%20Header/Custom%20Header.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
var section1_label = "Lounge";
var section1_fid = "25";

var section2_label = "RANF";
var section2_fid = "2";

var section3_label = "Groups";
var section3_fid = "53";

var section4_label = "Web Browsers";
var section4_fid = "247";

var section5_label = "Eclipse";
var section5_fid = "250";

var section6_label = "Market";
var section6_fid = "105";

var section7_label = "PM Tracking";
var section7_fid = "private.php?action=tracking";

var regex = /\(Unread(.*?)\)/;
var revised = "(Unread $1) | <a href='forumdisplay.php?fid="+section1_fid+"'>"+section1_label+" </a>"+
    "| <a href='forumdisplay.php?fid="+section2_fid+"'>"+section2_label+" </a>"+
    "| <a href='forumdisplay.php?fid="+section3_fid+"'>"+section3_label+" </a>"+
    "| <a href='forumdisplay.php?fid="+section4_fid+"'>"+section4_label+" </a>"+
    "| <a href='forumdisplay.php?fid="+section5_fid+"'>"+section5_label+" </a>"+
    "| <a href='forumdisplay.php?fid="+section6_fid+"'>"+section6_label+" </a>"+
    "| <a href='"+section7_fid+"'>"+section7_label+" </a>|";
document.getElementById('panel').innerHTML= document.getElementById('panel').innerHTML.replace(regex,revised);

