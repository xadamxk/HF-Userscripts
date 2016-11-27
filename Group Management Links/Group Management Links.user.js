// ==UserScript==
// @name       Group Management Links
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.1
// @description  Adds group management links to the HF toolbar (hardcoded - change GID accordingly)
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL 
// @iconURL https://github.com/xadamxk/HF-Userscripts/blob/master/scripticon.jpg
// ==/UserScript==

var gid = "";
var regex = "User CP</strong></a>";
var revised = "User CP</strong></a> &mdash; <a href='http://www.hackforums.net/managegroup.php?gid="+gid+"'>"+
    "<strong>Group CP</strong></a> &mdash; <a href='http://www.hackforums.net/managegroup.php?action=joinrequests&gid="+gid+"'><strong>Requests</strong></a>";
document.getElementById('panel').innerHTML= document.getElementById('panel').innerHTML.replace(regex,revised);