// ==UserScript==
// @name       PM Enhancements
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.3
// @description  Adds various features to the PM system.
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/GM_config.js
// @require https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/tinycon.min.js
// @match      *://hackforums.net*
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/releases/download/HFPE/PM.Enhancements.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/releases/download/HFPE/PM.Enhancements.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_log
// @grant       GM_info
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.0.3: Replaced update/download URLs with release
// version 1.0.2: Quote Stripping, PM Signature, PM Tracking
// version 1.0.1: Update/Download URLs
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// TODO: Easy Deny Responces? (http://userscripts-mirror.org/scripts/review/163767)
// ------------------------------ SETTINGS ------------------------------
// Siiiike, integrated settings panel
// ------------------------------ On Page ------------------------------
loadSettings();
if ( window.location.href == "https://hackforums.net/private.php" || (window.location.href == "https://hackforums.net/private.php#Settings")){
    onPMSystem();
    if ($("#message_new") > 0){
        stripQuotes();
        pmSignature();
    }
}
else if (window.location.href.includes("hackforums.net/private.php?action=send&pmid=")){
    onPMSend();
}
else if(window.location.href == "https://hackforums.net/private.php?action=tracking"){
    onPMTracking();
}
else if(window.location.href == "https://hackforums.net/private.php?action=send"){
    onPMCompose();
}
onAllPages();

