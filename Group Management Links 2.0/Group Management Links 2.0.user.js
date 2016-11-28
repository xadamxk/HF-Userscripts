// ==UserScript==
// @name       Group Management Links 2.0
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    2.0
// @description  Adds group management links to the HF toolbar (automated - grabs group info)
// @require http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/Group%20Management%20Links%202.0/Group%20Management%20Links%202.0.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
// ------------------------------ ON PAGE LOAD ------------------------------
var debug = false;

if(debug){
    //Debug Purposes
    GM_deleteValue("groupInfo");
}
else{
    // Check for previous group info
    var prevInfo = GM_getValue("groupInfo", false);
    // Load previously saved info
    if (prevInfo)
        setGroupInfo();
    // Grab group info
    else{
        getGroupInfo();
        prevInfo = GM_getValue("groupInfo", false);
        setGroupInfo();
    }
}

// Show Button on hackforums.net/usercp.php?action=usergroups
if (~window.location.href.indexOf("//hackforums.net/usercp.php?action=usergroups") && !(window.location.href.includes("action=joinrequests"))){
    // Insert button
    $("strong:contains('Groups You Lead')").append($("<button>").text("Update Groups").attr("id", "groupButton").addClass("button").css("margin-left", "20px"));
    $("body").on("click", "#groupButton", function() { getGroupInfo();});
}

// ------------------------------ METHODS ------------------------------


// Scrap group name, group id, group requests - write to "groupInfo" 'cookie'
function getGroupInfo(){
    // Snorlax OP
    var groupInfoArray = []; // (Name, ID, Requests)
    if (!$("a:contains('View Members')")){
    window.alert("Group Management Links 2.0 FAILED!\nGroup privledges not found!");
    }
    else{
        $("a:contains('View Members')").each(function() {
            groupInfoArray.push($(this).parent().prev().text()); // Group Name
            console.log(groupInfoArray[0]);
            groupInfoArray.push($(this).attr("href").substr(20)); // Group ID
            console.log(groupInfoArray[1]);
            groupInfoArray.push($(this).parent().next().text().replace(/[^0-9]/g, '')); // Pending Requests
            console.log(groupInfoArray[2]);
        });
        GM_setValue("groupInfo", groupInfoArray.join().toString());
    }
}

// Write "groupInfo" to HTML
function setGroupInfo(){
    var infoArray = prevInfo.trim().split(',');
    // Debug Info
    //window.alert(infoArray + " | Count:" + infoArray.length);
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
    document.getElementById('panel').innerHTML= document.getElementById('panel').innerHTML.replace(regex,revised);
}