// ==UserScript==
// @name       HF ToolBar
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
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
// version 1.0.0: Beta Release
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// GM_info : https://tampermonkey.net/documentation.php#GM_info
// https://github.com/sizzlemctwizzle/GM_config/wiki/Advance-Fields
// Thank you: http://www.freeformatter.com/javascript-escape.html
// blueish: #0F5799
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
    'showIconLabels':{
        'label':'Show Icon labels:',
        'title':'test',
        'section': ['Icon Labels',"Floppy Weiner"],
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
// Function to create header
createStickyHeader();
// Function to stick header
stickStickyHeader();
// Settings event listener
$("#rightSticky a").click(function(){GM_config.open();});
// Settings event listener
$("#leftSticky a:eq(3)").click(function(){appendEditMenu();});
// Favorite Button
if (location.href.includes("/forumdisplay.php?fid=")){

}

function createStickyHeader(){
    var headerHeight = "18px";
    var ariaHidden = "true";
    var showIconLabels = true;
    var iconLabelSpacer = "-";
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
        '#HFTB_config select {background: #cccccc; border: 1px solid #072948;}'
    });
    // Set values based on settings
    if(GM_config.get('showIconLabels') == true){
        showIconLabels = true;
    } else{
        showIconLabels = false;
    }
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
    // Create toolbar
    $("#panel").append($("<div>").attr("id","Sticky")
                       .css("height","22px").css("background-color","#333333")
                       .css("border-style","solid").css("border-color","white").css("border-width","0px 0px 1px 0px")
                       .css("display","flex").css("align-items","center"));
    // Left
    $("#Sticky").append($("<div>").attr("id","leftSticky").addClass("float_left").text("")
                        .css("padding-left","5px").css("display","block").css("height",headerHeight));
    // Home
    $("#leftSticky").append($("<a>").attr("href","https://hackforums.net/usercp.php").attr("onClick","")
                            .append($("<i>").attr("id","homeLeftSticky").addClass("fa fa-home fa-lg")));
    // Buddies
    $("#leftSticky").append($("<a>").attr("href","javascript:void(0);").attr("onClick","MyBB.popupWindow('https://hackforums.net/misc.php?action=buddypopup', 'buddyList', 350, 350);")
                            .append($("<i>").attr("id","buddiesLeftSticky").addClass("fa fa-users")));
    // Saved
    $("#leftSticky").append($("<a>").attr("href","#").attr("onClick","")
                            .append($("<i>").attr("id","savedLeftSticky").addClass("fa fa-floppy-o fa-lg")));
    // Edit
    $("#leftSticky").append($("<a>").attr("href","#").attr("onClick","")
                            .append($("<i>").attr("id","editLeftSticky").addClass("fa fa-pencil-square-o fa-lg")));
    // Right
    $("#Sticky").append($("<div>").attr("id","rightSticky").css("float","right").text("")
                        .css("padding-right","5px").css("padding-left","5px").css("display","block").css("height",headerHeight));
    // Settings
    $("#rightSticky").append($("<a>").attr("href","#").attr("onClick","")
                             .append($("<i>").attr("id","settingsRightSticky").addClass("fa fa-cog fa-lg")));
    // Icon Labels
    if(showIconLabels){
        // Left
        $("#leftSticky a:eq(0) i:eq(0)").after(" Home");
        $("#leftSticky a:eq(1) i:eq(0)").after(" Buddies");
        $("#leftSticky a:eq(2) i:eq(0)").after(" Saved");
        $("#leftSticky a:eq(3) i:eq(0)").after(" Edit");
        // Right
        $("#rightSticky a:eq(0) i:eq(0)").after(" Settings");
    }
    // Add spacers
    var numLeftElements = $( "#leftSticky a" ).length;
    $( "#leftSticky a" ).each(function( index ) {
        if ((index+1) != numLeftElements){
            $(this).after($("<span>").text(" "+iconLabelSpacer+" ").removeAttr('href'));
        }
        if ((index+1) == numLeftElements){
            $(this).after($("<span>").text(" | ").removeAttr('href'));
        }
    });
}
function stickStickyHeader(){
    $(document).ready(function(){
        $("#Sticky").sticky();
    });
}