// ------------------------------ Functions ------------------------------
function onPMCompose(){
    pmSignature();
}
function onPMTracking(){
    if(GM_config.get('enablePMTracking')){
        // Read tbody
        var readTable = getTrackingTableBody('Read Messages');
        trackingTableLinks(readTable);
        // Unread tbody
        var unreadTable = getTrackingTableBody('Unread Messages');
        trackingTableLinks(unreadTable);
    }
    // Change label of cancel button so it is more clear
    //$("input[value='Cancel']").text("TEST");

}
function onAllPages(){
    checkPMNotifications();
    hidePMNotice();
}
function onPMSend(){
    stripQuotes();
    pmSignature();
}
function onPMSystem(){
    // Append link for settings
    $("#content").find("a:contains('Download Messages')")
        .after($("<a>").text("PMEN Settings").attr("href","#Settings").attr("id","PMENSettings"))
        .after(" | ");
    // Event handler
    $("#PMENSettings").on( "click", function() {
        GM_config.open();
    });
}
function pmSignature(){
    if(GM_config.get('enablePMSignature')){
        // Format fixer
        if(GM_config.get('enableQuoteStripping') && window.location.href.includes("&pmid="))
            $(".tborder tr:last td:last span").append("<br>");
        // Append option for signature
        $(".tborder tr:last td:last span")
            .append($('<input>').attr({ type: 'checkbox', name:'options[sendMessage]',id:'showSignature'}).addClass("checkbox sendMessage").prop('checked', true))
            .append($("<strong>").text("PM Signature: "))
            .append($('<label>').text("add predefined text to the end of your PMs."));
        // Add new line on page load
        $("#message_new").val($("#message_new").val() + "\n");
        // Add Signature by default
        $("#message_new").val($("#message_new").val() + "\n" + GM_config.get('textPMSignature'));
        // Onclick Event
        $('.sendMessage').on("click",function(){
            if($(this).is(':checked')){
                // get value & add it to message body
                $("#message_new").val($("#message_new").val() + "\n" + GM_config.get('textPMSignature'));
            }
            else{
                // Remove if it exists
                var tempSig = $("#message_new").val();
                if(tempSig.includes(GM_config.get('textPMSignature'))){
                    $("#message_new").val(tempSig.replace(GM_config.get('textPMSignature'),""));
                    // All Hail StackOverflow (http://stackoverflow.com/a/5497333)
                    var pos = $("#message_new").val().lastIndexOf('\n');
                    $("#message_new").val($("#message_new").val().substring(0,pos) + $("#message_new").val().substring(pos+1));
                }
            }
        });
    }
}
function stripQuotes(){
    // PM Quote Remover - updated by myself
    // Credit to Snorlax (http://userscripts-mirror.org/scripts/source/185414.user.js)
    if(GM_config.get('enableQuoteStripping')){
        textarea = $("#message_new");
        GM_setValue("savedMessage", textarea.val());
        replace = textarea.val().replace(/^(\[quote=(?:(?!\[quote=)[\s\S]*?))\[quote=[\s\S]+\[\/quote\]\s*([\s\S]+?\[\/quote\]\s*)$/g, "$1$2\n\n");
        textarea.val(replace);
        $(".tborder tr:last td:last span")
            .append($('<input>').attr({ type: 'checkbox', name:'options[loadMessage]'}).addClass("checkbox loadMessage").prop('checked', true))
            .append($("<strong>").text("Strip Quotes: "))
            .append($('<label>').text("remove all quotes but the last."));
        $('.loadMessage').on("click",function(){
            if($(this).is(':checked'))
                textarea.val(replace);
            else
                textarea.val(GM_getValue("savedMessage"));
        });
    }
}
function hidePMNotice(){
    if(GM_config.get('hidePMNotification')){
        if ($("#pm_notice").length > 0)
            $("#pm_notice").hide();
    }
}
function checkPMNotifications(){
    var numPMs = 0;
    if ($("#pm_notice").length > 0){
        var pmAlert = $("#pm_notice");
        var hasNumber = /\d/;
        var numStr = hasNumber.test(pmAlert.find("strong").text());
        if (numStr)
            numPMs = parseInt(pmAlert.find("strong").text().replace(/[^0-9\.]/g, ''));
        else
            numPMs = 1;
    }
    if(GM_config.get('enableTinyCon')){
        Tinycon.setOptions({
            color: '#000000',
            background: '#ff3b30',
            fallback: true
        });
        // Set icon if page contains PM
        Tinycon.setBubble(numPMs);
    }
    if (GM_config.get('enablePMCheck')){
        // Function to check PM's in background
        var interval = 1000 * 60 * 5; // 1000 milli * 60 secs * x = minutes (No lower than 5 or timeout!)
        setInterval(function(){
            var pmCount = updateFavIcon();
            Tinycon.setBubble(pmCount);
        }, interval);
    }
}
function updateFavIcon(){
    var numPMs = 0;
    var notificationBodyText;
    var notificationBodyLink;
    var titleString;
    $.ajax({
        url: "https://hackforums.net/usercp.php",
        cache: false,
        async: false,
        success: function(response) {
            var pmAlert = $(response).find("#pm_notice");
            var hasNumber = /\d/;
            var numStr = hasNumber.test(pmAlert.find("strong").text());
            if (numStr)
                numPMs = parseInt(pmAlert.find("strong").text().replace(/[^0-9\.]/g, ''));
            else if(pmAlert.find("strong").text().includes("one"))
                numPMs = 1;
            notificationBodyText = $(pmAlert).find("div:eq(1) a:eq(1)").text() + " from "+ $("#pm_notice div:eq(1) a:eq(0)").text();
            notificationBodyLink = $(pmAlert).find("div:eq(1) a:eq(1)").attr("href");
            titleString = numPMs+" Unread Message";
            if (numPMs > 1){titleString = titleString+"s";}
        }
    });
    // Desktop Notifications
    if (GM_config.get('enablePMNotifications') && numPMs > 0){
        notifyMe(titleString,notificationBodyText,notificationBodyLink);
    }
    //console.log("Number of unread PM's: "+numPMs);
    return numPMs;
}
function notifyMe(Title, Comment, Link){
    if (Notification.permission !== "granted"){
        Notification.requestPermission().then(function() {
            if (Notification.permission !== "granted"){
                window.alert("PM Enhancer Userscript: Please allow desktop notifications!");
            } else{
                notififyMe("",Comment, Link);
            }
        });
    }
    else {
        var notification = new Notification(Title, {
            icon: 'https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/Quick%20Rep/NotificationIcon.png',
            requireInteraction: true,
            body: Comment,
        });

        notification.onclick = function () {
            window.location.href = Link;
            notification.close();
        };
        //setTimeout(function() { notification.close(); });
    }
}
function loadSettings(){
    // Get Changelog from meta block
    var tempChangeLog = GM_info.scriptMetaStr.split('//');
    var pmenChangeLog = "";
    for (i = 0; i < tempChangeLog.length; i++){
        if (tempChangeLog[i].includes(GM_info.script.version)){
            var index = tempChangeLog[i].indexOf('version '+GM_info.script.version+':');
            if(index != -1)
                pmenChangeLog = tempChangeLog[i].substring(tempChangeLog[i].indexOf(": ") + 1);
        }
    }
    // Settings
    var configSettings = {
        'hidePMNotification':{
            'label':'Hide PM Notification Alerts:',
            'section': ['PM Tweaks',"An assortment of Private Message modifications."],
            'title':"Hides the alert when you have an unread PM.",
            'type':'checkbox',
            'default':false,
        },
        'enableTinyCon':{
            'label':'Enable favicon badges for PMs:',
            'title':"Adds notification bubble to favicon with number of unread PMs.",
            'type':'checkbox',
            'default':true,
        },
        'enablePMCheck':{
            'label':"Enable Background PMs (Experimental - requires 'favicon badges' enabled):",
            'title':"Checks for new PMs after 5 mins.",
            'type':'checkbox',
            'default':false,
        },
        'enablePMNotifications':{
            'label':"Enable Desktop PM Notifications (Experimental - requires 'Background PMs' enabled'):",
            'title':"Uses the notification API to send desktop notifcations.",
            'type':'checkbox',
            'default':false,
        },
        'enableQuoteStripping':{
            'label':"Quote Stripping (Removes all but the last quote in PMs):",
            'title':"Credits to Snorlax for PM Quote Remover.",
            'type':'checkbox',
            'default':true,
        },
        'enablePMTracking':{
            'label':"PM Tracking Hyperlinks:",
            'title':"Hyperlink titles to the appropriate message in Message Tracking.",
            'type':'checkbox',
            'default':true,
        },
        'enablePMSignature':{
            'label':"PM Signature:",
            'title':"Adds predefined string to the end of all PM's.",
            'type':'checkbox',
            'default':false,
        },
        'textPMSignature':{
            'label':"Signature:",
            'title':"PM Signature.",
            'type':'text',
            'default':'-PM Enhancer Script',
        },
        'PMENversion':{
            'title':'About PM Enhancer',
            'section': ["About PM Enhancer",
                        "Written By: "+GM_info.script.author+
                        "<br>Latest Version: "+!(GM_info.scriptWillUpdate)+
                        "<br>Using Incognito: "+GM_info.isIncognito+
                        "<br>Userscript Manager: "+GM_info.scriptHandler+
                        '<br>Version: '+GM_info.script.version+": "+pmenChangeLog+
                        "<br>Last Updated: "+Date(GM_info.script.lastUpdated)],
            'value': '0',
            'type': 'hidden'
        }
    };
    // Instance of settings
    GM_config.init({
        'id':'PMEN_config',
        'title':"PM Enhancements",
        'fields':configSettings,
        'css': '#PMEN_config {background:#333; color:#CCC; font-size:14px; text:#fff;}'+
        '#PMEN_config .section_header {background:#072948; color:#FFF; border:none; font-size:14px;}'+
        '#PMEN_config .section_desc {background:grey; color:white; border:none; font-size:12px;}'+
        '#PMEN_config .reset {color:white; border:none; font-size:12px;}'+
        '#PMEN_config_buttons_holder {text-align:center}'+
        '#PMEN_config * {font-family:Verdana, Arial, Sans-Serif; font-weight:normal}'+
        '#PMEN_config button {color:#efefef; background-color: #072948; border: 1px solid #000 !important;'+
        'box-shadow: 0 1px 0 0 #0F5799 inset !important; padding: 3px 6px; text-decoration: none; font-family: arial;'+
        'text-shadow: 1px 1px 0px #000; font-size: 14px; font-weight: bold; border-radius: 3px;}'+
        '#PMEN_config button:hover {color: #499FED}'+
        '#PMEN_config input[type="text"] {width:50%;}'+
        '#PMEN_config select {background: #cccccc; border: 1px solid #072948;}'+
        '#PMEN_config_textPMSignature_var, #PMEN_config_enablePMCheck_var, #PMEN_config_enablePMNotifications_var {padding-left:15px}'
    });
}
function trackingTableLinks(table){
    table.find("tr").each(function( index ) {
        var messageID;
        if($(this).find(".checkbox").attr("name") !== undefined){
            $(this).find("td:eq(1)").html('<a href="https://hackforums.net/private.php?action=read&pmid='+
                                          (parseInt($(this).find(".checkbox").attr("name").replace(/\D/g,''))+1)+'">'+
                                          $(this).find("td:eq(1)").text()+'</a>');
        }
    });
}
function getTrackingTableBody(string){
    return $(".quick_keys").find("strong:contains('"+string+"')").parent().parent().parent();
}