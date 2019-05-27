// ==UserScript==
// @name       HF The Game
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description Adds various helpful tools to HF's Game (battery indicator & recharge time)
// @require     https://code.jquery.com/jquery-3.1.1.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.js
// @match      *://hackforums.net/gamecp.php
// @match      *://hackforums.net/gamecp.php?action=smallhacks*
// @match      *://hackforums.net/gamecp.php?action=battery*
// @match      *://hackforums.net/gamecp.php?action=logs*
// @match      *://https://hackforums.net/gamecp.php?action=leaderboard&type=1*
// @copyright  2016+
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// Use at your own risk :)
// ------------------------------ SETTINGS ------------------------------
var debug = false;
const jobs = {
    //     socialEngineerMcDonaldsLunch: "#job_id_11", // 93%
    //     facebookPassword: "#job_id_12",             // 86%
    //     downloadTorrentMSWindows: "#job_id_13",     // 79%
    //     makeStealthPaypal: "#job_id_14",            // 72%
    //     ewhoreRichDude: "#job_id_15",               // 65%
    //     doxSomeoneTwitter: "#job_id_16",            // 58%
    //     amazonPhishingPage: "#job_id_17",           // 51%
    //     accountGeneratorNetflix: "#job_id_18",      // 44%
    //     infectCoworkerVirus: "#job_id_19",          // 37%
    //     hackNeighborWifi: "#job_id_20",             // 30%
    sqlInjectWebsite: "#job_id_21",             // 23%
    spreadBTCMiner: "#job_id_22",               // 16%
    hackNasaMoonLanding: "#job_id_23"           //  9%
}
const batteryThreshold = 5; // %
const intervalVariableLow = 15; // 15 secs
const intervalVariableHigh = 60; // 1 mins
// ------------------------------ Page Load -----------------------------
var isCooldown = ($(".game_nav_content_system_container > a:eq(2)").find('.game-nav-countdown').length > 0 ? true : false);
var isLocked = ($("img[src$='/game/fbi-interrogating.jpg']").length > 0 ? true : false);
var isPowerCenter = ($("#progress-bar-percentage").length > 0 ? true : false);
var batteryPercent = (
    $(".game-top-right-icons > a:eq(4)") ?
        parseInt($(".game-top-right-icons > a:eq(4)").attr('title').replace('%', '')) :
        0);
var date = new Date();
var localDate = date.toLocaleTimeString();
// Append Logs & Leaderboard shortcuts
$(".game-top-right-icons")
    .prepend($("<a>").attr("href", "gamecp.php?action=logs")
        .append($("<i>").addClass("hficon-drawer-paper2")
            .attr({ "title": "Logs" })
            .css({
                "margin-left": "12px",
                "font-size": "24px",
                "color": "#ababab"
            })
            .hover(
                function () {
                    $(this).css({ "color": "#4d2f5d" });
                }, function () {
                    $(this).css({ "color": "#ababab" })
                })
        ))
    .prepend($("<a>").attr("href", "gamecp.php?action=leaderboard&type=1")
        .append($("<i>").addClass("hficon-medal-empty")
            .attr({ "title": "Leaderboard" })
            .css({
                "margin-left": "12px",
                "font-size": "24px",
                "color": "#ababab"
            })
            .hover(
                function () {
                    $(this).css({ "color": "#4d2f5d" });
                }, function () {
                    $(this).css({ "color": "#ababab" })
                })
        )
    );
// Append game status info
$(".game_nav_content_system_container").parent().parent()
    .after($("<tr>")
        .append($("<td>").addClass("trow1")
            .append($("<div>").attr("id", "gameStatusContainer")
                .append("<b>Cooldown:</b> " + isCooldown.toString().toUpperCase())
                .append("<br>")
                .append("<b>Locked:</b> " + isLocked.toString().toUpperCase())
                .append("<br>")
            )));
// Append battery info
var batteryElement = $('[class^="hficon-battery-"]');
batteryElement.after($("<span>").css({ "margin-left": "10px", "color": batteryElement.css('color') }).text(batteryPercent + "%"));
// Determine game status
if (batteryPercent < batteryThreshold && !isPowerCenter) {
    console.log("Battery threshold hit. Navigating to battery...");
    naviagteToBattery();
} else if (isPowerCenter) {
    // Full recharge time
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
    var rechargeDate = moment(extractedRechargeTime, "MMMM Do, YYYY, hh:mm A"); // May 13th, 2019, 02:45 AM
    var differenceInMS = Math.abs(moment().diff(rechargeDate, 'milliseconds')); // Diff in MS from now until recharge time
    batteryTimeElement.after($("<span>").text("(Reload time: " + rechargeDate.format('YYYY-MM-DD @ hh:mm A') + ")"));
    setInterval(naviagteToGame, differenceInMS);
}
else if (isCooldown) {
    console.log("Cooldown is active. Waiting...");
    // TODO: Add logic to check for page as well?
    runOnCooldown();
}
else if (isLocked) {
    // Grab time from FBI page (are there other pages?)
    $("#gameStatusContainer").append("Reload Time: " + localDate + " + (" + intervalVariableHigh + ")");
    setInterval(reloadPage, intervalVariableHigh);
} else {
    console.log("Game is ready. Playing...");
    runOnGame();
}

function runOnCooldown() {
    // Get timer count
    var timer = $(".game_nav_content_system_container > a:eq(2)").find('.game-nav-countdown > span').text();
    var timerMins = parseInt(timer.split(':')[0]);
    var timerSecs = parseInt(timer.split(':')[1]);
    var timerBufferSecs = calculateRandomInterval();
    var timerMS = ((timerMins * 60) + timerSecs + timerBufferSecs) * 1000;
    // Update status
    $("#gameStatusContainer").append("<b>Reload Time:</b> " + moment(date).add(timerMS, "milliseconds").format('YYYY-MM-DD @ hh:mm:s A'));
    // Set reload interval
    setInterval(reloadPage, timerMS);
}

function runOnGame() {
    $(selectRandomHackJob()).click();
    $("button:contains('Attempt Hack')").click();
}

function reloadPage() {
    console.log("reloaded page?");
    location.reload();
}

function naviagteToGame() {
    window.location.href = 'https://hackforums.net/gamecp.php?action=smallhacks#lgv';
}

function naviagteToBattery() {
    window.location.href = 'https://hackforums.net/gamecp.php?action=battery#lgv';
}

function calculateRandomInterval() {
    return Math.floor(Math.random() * intervalVariableHigh) + intervalVariableLow;
}

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100)
        , seconds = parseInt((duration / 1000) % 60)
        , minutes = parseInt((duration / (1000 * 60)) % 60);
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return minutes + ":" + seconds + "." + milliseconds;
}

function selectRandomHackJob(obj) {
    var keys = Object.keys(jobs)
    return jobs[keys[keys.length * Math.random() << 0]];
};