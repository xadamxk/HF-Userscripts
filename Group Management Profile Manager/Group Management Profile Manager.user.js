// ==UserScript==
// @name       Group Management Profile Manager
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    0.1
// @description  Adds group management buttons to profiles (add/remove) for HF leaders
// @require http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match      *hackforums.net/member.php?action=profile&uid=*
// @copyright  2016+
// @updateURL 
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
// WIP
// ------------------------------ ON PAGE LOAD ------------------------------
var prevInfo;
const GM_ValAddr = "groupsInfo";
var uid = $(location).attr('href').replace(/[^0-9]/g, '');
var username = $("span[class*='group']").text();




// Check for previous group info
    prevInfo = GM_getValue(GM_ValAddr, false);
    // Grab group info
    if (!prevInfo)
        getGroupInfo();
    // Load previously saved info
    else{
        generateButtons();
    }


// ------------------------------ METHODS ------------------------------
function addUser(gid){
    $.post("https://www.hackforums.net/managegroup.php",
    {
        "my_post_key": my_post_key,
        "action": "do_add",
        "gid": gid,
        "username": username
    },
        function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        location.reload();
    });
}

function removeUser(gid){
    $.post("https://www.hackforums.net/managegroup.php",
    {
        "my_post_key": my_post_key,
        "action": "do_manageusers",
        "gid": gid,
        "removeuser[0]": uid
    },
        function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
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
           // Group name found via userbar "img[src*=Product]"
            if($("img[src*="+tempName+"]").length >= 1) {
                $("strong:contains('Forum Info')").append($("<button>").text("Remove from "+capitalizeFirstLetter(tempName)).attr("id", tempName).addClass("button").css("margin-left", "20px"));
                $("body").on("click", "#"+tempName, function() { addUser(infoArray[i]);});
            }
            // Else (userbar not found)
            else {
                $("strong:contains('Forum Info')").append($("<button>").text("Add to "+capitalizeFirstLetter(tempName)).attr("id", tempName).addClass("button").css("margin-left", "20px"));
                $("body").on("click", "#"+tempName, function() { removeUser(infoArray[i]);});
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