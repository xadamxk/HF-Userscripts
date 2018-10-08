// ==UserScript==
// @name       HF PM Push Notifications
// @author xadamxk
// @namespace  https://github.com/xadamxk/
// @version    1.0.2
// @description  Receive push notifications for PMs from HF.
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/apikey.php
// @copyright  2017+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.0.2: Updated endpoints with newest HF API (v1), Fixed memory logic
// version 1.0.1: UID -> Username in notifications
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// 
// ------------------------------ SETTINGS ------------------------------
var debug = false;
// HF API Key
var apikey = "";
// Pushover API Token
var pushoverAPIToken = "";
// Pushover UserKey
var pushoverUserKey = "";
// Site
var siteAPI = "hackforums.net";
// Dateline List
var datelineList = [];
// Check interval
var interval = 1000 * 60 * 5; // 1000 milli * 60 secs * x = minutes (No lower than 5 or timeout!)
// ------------------------------ On Page ------------------------------
setInterval(function(){
var xhr = new XMLHttpRequest();
xhr.open('GET', "https://"+siteAPI+"/api/v1/inbox", false); // true for async
xhr.setRequestHeader("Authentication","Basic am52b1FpWUJWSHljSTJGZWNKeU1JeVlyN0hZUjRuTDc6");
xhr.send();

var jsonObj = steralizeJson(xhr.response);
// Json Response
if(debug){console.log(jsonObj);}

// Get list of pm ids
$.each(jsonObj.result.pms, function(item) {
    // If message is unread
    if($(this)[0].status == "0"){
        generateOutput($(this)[0].pmid,$(this)[0].dateline,$(this)[0].senderusername,$(this)[0].subject);
    }
});
}, interval);
// ------------------------------ Functions ------------------------------
// Generate output info
function generateOutput(pmid,date,senderusername,subject){
    var existingRecord = false;
    console.log(datelineList);
    for (var i = 0; i < datelineList.length; i++) {
        if(debug){console.log("List: " + datelineList[i]);}
        if(debug){console.log("Date: " + date);}
        if(datelineList[i] == date)
            if (debug){console.log("Existing Record Found!");}
            existingRecord = true;
    }
    // If not existing
    if (!existingRecord){
        if (debug){console.log("New Record Found!");}
        // Add to list
        datelineList.push(date);
        // Send notification
        $.post("https://api.pushover.net/1/messages.json",
               {
            "token": pushoverAPIToken,
            "user": pushoverUserKey,
            "message": "From: "+senderusername,
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