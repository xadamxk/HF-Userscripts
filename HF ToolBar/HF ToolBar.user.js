// ==UserScript==
// @name       HF ToolBar
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.1
// @description  Adds a toolbar with various options to the top of HF.
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery.sticky/1.0.3/jquery.sticky.js
// @require https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/JS%20Libraries/GM_config.js
// @run-at document-start
// @match      *://hackforums.net*
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL 
// @downloadURL 
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_log
// @grant       GM_info
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ------------------------------ Change Log ----------------------------
// version 1.0.1: Implemented Quick Links, Ability to hide shortcuts, and bug fixes.
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// blueish: #0F5799
// GM_info : https://tampermonkey.net/documentation.php#GM_info
// https://github.com/sizzlemctwizzle/GM_config/wiki/Advance-Fields
// Thank you: http://www.freeformatter.com/javascript-escape.html
// IH8CSS: http://howtocenterincss.com/
// Messages: If PM notice exists, change color of PM icon, hide pm notice
// Clean up: getShortcutEnabledIndex()
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
    'showShortcut2':{
        'label':'Show Buddies Shortcut:',
        'type':'checkbox',
        'default':true,
    },
    'showShortcut3':{
        'label':'Show Saved Shortcut:',
        'type':'checkbox',
        'default':true,
    },
    'showShortcut4':{
        'label':'Show Messages Shortcut:',
        'type':'checkbox',
        'default':true,
    },
    'showIconLabels':{
        'label':'Show Icon Labels:',
        'section': ['HFTB Utils',"Customize the appearance of HFTB."],
        'type':'checkbox',
        'default':true,
    },
    'iconLabelSpacer':{
        'label':'Icon Label Spacer:',
        'type':'select',
        'options':{
            'default':'-',
            'pipe':'|',
            'colon':':',
            'space':'(none)'
        },
        'default':'default',
    },
    'stickToolbar':{
        'label':'Make Toolbar "Sticky":',
        'type':'checkbox',
        'default':true,
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
        'default':false,
    },
    'quickLinks_5Text':{
        'label':'#5 Text:',
        'type':'text',
        'default':'',
    },
    'quickLinks_5Link':{
        'label':'#5 Link:',
        'type':'text',
        'default':'',
    },
    'HFTBversion':{
        'title':'test',
        'section': ["About HFTB",
                    'Version: '+GM_info.script.version+": "+hftbChangeLog+
                    "<br>Written By: "+GM_info.script.author+
                    "<br>Auto-Update: "+GM_info.scriptWillUpdate+
                    "<br>Using Incognito: "+GM_info.isIncognito+
                    "<br>Userscript Manager: "+GM_info.scriptHandler+
                    "<br>Last Updated: "+Date(GM_info.script.lastUpdated)],
        'value': '0',
        'type': 'hidden'
    }
};
// ------------------------------ On Page Load---------------------------
// Inject font-awesome.css
$("head").append ('<link '+ "href='https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/font-awesome\/4.7.0\/css\/font-awesome.css'" + 'rel="stylesheet" type="text/css">');
// Create toolbar
createStickyHeader();
// Stick toolbar
stickStickyHeader();
// PM Shortcut event listener
if(GM_config.get('showShortcut4')){
    $("#leftSticky a:eq("+getShortcutEnabledIndex("showShortcut4")+")").click(function(){window.alert("it works");});
}
// Settings event listener
$("#leftSticky a:eq("+numShortcutsEnabled()+")").click(function(){GM_config.open();});
// Append quick links to toolbar
appendQuickLinks();
// Add spacers to toolbar
addSpacersToHeader();

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
        '#HFTB_config_quickLinks_1Link_var,#HFTB_config_quickLinks_2Link_var,#HFTB_config_quickLinks_3Link_var,#HFTB_config_quickLinks_4Link_var,#HFTB_config_quickLinks_5Link_var{padding-left:15px}'
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
                       .css("display","flex").css("align-items","center"));
    // Left
    $("#Sticky").append($("<div>").attr("id","leftSticky").addClass("float_left").text("")
                        .css("padding-left","5px").css("display","block").css("height",headerHeight));
    if(GM_config.get('showShortcut1')){
        // Home
        $("#leftSticky").append($("<a>").attr("href","https://hackforums.net/usercp.php").attr("onClick","")
                                .append($("<i>").attr("id","homeLeftSticky").addClass("fa fa-home fa-lg")));
    }
    if(GM_config.get('showShortcut2')){
        // Buddies
        $("#leftSticky").append($("<a>").attr("href","javascript:void(0);").attr("onClick","MyBB.popupWindow('https://hackforums.net/misc.php?action=buddypopup', 'buddyList', 350, 350);")
                                .append($("<i>").attr("id","buddiesLeftSticky").addClass("fa fa-users")));
    }
    if(GM_config.get('showShortcut3')){
        // Saved
        $("#leftSticky").append($("<a>").attr("href","#").attr("onClick","")
                                .append($("<i>").attr("id","savedLeftSticky").addClass("fa fa-floppy-o fa-lg")));
    }
    if(GM_config.get('showShortcut4')){
        // PMs
        $("#leftSticky").append($("<a>").attr("href","#MessageSystem").attr("onClick","")
                                .append($("<i>").attr("id","pmLeftSticky").addClass("fa fa-comments fa-lg")));
    }
    // Settings (left)
    $("#leftSticky").append($("<a>").attr("href","#Settings").attr("onClick","")
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
        var numEnabled = numShortcutsEnabled();
        var numEnabledCount = 0;
        if(GM_config.get('showShortcut1')){
            numEnabled--;
            numEnabledCount++;
            if (numEnabled == 0){
                configIndex = numEnabledCount;
            }
        }
        if(GM_config.get('showShortcut2')){
            numEnabled--;
            numEnabledCount++;
            if (numEnabled == 0){
                configIndex = numEnabledCount;
            }
        }
        if(GM_config.get('showShortcut3')){
            numEnabled--;
            numEnabledCount++;
            if (numEnabled == 0){
                configIndex = numEnabledCount;
            }
        }
        if(GM_config.get('showShortcut4')){
            numEnabled--;
            numEnabledCount++;
            if (numEnabled == 0){
                configIndex = numEnabledCount;
            }
        }
    }
    return (configIndex-1);
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
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_1Link')).text(GM_config.get('quickLinks_1Text')));
        }
        if (GM_config.get('showQL2')){
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_2Link')).text(GM_config.get('quickLinks_2Text')));
        }
        if (GM_config.get('showQL3')){
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_3Link')).text(GM_config.get('quickLinks_3Text')));
        }
        if (GM_config.get('showQL4')){
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_4Link')).text(GM_config.get('quickLinks_4Text')));
        }
        if (GM_config.get('showQL5')){
            $("#leftSticky").append($("<a>").attr("href",GM_config.get('quickLinks_5Link')).text(GM_config.get('quickLinks_5Text')));
        }
    }
}