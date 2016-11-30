// ==UserScript==
// @name       HF News Notifier
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.0
// @description  Alerts users of new HF News editions (checks on /usercp.php)
// @require http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match      *://hackforums.net/usercp.php
// @copyright  2016+
// @updateURL //
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
// Bug: Closing alert
// ------------------------------ ON PAGE LOAD ------------------------------
// Settings
var debug = true;
var sectionURL = "https://hackforums.net/forumdisplay.php?fid=162";

// Grab most recent news thread title
$.ajax({
    url: sectionURL,
    cache: false,
    success: function(response) {
        // Static Variables
        var newsThreadName;
        var newThreadImage = "newfolder.gif";
        var hotThreadImage = "newhotfolder.gif";
        var html = "<div class='pm_alert' id='news_alert'><div class='float_right'><a title='Dismiss this notice'>"+
            "<img src='https://hackforums.net/images/modern_bl/dismiss_notice.gif' style='cursor:pointer' alt='Dismiss this notice' id='closeAlert' title='[x]'></a>"+
            "</div><div></div></div>";
        var threadLinkArray = [];
        var threadTitleArray = [];
        var forumTitle;
        var count = 0;
        // Break table into rows
        rows = $(response).find('.tborder').find( "tbody tr" ).toArray();
        // Debug: 6(if moderator?) + numStickies = first non-sticky row
        if (debug){
            //console.log(rows[9]);
        }
        // Loop through table rows
        var column2 = 'td:eq(1) div span a:eq(1)'; // Column with thread title & link
        for(i = 0; i < rows.length;i++){
            if (debug){
                //console.log($(rows[i]).find('td:eq(0)').find('img').attr('src'));
            }
            temp = $(rows[i]).find('td:eq(0)').find('img').attr('src');
            if (temp!== undefined && (temp.includes(newThreadImage) || temp.includes(hotThreadImage))){
                threadLinkArray[count] = $(rows[i]).find(column2).attr('href');
                threadTitleArray[count] = $(rows[i]).find(column2).text();
                count++;
            }
        }
        // Forum Title
        forumTitle = $(response).find(".navigation").find("span").text();
        if (debug){
            console.log("Forum Name: "+forumTitle);
            console.log("link: "+threadLinkArray[0]);
            console.log("title: "+threadTitleArray[0]);
            console.log("rows: "+rows.length);
            console.log("New Threads Found: "+threadLinkArray.length);
        }
        newsThreadName = "<strong>New '"+forumTitle+"' Thread(s):</strong><br/>";
        for (i=0; i < threadLinkArray.length; i++)
            newsThreadName += "<a href='"+threadLinkArray[i]+"'>"+threadTitleArray[i]+"</a><br/>";
        if (debug){
            console.log("Alert HTML: "+newsThreadName);
        }
        substring = "</div><div>";
        position = html.indexOf(substring)+(substring).length;
        html = [html.slice(0, position), newsThreadName, html.slice(position)].join('');
        if (threadLinkArray.length > 0)
            $(html).insertBefore("#content");
    }
});

$(function () {
    $("#closeAlert").click(function () {
        $("#news_alert").remove();
    });
});