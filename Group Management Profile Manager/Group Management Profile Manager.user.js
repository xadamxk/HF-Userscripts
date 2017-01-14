// ==UserScript==
// @name       Group Management Profile Manager
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.2.2
// @description  Adds group management buttons to profiles (add/remove) for HF leaders
// @require http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match      *://hackforums.net/*
// @match      *://hackforums.net*
// @copyright  2016+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Group%20Management%20Profile%20Manager/Group%20Management%20Profile%20Manager.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/Group%20Management%20Profile%20Manager/Group%20Management%20Profile%20Manager.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// ------------------------------ Change Log ----------------------------
// version 1.2.2: Added 'Mark All' under Group Member List
// version 1.2.1: Added 'Auto Accept' into Group Leader Notices
// version 1.2.0: Implemented 'Auto Decline' into Group Leader Notices
// version 1.1.2: Adding setting to hide Group Leader Notices
// version 1.1.1: Bug fix - Adding/Removing broke in code clean up of v1.1.0
// version 1.1.0: Implemented Accept/Ignore/Decline all radio buttons on join request menu, cleaned up code
// version 1.0.1: Public Release
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// Add quick accept all too
// Restructure code to support finding userbars better (if image contains string of group name)?
// ------------------------------ SETTINGS ------------------------------
// Key used to store group name,gid,etc. (Don't change)
const GM_ValAddr = "groupsInfo"; // (Default: 'groupsInfo')

// Hide the 'Group Leader Notice' alert (Disables 'Auto-Decline')
var hideGroupNotice = false; // (Default: false)

// Which select all radio button to default to Options: 'acceptAllRadio','ignoreAllRadio','declineAllRadio'
var defaultSelectAll = "ignoreAllRadio"; // (Default: ignoreAllRadio)

// Auto-Decline: Automatically declines group join requests if any are present
var declineAllAutomatically = false; // (Default: false)

// Debug Mode - Print certain results to console
var debug = false; // (Default: false)
// ------------------------------ ON PAGE LOAD ------------------------------
// Global variables
var uid = $(location).attr('href').replace(/[^0-9]/g, '');
var username = $("span[class*='group']").text();
var my_key;
if(my_post_key === undefined)
    my_key = unsafeWindow.my_post_key;
else
    my_key = my_post_key;
// Profile
if (window.location.href.includes("hackforums.net/member.php?action=profile&uid="))
    runonProfile();
// Join Requests Menu
else if (window.location.href.includes("hackforums.net/managegroup.php?action=joinrequests&gid="))
    runonJoinRequestMenu();
// Member List
else if (window.location.href.includes("hackforums.net/managegroup.php?gid="))
    runonMemberList();
// Decline all
runonEveryHFPage();
// ------------------------------ METHODS ------------------------------
function addUser(gid){
    // Debug purposes
    if(debug){console.log(my_post_key+","+gid+","+username);}
    $.post("/managegroup.php",
           {
        "my_post_key": my_key,
        "action": "do_add",
        "gid": gid,
        "username": username
    },
           function(data,status){
        if(debug){console.log("Add User\nData: " + data + "\nStatus: " + status);}
        location.reload();
    });
}
function removeUser(gid){
    $.post("/managegroup.php",
           {
        "my_post_key": my_key,
        "action": "do_manageusers",
        "gid": gid,
        "removeuser[0]": uid
    },
           function(data,status){
        if(debug){console.log("Remove User\nData: " + data + "\nStatus: " + status);}
        location.reload();
    });
}

// Generate buttons using GID & Group Name
function generateButtons(){
    var tempName = "";
    prevInfo = GM_getValue(GM_ValAddr, false);
    var infoArray = prevInfo.trim().split(',');
    for (var i = 0; i < infoArray.length; i++) {
        // Name
        if (i%3 === 0){
            tempName = infoArray[i].toLowerCase();
        }
        // ID
        else if(i%3 === 1){
            var tempGID = infoArray[i].toString();
            // Group name found via userbar "img[src*=Product]"
            if($("img[src*="+tempName+"]").length >= 1) {
                $("strong:contains('Forum Info')").append($("<button>").text("Remove from "+capitalizeFirstLetter(tempName)).attr("id", tempName).addClass("button").css("margin-left", "20px"));
                $("body").on("click", "#"+tempName, function() { removeUser(tempGID);});
            }
            // Else (userbar not found)
            else {
                $("strong:contains('Forum Info')").append($("<button>").text("Add to "+capitalizeFirstLetter(tempName)).attr("id", tempName).addClass("button").css("margin-left", "20px"));
                $("body").on("click", "#"+tempName, function() { addUser(tempGID);});
            }
        }
    }
}
// Scrap group name, group id, group requests - write to 'cookie'
function getGroupInfo(){
    // Snorlax OP
    var groupInfoArray = []; // (Name, ID, Requests)
    // AJAX HERE
    $.ajax({
        url: "https://hackforums.net/usercp.php?action=usergroups",
        cache: false,
        success: function(response) {
            if (!$(response).find("Groups You Lead")){
                window.alert("Group Management Links 2.0 FAILED!\nGroup privledges not found!");
            }
            else{
                $(response).find("a:contains('View Members')").each(function() {
                    groupInfoArray.push($(this).parent().prev().text()); // Group Name
                    if(debug){console.log(groupInfoArray[0]);}
                    groupInfoArray.push($(this).attr("href").substr(20)); // Group ID
                    if(debug){console.log(groupInfoArray[1]);}
                    groupInfoArray.push($(this).parent().next().text().replace(/[^0-9]/g, '')); // Pending Requests
                    if(debug){console.log(groupInfoArray[2]);}
                });
                GM_setValue(GM_ValAddr, groupInfoArray.join().toString());
            }
            generateButtons();
        }
    });
}

