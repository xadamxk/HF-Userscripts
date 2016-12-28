// ==UserScript==
// @name       EasyCite
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.2
// @description Allows users to cite threads, users, sections, and other pages on HF.
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net*
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/EasyCite/EasyCite.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.2: Small tweaks and fixes
// version 1.0.1: Public Release
// version 1.0.0: Beta Release
// ------------------------------ Dev Notes -----------------------------
// Figure out search.php
// ------------------------------ SETTINGS ------------------------------
//
// ------------------------------ ON PAGE LOAD ------------------------------
// Default
var citationLink = location.href;
var citationDescripion = $(".navigation").find(".active").text();
var citationText = citationDescripion;
// Append Cite Button
$(".navigation").append($("<button>").text("Cite").addClass("button")).attr("id","citeButton"); //.css("background","#333333")
// Profile Awards
if (location.href.includes("/myawards.php?uid=")){
    citationDescripion = $(".quick_keys").find("strong:contains('My Awards : ') a").text()+"'s "+$(".navigation").find(".active").text();
    citationText = citationDescripion;
}
// Sections
else if (location.href.includes("/forumdisplay.php?fid=")){
    citationDescripion = $(".navigation").find(".active").text()+" Section";
    citationText = citationDescripion;
}
// Profiles
else if (location.href.includes("/member.php?action=profile")){
    citationDescripion = $(".navigation").find(".active").text().replace("Profile of ","");
    citationText = citationDescripion;
}
// Threads
else if (location.href.includes("/showthread.php?tid=")){
    // Thread - not first post
    if (location.href.includes("&pid=")){
        citationLink = location.href.substring(0,location.href.indexOf("&pid="));
    }
    // Thread - not first page
    if (location.href.includes("&page=")){
        citationLink = location.href.substring(0,location.href.indexOf("&page="));
    }
    citationText = $(".navigation").find(".active").text();
    citationDescripion = citationText;
    // Posts - each post bit on page
    $(".bitButton[title='Trust Scan']").each(function (index, element) {
        var tsButton = $(element);
        var postMessage = tsButton.parents("table.tborder");
        // Grab UID & create button
        tsButton.parent().append($("<button>").text("Cite").attr("id", "citeButton"+index).addClass("bitButton").css("margin-left","5px"));
        // temp vars
        var tempcitationDescripion;
        var tempcitationLink;
        var tempcitationText;
        // onClick for cite buttons
        $("body").on("click", "#citeButton"+index, function(e) {
            e.preventDefault();
            // Foreach a in smalltext in postbit
            for (i = 0; i < $(postMessage).find(".smalltext strong a").length; i++){
                // If first post
                if($(postMessage).find(".smalltext strong a")[i].text == ("#1")){
                    tempcitationLink = "https://hackforums.net/"+$(postMessage).find(".smalltext strong a:eq("+i+")").attr('href');
                    tempcitationDescripion = $(".navigation").find(".active").text() + " by " + $(".post_author:eq(0) strong span a span").text();
                    tempcitationText = $(".navigation").find(".active").text()+"[/b][/url] by [b][url="+$(".post_author:eq(0) strong span a").attr("href")+"]"+$(".post_author:eq(0) strong span a span").text();
                }
                // Every other post
                else if($(postMessage).find(".smalltext strong a")[i].text.includes("#")){
                    tempcitationLink = "https://hackforums.net/"+$(postMessage).find(".smalltext strong a:eq("+i+")").attr('href');
                    tempcitationDescripion = $(postMessage).find(".largetext a:eq(0) span").text()+"'s Post";
                    tempcitationText = tempcitationDescripion;
                }
            }
            prompt("Citation: "+tempcitationDescripion,"[url="+tempcitationLink+"][b]"+tempcitationText+"[/b][/url]");
        });
    });
}
// Help Docs /myawards.php?awid=
else if (location.href.includes("/misc.php?action=help")){
    citationDescripion = "Help Documents - "+$(".navigation").find(".active").text();
    citationText = citationDescripion;
}
// Deal Dispute
else if (location.href.includes("/disputedb.php")){
    citationDescripion = "Deal Dispute - "+$(".navigation").find(".active").text();
    citationText = citationDescripion;
}
// Reputation Report
else if (location.href.includes("/reputation.php?uid=") || location.href.includes("/repsgiven.php?uid=")){
    citationDescripion = $(".quick_keys").find("strong:contains('Reputation Report for')").text().replace("Reputation Report for ","")+" 's "+$(".navigation").find(".active").text();
    citationText = citationDescripion;
}
// Search Page?
else if (location.href.includes("/search.php?action=results")){
    citationDescripion = ""+$(".navigation").find(".active").text();
    citationText = citationDescripion;
}
$("#citeButton").click(function (event){
    var target = $(event.target);
    if (target.is("button")) {
        prompt("Citation: "+citationDescripion,"[url="+citationLink+"][b]"+citationText+"[/b][/url]");
    }
});