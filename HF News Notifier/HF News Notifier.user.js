// ==UserScript==
// @name       HF News Notifier
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.2.5
// @description  Alerts users of new HF News editions (checks on /usercp.php)
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net/usercp.php
// @match      *://hackforums.net/showthread.php?tid=*
// @copyright  2016+
// @updateURL https://github.com/xadamxk/HF-Userscripts/releases/download/HFNN/HF.News.Notifier.user.js
// @downloadURL https://github.com/xadamxk/HF-Userscripts/releases/download/HFNN/HF.News.Notifier.user.js
// @iconURL https://raw.githubusercontent.com/xadamxk/HF-Userscripts/master/scripticon.jpg
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.2.5: Added weekly news report template
// version 1.2.4: Replaced update/download URLs with release
// version 1.2.3: Bug fix: document-start
// version 1.2.2: Fixed auto-update
// version 1.2.1: Bug Fix: thread titles with ("',) no longer break the alert (removes them)
// version 1.2.0: Implemented dismiss-cookie functionality - Hide alert if previously dismissed, until new thread is found.
// version 1.1.2: Fixed empty alert bug mentioned in v1.1.1
// version 1.1.1: Added alert notice note "Will fix this bug soon, have a good day." in regards to bug with Title Filters.
// version 1.1.0: Using jquery3 now, Added Settings & Changelog block, Added Thread Title Filters, Added Alert Notice Note functionality,
//      Added Multi-Section functionality, Bug Fix: Alert Notice w/out content is fixed, Bug Fix: Alert notice dismissal now works
// version 1.0.1: Added updateURL, Fixed occasional title bug
// version 1.0.0: Initial Release
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
// Section: Which section to search (News: 162)
var sectionURL = "https://hackforums.net/forumdisplay.php?fid=162";
// Filter Title: Filter unread thread results by keyword 
var titleFilterBool = true; // (true = ON, false = OFF)
var titleFilter = "Edition"; // seperate keywords by commas ex."PP,BTC"
// Debug: Show console.log statements for debugging purposes
var debug = false;
// Alert Note: Note at bottom of alert (note text goes between spans)
var alertNote = "<span id='alertCSS'></span>";
var alertNoteCSS = "<style>#alertCSS{color:red}</style>";
// ------------------------------ ON PAGE LOAD ------------------------------
if ( window.location.href == "https://hackforums.net/usercp.php"){
    // Cookie variables
    var threadTitles = "";
    var showAlert = true;
    // Grab most recent news thread title(s)
    $.ajax({
        url: sectionURL,
        cache: false,
        success: function(response) {
            // Static Variables
            var newsThreadName;
            var newThreadImage = "newfolder.gif";
            var hotThreadImage = "newhotfolder.gif"; // href='javascript:$(\"news_alert\").remove();'
            var threadLinkArray = [];
            var threadTitleArray = [];
            var forumTitle;
            var count = 0;
            // Forum Title
            forumTitle = $(response).find(".navigation").find("span").text();
            // Find correct table
            var tableArray = $(response).find(".tborder").toArray();
            var forumTable;
            for(i=0;i < tableArray.length;i++){
                if (debug && !$(tableArray[i]).find("tbody").find("tr").find("td").find("div:eq(1)").find("strong").text().empty())
                    console.log("Table Index "+i+": "+$(tableArray[i]).find("tbody").find("tr").find("td").find("div:eq(1)").find("strong").text());
                if($(tableArray[i]).find("tbody").find("tr").find("td").find("div:eq(1)").find("strong").text() === forumTitle){
                    // Select correct table
                    forumTable = tableArray[i];
                }
            }
            if (debug)
                console.log(forumTable);
            // Break table into rows
            rows = $(forumTable).find( "tbody tr" ).toArray();
            // Column with thread title & link
            // Loop through table rows
            var column2 = 'td:eq(1) div span a:eq(1)';
            for(i = 0; i < rows.length;i++){
                // Debug
                if (debug)
                    console.log("IMG SRC: "+$(rows[i]).find('td:eq(0)').find('img').attr('src'));
                // Filter threads by new
                temp = $(rows[i]).find('td:eq(0)').find('img').attr('src');
                if (temp!== undefined && (temp.includes(newThreadImage) || temp.includes(hotThreadImage))){
                    threadLinkArray[count] = $(rows[i]).find(column2).attr('href');
                    threadTitleArray[count] = $(rows[i]).find(column2).text().replace(/["',]/g, ""); // Remove chars("',) from string
                    count++;
                }
            }
            // Alert HTML Heading
            newsThreadName = "<strong class='.thead'><u>New '<a href='"+sectionURL+"'>"+forumTitle+"</a>' Thread(s):</u></strong><br/>";
            var foundNewFilter = false;
            // Alert HTML Body
            for (i=0; i < threadLinkArray.length; i++){
                // Title filter
                if (titleFilterBool){
                    // For loop for filters
                    var titleFilterArray = titleFilter.split(',');
                    for(j = 0; j < titleFilterArray.length; j++){
                        if (threadTitleArray[i].includes(titleFilterArray[j])){
                            foundNewFilter = true;
                            newsThreadName += "<a href='"+threadLinkArray[i]+"'>"+threadTitleArray[i]+"</a><br/>";
                            // Cookie string
                            threadTitles = threadTitles + threadTitleArray[i] + ",";
                        }
                    }
                }
                // No title filter
                else{
                    newsThreadName += "<a href='"+threadLinkArray[i]+"'>"+threadTitleArray[i]+"</a><br/>";
                    // Cookie string
                    threadTitles = threadTitles + threadTitleArray[i] + ",";
                }
            }
            // Cookie logic
            var addCookieAlert = "";
            // Make cookie if doesn't already exist
            if (document.cookie.replace(/(?:(?:^|.*;\s*)HFNNCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") === undefined)
                document.cookie = 'HFNNCookie=';
            // Debug Cookie and Current thread titles
            if (debug){
                console.log("Cookie: '"+document.cookie.replace(/(?:(?:^|.*;\s*)HFNNCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") +
                            "'\nThread: '" +threadTitles+"'");
                if(document.cookie.replace(/(?:(?:^|.*;\s*)HFNNCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") == threadTitles)
                    console.log("Titles Match: true");
                else
                    console.log("Titles Match: false");
            }
            // Cookie title matches (Hide alert)
            if(document.cookie.replace(/(?:(?:^|.*;\s*)HFNNCookie\s*\=\s*([^;]*).*$)|^.*$/, "$1") == threadTitles)
                showAlert = false;
            // No match (Inject HTML to show alert)
            else
                addCookieAlert = "document.cookie = 'HFNNCookie="+threadTitles+"'; $(\"news_alert\").remove();";

            // Alert notice html
            var html = "<div class='pm_alert' id='news_alert'><div class='float_right'><a href='javascript:closeAlert();'  title='Dismiss this notice'>"+
                "<img src='https://hackforums.net/images/modern_bl/dismiss_notice.gif' style='cursor:pointer' alt='Dismiss this notice'  title='Dismiss'></a>"+
                "</div><div></div></div><script>function closeAlert(){var confirmAlert = confirm('Dismiss alert? Doing so will hide it until new threads are found.');"+
                " if(confirmAlert){"+addCookieAlert+"}}</script>";
            // Some fancy string insertion
            substring = "</div><div>";
            position = html.indexOf(substring)+(substring).length;
            newsThreadName += alertNote + alertNoteCSS;
            html = [html.slice(0, position), newsThreadName, html.slice(position)].join('');
            // If new threads (Filter and Found) => Append HTML
            // Runs if titles don't match
            if (showAlert){
                if (titleFilterBool && foundNewFilter)
                    $(html).insertBefore("#content");
                // If new threads (all) => Append HTML
                if (!titleFilterBool)
                    $(html).insertBefore("#content");
            }
            // Debug
            if (debug){
                console.log("rows: "+rows.length);
                console.log("New Threads Found: "+threadLinkArray.length);
                console.log("Alert HTML: "+newsThreadName);
            }
        }
    });
}
if ( window.location.href.includes("/showthread.php?tid=")){
    if ($(".quick_keys").find("strong:contains(Hack Forums News // Weekly Reports)").length > 0){
        console.log($(".quick_keys").find("strong:contains(Hack Forums News // Weekly Reports)"));
        var reportTemplate = "[b][color=#00e4ff]Briefly describe the event: [/color][/b]\n[b][color=#00e4ff]Any important links: [/color][/b]";
        $("#message").text(reportTemplate);
    }
}
