// ==UserScript==
// @name       Group Management Profile Manager 2
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    2.0.0
// @description Adds additional group management options for HF leaders.
// @require     https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Group%20Management%20Profile%20Manager/Group%20Management%20Profile%20Manager%202.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/Group%20Management%20Profile%20Manager/Group%20Management%20Profile%20Manager%202.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 2.0.0: Rewrote userscript from the ground up
// ------------------------------ Dev Notes -----------------------------
// Remember to lowercase group name when searching for userbar image
// ------------------------------ SETTINGS ------------------------------
// Key used to store group name,gid,etc. (Don't change)
const GM_ValAddr = "groupsInfo"; // (Default: 'groupsInfo')

// Hide the 'Group Leader Notice' alert (Disables 'Auto-Decline')
const hideGroupNotice = false; // (Default: false)

// Which select all radio button to default to Options: 'acceptAllRadio','ignoreAllRadio','declineAllRadio'
const defaultSelectAll = "ignoreAllRadio"; // (Default: ignoreAllRadio)

// Auto-Decline: Automatically declines group join requests if any are present
//const declineAllAutomatically = false; // (Default: false)

// Links 'Group Leader Notice' to group requests
//const linkGroupLeaderNotice = true; // (Default: true)

// Alternate Row Highlighting (member/request list)
const colorAltRows = true; // (Default: true)

// Debug Mode - Print certain results to console
const debug = true; // (Default: false)
// ------------------------------ Script ------------------------------
// Global variables
var uid = window.location.href.replace(/[^0-9]/g, '');
var username = $(".group0:eq(0)").text();
var my_key = getMyPostKey();

// Profile (Add/Remove Button)
if (window.location.href.includes("hackforums.net/member.php?action=profile&uid=")){
    runOnProfile();
}
// Join Requests Menu (Select All)
else if (window.location.href.includes("hackforums.net/managegroup.php?action=joinrequests&gid=")){
    runOnJoinRequestMenu();
}
// Member List (Select All)
else if (window.location.href.includes("hackforums.net/managegroup.php?gid=")){
    //runonMemberList();
}
// Add 'Update Group' button (Updates gid for links)
else if(window.location.href.includes("https://hackforums.net/usercp.php?action=usergroups") && !(window.location.href.includes("action=joinrequests"))){
    runOnGroupMembership();
}
// Group Leader Notice (Quick Accept/Deny, Link notice to Requests)
runOnEveryHFPage();
// ------------------------------ Run On ------------------------------

function runOnEveryHFPage(){
    //
}

function runOnProfile(){
    generateProfileButtons();
}

function runOnJoinRequestMenu(){
    // var descRow = $(".quick_keys form table tbody tr:eq(1)");
    var descRow = $("strong:contains('Join Requests for')").parent().parent().next();
    var radioID = "";
    // 0 = Accept, 1 = Ignore, 2 = Decline
    for (var i=2; i < 5; i++){
        switch(i){
            case 2: radioID = "acceptAllRadio";
                break;
            case 3: radioID = "ignoreAllRadio";
                break;
            case 4: radioID = "declineAllRadio";
                break;
        }
        // Add 'All' radio buttons
        $(descRow).find("td:eq("+i+") strong")
            .append("<br>")
            .append("All")
            .append("<br>")
            .append($("<input>").attr("id",radioID).attr("type","radio").addClass("radio").attr("name","allRadio"));
    }
    $('input[type=radio][name=allRadio]').change(function() {
        debugPrint($(this).attr("id") + " button checked.");
        switch($(this).attr("id")){
            case "acceptAllRadio": markAllRadio(2);
                break;
            case "ignoreAllRadio": markAllRadio(3);
                break;
            case "declineAllRadio": markAllRadio(4);
                break;
            default : console.log("if you're seeing this, my script no longer works.");
        }
    });
    // Select defaultSelectAll option
    if($("#"+defaultSelectAll).length > 0){
        $("#"+defaultSelectAll).click();
    }
}

// Get group info from current page
function runOnGroupMembership(){
    var response = $("body");
    getGroupInfo(response, false);
}

// ------------------------------ Functions ------------------------------
function debugPrint(str){
    debug ? console.log(str) : false;
}

