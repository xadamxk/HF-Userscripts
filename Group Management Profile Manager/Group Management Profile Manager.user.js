// ==UserScript==
// @name       HF Group Management
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    2.0.5
// @description  Adds improved group management options for HF leaders.
// @require http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match      *://hackforums.net/*
// @match      *://hackforums.net*
// @copyright  2016+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// @updateURL https://github.com/xadamxk/HF-Userscripts/releases/download/HFGM/Group.Management.Profile.Manager.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/releases/download/HFGM/Group.Management.Profile.Manager.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// ------------------------------ Change Log ----------------------------
// version 2.0.5: Removed console.log statements
// version 2.0.4: Replaced update/download URLs with release
// version 2.0.3: Added alt row highlighting on member/request lists.
// version 2.0.2: Group Leader Notice now links to your group's requests page
// version 2.0.1: Bug fix - Centered 'select all' checkbox on member list page
// version 2.0.0: Implemented 'Group Management Links 2.0' - https://hackforums.net/showthread.php?tid=5477859
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
// Restructure code to support finding userbars better (hf news)
// GM_deleteValue("groupInfo");
// ------------------------------ SETTINGS ------------------------------
// Key used to store group name,gid,etc. (Don't change)
const GM_ValAddr = "groupsInfo"; // (Default: 'groupsInfo')

// Hide the 'Group Leader Notice' alert (Disables 'Auto-Decline')
var hideGroupNotice = false; // (Default: false)

// Which select all radio button to default to Options: 'acceptAllRadio','ignoreAllRadio','declineAllRadio'
var defaultSelectAll = "ignoreAllRadio"; // (Default: ignoreAllRadio)

// Auto-Decline: Automatically declines group join requests if any are present
var declineAllAutomatically = false; // (Default: false)

// Links 'Group Leader Notice' to group requests
var linkGroupLeaderNotice = true; // (Default: true)

// Alternate Row Highlighting (member/request list)
var colorAltRows = true; // (Default: true)

// Debug Mode - Print certain results to console
var debug = false; // (Default: false)
// ------------------------------ ON PAGE LOAD ------------------------------
// Global variables
var uid = $(location).attr('href').replace(/[^0-9]/g, '');
var username = $("span[class*='group']").text();
var my_key;
var prevInfo;
if(my_post_key === undefined)
    my_key = unsafeWindow.my_post_key;
else
    my_key = my_post_key;
// Profile (Add/Remove Button)
if (window.location.href.includes("hackforums.net/member.php?action=profile&uid="))
    runonProfile();
// Join Requests Menu (Select All)
else if (window.location.href.includes("hackforums.net/managegroup.php?action=joinrequests&gid="))
    runonJoinRequestMenu();
// Member List (Select All)
else if (window.location.href.includes("hackforums.net/managegroup.php?gid="))
    runonMemberList();
// Add 'Update Group' button (Updates gid for links)
else if(window.location.href.includes("https://hackforums.net/usercp.php?action=usergroups") && !(window.location.href.includes("action=joinrequests"))){
    runonGroupMembership();
}
// Group Leader Notice (Quick Accept/Deny, Link notice to Requests)
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
    if (colorAltRows){
        // Add odd/even rows
        $("strong:contains(Join Requests for)").parent().parent().parent().parent().attr("id","selectedTable");
        alternateRows("selectedTable");
        var altColor = $("#selectedTable tr:eq(1) td:eq(0)").css("background-color");
        if(debug){console.log("Alternate Color (request list): "+altColor);}
        // Color odd/even rows
        $("#selectedTable .odd").children().css("background-color",shadeRGBColor(altColor, 0.01));
        //$("#selectedTable .even").children().css("background-color",shadeRGBColor(altColor, 0.01));
    }
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
    if(debug){console.log(GM_getValue("groupInfo", "groupInfo EMPTY"));}
    // Check for previous group info
    prevInfo = GM_getValue("groupInfo", false);
    // Grab group info
    if (!prevInfo)
        getGroupInfo();
    // Load previously saved info
    else
        setGroupInfo();
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
            var gid = 0;
            // Check for previous group info
            prevInfo = GM_getValue("groupInfo", false);
            // Grab group info
            if (!prevInfo)
                getGroupInfo();
            var infoArray = prevInfo.trim().split(',');
            gid = infoArray[1];
            // Link 'Group Leader Notice' with requests page
            if (linkGroupLeaderNotice){
                console.log($(groupNoticeDiv).find("a:eq(0)").attr("href","http://www.hackforums.net/managegroup.php?action=joinrequests&gid="+gid));
                if(debug){console.log("Link Group Leader Notice: "+linkGroupLeaderNotice+ ","+gid);}
            }
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
    if(debug){console.log("All Requests Function!");}
    // Check for previous group info
    prevInfo = GM_getValue("groupInfo", false);
    // Grab group info
    if (!prevInfo)
        getGroupInfo();
    var infoArray = prevInfo.trim().split(',');
    gid = infoArray[1];
    // Update user string
    if (actionStr == "accept")
        $("#acceptAllRequests").text("Accepting Requests...");
    else if(actionStr == "decline")
        $("#declineAllRequests").text("Declining Requests...");
    // Run 'all' action
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
    if(debug){console.log(numRequests+ " Requests Declined");}
}

