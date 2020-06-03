// ==UserScript==
// @name       Award Addicts - Award Manager
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description Makes managing awards easier
// @require     https://code.jquery.com/jquery-3.1.1.js
// @match      *://awardaddicts.com/@*
// @match      *://awardaddicts.com/member.php?action=profile&uid=*
// @match      *://awardaddicts.com/Thread-*
// @copyright  2020+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Other%20Sites/AwardAddicts_AwardManager.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/Other%20Sites/AwardAddicts_AwardManager.user.js
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 1.0.0: Initial Release
// ------------------------------ Dev Notes -----------------------------
// Ability to remove awards requires an additional service call (same awards multiple times issue...)
// ------------------------------ SETTINGS ------------------------------
//
// ------------------------------ Script ------------------------------
if (window.location.href.includes("awardaddicts.com/@") || window.location.href.includes("awardaddicts.com/member.php?action=profile&uid=")){
    fetchAwards();
}
else if (window.location.href.includes("awardaddicts.com/Thread-")){
    //runOnThread();
}

function fetchAwards(){
    var awardsArray = [];
    $.get("https://awardaddicts.com/awards.php", function(data, status){
        let awardIcons = $("<div/>").html(data).contents().find(".awards-row");
        $(awardIcons).each((index,awardEntry) => {
            let currentAward = $(awardEntry).find(".award-icon > a:eq(1)");
            let currentDescription = $(awardEntry).find(".awards-table-cell > span").text();
            awardsArray.push({
                "name":currentAward.attr("title"),
                "id": currentAward.attr("href").replace("https://awardaddicts.com/awards.php?view=", ""),
                "src":currentAward.find("img").attr("src"),
                "description":currentDescription
            });
        });
        addAwardTable(awardsArray)
    });
}

function addAwardTable(awardsArray){
    let awardsTable = $(".profile-responsive:eq(2) > table:eq(0)");
    let currentProfileName = $(".active").text().replace("Profile of","").trim();
    // Clone awards table
    let tableClone = awardsTable.clone();
    // Append new awards table
    awardsTable.before(tableClone);
    // Remove new table's rows
    awardsTable.find("tbody > tr").slice(1).remove()
    // Add scrollable container to new table
    awardsTable.find("tbody").append($("<div>").css({"height":"250px", "overflow": "scroll", "display":"flex", "flex-wrap":"wrap", "padding":"0 4px"}));
    // Change table title on new table
    awardsTable.find(".thead > strong").text("Give Awards")
    // Append awards to new table's scrollable container
    awardsArray.forEach((award, index) =>{
        awardsTable.find("tbody > div").append(
            $("<tr>").css("flex","25%").append($("<td>").addClass("trow1")
                                               .append($("<div>").attr({"href":"javascript:void(0);", "title":award["name"]}).click(function(){manageAward(award["name"], "give", award["id"], currentProfileName)})
                                                       .append($("<img>").attr({
                "src":award["src"],
                "style":"margin: 3px;height: 20px; width: 20px; padding:3px; border: 2px solid #c76af1;border-radius:15%;background:#333; margin-left: 0;",
                "alt":award["name"]
            })))))
    });
    // Add ability to remove awards on user's awards table if awards exist
    awardsTable = $(".profile-responsive:eq(2) > table:eq(0)");
    if(awardsTable.find("img").length > 0){
        awardsTable.find("tbody > tr:eq(1) > td > a:odd").each((index, award) => {
            let awardName = $(award).attr("title");
            let awardId = $(award).attr("href").replace("https://awardaddicts.com/awards.php?view=","")
            $(award).attr("href", "javascript:void(0);").click(function(){manageAward(awardName, "revoke", awardId, currentProfileName)})
        });
    }
}

function manageAward(awardName="", action, aid, username, reason = "", thread = ""){
    if(confirm(`Are you sure you want to ${action} the ${awardName} to/from ${username}?`)){
        let giveData = {
            "manage": action,
            "aid":aid,
            "username":username,
            "reason":reason
        }
        let revokeData = {
            "manage": action,
            "aid":aid,
            "username":username
        }
        //         let revokeByAID = {
        //             "manage": action,
        //             "aid":aid,
        //             "username":username
        //         }
        $.post('https://awardaddicts.com/modcp.php?action=awards', action=="give" ? giveData : revokeData,
               function(data, status, jqXHR) {
            location.reload()
        })
    }
}