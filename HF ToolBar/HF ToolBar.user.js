// ==UserScript==
// @name       HF ToolBar
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.5
// @description  Adds a toolbar with various options to the top of HF.
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/jquery.sticky.js
// @require https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/GM_config.js
// @require https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/tinycon.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js
// @require http://sandbox.scriptiny.com/tinybox2/tinybox.js
// @run-at document-start
// @match      *://hackforums.net*
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20ToolBar/HF%20ToolBar.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/raw/master/HF%20ToolBar/HF%20ToolBar.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_log
// @grant       GM_info
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.0.5: Implemented extractable Buddy List.
// version 1.0.4: Load HFTB Messages in new tab setting, current page highlight color & settings.
// version 1.0.3: Home link setting, favicon notifications, and PM updates
// version 1.0.2: Code restructure, bug fixes, small changes.
// version 1.0.1: Implemented Quick Links, Ability to hide shortcuts, and bug fixes.
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// Note: Tiny Box: http://puu.sh/2QUaB.js - https://github.com/nonfiction/nterchange3-extras/tree/master/tinybox2/public_html/javascripts/tinybox2
// Note: Color compliments: http://www.colorhexa.com/1f8ef1, https://color.adobe.com, http://www.colorschemer.com/online.html
// Note: bullet Color: #0F5799
// Note: Good green: #1ff182
// Note: Good orange: #f4b94f
// TODO: Buddy list implementation - iFrame?
// TODO: Saved threads - ?
// Note: Draggable: https://jqueryui.com/draggable/
// ------------------------------ SETTINGS ------------------------------
// Get Changelog from meta block
var tempChangeLog = GM_info.scriptMetaStr.split('//');
var hftbChangeLog = "";
for (i = 0; i < tempChangeLog.length; i++){
    if (tempChangeLog[i].includes(GM_info.script.version)){
        var index = tempChangeLog[i].indexOf('version '+GM_info.script.version+':');
        if(index != -1)
            hftbChangeLog = tempChangeLog[i].substring(tempChangeLog[i].indexOf(": ") + 1);
    }
}
// Settings
var configSettings = {
    'showShortcut1':{
        'label':'Show Home Shortcut:',
        'section': ['Shortcuts',"Shortcuts located on the left of HFTB."],
        'type':'checkbox',
        'default':true,
    },
    'shortcut1Link':{
        'label':'Home Link:',
        'title':'Create a home location.',
        'type':'text',
        'default':'https://hackforums.net/usercp.php',
    },
    'showShortcut2':{
        'label':'Show Buddies Shortcut:',
        'type':'checkbox',
        'default':true,
    },
    'enableBuddyPopout':{
        'label':'Enable Retractable Buddy List:',
        'title':'Makes a draggable Buddy List popout.',
        'type':'checkbox',
        'default':true,
    },
    'showShortcut3':{
        'label':'Show Saved Shortcut:',
        'title':'This doesnt do anything yet.',
        'type':'checkbox',
        'default':true,
    },
    'showShortcut4':{
        'label':'Show Messages Shortcut:',
        'title':'Hyperlinks to new PMs/ create new PM.',
        'type':'checkbox',
        'default':true,
    },
    'showIconLabels':{
        'label':'Show Icon Labels:',
        'section': ['HFTB Utilities',"Customize the appearance of HFTB."],
        'type':'checkbox',
        'default':false,
    },
    'iconLabelSpacer':{
        'label':'Icon Label Spacer:',
        'title':'Spacer between icons/labels in HFTB.',
        'type':'select',
        'options':{
            'default':'-',
            'pipe':'|',
            'colon':':',
            'space':'(none)'
        },
        'default':'default',
    },
    'enableActiveIcons':{
        'label':'Enable Active Icons:',
        'title':'Icons/Text change colors based on different events.',
        'type':'checkbox',
        'default':true,
    },
    'stickToolbar':{
        'label':"Enable 'Sticky' Toolbar (experimental):",
        'title':"Makes the toolbar stick to the top of the screen when scrolling.",
        'type':'checkbox',
        'default':true,
    },
    'enableCurrentPageColor':{
        'label':"Enable Current Page Highlight:",
        'title':"If you are on one of the HFTB links, it will color that icon.",
        'type':'checkbox',
        'default':true,
    },
    'customCurrentPageColor':{
        'label':"Color:",
        'title':"Hex color used for Current Page Highlights.",
        'type':'text',
        'default':'#F4B94F',
    },
    'showQL1':{
        'label':'Show Quick Link #1:',
        'section': ['Quick Links',"Add shortcuts to other HF pages."],
        'type':'checkbox',
        'default':true,
    },
    'quickLinks_1Text':{
        'label':'#1 Text:',
        'type':'text',
        'default':'Lounge',
    },
    'quickLinks_1Link':{
        'label':'#1 Link:',
        'type':'text',
        'default':'https://hackforums.net/forumdisplay.php?fid=25',
    },
    'spacer1':{
        'value': '0',
        'type': 'hidden'
    },
    'showQL2':{
        'label':'Show Quick Link #2:',
        'type':'checkbox',
        'default':true,
    },
    'quickLinks_2Text':{
        'label':'#2 Text:',
        'type':'text',
        'default':'RANF',
    },
    'quickLinks_2Link':{
        'label':'#2 Link:',
        'type':'text',
        'default':'https://hackforums.net/forumdisplay.php?fid=2'
    },
    'spacer2':{
        'value': '0',
        'type': 'hidden'
    },
    'showQL3':{
        'label':'Show Quick Link #3:',
        'type':'checkbox',
        'default':true,
    },
    'quickLinks_3Text':{
        'label':'#3 Text:',
        'type':'text',
        'default':'Groups',
    },
    'quickLinks_3Link':{
        'label':'#3 Link:',
        'type':'text',
        'default':'https://hackforums.net/forumdisplay.php?fid=53',
    },
    'spacer3':{
        'value': '0',
        'type': 'hidden'
    },
    'showQL4':{
        'label':'Show Quick Link #4:',
        'type':'checkbox',
        'default':true,
    },
    'quickLinks_4Text':{
        'label':'#4 Text:',
        'type':'text',
        'default':'PM Tracking',
    },
    'quickLinks_4Link':{
        'label':'#4 Link:',
        'type':'text',
        'default':'https://hackforums.net/private.php?action=tracking',
    },
    'spacer4':{
        'value': '0',
        'type': 'hidden'
    },
    'showQL5':{
        'label':'Show Quick Link #5:',
        'type':'checkbox',
        'default':true,
    },
    'quickLinks_5Text':{
        'label':'#5 Text:',
        'type':'text',
        'default':'Web Browsers',
    },
    'quickLinks_5Link':{
        'label':'#5 Link:',
        'type':'text',
        'default':'https://hackforums.net/forumdisplay.php?fid=247',
    },
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
    'openPMNewTab':{
        'label':"Load messages from HFTB in a new tab:",
        'title':"Make HFTB Message icon open messages in a new tab",
        'type':'checkbox',
        'default':false,
    },
    'HFTBversion':{
        'title':'About HFTB',
        'section': ["About HFTB",
                    "Written By: "+GM_info.script.author+
                    "<br>Latest Version: "+!(GM_info.scriptWillUpdate)+
                    "<br>Using Incognito: "+GM_info.isIncognito+
                    "<br>Userscript Manager: "+GM_info.scriptHandler+
                    '<br>Version: '+GM_info.script.version+": "+hftbChangeLog+
                    "<br>Last Updated: "+Date(GM_info.script.lastUpdated)],
        'value': '0',
        'type': 'hidden'
    }
};
// ------------------------------ On Page Load---------------------------
// Inject font-awesome.css (Thank you: http://www.freeformatter.com/javascript-escape.html)
$("head").append('<link '+ "href='https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/font-awesome\/4.7.0\/css\/font-awesome.css'" + 'rel="stylesheet" type="text/css">');
$("head").append('<link '+ "href='https:\/\/cdn.rawgit.com\/xadamxk\/HF-Userscripts\/9bf86deb\/JS%20Libraries\/tinybox.css'" + 'rel="stylesheet" type="text/css">');
// Create toolbar
createStickyHeader();
// Stick toolbar
stickStickyHeader();
// Shortcut event listener example:
if(GM_config.get('showShortcut2')){
    $("#leftSticky a:eq("+getShortcutEnabledIndex("showShortcut2")+")").click(function(){
        // Method
        showBuddyContainer();
    });
}
// Settings event listener
$("#leftSticky a:eq("+numShortcutsEnabled()+")").click(function(){GM_config.open();});
// Save button event listener
// Append quick links to toolbar
appendQuickLinks();
// Add spacers to toolbar
addSpacersToHeader();
// Hide PM Alert
hidePMNotice();
// Check for PM Notifications
checkPMNotifications();
// Check current page (color if found on toolbar)
checkforCurrentPage();