function getMyPostKey(){
    if(my_post_key === undefined)
        return unsafeWindow.my_post_key;
    else
        return my_post_key;
    return my_key;
}

// Mark all radio buttons with col index
function markAllRadio(colIndex){
    var joinRequestTable = $("strong:contains('Join Requests for')").parent().parent().parent().parent();
    $(joinRequestTable).find("tr").each(function( index ) {
        if (index === 0 || index === 1){
            // Don't do anything
        } else{
            // Select all radios based on selected -all radio
            $(joinRequestTable).find("tr:eq("+index+") td:eq("+colIndex+") input").prop("checked", true);
        }
    });
}

function addUser(gid){
    debugPrint({
        "action": "removeUser",
        "my_post_key":my_post_key,
        "username":username,
        "gid": gid
    })
    var tempRemoveUserKey = "removeuser["+uid+"]";

    $.ajax({
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        url: "/managegroup.php",
        data: {
            "my_post_key": my_key,
            "action": "do_add",
            "gid": gid,
            "username": username
        },
        success: function(data) {
            debugPrint({
                "action": "do_add",
                "data":data,
                "status":status
            })
            location.reload();
        }
    });
}

function removeUser(gid){
    debugPrint({
        "action": "removeUser",
        "my_post_key":my_post_key,
        "username":username,
        "gid": gid
    })
    var tempRemoveUserKey = "removeuser["+uid+"]";

    $.ajax({
        type: "POST",
        contentType: "application/x-www-form-urlencoded",
        url: "/managegroup.php",
        data: {
            "my_post_key": my_key,
            "action": "do_manageusers",
            "gid": gid,
            [tempRemoveUserKey]: uid
        },
        success: function(data) {
            debugPrint({
                "action": "do_manageusers",
                "data":data,
                "status":status
            })
            location.reload();
        }
    });
}

function generateProfileButtons(){
    // Check for groupInfo
    var prevInfo = GM_getValue(GM_ValAddr, false);
    // If group leader
    if(prevInfo){
        // Loop through each group
        debugPrint("Found existing previousGroupInfo");
        console.log(prevInfo);
        $.each( prevInfo, function( index, value ){
            var groupName = value["name"];
            var gid = value["id"];
            if($(".pro-adv-groups-group").find("img[src*="+groupName.toLowerCase()+"]").length >= 1) {
                $(".float_left")
                    .append($("<a>").attr({
                    "data-tooltip": "Remove from " + groupName,
                    "href": "javascript:void(0);"
                }).css({"display":"inline-block", "line-height":"37px", "padding":"0px 15px"})
                            .click(function(){ removeUser(gid); })
                            .append($("<i>").addClass("fa fa-user-minus")))
            } else {
                $(".float_left")
                    .append($("<a>").attr({
                    "data-tooltip": "Add to " + groupName,
                    "href": "javascript:void(0);"
                }).click(function(){ addUser(gid); })
                            .append($("<i>").addClass("fa fa-user-plus")))
            }
        });
    } else {
        fetchGroupInfo();
        location.reload();
    }
}

// Scrap group name, group id, group requests - write to 'cookie'
function getGroupInfo(response, showAlert){
    var groupInfoArray = []; // (Name, ID, Requests)
    if (!$(response).find("Groups You Lead")){
        showAlert ? window.alert("Group Management Profile Manager 2 FAILED!\nGroup privledges not found! Please uninstall script..."): "";
    }
    else{
        $(response).find("a:contains('View Members')").each(function() {
            var groupEntry = {
                "name":$(this).parent().prev().text().replace("The", "").trim(),
                "id":$(this).attr("href").substr(20),
                "pending":$(this).parent().next().text().replace(/[^0-9]/g, ''),
            }
            groupInfoArray.push(groupEntry);
        });
        debugPrint(groupInfoArray);
        GM_setValue(GM_ValAddr, groupInfoArray);
        showAlert ? window.alert("Group Management Profile Manager 2 SUCCESS!\n Group privledges found! Please reload the page..."): "";
    }
}

// Make AJAX request to get group info
function fetchGroupInfo(){
    $.ajax({
        url: "https://hackforums.net/usercp.php?action=usergroups",
        cache: false,
        success: function(response) {
            getGroupInfo(response, true)
        }
    });
}