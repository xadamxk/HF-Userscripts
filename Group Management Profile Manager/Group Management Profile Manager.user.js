// ==UserScript==
// @name       Group Management Profile Manager
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.1.0
// @description  Adds group management buttons to profiles (add/remove) for HF leaders
// @require http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match      *://hackforums.net/member.php?action=profile&uid=*
// @match      *://hackforums.net/managegroup.php?action=joinrequests&gid=*
// @copyright  2016+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Group%20Management%20Profile%20Manager/Group%20Management%20Profile%20Manager.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/Group%20Management%20Profile%20Manager/Group%20Management%20Profile%20Manager.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// ------------------------------ Change Log ----------------------------
// version 1.1.0: Implemented Accept/Ignore/Decline all radio buttons on join request menu, cleaned up code
// version 1.0.1: Public Release
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// Add quick deny all?
// ------------------------------ SETTINGS ------------------------------
// Key used to store group name,gid,etc. (Don't change)
const GM_ValAddr = "groupsInfo"; // (Default: 'groupsInfo')
var declineAllAutomatically = true; // (Default: false)
// ------------------------------ ON PAGE LOAD ------------------------------
// Profile
if (window.location.href.includes("hackforums.net/member.php?action=profile&uid="))
    runonProfile();
// Join Requests Menu
else if (window.location.href.includes("hackforums.net/managegroup.php?action=joinrequests&gid="))
    runonJoinRequestMenu();
// Decline all
runonEveryHFPage();
// ------------------------------ METHODS ------------------------------
function addUser(gid){
    var my_key;
    if(my_post_key === undefined)
        my_key = unsafeWindow.my_post_key;
    else
        my_key = my_post_key;
    // Debug purposes
    //window.alert(my_post_key+","+gid+","+username);
    $.post("/managegroup.php",
           {
        "my_post_key": my_key,
        "action": "do_add",
        "gid": gid,
        "username": username
    },
           function(data,status){
        //console.log("Data: " + data + "\nStatus: " + status);
        location.reload();
    });
}
function removeUser(gid){
    var my_key;
    if(my_post_key === undefined)
        my_key = unsafeWindow.my_post_key;
    else
        my_key = my_post_key;
    $.post("/managegroup.php",
           {
        "my_post_key": my_key,
        "action": "do_manageusers",
        "gid": gid,
        "removeuser[0]": uid
    },
           function(data,status){
        //console.log("Data: " + data + "\nStatus: " + status);
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
                    console.log(groupInfoArray[0]);
                    groupInfoArray.push($(this).attr("href").substr(20)); // Group ID
                    console.log(groupInfoArray[1]);
                    groupInfoArray.push($(this).parent().next().text().replace(/[^0-9]/g, '')); // Pending Requests
                    console.log(groupInfoArray[2]);
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

function runonProfile(){
    var prevInfo;
    var uid = $(location).attr('href').replace(/[^0-9]/g, '');
    var username = $("span[class*='group']").text();

    // Check for previous group info
    prevInfo = GM_getValue(GM_ValAddr, false);
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
    console.log("'allRadio' labels & radio buttons appened.");
    $('input[type=radio][name=allRadio]').change(function() {
        console.log($(this).attr("id") + " button checked.");
        switch($(this).attr("id")){
            case "acceptAllRadio": markAllRadio(2);
                break;
            case "ignoreAllRadio": markAllRadio(3);
                break;
            case "declineAllRadio": markAllRadio(4);
                break;
            default : console.log("error");
        }
    });
}

function runonEveryHFPage(){
    // every
}