// ==UserScript==
// @name       Always Quote
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0.0
// @description  Allows you to quote posts on closed threads
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/showthread.php?tid=*
// @copyright  2016+
// @updateURL
// @downloadURL
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Initial Release
// ------------------------------ Dev Notes -----------------------------
// Bold, Italics, Underline, Strike (goes at end)
// Figure out images/videos?
// ------------------------------ SETTINGS ------------------------------
//
// ------------------------------ ON PAGE LOAD ------------------------------
if($(".quick_keys").find($("a[title='Thread Closed']")).length > 0){
    // Append quote buttons
    $(".quick_keys").find($("a[title='Report this post to a moderator']")).each(function( index ) {
        $(this).before($("<a>").addClass("bitButton closedQuote").text("Quote").css("margin","5px").attr("id","closedQuote"+index));
    });
    // Quote event listeners
    $( ".closedQuote" ).click(function() {
        var postBlock = $(this).parent().parent().parent().parent();
        //console.log(postBlock);
        // Post Link
        var postLink = postBlock.find("strong a").attr("href").split("&pid=");
        if(postLink[1].includes("#pid")){ postLink[1] = postLink[1].substring(0,postLink[1].indexOf("#pid")); }
        console.log("Post ID: "+postLink[1]);
        // Username
        var postUsername = postBlock.children().next().children().eq(0).find(".post_author").find("strong span a span").text();
        console.log("Username: "+postUsername);
        // Post Content
        var postContent = $("#pid_"+postLink[1]).text();
        var postContentHTML = $("#pid_"+postLink[1]).html();
        var parsedPostHTML = $('<div/>').append(postContentHTML);
        console.log(parsedPostHTML);
        // Spoilers
        if(parsedPostHTML.find(".spoiler_header").length > 0){
            $(parsedPostHTML).find(".spoiler_header").each(function( index ) {
                var spoilerHead = $(this).text().replace(" (Click to View)","");
                var spoilerBody = $(parsedPostHTML).find(".spoiler_body:eq("+index+")").text();
                postContent = postContent.replace($(this).text(),"[sp="+spoilerHead+"]"+spoilerBody+"[/sp]");
            });
        }
        // Hyperlinks
        if(parsedPostHTML.find("a").length > 0){
            $(parsedPostHTML).find("a").each(function( index ) {
                // Exclude spoilers
                if(!$(this).text().includes("(Click to View)")){
                    // Add hyperlink to text
                    postContent = postContent.replace($(this).text(),"[url="+$(this).attr("href")+"]"+$(this).text()+"[/url]");
                }
            });
        }
        postContent = "[quote='"+postUsername+"' pid='"+postLink[1]+"']"+postContent+"[/quote]";
        console.log("new content: "+postContent);
        prompt(postUsername+"'s Quote: ",postContent);
    });
}

// ------------------------------ Functions ------------------------------
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};