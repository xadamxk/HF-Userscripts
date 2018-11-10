// ==UserScript==
// @name       HF Award Recipient Count
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description Shows number of recipient total on awards page
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/myawards.php?awid=*
// @copyright  2018+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Script ------------------------------
$('strong:contains("My Awards")').after($("<span>").addClass("float_right").text($('.award_sprite').length + " recipients"));