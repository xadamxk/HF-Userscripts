// ==UserScript==
// @name       HF PM Push Notifications
// @author xadamxk
// @namespace  https://github.com/xadamxk/
// @version    1.0.1
// @description  Receive push notifications for PMs from HF.
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://?????
// @copyright  2017+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.0.1: UID -> Username in notifications
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// 
// ------------------------------ SETTINGS ------------------------------
// HF API Key
var apikey = "";
// Pushover API Token
var pushoverAPIToken = "";
// Pushover UserKey
var pushoverUserKey = "";
// Site
var siteAPI = "";
// Dateline List
var datelineList = [];
// Check interval
var interval = 1000 * 60 * 10; // 1000 milli * 60 secs * x = minutes (No lower than 5 or timeout!)
// ------------------------------ On Page ------------------------------
setInterval(function(){
var xhr = new XMLHttpRequest();
xhr.open('GET', "https://"+siteAPI+"/apicall.php?key="+apikey+"&inbox", false); // true for async
xhr.send();

var jsonObj = steralizeJson(xhr.response);
// Json Response
console.log(jsonObj);

// Get list of pm ids
$.each(jsonObj.result.pminfo, function(pmID, item) {
    // If message is unread
    if($(this)[0].status == "0"){
        generateOutput(pmID,$(this)[0].dateline,$(this)[0].sender,$(this)[0].subject);
    }
});
}, interval);
// ------------------------------ Functions ------------------------------
// Generate output info
function generateOutput(pmid,date,sender,subject){
    var existingRecord = false;
    for (var i = 0; i < datelineList; i++) {
        if(datelineList[i] == date)
            existingRecord = true;
    }
    // If not existing
    if (!existingRecord){
        // Add to list
        datelineList.push(date);
        // Get username of uid
        var xhrUsername = new XMLHttpRequest();
        xhrUsername.open('GET', "https://"+siteAPI+"/apicall.php?key="+apikey+"&uid="+sender, false); // true for async
        xhrUsername.send();
        var jsonObjname = steralizeJson(xhrUsername.response);
        // Send notification
        $.post("https://api.pushover.net/1/messages.json",
               {
            "token": pushoverAPIToken,
            "user": pushoverUserKey,
            "message": "From: "+jsonObjname.result.username+".",
            "title": "New Mesage: "+subject,
            "url": "https://"+siteAPI+"/private.php?action=read&pmid="+pmid,
            "url_title": "Click to Open PM",
            "timestamp": date
        },
               function(data,status){
            if(debug){console.log("Add User\nData: " + data + "\nStatus: " + status);}
        });
    }
}
// Returns true if request fails
function isError(json){
    return json.success ? false : true;
}
// Sterilizes json obj
function steralizeJson(json){
    if(isJsonValid(json))
        return JSON.parse(json);
}
// Returns true if valid json
function isJsonValid(json){
    return JSON.parse(json) ? true : false;
}
// Epoch to Json Date http://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date-with-javascript
function epochToJsDate(ts){
    // ts = epoch timestamp
    // returns date obj
    return new Date(ts*1000);
}