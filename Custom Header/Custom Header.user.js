// ==UserScript==
// @name       Custom Header
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.2
// @description  Adds various shortcuts to the HF toolbar. (Leave strings blank to exclude)
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Custom%20Header/Custom%20Header.user.js
// @icon https://github.com/xadamxk/HF-Userscripts/blob/master/scripticon.jpg
// ==/UserScript==
var section1_label = "Lounge";
var section1_fid = "25";

var section2_label = "Legends";
var section2_fid = "349";

var section3_label = "Computing Tab";
var section3_fid = "88";

var section4_label = "Groups";
var section4_fid = "53";

var section5_label = "iOS & iDevices";
var section5_fid = "137";

var section6_label = "RANF";
var section6_fid = "2";

var section7_label = "Mentor";
var section7_fid = "123";

var regex = /\(Unread(.*?)\)/;
var revised = "(Unread $1) | <a href='forumdisplay.php?fid="+section1_fid+"'>"+section1_label+" </a>"+
    "| <a href='forumdisplay.php?fid="+section2_fid+"'>"+section2_label+" </a>"+
    "| <a href='forumdisplay.php?fid="+section3_fid+"'>"+section3_label+" </a>"+
    "| <a href='forumdisplay.php?fid="+section4_fid+"'>"+section4_label+" </a>"+
    "| <a href='forumdisplay.php?fid="+section5_fid+"'>"+section5_label+" </a>"+
    "| <a href='forumdisplay.php?fid="+section6_fid+"'>"+section6_label+" </a>"+
    "| <a href='forumdisplay.php?fid="+section7_fid+"'>"+section7_label+" </a>|";
document.getElementById('panel').innerHTML= document.getElementById('panel').innerHTML.replace(regex,revised);

