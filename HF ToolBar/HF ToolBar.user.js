// ==UserScript==
// @name       HF ToolBar
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.2.2
// @description  Adds a toolbar with various options to the top of HF.
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/jquery.sticky.js
// @require https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/GM_config.js
// @require https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/jquery-ui.js
// @require https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/tinybox.js
// @require https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/jquery.textareafullscreen.js
// @match      *://hackforums.net*
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/releases/download/HFTB/HF.ToolBar.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/releases/download/HFTB/HF.ToolBar.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_log
// @grant       GM_info
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.2.2: Replaced update/download URLs with release
// version 1.2.1: Removed PM features -> now in 'PM Enhancer' Userscript
// version 1.2.0: Added Right Shortcuts, 10 Quick Links, and bug fixes.
// version 1.1.1: Bug Fix: Fixed Buddies/Settings icon not working - caused by other header scripts.
// version 1.1.0: Public Release.
// version 1.0.5: Implemented extractable Buddy List, Settings active icon color.
// version 1.0.4: Load HFTB Messages in new tab setting, current page highlight color & settings.
// version 1.0.3: Home link setting, favicon notifications, and PM updates
// version 1.0.2: Code restructure, bug fixes, small changes.
// version 1.0.1: Implemented Quick Links, Ability to hide shortcuts, and bug fixes.
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// Note: Color compliments: http://www.colorhexa.com/1f8ef1, https://color.adobe.com, http://www.colorschemer.com/online.html
// Note: bullet Color: #0F5799
// TODO: Make sticky width 100%, quick notes, 10 quick links
// Quick note box: http://creoart.org/jquery.textareafullscreen/
// Make seperate HTML for textareafullscreen and save button -> append under sticky with movable
// BUG: Not compatible with leader links :/
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
        'label':'Show QuickNote Shortcut:',
        'title':'Access your UserCP notepad.',
        'type':'checkbox',
        'default':false,
    },
    'enableNotepadPopout':{
        'label':'Enable Retractable UserCP Notepad:',
        'title':'Makes a draggable Notepad popout.',
        'type':'checkbox',
        'default':false,
    },
    'showShortcut4':{
        'label':'Show Messages Shortcut:',
        'title':'Hyperlinks to most recent unread PM/PM Option.',
        'type':'checkbox',
        'default':true,
    },
    'pmOption':{
        'label':'Action:',
        'title':'Event when Message Shortcut is clicked.',
        'type':'select',
        'options':{
            'default':'PM Inbox',
            'compose':'PM Compose',
            'tracking':'PM Tracking',
            'search':'PM Search'
        },
        'default':'default',
    },
    'showNewPosts':{
        'label':"Show 'New Posts' Shortcut:",
        'section': ['Shortcuts',"Shortcuts located on the right of HFTB."],
        'type':'checkbox',
        'default':true,
    },
    'showYourThreads':{
        'label':"Show 'Your Threads' Shortcut:",
        'type':'checkbox',
        'default':true,
    },
    'showYourPosts':{
        'label':"Show 'Your Posts' Shortcut:",
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
        'label':'Label Spacer:',
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
    'showQL6':{
        'label':'Show Quick Link #6:',
        'type':'checkbox',
        'default':false,
    },
    'quickLinks_6Text':{
        'label':'#6 Text:',
        'type':'text',
        'default':'',
    },
    'quickLinks_6Link':{
        'label':'#6 Link:',
        'type':'text',
        'default':'',
    },
    'showQL7':{
        'label':'Show Quick Link #7:',
        'type':'checkbox',
        'default':false,
    },
    'quickLinks_7Text':{
        'label':'#7 Text:',
        'type':'text',
        'default':'',
    },
    'quickLinks_7Link':{
        'label':'#7 Link:',
        'type':'text',
        'default':'',
    },
    'showQL8':{
        'label':'Show Quick Link #8:',
        'type':'checkbox',
        'default':false,
    },
    'quickLinks_8Text':{
        'label':'#8 Text:',
        'type':'text',
        'default':'',
    },
    'quickLinks_8Link':{
        'label':'#8 Link:',
        'type':'text',
        'default':'',
    },
    'showQL9':{
        'label':'Show Quick Link #9:',
        'type':'checkbox',
        'default':false,
    },
    'quickLinks_9Text':{
        'label':'#9 Text:',
        'type':'text',
        'default':'',
    },
    'quickLinks_9Link':{
        'label':'#9 Link:',
        'type':'text',
        'default':'',
    },
    'showQL10':{
        'label':'Show Quick Link #10:',
        'type':'checkbox',
        'default':false,
    },
    'quickLinks_10Text':{
        'label':'#10 Text:',
        'type':'text',
        'default':'',
    },
    'quickLinks_10Link':{
        'label':'#10 Link:',
        'type':'text',
        'default':'',
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
$("head").append('<link '+ "href='https:\/\/cdn.rawgit.com\/xadamxk\/HF-Userscripts\/5f4ab5af\/JS%20Libraries\/textareafullscreen.css'" + 'rel="stylesheet" type="text/css">');
// Create toolbar
createStickyHeader();
// Stick toolbar
stickStickyHeader();
// Buddy event listener example:
if(GM_config.get('showShortcut2')){
    $("#leftSticky a:eq("+getShortcutEnabledIndex("showShortcut2")+")").click(function(){
        // Method
        showBuddyContainer();
    });
}
// Notepad event listener example:
if(GM_config.get('showShortcut3')){
    $("#leftSticky a:eq("+getShortcutEnabledIndex("showShortcut3")+")").click(function(){
        // Method
        //showNotepadContainer();
    });
}
// Settings event listener
$("#leftSticky a:eq("+numShortcutsEnabled()+")").click(function(){
    if(GM_config.get('enableActiveIcons')){
        $("#settingsleftSticky").css("color","#1EF1EA");}
    GM_config.open();
});
// Save button event listener
// Append quick links to toolbar
appendQuickLinks();
// Add spacers to toolbar
addSpacersToHeader();
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
        '#HFTB_config_quickLinks_6Text_var,#HFTB_config_quickLinks_7Text_var,#HFTB_config_quickLinks_8Text_var,#HFTB_config_quickLinks_9Text_var,#HFTB_config_quickLinks_10Text_var,'+
        '#HFTB_config_quickLinks_6Link_var,#HFTB_config_quickLinks_7Link_var,#HFTB_config_quickLinks_8Link_var,#HFTB_config_quickLinks_9Link_var,#HFTB_config_quickLinks_10Link_var,'+
        '#HFTB_config_shortcut1Link_var, #HFTB_config_customCurrentPageColor_var, #HFTB_config_enableBuddyPopout_var, #HFTB_config_enablePMCheck_var, #HFTB_config_pmOption_var,'+
        '#HFTB_config_enableNotepadPopout_var {padding-left:15px}'
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
                       .css("align-items","center").css("z-index","100"));
    // ----------------------------------------- LEFT -----------------------------------------
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
        // Note
        $("#leftSticky").append($("<a>").attr("href","#QuickNote").attr("onClick","")
                                .append($("<i>").attr("id","savedLeftSticky").addClass("fa fa-sticky-note")));
    }
    // No PM Notice
    var shortcut4Link = "";
    var shortcut4Text = "";
    switch (GM_config.get('pmOption')){
        case "default": shortcut4Link = "https://hackforums.net/private.php";
            shortcut4Text = "PM Inbox";
            break;
        case "compose": shortcut4Link = "https://hackforums.net/private.php?action=send";
            shortcut4Text = "Compose a Message";
            break;
        case "tracking": shortcut4Link = "https://hackforums.net/private.php?action=tracking";
            shortcut4Text = "PM Tracking";
            break;
        case "search": shortcut4Link = "https://hackforums.net/private.php?action=advanced_search";
            shortcut4Text = "PM Search";
            break;
        default : shortcut4Link = "https://hackforums.net/private.php?action=send";
            shortcut4Text = "Compose a Message";
    }
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
        // If new PM & enableActiveIcons
        if(shortcut4NewPM)
            $("#pmLeftSticky").css("color","#ff3b30");
    }
    // Settings (left)
    $("#leftSticky").append($("<a>").attr("href","#Settings").attr("onClick","").attr("title","Settings")
                            .append($("<i>").attr("id","settingsleftSticky").addClass("fa fa-cog fa-lg")));
    // Right
    $("#Sticky").append($("<div>").attr("id","rightSticky").css("float","right").css("height",headerHeight));
    // ----------------------------------------- RIGHT -----------------------------------------
    // View New Posts (right)
    if(GM_config.get('showNewPosts'))
        $("#rightSticky").append($("<a>").text("New Posts").attr("href","https://hackforums.net/search.php?action=getnew").attr("onClick",""));
    // Your Threads (right)
    if(GM_config.get('showYourThreads'))
        $("#rightSticky").append($("<a>").text("Your Threads").attr("href","https://hackforums.net/search.php?action=finduserthreads&uid="+getUID()).attr("onClick",""));
    // Your Posts (right)
    if(GM_config.get('showYourPosts'))
        $("#rightSticky").append($("<a>").text("Your Posts").attr("href","https://hackforums.net/search.php?action=finduser&uid="+getUID()).attr("onClick",""));
    // ----------------------------------------- Left Labels -----------------------------------------
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
            $("#leftSticky a:eq("+count+") i:eq(0)").after(" Notepad");
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
    // Left
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
    // Right
    var numRightElements = $( "#rightSticky a" ).length;
    $( "#rightSticky a" ).each(function( index ) {
        if ((index) == (numRightShortcutsEnabled())){
            $(this).after($("<span>").text(" | ").removeAttr('href'));
        }
        else if((index+1) == numRightElements){
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
    // Left Shortcuts
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
function numRightShortcutsEnabled(){
    // Right Shortcuts
    var shortcutCount = 0;
    if(GM_config.get('showNewPosts'))
        shortcutCount++;
    if(GM_config.get('showYourThreads'))
        shortcutCount++;
    if(GM_config.get('showYourPosts'))
        shortcutCount++;
    //if(GM_config.get('showShortcut4'))
    //shortcutCount++;
    return shortcutCount;
}
function appendQuickLinks(){
    if ($("#Sticky").length > 0){
        if (GM_config.get('showQL1'))
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_1Link')).text(GM_config.get('quickLinks_1Text')).addClass("currentLink"));
        if (GM_config.get('showQL2'))
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_2Link')).text(GM_config.get('quickLinks_2Text')).addClass("currentLink"));
        if (GM_config.get('showQL3'))
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_3Link')).text(GM_config.get('quickLinks_3Text')).addClass("currentLink"));
        if (GM_config.get('showQL4'))
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_4Link')).text(GM_config.get('quickLinks_4Text')).addClass("currentLink"));
        if (GM_config.get('showQL5'))
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_5Link')).text(GM_config.get('quickLinks_5Text')).addClass("currentLink"));
        if (GM_config.get('showQL6'))
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_6Link')).text(GM_config.get('quickLinks_6Text')).addClass("currentLink"));
        if (GM_config.get('showQL7'))
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_7Link')).text(GM_config.get('quickLinks_7Text')).addClass("currentLink"));
        if (GM_config.get('showQL8'))
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_8Link')).text(GM_config.get('quickLinks_8Text')).addClass("currentLink"));
        if (GM_config.get('showQL9'))
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_9Link')).text(GM_config.get('quickLinks_9Text')).addClass("currentLink"));
        if (GM_config.get('showQL10'))
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_10Link')).text(GM_config.get('quickLinks_10Text')).addClass("currentLink"));
    }
}
function updateFavIcon(){
    var numPMs = 0;
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
        // Each Quick Link
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
        TINY.box.show({iframe:'https://hackforums.net/misc.php?action=buddypopup',mask:false, boxid:'buddyBox',width:300,height:350,fixed:true, closejs:function(){$("#buddiesLeftSticky").css("color","white");}});
        $("#buddyBox").css("background-color","rgba(7,41,72,0.4)"); //.tbox for no frame
        $( "#buddyBox" ).draggable();
        // Toggle color of buddy
        if(GM_config.get('enableActiveIcons')){
            if($("#buddyBox").length > 0)
                $("#buddiesLeftSticky").css("color","#1ff182");
        }
    }
    else{
        window.open('https://hackforums.net/misc.php?action=buddypopup', '_blank');
    }

}
function getUID(){
    var profileLink = "";
    if ($("#panel a:eq(0)").length > 0)
        profileLink = $("#panel a:eq(0)").attr("href");
    if (profileLink.includes("hackforums.net/member.php?action=profile&uid="))
        profileLink = profileLink.replace(/\D/g,'');
    return profileLink;
}
function showNotepadContainer(){
    if(GM_config.get('enableNotepadPopout')){
        // Ajax here
        //TINY.box.show({url:'https://hackforums.net/usercp.php',boxid:'noteBox',animate:true,mask:false,fixed:true});
        $("#Sticky").after($("<div>").attr("id","notepadDiv").css("width","470px").css("display","block").css("margin-right","auto").css("margin-left","auto")
                           .append($("<textarea>").attr("id","notepadTextArea").css("height","100px")));
        $(".tx-editor-wrapper").css("padding","5px");
        $("#notepadTextArea").textareafullscreen({
            overlay: false, // Overlay
            maxWidth: '90%', // Max width
            maxHeight: '90%', // Max height
        });
        $( "#notepadDiv" ).draggable().css("background-color","rgba(7,41,72,0.4)");
        // Toggle color of note
        if(GM_config.get('enableActiveIcons')){
            if($("#notepadTextArea").length > 0)
                $("#savedLeftSticky").css("color","#F1EA1E");
        }
    }
    else{
        window.open('https://hackforums.net/misc.php?action=buddypopup', '_blank');
    }

}