// Mark all checkboxs
function runonMemberList(){
    var memberListTable = $("strong:contains(Members in)").parent().parent().parent().attr("id","selectedTable");
    memberListTable.find("tr:eq(1) td:eq(5)")
        .append($("<input>").attr("id","checkBoxAll").attr("type","checkbox").addClass("checkbox").attr("name","allCheckbox"));
    // Center textbox
    $("#checkBoxAll").parent().css("text-align","center").css("vertical-align","middle");
    // Check all
    $('input[type=checkbox][name=allCheckbox]').change(function() {
        var checkStatus = $(this).is(':checked');
        $('input[type=checkbox][class=checkbox]').each(function(rowIndex) {
            $(this).prop('checked', checkStatus);
        });
    });
    if (colorAltRows){
        // Add odd/even rows
        alternateRows("selectedTable");
        var altColor = $("#selectedTable tr:eq(1) td:eq(0)").css("background-color");
        if(debug){console.log("Alternate Color (member list): "+altColor);}
        // Color odd/even rows
        //$("#selectedTable .odd").children().css("background-color","#111111");
        $("#selectedTable .even").children().css("background-color",shadeRGBColor(altColor, 0.05));
    }
}

// Add 'Update Group' button
function runonGroupMembership(){
    // Insert button
    $("strong:contains('Groups You Lead')").append($("<button>").text("Update Groups").attr("id", "groupButton").addClass("button").css("margin-left", "20px"));
    $("body").on("click", "#groupButton", function() { getGroupInfo();});
}

// Scrap group name, group id, group requests - write to "groupInfo" 'cookie'
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
                GM_setValue("groupInfo", groupInfoArray.join().toString());
            }
            prevInfo = GM_getValue("groupInfo", false);
            setGroupInfo();
        }
    });
}

// Write "groupInfo" to HTML
function setGroupInfo(){
    var infoArray = prevInfo.trim().split(',');
    // Debug Info
    if(debug){console.log(infoArray + " | Count:" + infoArray.length);}
    var regex = "User CP</strong></a>";
    var revised = "User CP</strong></a>";
    var nameTemp;
    var idTemp;
    for (var i = 0; i < infoArray.length; i++) {
        // Name
        if (i%3 === 0)
            nameTemp = infoArray[i];
        // ID
        if(i%3 === 1)
            idTemp = infoArray[i];
        // Build String (requestions could also go here)
        if(i%3 === 2)
            revised += " &mdash; <a href='http://www.hackforums.net/managegroup.php?gid="+idTemp+"'><strong>"+nameTemp+" Members</strong>"+
                "</a> &mdash; <a href='http://www.hackforums.net/managegroup.php?action=joinrequests&gid="+idTemp+"'><strong>"+nameTemp+" Requests</strong></a>";
    }
    // Set string
    $("#panel").html($("#panel").html().replace(regex,revised));
}
// Source: http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
function shadeRGBColor(color, percent) {
    var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
    return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}
// Source: https://www.sitepoint.com/background-colors-javascript/
function alternateRows(id){
    if(document.getElementsByTagName){
        var table = document.getElementById(id);
        var rows = table.getElementsByTagName("tr");
        for(i = 0; i < rows.length; i++){
            //manipulate rows
            if (i > 1){
                if(i % 2 === 0)
                    rows[i].className = "even";
                else
                    rows[i].className = "odd";
            }
        }
    }
}