// ------------------------------ Functions ---------------------------
function createStickyHeader(){
    var headerHeight = "18px";
    var ariaHidden = "true";
    var showIconLabels = true;

    GM_config.init({
        'id':'HFTB_config',
        'title':"HF Toolbar",
        'fields':configSettings,
        'css': '#HFTB_config {background:#333; color:#CCC; font-size:14px; text:#fff;}'+
        '#HFTB_config .section_header {background:#072948; color:#FFF; border:none; font-size:14px;}'+
        '#HFTB_config .section_desc {background:grey; color:white; border:none; font-size:12px;}'+
        '#HFTB_config .reset {color:white; border:none; font-size:12px;}'+
        '#HFTB_config_buttons_holder {text-align:center}'+
        '#HFTB_config * {font-family:Verdana, Arial, Sans-Serif; font-weight:normal}'+
        '#HFTB_config button {color:#efefef; background-color: #072948; border: 1px solid #000 !important;'+
        'box-shadow: 0 1px 0 0 #0F5799 inset !important; padding: 3px 6px; text-decoration: none; font-family: arial;'+
        'text-shadow: 1px 1px 0px #000; font-size: 14px; font-weight: bold; border-radius: 3px;}'+
        '#HFTB_config button:hover {color: #499FED}'+
        '#HFTB_config select {background: #cccccc; border: 1px solid #072948;}'+
        '#HFTB_config input[type="text"] {width:50%;}'+ // '#HFTB_config_spacer1_var,#HFTB_config_spacer2_var,#HFTB_config_spacer3_var,#HFTB_config_spacer4_var {height:10px;}'
        '#HFTB_config_quickLinks_1Text_var,#HFTB_config_quickLinks_2Text_var,#HFTB_config_quickLinks_3Text_var,#HFTB_config_quickLinks_4Text_var,#HFTB_config_quickLinks_5Text_var,'+
        '#HFTB_config_quickLinks_1Link_var,#HFTB_config_quickLinks_2Link_var,#HFTB_config_quickLinks_3Link_var,#HFTB_config_quickLinks_4Link_var,#HFTB_config_quickLinks_5Link_var,'+
        '#HFTB_config_shortcut1Link_var, #HFTB_config_customCurrentPageColor_var, #HFTB_config_enableBuddyPopout_var {padding-left:15px}'
    });
    // Set values based on settings
    // Icon Labels
    if(GM_config.get('showIconLabels')){
        showIconLabels = true;
    } else{
        showIconLabels = false;
    }
    // Create toolbar
    $("#panel").append($("<div>").attr("id","Sticky")
                       .css("height","22px").css("background-color","#333333")
                       .css("border-style","solid").css("border-color","white").css("border-width","0px 0px 1px 0px")
                       .css("display","flex").css("align-items","center").css("z-index","100"));
    // Left
    $("#Sticky").append($("<div>").attr("id","leftSticky").addClass("float_left").text("")
                        .css("padding-left","5px").css("display","block").css("height",headerHeight));
    if(GM_config.get('showShortcut1')){
        // Home
        $("#leftSticky").append($("<a>").attr("href",GM_config.get('shortcut1Link')).attr("onClick","").attr("title","Home")
                                .append($("<i>").attr("id","homeLeftSticky").addClass("fa fa-home fa-lg")));
    }
    if(GM_config.get('showShortcut2')){
        // Buddies
        $("#leftSticky").append($("<a>").attr("href","#Buddies").attr("onclick","")
                                .append($("<i>").attr("id","buddiesLeftSticky").addClass("fa fa-users")));
    }
    if(GM_config.get('showShortcut3')){
        // Saved
        $("#leftSticky").append($("<a>").attr("href","#").attr("onClick","")
                                .append($("<i>").attr("id","savedLeftSticky").addClass("fa fa-floppy-o fa-lg")));
    }
    // If PM notice
    var shortcut4Link = "https://hackforums.net/private.php?action=send";
    var shortcut4Text = "New Message";
    var shortcut4NewPM = false;
    // New PM
    if ($("#pm_notice").length > 0){
        // Active Icons
        if(GM_config.get('enableActiveIcons')){
            shortcut4NewPM = true;
            shortcut4Text = $("#pm_notice div:eq(1) a:eq(1)").text() + " from "+ $("#pm_notice div:eq(1) a:eq(0)").text();
            shortcut4Link = $("#pm_notice div:eq(1) a:eq(1)").attr("href");}
    }
    if(GM_config.get('showShortcut4')){
        // PMs
        $("#leftSticky").append($("<a>").attr("href",shortcut4Link).attr("title",shortcut4Text)
                                .append($("<i>").attr("id","pmLeftSticky").addClass("fa fa-comments fa-lg")));
        if (GM_config.get('openPMNewTab')){
            $("#leftSticky a").attr("target","_blank");
        }
        // If new PM & enableActiveIcons
        if(shortcut4NewPM){
            $("#pmLeftSticky").css("color","#ff3b30");
        }
    }
    // Settings (left)
    $("#leftSticky").append($("<a>").attr("href","#Settings").attr("onClick","").attr("title","Settings")
                            .append($("<i>").attr("id","settingsleftSticky").addClass("fa fa-cog fa-lg")));
    // Right
    $("#Sticky").append($("<div>").attr("id","rightSticky").css("float","right").text("")
                        .css("padding-right","5px").css("padding-left","5px").css("display","block").css("height",headerHeight));
    // Settings (right)
    //$("#rightSticky").append($("<a>").attr("href","#").attr("onClick","").append($("<i>").attr("id","settingsRightSticky").addClass("fa fa-cog fa-lg")));
    // Icon Labels
    if(showIconLabels){
        var count = 0;
        // Left
        if(GM_config.get('showShortcut1')){
            $("#leftSticky a:eq("+count+") i:eq(0)").after(" Home");
            count++;}
        if(GM_config.get('showShortcut2')){
            $("#leftSticky a:eq("+count+") i:eq(0)").after(" Buddies");
            count++;}
        if(GM_config.get('showShortcut3')){
            $("#leftSticky a:eq("+count+") i:eq(0)").after(" Saved");
            count++;}
        if(GM_config.get('showShortcut4')){
            $("#leftSticky a:eq("+count+") i:eq(0)").after(" Messages");
            count++;}
        $("#leftSticky a:eq("+count+") i:eq(0)").after(" Settings");
    }
}
function getShortcutEnabledIndex(configName){
    var configIndex = 0;
    if(GM_config.get(configName)){
        var numEnabledCount = 0;
        var configNameTemp = "";
        for (i=0; i < 5; i++){
            switch (i){
                case 0: configNameTemp = "showShortcut1";
                    break;
                case 1: configNameTemp = "showShortcut2";
                    break;
                case 2: configNameTemp = "showShortcut3";
                    break;
                case 3: configNameTemp = "showShortcut4";
                    break;
            }
            if(GM_config.get(configNameTemp)){
                if (configName == configNameTemp)
                    return configIndex;
                configIndex++;
            }
        }
    }
    return (configIndex);
}
function addSpacersToHeader(){
    var iconLabelSpacer = "-";
    switch (GM_config.get('iconLabelSpacer')){
        case "default": iconLabelSpacer = "-";
            break;
        case "pipe": iconLabelSpacer = "|";
            break;
        case "colon": iconLabelSpacer = ":";
            break;
        case "space": iconLabelSpacer = "";
            break;
    }
    // Add spacers
    var numLeftElements = $( "#leftSticky a" ).length;
    $( "#leftSticky a" ).each(function( index ) {
        if ((index) == (numShortcutsEnabled())){
            $(this).after($("<span>").text(" | ").removeAttr('href'));
        }
        else if((index+1) == numLeftElements){
            // Don't append anything
        }
        else{
            $(this).after($("<span>").text(" "+iconLabelSpacer+" ").removeAttr('href'));
        }
    });
}
function stickStickyHeader(){
    $(document).ready(function(){
        if(GM_config.get('stickToolbar')){
            $("#Sticky").sticky();
        }
    });
}
function numShortcutsEnabled(){
    // Toolbar Shortcuts
    var shortcutCount = 0;
    if(GM_config.get('showShortcut1'))
        shortcutCount++;
    if(GM_config.get('showShortcut2'))
        shortcutCount++;
    if(GM_config.get('showShortcut3'))
        shortcutCount++;
    if(GM_config.get('showShortcut4'))
        shortcutCount++;
    return shortcutCount;
}
function appendQuickLinks(){
    if ($("#Sticky").length > 0){
        if (GM_config.get('showQL1')){
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_1Link')).text(GM_config.get('quickLinks_1Text')).addClass("currentLink"));
        }
        if (GM_config.get('showQL2')){
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_2Link')).text(GM_config.get('quickLinks_2Text')).addClass("currentLink"));
        }
        if (GM_config.get('showQL3')){
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_3Link')).text(GM_config.get('quickLinks_3Text')).addClass("currentLink"));
        }
        if (GM_config.get('showQL4')){
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_4Link')).text(GM_config.get('quickLinks_4Text')).addClass("currentLink"));
        }
        if (GM_config.get('showQL5')){
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_5Link')).text(GM_config.get('quickLinks_5Text')).addClass("currentLink"));
        }
    }
}
function hidePMNotice(){
    if(GM_config.get('hidePMNotification')){
        if ($("#pm_notice").length > 0)
            $("#pm_notice").hide();
    }
}
function checkPMNotifications(){
    if(GM_config.get('enableTinyCon') || GM_config.get('enablePMCheck')){
        Tinycon.setOptions({
            color: '#000000',
            background: '#ff3b30',
            fallback: true
        });
        // Set icon if page contains PM
        if ($("#pm_notice").length > 0){
            var pmAlert = $("#pm_notice");
            var hasNumber = /\d/;
            var numPMs = 0;
            var numStr = hasNumber.test(pmAlert.find("strong").text());
            if (numStr)
                numPMs = parseInt(pmAlert.find("strong").text().replace(/[^0-9\.]/g, ''));
            else
                numPMs = 1;
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
}
function updateFavIcon(){
    var numPMs = 0;
    $.ajax({
        url: "https://hackforums.net/stickies.php",
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
            // If Messages icon is enabled AND Active Icons are on - update link on Toolbar
            if (GM_config.get('showShortcut4') && GM_config.get('enableActiveIcons')){
                shortcut4Text = $(pmAlert).find("div:eq(1) a:eq(1)").text() + " from "+ $("#pm_notice div:eq(1) a:eq(0)").text();
                shortcut4Link = $(pmAlert).find("div:eq(1) a:eq(1)").attr("href");
                $("#pmLeftSticky").attr("href",shortcut4Link).attr("target","_blank").attr("title",shortcut4Text);
            }
        }
    });
    //console.log("Number of unread PM's: "+numPMs);
    return numPMs;
}
function checkforCurrentPage(){
    if(GM_config.get('enableCurrentPageColor')){
        $(".currentLink").each(function( index ) {
            if ($(this).attr("href") === window.location.href){
                $(this).css("color",GM_config.get('customCurrentPageColor'));
                return false;
            }
        });
        if (window.location.href.includes(GM_config.get('shortcut1Link')))
            $("#homeLeftSticky").css("color",GM_config.get('customCurrentPageColor'));
    }
}
function showBuddyContainer(){
    if(GM_config.get('enableBuddyPopout')){
        TINY.box.show({iframe:'https://hackforums.net/misc.php?action=buddypopup',mask:false, boxid:'frameless',width:300,height:350,fixed:true, closejs:function(){$("#buddiesLeftSticky").css("color","white");}});
        $(".tinner").attr("id","tbWindow").css("background-color","rgba(7,41,72,0.4)"); //.tbox for no frame
        $( "#tbWindow" ).draggable();
        // Toggle color of buddy
        if(GM_config.get('enableActiveIcons')){
            if($("#tbWindow").length > 0)
                $("#buddiesLeftSticky").css("color","#1ff182");
        }
    }
    else{
        window.open('https://hackforums.net/misc.php?action=buddypopup', '_blank');
    }

}