// ==UserScript==
// @name       HF Game Additions
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.1
// @description Adds various helpful tools to HF's Game
// @require     https://code.jquery.com/jquery-3.1.1.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.js
// @match      *://hackforums.net/gamecp.php?*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Game/HFGameAdditions.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20Game/HFGameAdditions.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 1.0.1: Update/Download URL
// v 1.0.0: Absolute battery timestamp, battery percentage, shortcut icons (logs and leaderboard)
// ------------------------------ Dev Notes -----------------------------
// Use at your own risk :)
// ------------------------------ SETTINGS ------------------------------
// Append battery info
var batteryPercent = (
    $(".game-top-right-icons > a:eq(4)") ?
        parseInt($(".game-top-right-icons > a:eq(4)").attr('title').replace('%', '')) :
        0);
var batteryElement = $('[class^="hficon-battery-"]').filter((index, item) => { return $(item).attr('href') });
batteryElement.after($("<span>").css({ "margin-left": "10px", "color": batteryElement.css('color') }).text(batteryPercent + "%"));

// Append absolute timestamp
var date = new Date();
var localDate = date.toLocaleTimeString();
var extractedRechargeTime = (
    $("#game_content_currentpage").find(".tinytext > span").attr('title') ?
        $("#game_content_currentpage").find(".tinytext > span").attr('title') :
        $("#game_content_currentpage").find("em").text()
);
var batteryTimeElement = (
    $("#game_content_currentpage").find(".tinytext > span") ?
        $("#game_content_currentpage").find(".tinytext > span") :
        $(".gmiddle").parent().find("em")
);
var rechargeDate = moment(extractedRechargeTime, "MM-DD-YYYY, hh:mm A"); // 06-25-2019, 07:35 PM
var differenceInMS = Math.abs(moment().diff(rechargeDate, 'milliseconds')); // Diff in MS from now until recharge time
batteryTimeElement.after($("<span>").text("(" + rechargeDate.format('MM-DD-YYYY @ hh:mm A') + ")"));

// Append shortcut icons (Logs & Leaderboard)
$(".game-top-right-icons")
    .prepend($("<a>").attr("href", "gamecp.php?action=logs")
        .append($("<i>").addClass("hficon-drawer-paper2")
            .attr({ "title": "Logs" })
            .css({
                "margin-left": "12px",
                "font-size": "24px",
                "color": "#ababab"
            }).hover(
                function () {
                    $(this).css({ "color": "#4d2f5d" });
                }, function () {
                    $(this).css({ "color": "#ababab" })
                })))
    .prepend($("<a>").attr("href", "gamecp.php?action=leaderboard&type=1")
        .append($("<i>").addClass("hficon-medal-empty")
            .attr({ "title": "Leaderboard" })
            .css({
                "margin-left": "12px",
                "font-size": "24px",
                "color": "#ababab"
            }).hover(
                function () {
                    $(this).css({ "color": "#4d2f5d" });
                }, function () {
                    $(this).css({ "color": "#ababab" })
                })
        )
    );
