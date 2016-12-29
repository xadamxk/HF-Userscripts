// ==UserScript==
// @name       EasyCite
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.4
// @description Allows users to cite threads, users, sections, and other pages on HF.
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net*
// @match      *://hackforums.net/*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/raw/master/EasyCite/EasyCite.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.4: Added user colors setting for profiles
// version 1.0.3: Added user colors setting for posts
// version 1.0.2: Small tweaks and fixes
// version 1.0.1: Public Release
// version 1.0.0: Beta Release
// ------------------------------ Dev Notes -----------------------------
// Figure out search.php?
// ------------------------------ SETTINGS ------------------------------
// Add's color to the username (based on the user's group) when citing a user's profile.
var profileColors = true; // (Default: true)
// Add's color to the username (based on the user's group) when citing a user's post.
var usernameColors = false; // (Default: false)
// Hyperlink's the username when citing a user's post
var usernameLink = false; // (Default: false)
// ------------------------------ ON PAGE LOAD ------------------------------
// Default
var citationLink = location.href;
var citationDescripion = $(".navigation").find(".active").text();
var citationText = citationDescripion;
// Append Cite Button
$(".navigation").append($("<button>").text("Cite").addClass("bitButton")).attr("id","citeButton"); //.css("background","#333333")
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
    if (profileColors)
        citationText = "[color="+rgb2hex($(".quick_keys").find(".largetext strong span").css("color"))+"]"+citationDescripion+"[/color]";
    else
        citationText = +citationDescripion;
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
                    // User profile link
                    if (usernameLink)
                        tempcitationLink = $(postMessage).find(".largetext a:eq(0)").attr('href');
                    // post Username Info
                    var postUsername = $(postMessage).find(".largetext a:eq(0) span").text();
                    var postUsernameLink = "https://hackforums.net/"+$(postMessage).find(".smalltext strong a:eq("+i+")").attr('href');
                    // User color
                    if (usernameColors){
                        var userColor = rgb2hex($(postMessage).find(".largetext a:eq(0) span").css('color'));
                        // Color + User link
                        if (usernameLink)
                            tempcitationText = "[color="+userColor+"]"+postUsername+" [/url][/color][color=white]'s[/color][url="+postUsernameLink+"]"+"[/b][b] Post";
                        // Color + No Link
                        else
                            tempcitationText = "[color="+userColor+"]"+postUsername+"[/color]'s Post";
                    }
                    // No color
                    else{
                        // No color + User link
                        if (usernameLink)
                            tempcitationText = postUsername+"[/url]'s[/b][url="+postUsernameLink+ "][b] Post";
                        // No color + No link
                        else
                            tempcitationText = postUsername+"'s Post";
                    }
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

// Credit: https://jsfiddle.net/mushigh/myoskaos/
function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}