// Capitalize first char
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function runonProfile(){
    var prevInfo;
    // Check for previous group info
    prevInfo = GM_getValue(GM_ValAddr, false);
    if(debug){console.log("prevInfo: "+prevInfo);}
    // Grab group info
    if (!prevInfo)
        getGroupInfo();
    // Load previously saved info
    else
        generateButtons();
}

function runonJoinRequestMenu(){
    var descRow = $(".quick_keys form table tbody tr:eq(1)");
    var radioID = "";
    // 0 = Accept, 1 = Ignore, 2 = Decline
    for (i=2; i < 5; i++){
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
    if(debug){console.log("'allRadio' labels & radio buttons appened.");}
    $('input[type=radio][name=allRadio]').change(function() {
        console.log($(this).attr("id") + " button checked.");
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
}

// Mark all radio buttons with col index
function markAllRadio(colIndex){
    var joinRequestTable = $(".quick_keys form table tbody");
    $(joinRequestTable).find("tr").each(function( index ) {
        if (index === 0 || index === 1){
            // Don't do anything
        } else{
            // Select all radios based on selected -all radio
            $(joinRequestTable).find("tr:eq("+index+") td:eq("+colIndex+") input").prop("checked", true);
        }
    });
}

function runonEveryHFPage(){
    var groupNoticeDiv;
    // Check for pm alert class
    if ($(".pm_alert").length > 0){
        // Check alerts for group notice
        $( ".pm_alert" ).each(function( index ) {
            if ($(this).attr("id") === undefined && $(this).find("Group Leader Notice"))
                groupNoticeDiv = $(this);
        });
    }
    // Group Notice
    if(groupNoticeDiv !== undefined){
        if(debug){console.log("Group Notice Found!");}
        if (hideGroupNotice)
            groupNoticeDiv.hide();
        else{
            // Auto decline on page load
            if(declineAllAutomatically)
                declineAllRequests(groupNoticeDiv,"decline");
            // Append anchor for 'Deny all Requests'
            else{
                $(groupNoticeDiv).append("<br>").append($("<a>").text("(Decline All Requests)").attr("href","#DeclineAllRequests").attr("id","declineAllRequests"));
                $("#declineAllRequests").click(function() {
                    var confirmDeny = window.confirm("Are you sure you want to remove all group requests?");
                    if(confirmDeny){declineAllRequests(groupNoticeDiv,"decline");}
                });
                $("#declineAllRequests")
                    .after($("<a>").text("(Accept All Requests)").attr("href","#AcceptAllRequests").attr("id","acceptAllRequests"))
                    .after($("<a>").text(" | ").removeAttr("href"));
                $("#acceptAllRequests").click(function() {
                    var confirmDeny = window.confirm("Are you sure you want to accept all group requests?");
                    if(confirmDeny){declineAllRequests(groupNoticeDiv,"accept");}
                });
            }
        }
    }
}

// AJAX to decline all join requests
function declineAllRequests(groupNoticeDiv, actionStr){
    var gid;
    var numRequests = 0;
    if(debug){console.log("Decline All Requests Function!");}
    // AJAX to get GID
    $.ajax({
        url: "/usercp.php?action=usergroups",
        cache: false,
        async: false,
        success: function(response) {
            // Get GID
            gid = $(response).find("a:contains(Join Requests)").attr("href").replace(/[^0-9]/g, '');
            if(debug){console.log("Scrapped GID: "+gid);}
        }
    });
    if (actionStr == "accept")
        $("#acceptAllRequests").text("Accepting Requests...");
    else if(actionStr == "decline")
        $("#declineAllRequests").text("Declining Requests...");
    // Wait 1 second, then remove all
    setTimeout(function () {
        var denyJSON = {
            "my_post_key": my_key,
            "action": "do_joinrequests",
            "gid": gid
        };
        // AJAX to deny all requests
        $.ajax({
            url: "/managegroup.php?action=joinrequests&gid="+gid,
            cache: false,
            async: false,
            dataType : "html",
            success: function(response) {
                if(debug){console.log("Loaded Requests Page.");}
                // Deny all
                var tempStr;
                var tempJSON;
                $(response).find("strong:contains(Join Requests for)").parent().parent().parent().find("tr").each(function(rowIndex) {
                    if ($(this).find("td:eq(0) a:eq(0)").attr("href") === undefined){
                        // do nothing
                    }else{
                        // add UID to json
                        tempStr = $(this).find("td:eq(0) a:eq(0)").attr("href").replace(/[^0-9]/g, '');
                        denyJSON[["request["+tempStr+"]"]] = actionStr;
                        if(debug){console.log(denyJSON);}
                        numRequests = rowIndex -2;
                    }
                });
                if(debug){console.log(denyJSON);}
                $.post("/managegroup.php",
                       denyJSON,
                       function(data,status){
                });
            }
        });
        groupNoticeDiv.hide();
    }, 1000);
    if(debug){console.log(numRequests+ " Requests Declined");}
}

// Mark all checkboxs
function runonMemberList(){
    console.log("it works");
    var memberListTable = $("strong:contains(Members in)").parent().parent().parent();
    memberListTable.find("tr:eq(1) td:eq(5)")
        .append($("<input>").attr("id","checkBoxAll").attr("type","checkbox").addClass("checkbox").attr("name","allCheckbox"));
    // Check all
    $('input[type=checkbox][name=allCheckbox]').change(function() {
        var checkStatus = $(this).is(':checked');
        $('input[type=checkbox][class=checkbox]').each(function(rowIndex) {
            $(this).prop('checked', checkStatus);
        });
    });
}