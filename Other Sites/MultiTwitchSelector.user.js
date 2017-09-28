// ==UserScript==
// @name       Multi Twitch Selector
// @author xadamxk
// @namespace  https://github.com/xadamxk
// @version    1.0.0
// @description Adds a selector in twitch to view multiple streams using MultiTwitch.com
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://www.twitch.tv/directory/following
// @match      *://www.twitch.tv/directory/following/live
// @copyright  2017+
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Release
// ------------------------------ Dev Notes -----------------------------
// Live Channels Section ID:      #directory-list
// Streaner Name Class:           .qa-live-streams
// Add to other parts of twitch in the future?
// ------------------------------ SETTINGS ------------------------------
//
// ------------------------------ Code ------------------------------
var streamerList = [];
var myInterval = setInterval(function() {
    if(streamerList.length === 0){
        $( "#directory-list" ).find(".js-channel-link").each(function( index ) {
            streamerList.push($(this).text().replace(/^\s+|\s+$/g, "").replace(/\s/g, '').toLowerCase());
        });
    }  else{
        clearInterval(myInterval);
        successFunction();
    }
    //console.log("List not found...");
}, 1000);

function successFunction(){
    // Test list
    console.log(streamerList);
    // Concat HTML from streamer list
    var myLiveChannelSelector = '<select multiple id="liveChannelSelection" size="' + streamerList.length + '" style="height: 100%;">';
    for (i = 0; i < streamerList.length; ++i) {
        myLiveChannelSelector += "<option value='" + streamerList[i] + "'>" + streamerList[i] + "</option>";
    }
    myLiveChannelSelector += "</select>";
    // Append selector list
    $("h4:contains(Live Channels)").after(myLiveChannelSelector);
    // Append button after list
    $("#liveChannelSelection").after("<br><button id='liveChannelButton' type='button'>Watch Em!</button>");
    // Button event listener
    $("#liveChannelButton").click(function() {
        var selectedChannels = "";
        // Loop through selected streams
        $("#liveChannelSelection option:selected").each(function( index ) {
            if (this.value !== undefined){
                selectedChannels += "/" + this.value;
            }
        });
        // Test formated selected string
        console.log(selectedChannels);
        // New tab with multitwitch
        var url = "http://multitwitch.tv" + selectedChannels;
        window.open(url, "_blank");
    });
}
